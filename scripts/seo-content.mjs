// SEO 静态文案数据源（中英双语）
// 严格基于工具真实能力（见 src/core/ 与 AGENTS.md），不虚构功能。
// 由 scripts/generate-seo-html.mjs 导入并注入到 /zh /en 两个 HTML 入口。

export const SITE = {
  domain: 'https://java2json.cjantwhy.com',
  ogImage: {
    zh: '/og-zh.png',
    en: '/og-en.png',
  },
}

export const SEO_CONTENT = {
  zh: {
    lang: 'zh-CN',
    title: 'Java 实体类转 JSON 在线工具 - 支持 @JsonProperty 注解与 java.time 默认值',
    description:
      '在线将 Java 实体类（POJO）一键转换为 JSON 示例。支持 @JsonProperty、@SerializedName、@JSONField 注解，自动处理 List/Map/泛型与 T[] 数组，内置 LocalDate/LocalDateTime/BigDecimal 等默认值，代码纯浏览器运行、不上传服务器。',
    keywords:
      'Java 实体类转 JSON, Java POJO 转 JSON, Java class 生成 JSON, @JsonProperty 示例, Java to JSON converter, Java 实体生成 JSON 样例',
    h1: 'Java 实体类转 JSON 在线工具',
    intro:
      '本工具将 Java 实体类（POJO）一键转换为 JSON 示例，方便接口联调、Mock 数据生成与文档编写。粘贴类代码即可立即得到带默认值的 JSON，支持常见的 JSON 字段名注解、集合/Map/泛型、以及 java.time 与 BigDecimal 等业务常用类型。所有解析在你的浏览器本地完成，代码不会上传到任何服务器。',
    features: {
      title: '功能特性',
      items: [
        ['识别 JSON 字段名注解', '自动识别 @JsonProperty、@SerializedName、@JSONField，按注解 value 生成 JSON 字段名。'],
        ['集合与数组', '识别 List / Set / Collection / ArrayList / HashSet / LinkedHashSet / TreeSet 并生成单元素示例数组；支持 T[] 数组语法。'],
        ['Map 类型', '识别 Map / HashMap / LinkedHashMap / TreeMap / ConcurrentHashMap，生成形如 { "key": <默认值> } 的结构。'],
        ['时间与数值类型', '内置 LocalDate、LocalDateTime、LocalTime、ZonedDateTime、Instant、Date、Timestamp 以及 BigDecimal、BigInteger 的合理默认值。'],
        ['import 解析', '读取类的 import 语句，将字段中的简单类名解析为全限定名，避免同名类混淆。'],
        ['嵌套引用与上下文', '支持嵌套引用其他实体类，把被引用的类粘贴到「上下文」框即可一并解析；深度超过 5 层自动返回 null 防止无限递归。'],
        ['自动跳过序列化字段', '自动跳过 serialVersionUID，不污染输出 JSON。'],
        ['纯前端、零上传', '解析全部在浏览器完成，没有后端、没有网络请求，适合处理敏感业务模型。'],
      ],
    },
    steps: {
      title: '使用步骤',
      items: [
        '在左侧「实体类」输入框粘贴要转换的 Java 实体类代码。',
        '如果类中引用了其他自定义类型，把它们粘贴到右侧「上下文」输入框（可选）。',
        '点击「转换」按钮，右下方立即显示带默认值的 JSON 示例，可一键复制。',
      ],
    },
    faq: {
      title: '常见问题',
      items: [
        {
          q: '支持哪些 JSON 字段名注解？',
          a: '目前支持 Jackson 的 @JsonProperty、Gson 的 @SerializedName 以及 Fastjson 的 @JSONField。工具会优先使用注解中指定的名称作为 JSON 字段名。',
        },
        {
          q: '我的代码会被上传到服务器吗？',
          a: '不会。本工具是纯前端应用，没有后端服务，所有解析都在你的浏览器内完成，不会发起任何网络请求。',
        },
        {
          q: '遇到未识别的引用类型怎么办？',
          a: '工具不会报错，而是跳过该字段并给出提示。把被引用的类定义粘贴到「上下文」输入框，重新转换即可。',
        },
        {
          q: '集合、Map 和数组会如何处理？',
          a: 'List/Set/Collection 等会生成包含一个示例元素的数组；Map 会生成 { "key": <值默认值> } 的对象；T[] 数组同样生成示例数组。',
        },
        {
          q: '支持哪些 Java 时间类型？',
          a: '内置 java.time 全家桶（LocalDate、LocalDateTime、LocalTime、ZonedDateTime、Instant）以及 java.util.Date、java.sql.Timestamp 的默认值，可在输出中直接使用。',
        },
      ],
    },
    aboutTitle: '关于这个工具',
    about:
      '这是一个面向后端开发与接口联调场景的小工具：当你拿到一个 Java 接口入参类，需要快速构造一份 JSON 示例用于 Postman 调用、写文档或 Mock 数据时，手动逐字段填写很繁琐。本工具自动按字段类型填入合理的默认值，配合 @JsonProperty 等注解生成符合实际序列化结果的 JSON，省去手写样例的工作。',
  },

  en: {
    lang: 'en',
    title: 'Java Entity to JSON Converter Online - Supports @JsonProperty & java.time',
    description:
      'Convert Java entity classes (POJO) to JSON examples online. Supports @JsonProperty, @SerializedName, @JSONField annotations, List/Map/generics and T[] arrays, with sensible defaults for LocalDate/LocalDateTime/BigDecimal. Runs entirely in your browser — no code upload.',
    keywords:
      'Java entity to JSON converter, Java POJO to JSON online, generate JSON from Java class, @JsonProperty example, Java class to JSON sample',
    h1: 'Java Entity to JSON Converter',
    intro:
      'This tool converts Java entity classes (POJO) into JSON examples with sensible default values — handy for API debugging, mock data and documentation. Paste your class to instantly get JSON that respects JSON-name annotations, collections, maps, generics, and common types like java.time and BigDecimal. All parsing happens locally in your browser; no code is ever uploaded.',
    features: {
      title: 'Features',
      items: [
        ['JSON-name annotations', 'Recognizes @JsonProperty, @SerializedName and @JSONField, using the annotation value as the JSON field name.'],
        ['Collections & arrays', 'Recognizes List / Set / Collection / ArrayList / HashSet / LinkedHashSet / TreeSet and emits a single-element sample array; supports T[] array syntax.'],
        ['Map types', 'Recognizes Map / HashMap / LinkedHashMap / TreeMap / ConcurrentHashMap and emits an object like { "key": <default> }.'],
        ['Time & numeric types', 'Ships with sensible defaults for LocalDate, LocalDateTime, LocalTime, ZonedDateTime, Instant, Date, Timestamp, plus BigDecimal and BigInteger.'],
        ['import resolution', 'Reads class imports and resolves simple class names to fully-qualified names to avoid same-name ambiguity.'],
        ['Nested references & context', 'Supports nested entity references — paste referenced classes into the "Context" box. Recursion is capped at depth 5 (deeper fields return null).'],
        ['Skips serialVersionUID', 'Automatically excludes serialVersionUID so it never pollutes the output JSON.'],
        ['Front-end only, zero upload', 'Parsing runs entirely in your browser. No backend, no network requests — safe for sensitive domain models.'],
      ],
    },
    steps: {
      title: 'How to use',
      items: [
        'Paste the Java entity class you want to convert into the "Entity class" box on the left.',
        'If the class references other custom types, paste them into the "Context" box on the right (optional).',
        'Click "Convert" — a JSON sample with default values appears in the bottom-right panel, ready to copy.',
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        {
          q: 'Which JSON-name annotations are supported?',
          a: 'Jackson\'s @JsonProperty, Gson\'s @SerializedName and Fastjson\'s @JSONField. The name specified in the annotation is used as the JSON field name.',
        },
        {
          q: 'Is my code uploaded anywhere?',
          a: 'No. This is a purely front-end app with no backend. All parsing happens in your browser; no network request is made.',
        },
        {
          q: 'What happens with unrecognized referenced types?',
          a: 'The tool does not error — it skips the field and emits a warning. Paste the referenced class definition into the "Context" box and convert again.',
        },
        {
          q: 'How are collections, maps and arrays handled?',
          a: 'List/Set/Collection etc. produce a sample array with one element; Map produces an object like { "key": <value default> }; T[] arrays also produce a sample array.',
        },
        {
          q: 'Which Java time types are supported?',
          a: 'The java.time family (LocalDate, LocalDateTime, LocalTime, ZonedDateTime, Instant) plus java.util.Date and java.sql.Timestamp all have built-in defaults in the output.',
        },
      ],
    },
    aboutTitle: 'About this tool',
    about:
      'A small utility for backend developers and API integration work: when you have a Java request class and need a quick JSON sample for Postman, documentation or mock data, filling fields by hand is tedious. This tool auto-fills sensible defaults per field type and respects @JsonProperty and similar annotations, so the output matches the real serialized JSON — no manual sample writing.',
  },
}
