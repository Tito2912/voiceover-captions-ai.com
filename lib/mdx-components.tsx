import type { ReactNode } from 'react';

function childrenToText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return childrenToText((children as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type HP = { children?: ReactNode };

function H2({ children }: HP) { return <h2 id={slugify(childrenToText(children))}>{children}</h2>; }
function H3({ children }: HP) { return <h3 id={slugify(childrenToText(children))}>{children}</h3>; }
function H4({ children }: HP) { return <h4 id={slugify(childrenToText(children))}>{children}</h4>; }

export const mdxComponents = { h2: H2, h3: H3, h4: H4 };
