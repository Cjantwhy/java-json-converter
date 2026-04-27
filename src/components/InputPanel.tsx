import { useState } from 'react'

interface Props {
  onConvert: (mainClass: string, context: string) => void
}

const PLACEHOLDER_MAIN = `// 在此粘贴要转换的 Java 实体类
public class CreateOrderRequest {
    @JsonProperty("order_id")
    private Long orderId;

    private String productName;

    private Integer quantity;

    private BigDecimal amount;

    private LocalDateTime createTime;

    private List<OrderItem> items;

    private Address shippingAddress;
}`

const PLACEHOLDER_CONTEXT = `// 在此粘贴被引用的类定义（可选）
public class OrderItem {
    private String sku;

    private Integer count;

    private Double unitPrice;
}

public class Address {
    private String province;

    private String city;

    private String detail;
}`

export default function InputPanel({ onConvert }: Props) {
  const [mainClass, setMainClass] = useState('')
  const [context, setContext] = useState('')
  const [error, setError] = useState('')

  const handleConvert = () => {
    setError('')
    if (!mainClass.trim()) {
      setError('请先输入要转换的 Java 实体类')
      return
    }
    onConvert(mainClass, context)
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-sm font-medium text-gray-300 mb-1.5">
          实体类 <span className="text-red-400">*</span>
        </label>
        <textarea
          className="flex-1 w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm
                     text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500
                     transition-colors"
          placeholder={PLACEHOLDER_MAIN}
          value={mainClass}
          onChange={e => setMainClass(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <label className="text-sm font-medium text-gray-300 mb-1.5">
          上下文（被引用的类）
        </label>
        <textarea
          className="flex-1 w-full bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm
                     text-gray-100 placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500
                     transition-colors"
          placeholder={PLACEHOLDER_CONTEXT}
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
        转换
      </button>
    </div>
  )
}
