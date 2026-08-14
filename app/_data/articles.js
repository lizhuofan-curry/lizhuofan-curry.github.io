export const articles = [
  {
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
  "read-traceback": () => import("../articles/_content/read-traceback.mdx"),
  "inception-branches": () => import("../articles/_content/inception-branches.mdx"),
  "resnet-identity": () => import("../articles/_content/resnet-identity.mdx"),
  "validation-is-not-test": () => import("../articles/_content/validation-is-not-test.mdx"),
};
import { headingId } from "../../lib/headings";
