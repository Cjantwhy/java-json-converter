import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Locale } from './core/messages'

export interface UiStrings {
  headerSubtitle: string
  entityClassLabel: string
  contextLabel: string
  errorNoInput: string
  convertButton: string
  resultTitle: string
  copyButton: string
  copiedButton: string
  emptyState: string
  warningsTitle: (n: number) => string
  parseError: (msg: string) => string
  unknownError: string
  placeholderMain: string
  placeholderContext: string
}

const STRINGS: Record<Locale, UiStrings> = {
  zh: {
    headerSubtitle: '将 Java 实体类转换为 JSON 格式，方便接口调试',
    entityClassLabel: '实体类',
    contextLabel: '上下文（被引用的类）',
    errorNoInput: '请先输入要转换的 Java 实体类',
    convertButton: '转换',
    resultTitle: '转换结果',
    copyButton: '复制',
    copiedButton: '已复制 ✓',
    emptyState: '在左侧输入 Java 实体类后点击「转换」，结果将在此显示',
    warningsTitle: n => `提示（${n} 项）`,
    parseError: msg => `解析失败：${msg}`,
    unknownError: '未知错误',
    placeholderMain: `// 在此粘贴要转换的 Java 实体类
public class CreateOrderRequest {
    @JsonProperty("order_id")
    private Long orderId;

    private String productName;

    private Integer quantity;

    private BigDecimal amount;

    private LocalDateTime createTime;

    private List<OrderItem> items;

    private Address shippingAddress;
}`,
    placeholderContext: `// 在此粘贴被引用的类定义（可选）
public class OrderItem {
    private String sku;

    private Integer count;

    private Double unitPrice;
}

public class Address {
    private String province;

    private String city;

    private String detail;
}`,
  },
  en: {
    headerSubtitle: 'Convert Java entity classes to JSON for easy API debugging',
    entityClassLabel: 'Entity class',
    contextLabel: 'Context (referenced classes)',
    errorNoInput: 'Please enter a Java entity class first',
    convertButton: 'Convert',
    resultTitle: 'Result',
    copyButton: 'Copy',
    copiedButton: 'Copied ✓',
    emptyState: 'Enter a Java entity class on the left and click "Convert" — the result will appear here',
    warningsTitle: n => `Notes (${n})`,
    parseError: msg => `Parse failed: ${msg}`,
    unknownError: 'Unknown error',
    placeholderMain: `// Paste the Java entity class to convert here
public class CreateOrderRequest {
    @JsonProperty("order_id")
    private Long orderId;

    private String productName;

    private Integer quantity;

    private BigDecimal amount;

    private LocalDateTime createTime;

    private List<OrderItem> items;

    private Address shippingAddress;
}`,
    placeholderContext: `// Paste referenced class definitions here (optional)
public class OrderItem {
    private String sku;

    private Integer count;

    private Double unitPrice;
}

public class Address {
    private String province;

    private String city;

    private String detail;
}`,
  },
}

interface I18nContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: UiStrings
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('zh')
  return (
    <I18nContext.Provider value={{ locale, setLocale, t: STRINGS[locale] }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
