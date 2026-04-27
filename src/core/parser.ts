import type { ParsedClass, ParsedField } from '../types'

const PRIMITIVES = new Set([
  'int', 'long', 'short', 'byte', 'float', 'double', 'boolean', 'char',
])

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
}

function extractClassName(source: string): string {
  const m = source.match(/(?:public\s+)?(?:abstract\s+)?(?:final\s+)?class\s+(\w+)/)
  return m ? m[1] : 'Unknown'
}

function extractImports(source: string): Map<string, string> {
  const imports = new Map<string, string>()
  const re = /import\s+(?:static\s+)?([\w.]+?)(?:\.\*)?\s*;/g
  let m: RegExpExecArray | null
  while ((m = re.exec(source)) !== null) {
    const fq = m[1]
    const short = fq.substring(fq.lastIndexOf('.') + 1)
    imports.set(short, fq)
  }
  return imports
}

function resolveAnnotationKey(annotations: string[]): string | null {
  for (const ann of annotations) {
    const jp = ann.match(/@JsonProperty\s*\(\s*(?:value\s*=\s*)?"(\w+)"/)
    if (jp) return jp[1]
    const sn = ann.match(/@SerializedName\s*\(\s*(?:value\s*=\s*)?"(\w+)"/)
    if (sn) return sn[1]
    const jf = ann.match(/@JSONField\s*\(\s*(?:name\s*=\s*)?"(\w+)"/)
    if (jf) return jf[1]
  }
  return null
}

const FIELD_RE= /(private|protected|public)\s+([\w<>,\s\[\]]+?)\s+(\w+)\s*(?:=\s*[^;]+)?\s*;/

export function parseClass(source: string): ParsedClass {
  const clean = stripComments(source)
  const name = extractClassName(clean)
  const imports = extractImports(clean)

  const fields: ParsedField[] = []
  const lines = clean.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Collect annotations from preceding lines
    if (trimmed.match(/^@\w/)) continue

    const fm = FIELD_RE.exec(line)
    if (!fm) continue

    const accessMod = fm[1]
    if (accessMod === 'public') {
      // skip public non-field (methods have parens)
      if (line.includes('(')) continue
    }

    const rawType = fm[2].trim()
    const fieldName = fm[3]

    // Skip serialVersionUID
    if (fieldName === 'serialVersionUID') continue

    // Collect annotations from lines above
    const annotations: string[] = []
    let j = i - 1
    while (j >= 0 && lines[j].trim().match(/^@\w/)) {
      annotations.unshift(lines[j].trim())
      j--
    }

    const jsonName = resolveAnnotationKey(annotations) || fieldName

    // Parse generic arguments from raw type: List<String> → List, [String]
    const gaMatch = rawType.match(/^([\w.]+)\s*<\s*(.+)\s*>$/)
    let typeName: string
    let genericArgs: string[]

    if (gaMatch) {
      typeName = gaMatch[1]
      genericArgs = gaMatch[2].split(/\s*,\s*/).map(s => s.trim())
    } else {
      typeName = rawType.replace(/\[\]$/, '')
      genericArgs = []
      if (rawType.endsWith('[]')) {
        // treat array as List-like with the element type as generic arg
        genericArgs = [typeName]
        typeName = 'Array'
      }
    }

    // Resolve unqualified type names via imports
    if (!PRIMITIVES.has(typeName) && !typeName.includes('.') && !typeName.startsWith('java.')) {
      const resolved = imports.get(typeName)
      if (resolved) typeName = resolved
    }

    fields.push({ javaName: fieldName, jsonName, typeName, genericArgs })
  }

  return { name, fields }
}

/**
 * Parse context input — may contain multiple class definitions.
 */
export function parseContext(source: string): ParsedClass[] {
  if (!source.trim()) return []
  const clean = stripComments(source)

  // Split by class definition boundaries
  const classBlocks = clean.split(/(?=(?:public\s+)?(?:abstract\s+)?(?:final\s+)?class\s+\w+)/)
  return classBlocks.filter(b => /\bclass\s+\w+/.test(b)).map(parseClass)
}
