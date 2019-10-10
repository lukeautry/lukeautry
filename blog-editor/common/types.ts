/**
 * @serializable
 */
export interface IBlogPost extends IBlogPostRequest {
  id: string;
}

/**
 * @serializable
 */
export interface IBlogPostRequest {
  slug: string;
  title: string;
  description: string;
  dateCreated: number;
  dateModified: number;
  content: string;
}

export interface ISchema {
  posts: Posts;
}

export type Posts = Record<string, IBlogPost>;
