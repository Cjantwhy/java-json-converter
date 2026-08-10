import type { ConversionResult, ConversionWarning, ParsedClass, ParsedField } from '../types'
import { parseClass, parseContext } from './parser'
import {
  getDefaultForType,
  isArrayType,
  isCollectionType,
  isMapType,
  isStandardType,
} from './typeDefaults'
import { warningMessage, type Locale } from './messages'

function buildTypeRegistry(contextClasses: ParsedClass[]): Map<string, ParsedClass> {
  const registry = new Map<string, ParsedClass>()
  for (const cls of contextClasses) {
    registry.set(cls.name, cls)
    // Also register by fully qualified short name (last segment)
    const short = cls.name.includes('.') ? cls.name.substring(cls.name.lastIndexOf('.') + 1) : cls.name
    if (short !== cls.name) {
      registry.set(short, cls)
    }
  }
  return registry
}

function resolveFieldValue(
  field: ParsedField,
  registry: Map<string, ParsedClass>,
  warnings: ConversionWarning[],
  depth: number = 0,
  locale: Locale = 'zh',
): unknown {
  if (depth > 5) return null

  const { typeName, genericArgs, javaName, jsonName } = field

  // Collections: List<T>, Set<T>, etc.
  if (isCollectionType(typeName)) {
    if (genericArgs.length > 0) {
      const elementType = genericArgs[0]
      if (!isStandardType(elementType) && !registry.has(elementType)) {
        warnings.push({
          fieldName: javaName,
          typeName: elementType,
          message: warningMessage('unknownGeneric', locale, { fieldName: javaName, typeName: elementType }),
        })
        return undefined
      }
      const syntheticField: ParsedField = {
        javaName,
        jsonName,
        typeName: elementType,
        genericArgs: genericArgs.slice(1),
      }
      return [resolveFieldValue(syntheticField, registry, warnings, depth + 1, locale)]
    }
    return []
  }

  // Maps: Map<K, V>
  if (isMapType(typeName)) {
    if (genericArgs.length >= 2) {
      const keyField: ParsedField = {
        javaName: 'key',
        jsonName: 'key',
        typeName: genericArgs[0],
        genericArgs: [],
      }
      const valField: ParsedField = {
        javaName: 'value',
        jsonName: 'value',
        typeName: genericArgs[1],
        genericArgs: genericArgs.slice(2),
      }
      const key = resolveFieldValue(keyField, registry, warnings, depth + 1, locale)
      const value = resolveFieldValue(valField, registry, warnings, depth + 1, locale)
      return { [String(key)]: value }
    }
    return {}
  }

  // Arrays: T[]
  if (isArrayType(typeName)) {
    if (genericArgs.length > 0) {
      const elementType = genericArgs[0]
      if (!isStandardType(elementType) && !registry.has(elementType)) {
        warnings.push({
          fieldName: javaName,
          typeName: elementType,
          message: warningMessage('unknownArray', locale, { fieldName: javaName, typeName: elementType }),
        })
        return undefined
      }
      const syntheticField: ParsedField = {
        javaName,
        jsonName,
        typeName: elementType,
        genericArgs: genericArgs.slice(1),
      }
      return [resolveFieldValue(syntheticField, registry, warnings, depth + 1, locale)]
    }
    return []
  }

  // Standard Java types
  if (isStandardType(typeName)) {
    return getDefaultForType(typeName)
  }

  // Known entity class (from context)
  const entityClass = registry.get(typeName)
  if (entityClass) {
    return classToJson(entityClass, registry, warnings, depth + 1, locale)
  }

  // Unknown type → warning + skip
  warnings.push({
    fieldName: javaName,
    typeName,
    message: warningMessage('unknownType', locale, { fieldName: javaName, typeName }),
  })
  return undefined // will be filtered out
}

function classToJson(
  cls: ParsedClass,
  registry: Map<string, ParsedClass>,
  warnings: ConversionWarning[],
  depth: number = 0,
  locale: Locale = 'zh',
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const field of cls.fields) {
    const value = resolveFieldValue(field, registry, warnings, depth, locale)
    if (value !== undefined) {
      result[field.jsonName] = value
    }
  }
  return result
}

export function convert(mainSource: string, contextSource: string, locale: Locale = 'zh'): ConversionResult {
  const mainClass = parseClass(mainSource)
  const contextClasses = parseContext(contextSource)
  const registry = buildTypeRegistry(contextClasses)
  const warnings: ConversionWarning[] = []

  const json = classToJson(mainClass, registry, warnings, 0, locale)

  return { json, warnings }
}
