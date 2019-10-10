import { promises as fs } from "fs";
import path from "path";
import { deserialize } from "./deserializers";
import { IBlogPost, Posts, ISchema } from "../common/types";

export class BlogService {
  public async getPosts(): Promise<Posts> {
    const { posts } = await this.getData();
    return posts;
  }

  public async createPost(data: unknown): Promise<IBlogPost> {
    const result = deserialize("IBlogPostRequest", data);
    if (!result.success) {
      throw new Error(result.error.message);
    }

    const postRequest = result.value;
    const postMap = await this.getPosts();
    const posts = Object.values(postMap);

    if (posts.find(p => p.slug === postRequest.slug)) {
      throw new Error(`Post with slug '${postRequest.slug}' already exists.`);
    }

    const post = {
      ...postRequest,
      id: this.uuid()
    };

    postMap[post.id] = post;
    await this.savePosts(postMap);

    return post;
  }

  public async updatePost(data: unknown): Promise<IBlogPost> {
    const result = deserialize("IBlogPost", data);
    if (!result.success) {
      throw new Error(result.error.message);
    }

    const postMap = await this.getPosts();
    const existingPost = postMap[result.value.id];
    if (!existingPost) {
      throw new Error(`No post with id ${result.value.id} exists.`);
    }

    const posts = Object.values(postMap);
    if (
      existingPost.slug !== result.value.slug &&
      posts.find(p => p.slug === result.value.slug)
    ) {
      throw new Error(`Post with slug '${result.value.slug}' already exists.`);
    }

    postMap[result.value.id] = result.value;

    await this.savePosts(postMap);

    return result.value;
  }

  public async deletePost(id: string) {
    const posts = await this.getPosts();
    delete posts[id];

    await this.savePosts(posts);
  }

  private async savePosts(posts: Posts) {
    const data = await this.getData();
    data.posts = posts;

    await fs.writeFile(
      path.join(__dirname, "../data.json"),
      JSON.stringify(data, null, 2)
    );
  }

  private async getData(): Promise<ISchema> {
    const rawData = await fs.readFile(path.join(__dirname, "../data.json"));
    return JSON.parse(rawData.toString());
  }

  private uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
