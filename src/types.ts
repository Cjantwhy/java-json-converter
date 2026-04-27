export interface ParsedField {
  javaName: string
  jsonName: string
  typeName: string
  genericArgs: string[]
}

export interface ParsedClass {
  name: string
  fields: ParsedField[]
}

export interface ConversionWarning {
  fieldName: string
  typeName: string
  message: string
}

export interface ConversionResult {
  json: Record<string, unknown>
  warnings: ConversionWarning[]
}
