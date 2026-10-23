const paths = {
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  diagonal: <><path d="M6 18 18 6M6 6h12v12" /></>,
  down: <><path d="M12 5v14m-6-6 6 6 6-6" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  moon: <path d="M20 14.1A8.5 8.5 0 0 1 9.9 4a8.5 8.5 0 1 0 10.2 10.1Z" />,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
  github: <><path d="M9 19c-4 1.2-4-2-5-2m10 5v-3.4c0-1 .1-1.5-.5-2 3.2-.4 6.5-1.6 6.5-6.7 0-1.5-.5-2.7-1.4-3.7.1-.4.6-1.8-.1-3.6 0 0-1.1-.4-3.7 1.4a12.5 12.5 0 0 0-6.6 0C5.6 2.2 4.5 2.6 4.5 2.6c-.7 1.8-.2 3.2-.1 3.6A5.2 5.2 0 0 0 3 9.9c0 5.1 3.3 6.3 6.5 6.7-.6.5-.6 1.2-.5 2V22"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/></>,
  book: <><path d="M12 6c-2-2-6-2-9-1v14c3-1 7-1 9 1 2-2 6-2 9-1V5c-3-1-7-1-9 1Zm0 0v14"/></>,
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/></>,
  spark: <path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
};
export function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.spark}</svg>;
}
