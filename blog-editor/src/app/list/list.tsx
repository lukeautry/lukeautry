import React from "react";
import { Store } from "../store";
import { observer } from "mobx-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { getPath } from "../../paths";
import { Api } from "../api";
import { IBlogPost } from "../../../common/types";

interface IListProps {
  store: Store;
}

@observer
export class List extends React.Component<IListProps> {
  public render() {
    const posts = this.props.store.getPosts();
    return (
      <div className="p-h p-v">
        <div className="fl jc-sb ai-c">
          <div className="title">Blog Posts</div>
          <Link to={getPath(p => p.create)} className="button is-link">
            Create Post
          </Link>
        </div>
        {posts.length ? this.renderTable() : this.renderEmpty()}
      </div>
    );
  }

  private renderEmpty() {
    return <div className="notification">No blog posts yet</div>;
  }

  private renderTable() {
    const posts = this.props.store.getPosts();
    const formatDate = (timestamp: number) =>
      moment.utc(timestamp).format("MM/DD/YY");

    return (
      <table className="table">
        <thead className="thead">
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Date Created</th>
            <th>Date Modified</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody className="tbody">
          {posts.map(post => {
            return (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.slug}</td>
                <td>{formatDate(post.dateCreated)}</td>
                <td>{formatDate(post.dateCreated)}</td>
                <td>
                  <Link to={getPath(p => p.edit, { id: post.id })}>Edit</Link>
                </td>
                <td>
                  <a
                    href={`http://localhost:64536/blog/${post.slug}`}
                    target="_blank"
                  >
                    View
                  </a>
                </td>
                <td>
                  <a className="link" onClick={this.handleDelete(post)}>
                    Delete
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  private readonly handleDelete = (post: IBlogPost) => async () => {
    const result = window.confirm(`Delete this post (${post.title})?`);
    if (result) {
      await new Api().delete(post.id);
      this.props.store.deletePost(post.id);
    }
  };
}
