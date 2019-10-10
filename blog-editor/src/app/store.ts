import { IBlogPost } from "../../common/types";
import { observable } from "mobx";

export class Store {
  @observable private data: IBlogPost[];

  constructor(data: IBlogPost[]) {
    this.data = data;
  }

  public addPost(post: IBlogPost) {
    this.data.push(post);
  }

  public updatePost(post: IBlogPost) {
    const index = this.data.findIndex(p => p.id === post.id);
    if (index === -1) {
      throw new Error(`No post found with id ${post.id}`);
    }

    this.data.splice(index, 1, post);
  }

  public getPosts() {
    return this.data.sort((a, b) => {
      if (a.dateCreated < b.dateCreated) {
        return -1;
      }
      if (a.dateCreated > b.dateCreated) {
        return 1;
      }
      return 0;
    });
  }

  public getPostById(id: string) {
    const post = this.data.find(p => p.id === id);
    if (!post) {
      throw new Error(`No post found with id ${id}`);
    }

    return post;
  }

  public deletePost(id: string) {
    this.data = this.data.filter(p => p.id !== id);
  }
}
