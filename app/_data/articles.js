export const articles = [
  {
    slug: "read-traceback",
    title: "把 Traceback 读成下一步",
    description: "先找到真正失败的一行，再把环境、输入和调用链逐层缩小。",
    tags: ["调试", "Python", "方法"],
    category: "调试方法",
    readingTime: "4 分钟",
    keywords: ["traceback", "报错", "复现", "debug"],
  },
  {
    slug: "inception-branches",
    title: "Inception：分支为什么能汇合",
    description: "从 torch.cat 出发，理解多尺度分支、空间尺寸和通道数。",
    tags: ["深度学习", "PyTorch", "Inception"],
    category: "结构笔记",
    readingTime: "5 分钟",
    keywords: ["torch.cat", "channels", "卷积", "分支"],
  },
  {
    slug: "resnet-identity",
    title: "ResNet：identity 留下了什么",
    description: "用 out += identity 阅读残差连接，而不是把它当成性能承诺。",
    tags: ["深度学习", "PyTorch", "ResNet"],
    category: "结构笔记",
    readingTime: "5 分钟",
    keywords: ["residual", "identity", "残差", "投影"],
  },
  {
    slug: "validation-is-not-test",
    title: "验证集不是测试集",
    description: "让数据划分、训练曲线和文字结论各自守住证据边界。",
    tags: ["实验", "证据", "机器学习"],
    category: "实验方法",
    readingTime: "4 分钟",
    keywords: ["validation", "test", "metrics", "数据划分"],
  },
];

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug);
}

export const articleModules = {
  "read-traceback": () => import("../articles/_content/read-traceback.mdx"),
  "inception-branches": () => import("../articles/_content/inception-branches.mdx"),
  "resnet-identity": () => import("../articles/_content/resnet-identity.mdx"),
  "validation-is-not-test": () => import("../articles/_content/validation-is-not-test.mdx"),
};
