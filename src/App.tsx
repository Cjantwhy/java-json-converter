import { useState } from 'react'
import Header from './components/Header'
import InputPanel from './components/InputPanel'
import OutputPanel from './components/OutputPanel'
import type { ConversionResult } from './types'
import { convert } from './core/converter'
import { useI18n } from './i18n'

export default function App() {
  const [result, setResult] = useState<ConversionResult | null>(null)
  const { t, locale } = useI18n()

  const handleConvert = (mainClass: string, context: string) => {
    try {
      const r = convert(mainClass, context, locale)
      setResult(r)
    } catch (e) {
      setResult({
        json: {},
        warnings: [{
          fieldName: '',
          typeName: '',
          message: t.parseError(e instanceof Error ? e.message : t.unknownError),
        }],
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex gap-0 p-4 min-h-0">
        <div className="w-1/2 p-4 min-h-0 flex flex-col">
          <InputPanel onConvert={handleConvert} />
        </div>
        <div className="w-px bg-gray-800 shrink-0" />
        <div className="w-1/2 p-4 min-h-0 flex flex-col">
          <OutputPanel result={result} />
        </div>
      </main>
    </div>
  )
}
