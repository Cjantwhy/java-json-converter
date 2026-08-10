export type Locale = 'zh' | 'en'

export type WarningKey = 'unknownGeneric' | 'unknownArray' | 'unknownType'

interface WarningMsgParams {
  fieldName: string
  typeName: string
}

const MESSAGES: Record<Locale, Record<WarningKey, (p: WarningMsgParams) => string>> = {
  zh: {
    unknownGeneric: p => `字段 "${p.fieldName}" 的泛型类型 "${p.typeName}" 是未识别的实体类，已跳过。请在「上下文」输入框中补充该类的定义。`,
    unknownArray: p => `字段 "${p.fieldName}" 的数组元素类型 "${p.typeName}" 是未识别的实体类，已跳过。请在「上下文」输入框中补充该类的定义。`,
    unknownType: p => `字段 "${p.fieldName}" 的类型 "${p.typeName}" 是未识别的实体类，已跳过。请在「上下文」输入框中补充该类的定义。`,
  },
  en: {
    unknownGeneric: p => `Field "${p.fieldName}" has generic type "${p.typeName}" which is an unrecognized entity class; skipped. Please paste its definition in the "Context" textarea.`,
    unknownArray: p => `Field "${p.fieldName}" has array element type "${p.typeName}" which is an unrecognized entity class; skipped. Please paste its definition in the "Context" textarea.`,
    unknownType: p => `Field "${p.fieldName}" has type "${p.typeName}" which is an unrecognized entity class; skipped. Please paste its definition in the "Context" textarea.`,
  },
}

export function warningMessage(key: WarningKey, locale: Locale, params: WarningMsgParams): string {
  return MESSAGES[locale][key](params)
}
