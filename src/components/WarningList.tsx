import type { ConversionWarning } from '../types'
import { useI18n } from '../i18n'

interface Props {
  warnings: ConversionWarning[]
}

export default function WarningList({ warnings }: Props) {
  const { t } = useI18n()
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-yellow-400">
        {t.warningsTitle(warnings.length)}
      </h3>
      <ul className="space-y-1.5">
        {warnings.map((w, i) => (
          <li
            key={i}
            className="bg-yellow-950/50 border border-yellow-800 rounded-md px-3 py-2 text-sm text-yellow-300"
          >
            {w.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
