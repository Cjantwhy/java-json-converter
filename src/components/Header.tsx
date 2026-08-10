import { useI18n } from '../i18n'
import type { Locale } from '../core/messages'

export default function Header() {
  const { t, locale } = useI18n()

  const switchLocale = (target: Locale) => {
    if (target === locale) return
    window.location.href = target === 'en' ? '/en' : '/zh'
  }

  return (
    <header className="relative text-center py-6 border-b border-gray-800">
      <h1 className="text-2xl font-bold tracking-tight">
        Java Entity → JSON
      </h1>
      <p className="text-gray-400 mt-1 text-sm">
        {t.headerSubtitle}
      </p>
      <div className="absolute top-6 right-4 flex items-center text-xs border border-gray-700 rounded-md overflow-hidden">
        <button
          onClick={() => switchLocale('zh')}
          className={`px-2 py-1 transition-colors cursor-pointer ${
            locale === 'zh' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => switchLocale('en')}
          className={`px-2 py-1 transition-colors cursor-pointer ${
            locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
          }`}
        >
          EN
        </button>
      </div>
    </header>
  )
}
