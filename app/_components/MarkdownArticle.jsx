import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { headingId } from "../../lib/headings";

export function MarkdownArticle({ children }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} skipHtml components={{ h2: ({ children: headingChildren }) => <h2 id={headingId(headingChildren)}>{headingChildren}</h2> }}>{children}</ReactMarkdown>;
}
