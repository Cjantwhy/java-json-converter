export type DefaultValue =
  | number
  | string
  | boolean
  | null
  | Record<string, unknown>
  | unknown[]

// Standard library types that should be recognized even without imports
const STANDARD_TYPES: Record<string, DefaultValue> = {
  // Primitives
  int: 0,
  long: 0,
  short: 0,
  byte: 0,
  float: 0.0,
  double: 0.0,
  boolean: false,
  char: '',
  // Wrappers
  Integer: 0,
  Long: 0,
  Short: 0,
  Byte: 0,
  Float: 0.0,
  Double: 0.0,
  Boolean: false,
  Character: '',
  // Common
  String: '',
  // Math
  BigDecimal: 0,
  BigInteger: 0,
  // Time
  LocalDate: '2024-01-01',
  LocalDateTime: '2024-01-01T00:00:00',
  LocalTime: '00:00:00',
  ZonedDateTime: '2024-01-01T00:00:00+08:00',
  Instant: '2024-01-01T00:00:00Z',
  Date: '2024-01-01T00:00:00Z',
  Timestamp: '2024-01-01T00:00:00Z',
  // Common library types
  Object: {},
}

const STANDARD_SHORT_NAMES = new Set(Object.keys(STANDARD_TYPES))

/**
 * Check if a type name is a known standard type (by short name).
 */
export function isStandardType(typeName: string): boolean {
  const short = typeName.includes('.') ? typeName.substring(typeName.lastIndexOf('.') + 1) : typeName
  return STANDARD_SHORT_NAMES.has(short)
}

/**
 * Get the default JSON value for a standard type.
 */
export function getDefaultForType(typeName: string): DefaultValue {
  const short = typeName.includes('.') ? typeName.substring(typeName.lastIndexOf('.') + 1) : typeName
  if (short in STANDARD_TYPES) {
    return structuredClone(STANDARD_TYPES[short])
  }
  throw new Error(`Unknown standard type: ${typeName}`)
}

/**
 * Check if a type name refers to a collection.
 */
export function isCollectionType(typeName: string): boolean {
  const short = typeName.includes('.') ? typeName.substring(typeName.lastIndexOf('.') + 1) : typeName
  return short === 'List' || short === 'Set' || short === 'Collection' || short === 'ArrayList' || short === 'HashSet' || short === 'LinkedHashSet' || short === 'TreeSet'
}

export function isMapType(typeName: string): boolean {
  const short = typeName.includes('.') ? typeName.substring(typeName.lastIndexOf('.') + 1) : typeName
  return short === 'Map' || short === 'HashMap' || short === 'LinkedHashMap' || short === 'TreeMap' || short === 'ConcurrentHashMap'
}

export function isArrayType(typeName: string): boolean {
  return typeName === 'Array'
}
