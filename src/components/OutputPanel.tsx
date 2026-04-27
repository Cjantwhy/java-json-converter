import { useState } from 'react'
import type { ConversionResult } from '../types'
import WarningList from './WarningList'

interface Props {
  result: ConversionResult | null
}

export default function OutputPanel({ result }: Props) {
  const [copied, setCopied] = useState(false)

  const jsonText = result ? JSON.stringify(result.json, null, 2) : ''

  const handleCopy = async () => {
    if (!jsonText) return
    await navigator.clipboard.writeText(jsonText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        在左侧输入 Java 实体类后点击「转换」，结果将在此显示
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-300">转换结果</h2>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md
                     transition-colors cursor-pointer border border-gray-700"
        >
          {copied ? '已复制 ✓' : '复制'}
        </button>
      </div>

      <pre className="flex-1 bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm
                      text-green-300 overflow-auto whitespace-pre-wrap break-all min-h-0">
        {jsonText || '{}'}
      </pre>

      {result.warnings.length > 0 && <WarningList warnings={result.warnings} />}
    </div>
  )
}
