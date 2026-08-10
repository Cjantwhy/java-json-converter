import { useState } from 'react'
import { useI18n } from '../i18n'

interface Props {
  onConvert: (mainClass: string, context: string) => void
}

export default function InputPanel({ onConvert }: Props) {
  const { t } = useI18n()
  const [mainClass, setMainClass] = useState('')
  const [context, setContext] = useState('')
  const [error, setError] = useState('')

  const handleConvert = () => {
    setError('')
    if (!mainClass.trim()) {
      setError(t.errorNoInput)
      return
    }
    onConvert(mainClass, context)
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-sm font-medium text-gray-300 mb-1.5">
          {t.entityClassLabel} <span className="text-red-400">*</span>
        </label>
        <textarea
          className="flex-1 w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm
                     text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500
                     transition-colors"
          placeholder={t.placeholderMain}
          value={mainClass}
          onChange={e => setMainClass(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-sm font-medium text-gray-300 mb-1.5">
          {t.contextLabel}
        </label>
        <textarea
          className="flex-1 w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm
                     text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500
                     transition-colors"
          placeholder={t.placeholderContext}
          value={context}
          onChange={e => setContext(e.target.value)}
          spellCheck={false}
        />
      </div>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        onClick={handleConvert}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg
                   transition-colors cursor-pointer"
      >
        {t.convertButton}
      </button>
    </div>
  )
}
