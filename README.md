# Zhuofan Li · AI Field Notes

李卓凡的个人主页与 AI 项目作品集。新版围绕“把好奇心编译成作品”展开，展示从证据驱动调试、PyTorch 模型实验，到计算机视觉与 LLM 产品工程的成长路线。

## 在线访问

<https://lizhuofan-curry.github.io>

## 本次改版

- 用深色实验室视觉、动态学习回路和高对比项目卡片重构首页；
- 更新问渠、智图寻宝、CIFAR-10 三架构实验与 LLM FullStack Journey；
- 将对话中反复形成的工作方法提炼为 Traceback First、Shape Aware、Evidence > Claims、Build to Learn；
- 保持响应式设计、无障碍语义与减少动态效果偏好支持；
- 所有项目指标都标明证据边界，验证集结果不表述为独立测试结果。

## 本地运行

```bash
npm install
npm run dev
```

## 构建与发布

```bash
npm run build
```

站点采用 Next.js 静态导出。推送到 `main` 后，GitHub Actions 会将 `out/` 发布到 GitHub Pages。
