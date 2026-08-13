import { headingId } from "./lib/headings";

export function useMDXComponents(components) {
  return {
    h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
    ...components,
  };
}
