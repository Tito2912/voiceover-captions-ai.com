import type { Post } from '@/lib/types';

export function ArticleLayout({ post }: { post: Post }) {
  if (post.type === 'article') {
    return <main className="container article">{post.content}</main>;
  }

  if (post.type === 'blogIndex') {
    return <main className="container">{post.content}</main>;
  }

  return <main>{post.content}</main>;
}

