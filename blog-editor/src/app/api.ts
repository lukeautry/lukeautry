import axios from "axios";
import { Posts, IBlogPost, IBlogPostRequest } from "../../common/types";

export class Api {
  public async create(request: IBlogPostRequest) {
    return await this.callAndHandleError(async () => {
      const { data } = await axios.post<IBlogPost>("/posts", request);
      return data;
    });
  }

  public async update(request: IBlogPost) {
    return await this.callAndHandleError(async () => {
      const { data } = await axios.patch<IBlogPost>("/posts", request);
      return data;
    });
  }

  public async get(): Promise<Posts> {
    return await this.callAndHandleError(async () => {
      const { data } = await axios.get<Posts>("/posts");
      return data;
    });
  }

  public async delete(id: string) {
    return await this.callAndHandleError(async () => {
      return await axios.delete("/posts", {
        params: {
          id
        }
      });
    });
  }

  private async callAndHandleError<T>(fn: () => Promise<T>) {
    try {
      return await fn();
    } catch (err) {
      window.alert(`Error: ${JSON.stringify(err)}`);
      throw err;
    }
  }
}
