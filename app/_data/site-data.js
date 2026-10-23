export const projects = [
  {
    slug: "agent-book",
    title: "AI Agent 读书实验",
    summary: "从搜索循环、上下文工程到记忆与检索，保留分步代码、运行轨迹与核查记录。",
    category: "学习实验",
    copy: "从搜索循环、上下文工程到记忆与检索，保留分步代码、运行轨迹与核查记录。",
    question: "怎样把一个概念拆成可以观察、运行与回看的步骤？",
    href: "https://github.com/lizhuofan-curry/ai-agents-book-learning",
    tags: [
      "Python",
      "Agent",
      "检索"
    ],
    highlights: [
      "将搜索 Agent 拆成离线观察、工具回传与真实循环等学习步骤。",
      "记录上下文压缩、状态栏与记忆格式的局部对照实验。",
      "保存稠密检索、BM25 与混合检索的小规模学习记录。"
    ],
    boundary: "参考《深入理解 AI Agent》的个人学习整理；不同实验范围与完成状态以仓库为准，不视为通用性能结论。",
    featured: false,
    accent: "sky"
  },
  {
    slug: "llm-pretrain",
    title: "LLM 预训练实验室",
    summary: "从手写 BPE 开始，理解文本怎样变成 token，以及训练系统的资源约束。",
    category: "学习实验",
    copy: "从手写 BPE 开始，理解文本怎样变成 token，以及训练系统的资源约束。",
    question: "怎样把一个概念拆成可以观察、运行与回看的步骤？",
    href: "https://github.com/lizhuofan-curry/LLM_Pretrain",
    tags: [
      "Python",
      "Tokenizer",
      "PyTorch"
    ],
    highlights: [
      "手写 SimpleBPE，观察统计、合并、编码与解码。",
      "使用 Byte-Level BPE，并比较 tiktoken 与 Qwen Tokenizer。",
      "整理显存、FLOPs、MFU、带宽与 DDP 基础。"
    ],
    boundary: "语料管线正在扩展，Transformer 与完整单卡、多卡预训练仍在计划中。",
    featured: false,
    accent: "sky"
  },
  {
    slug: "algorithm-templates",
    title: "算法与易错点手册",
    summary: "按知识模块整理 C++ 模板、解题思路与容易反复出错的细节。",
    category: "学习实验",
    copy: "按知识模块整理 C++ 模板、解题思路与容易反复出错的细节。",
    question: "怎样把一个概念拆成可以观察、运行与回看的步骤？",
    href: "https://github.com/lizhuofan-curry/algorithm-templates",
    tags: [
      "C++17",
      "算法",
      "CI"
    ],
    highlights: [
      "包含基础算法、数据结构、搜索图论与动态规划模块。",
      "配套学习笔记、总目录与易错点记录。",
      "提供 Markdown 链接与 C++ 语法检查脚本及 CI。"
    ],
    boundary: "来自 AcWing 算法基础课的个人学习整理；数学与贪心模块仍待补充。",
    featured: false,
    accent: "sky"
  }
,
  {
    slug: "wenqu",
    title: "问渠 Wenqu",
    category: "AI 阅读产品",
    summary: "从原文证据出发，把阅读、主动回忆与错因诊断连成一段完整的学习过程。",
    copy: "问渠把阅读拆成可以回看的过程：先建立材料地图，再带着问题阅读，通过复述、理解题和原文证据定位还没有弄懂的地方。",
    question: "读完一份材料之后，怎样知道自己真正理解了什么？",
    highlights: [
      "材料地图与严格轨、陪读轨双轨阅读",
      "开放式理解题、复述与原文证据诊断",
      "D1/D3/D7 间隔复习与服务端可信学习档案"
    ],
    tags: [
      "React",
      "TypeScript",
      "FastAPI",
      "Supabase"
    ],
    href: "https://github.com/lizhuofan-curry/wenqu",
    demo: "https://wenqu.zhuofan.me/",
    featured: true,
    accent: "mint",
    image: "/images/wenqu-home.png",
    boundary: "README 当前为 v.5，截图底部为此前视觉基线版本 不宣称已有保持趋势或学习效果提升",
    eyebrow: "AI 阅读产品",
    role: "个人项目",
    signal: ""
  },
  {
    slug: "henubci",
    title: "HenuBCI",
    category: "实验室协作平台",
    summary: "把课表、共同空闲、任务与成员工作连接起来，让实验室协作更清楚。",
    copy: "HenuBCI 面向实验室协作，把成员课表、共同空闲与项目任务放在同一个空间，并用有来源的工作关系图帮助梳理内容之间的联系。",
    question: "当课表、任务与工作记录分散在不同地方，怎样把协作重新连起来？",
    highlights: [
      "课表导入、成员课表与多人共同空闲查询",
      "项目小组、任务成果验收与私有附件",
      "具有来源依据的 2D 工作关系图与内容关联反馈"
    ],
    tags: [
      "Next.js",
      "PostgreSQL",
      "Docker"
    ],
    href: "https://github.com/lizhuofan-curry/lab-schedule",
    demo: "https://schedule.henubci.cn",
    featured: true,
    accent: "sky",
    image: null,
    boundary: "当前为 2D 关系图，3D 为后续计划 关系图仅对登录启用成员开放",
    eyebrow: "实验室协作平台",
    role: "个人项目",
    signal: ""
  },
  {
    slug: "momo-reading-assistant",
    title: "拾词",
    category: "语境学习工具",
    summary: "从真实英文材料里筛出值得记住的词，保留语境，经人工审核后同步到墨墨。",
    copy: "拾词从材料里提取语境，让 AI 提供候选词、释义与筛选理由，再由人审核决定是否加入词本。重点是保留阅读时真正遇见这个词的上下文。",
    question: "阅读时遇到的词，怎样带着上下文进入复习？",
    highlights: [
      "文档、图片、视频与字幕中的语境提取",
      "按学习目标筛词，保留例句、释义与理由",
      "跨页面候选箱、人工审核与墨墨云词本同步"
    ],
    tags: [
      "JavaScript",
      "Browser OCR",
      "AI API"
    ],
    href: "https://github.com/lizhuofan-curry/momo-reading-assistant",
    demo: "https://momo.zhuofan.me/",
    featured: true,
    accent: "lavender",
    image: "/images/momo-workspace.png",
    boundary: "非墨墨官方工具，不宣称官方合作或背书 Local-first 不代表所有计算离线，确认后的分析文本会发送给 AI 服务",
    eyebrow: "语境学习工具",
    role: "个人项目",
    signal: ""
  },
  {
    slug: "hello-agents",
    title: "Hello Agents 学习实验室",
    category: "Agent 学习与实验",
    summary: "从规则对话到自制 Agent 框架，用中文笔记、演示与中间状态记录逐渐理解的过程。",
    copy: "从规则对话到自制 Agent 框架，用中文笔记、演示与中间状态记录逐渐理解的过程。",
    question: "怎样把学习的过程，变成可以运行和回看的记录？",
    highlights: [
      "ELIZA、语言模型与经典 Agent 工作流章节实验",
      "自制 Message、Tool、Agent 基础组件与工具注册",
      "33 个阶段性演示与章节中文笔记"
    ],
    tags: [
      "Python",
      "Agent"
    ],
    href: "https://github.com/lizhuofan-curry/hello-agents-learning-lab",
    featured: false,
    accent: "mint",
    boundary: "个人学习实现，参考 Datawhale Hello-Agents，非官方教程 不是每个历史演示均兼容当前接口 Reflection 仅一轮，Plan-and-Solve 尚不动态重规划 Function Calling 网络模型完整端到端流程及异常分支仍待验证",
    eyebrow: "Agent 学习与实验",
    role: "个人学习实践",
    signal: ""
  },
  {
    slug: "llm-fullstack",
    title: "LLM FullStack Journey",
    category: "LLM 工程学习",
    summary: "以可运行的 AI Study Coach API 为起点，练习接口、模型适配、自动化测试与持续集成。",
    copy: "以可运行的 AI Study Coach API 为起点，练习接口、模型适配、自动化测试与持续集成。",
    question: "怎样把学习的过程，变成可以运行和回看的记录？",
    highlights: [
      "FastAPI AI Study Coach API 与交互式文档",
      "确定性离线 Provider 与兼容模型 Provider",
      "接口测试、Ruff 检查与 GitHub Actions CI"
    ],
    tags: [
      "Python",
      "FastAPI",
      "CI"
    ],
    href: "https://github.com/lizhuofan-curry/LLM-FullStack-Journey",
    featured: false,
    accent: "mint",
    boundary: "多轮持久会话、RAG、LangGraph、Docker 与在线 Demo 均在路线图，不能写已实现",
    eyebrow: "LLM 工程学习",
    role: "个人学习实践",
    signal: ""
  },
  {
    slug: "shop-vision",
    title: "智图寻宝 Shop Vision",
    category: "计算机视觉",
    summary: "商品分类、去噪、相似检索与多模态文案生成的视觉应用。",
    copy: "早期项目档案，保留公开实现与实验的入口。",
    question: "如何把多个视觉任务组织成可以使用的应用？",
    highlights: [
      "商品图像分类、去噪与相似检索。",
      "结合 Kimi 多模态模型生成商品文案。",
      "实验指标须区分验证集与测试集。"
    ],
    tags: [
      "PyTorch",
      "Computer Vision"
    ],
    href: "https://github.com/lizhuofan-curry/smart-image-treasure-hunt",
    archived: true,
    accent: "sky"
  },
  {
    slug: "cnn-architectures",
    title: "CNN × Inception × ResNet",
    category: "深度学习实验",
    summary: "在 CIFAR-10 上，用同一训练流程观察三种经典视觉网络。",
    copy: "从连接方式出发阅读实现，并把训练曲线与结论分开记录。",
    question: "不同的网络连接方式，如何改变信息经过模型的路径？",
    highlights: [
      "观察 CNN、Inception 与 ResNet 的结构。",
      "用 torch.cat 合并多尺度分支。",
      "用 identity 路径理解残差连接。"
    ],
    tags: [
      "PyTorch",
      "CIFAR-10"
    ],
    href: "https://github.com/lizhuofan-curry/LiuErDaRenPyTorch/tree/main/Chapter11_AdvancedCNN/CIFAR10_Three_CNN_Architectures",
    archived: true,
    accent: "sky"
  }
];
export const notes = [];
export function getProject(slug) { return projects.find(p => p.slug === slug); }
