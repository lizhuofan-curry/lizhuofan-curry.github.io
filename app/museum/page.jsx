import { SiteFooter, SiteHeader } from "../_components/SiteHeader";

const cases = [
  { id: "01", tag: "ENVIRONMENT", code: "WinError 4551", title: "导入失败，未必是模型的错。", symptom: "PyTorch 在导入阶段加载 DLL 失败，训练代码甚至还没有开始运行。", trace: "先确认 Python 解释器与报错路径，再检查 Windows 的应用控制或代码完整性策略。", lesson: "在改模型之前，先区分环境阻塞和代码错误。" },
  { id: "02", tag: "SHAPE", code: "Conv2d channel mismatch", title: "通道对不上，网络就不会说话。", symptom: "卷积层期待的输入通道数，与前一层真正输出的通道数不一致。", trace: "沿着前向传播逐层标注形状，检查每个 Conv2d 的 in_channels 是否接住上一层。", lesson: "Shape aware：每一层的通道与空间尺寸都要有据可查。" },
  { id: "03", tag: "TRAINING LOOP", code: "return too early", title: "不报错的训练，也可能是错的。", symptom: "训练循环提前 return，或验证阶段仍调用固定的模型变量。", trace: "检查 return 的缩进位置，并确认训练、验证都通过传入的 model 执行前向传播。", lesson: "能跑不等于逻辑正确；要看完整控制流。" },
  { id: "04", tag: "EVIDENCE", code: "validation ≠ test", title: "曲线漂亮，不等于结论成立。", symptom: "把验证集指标写成测试结果，或者忽略数据划分与随机种子。", trace: "回到数据划分、训练设置和原始输出，明确结果到底来自哪一步。", lesson: "Evidence > claims：结论的强度不能超过证据。" },
];

export const metadata = { title: "报错博物馆 — Zhuofan Li" };

export default function MuseumPage() { return <main className="knowledge-page"><SiteHeader /><section className="page-hero museum-hero"><p className="label">05 / TRACEBACK MUSEUM</p><h1>每一个报错，<br /><em>都是一件展品。</em></h1><p>不把失败藏起来：保存症状、排查路径与留下来的判断规则。</p></section><section className="museum-intro"><p>点击一张卡片，展开这次调试从「现象」到「线索」再到「规则」的过程。</p><span>REAL ERRORS · REUSABLE RULES</span></section><section className="museum-grid">{cases.map((item) => <details className="museum-card" key={item.id}><summary><div><span>{item.id}</span><span>{item.tag}</span></div><code>{item.code}</code><h2>{item.title}</h2><span className="museum-open">打开展签 ↓</span></summary><div className="museum-detail"><div><span>SYMPTOM</span><p>{item.symptom}</p></div><div><span>TRACE</span><p>{item.trace}</p></div><div><span>TAKEAWAY</span><p>{item.lesson}</p></div></div></details>)}</section><SiteFooter /></main>; }
