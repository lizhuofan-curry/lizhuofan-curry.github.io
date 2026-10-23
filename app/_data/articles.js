import { headingId } from "../../lib/headings";

// 说明：注册表条目本身不含 `source` 字段；渲染时由 lib/content.js 的回退路径注入 `source: "mdx"`。


export const articles = [
  {
    slug: "reading-with-evidence",
    title: "让 AI 阅读，回到原文证据",
    description: "从问渠的双轨阅读与复述诊断，看一段学习过程怎样形成闭环。",
    category: "产品思考",
    readingTime: "约 3 分钟",
    tags: [
      "AI",
      "问渠",
      "学习体验"
    ],
    keywords: [
      "阅读",
      "证据",
      "复习"
    ],
    evidence: [
      "https://github.com/lizhuofan-curry/wenqu"
    ]
  },
  {
    slug: "collaboration-from-time",
    title: "协作，从找到共同空闲开始",
    description: "课表、任务与工作关系图，怎样共同服务一个实验室的日常。",
    category: "工程记录",
    readingTime: "约 3 分钟",
    tags: [
      "协作",
      "HenuBCI",
      "产品设计"
    ],
    keywords: [
      "课表",
      "任务",
      "实验室"
    ],
    evidence: [
      "https://github.com/lizhuofan-curry/lab-schedule"
    ]
  },
  {
    slug: "agents-through-experiments",
    title: "理解 Agent，先让过程看得见",
    description: "从章节实验到工具调用，把学习拆成可运行、可观察的小步骤。",
    category: "学习笔记",
    readingTime: "约 3 分钟",
    tags: [
      "Agent",
      "Python",
      "实验"
    ],
    keywords: [
      "hello agents",
      "智能体",
      "学习"
    ],
    evidence: [
      "https://github.com/lizhuofan-curry/hello-agents-learning-lab"
    ]
  }
,
  {
    archived: true,
    slug: "read-traceback",
    title: "把 Traceback 读成下一步",
    description: "先找到真正失败的一行，再把环境、输入和调用链逐层缩小。",
    tags: ["调试", "Python", "方法"],
    category: "调试方法",
    readingTime: "6 分钟",
    keywords: ["traceback", "报错", "复现", "debug"],
    evidence: ["https://github.com/lizhuofan-curry/LiuErDaRenPyTorch"],
    toc: ["报错不是最后一句话", "把问题分成三个层次", "用最小前向传播代替完整训练", "一次修改对应一个判断", "修复后重新读取最新 Traceback"].map((text) => ({ text, id: headingId(text) })),
  },
  {
    archived: true,
    slug: "inception-branches",
    title: "Inception：分支为什么能汇合",
    description: "从 torch.cat 出发，理解多尺度分支、空间尺寸和通道数。",
    tags: ["深度学习", "PyTorch", "Inception"],
    category: "结构笔记",
    readingTime: "6 分钟",
    keywords: ["torch.cat", "channels", "卷积", "分支"],
    evidence: ["https://github.com/lizhuofan-curry/LiuErDaRenPyTorch/tree/main/Chapter11_AdvancedCNN/CIFAR10_Three_CNN_Architectures"],
    toc: ["从汇合处往回看", "先写出每条路径的形状", "卷积核不同，空间尺寸仍要一致", "用最小输入验证结构", "这段实现能说明什么"].map((text) => ({ text, id: headingId(text) })),
  },
  {
    archived: true,
    slug: "resnet-identity",
    title: "ResNet：identity 留下了什么",
    description: "用 out += identity 阅读残差连接，而不是把它当成性能承诺。",
    tags: ["深度学习", "PyTorch", "ResNet"],
    category: "结构笔记",
    readingTime: "6 分钟",
    keywords: ["residual", "identity", "残差", "投影"],
    evidence: ["https://github.com/lizhuofan-curry/LiuErDaRenPyTorch/tree/main/Chapter11_AdvancedCNN/CIFAR10_Three_CNN_Architectures"],
    toc: ["先找到那条没有绕路的路径", "相加比拼接多一个限制", "尺寸变化时需要投影", "用断言替代猜测", "结构理解与实验结论分开"].map((text) => ({ text, id: headingId(text) })),
  },
  {
    archived: true,
    slug: "validation-is-not-test",
    title: "验证集不是测试集",
    description: "让数据划分、训练曲线和文字结论各自守住证据边界。",
    tags: ["实验", "证据", "机器学习"],
    category: "实验方法",
    readingTime: "7 分钟",
    keywords: ["validation", "test", "metrics", "数据划分"],
    evidence: ["https://github.com/lizhuofan-curry/smart-image-treasure-hunt", "https://github.com/lizhuofan-curry/LiuErDaRenPyTorch/tree/main/Chapter11_AdvancedCNN/CIFAR10_Three_CNN_Architectures"],
    toc: ["名称决定结论边界", "先记录数据怎样被切分", "项目页面也要遵守同一规则", "图表至少回答四个问题", "结果表述要和证据一一对应"].map((text) => ({ text, id: headingId(text) })),
  },
];

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug);
}

export const articleModules = {
  "reading-with-evidence": () => import("../articles/_content/reading-with-evidence.mdx"),
  "collaboration-from-time": () => import("../articles/_content/collaboration-from-time.mdx"),
  "agents-through-experiments": () => import("../articles/_content/agents-through-experiments.mdx"),

  "read-traceback": () => import("../articles/_content/read-traceback.mdx"),
  "inception-branches": () => import("../articles/_content/inception-branches.mdx"),
  "resnet-identity": () => import("../articles/_content/resnet-identity.mdx"),
  "validation-is-not-test": () => import("../articles/_content/validation-is-not-test.mdx"),
};
