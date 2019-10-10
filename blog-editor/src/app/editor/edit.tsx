import React from "react";
import { Editor } from "./editor";
import { Store } from "../store";
import { Api } from "../api";

interface IEditProps {
  store: Store;
  match: {
    params: {
      id: string;
    };
  };
}

export const Edit: React.SFC<IEditProps> = props => {
  const post = props.store.getPostById(props.match.params.id);

  return (
    <Editor
      title="Edit Blog Post"
      store={props.store}
      state={post}
      onSubmit={async state => {
        const time = new Date().getTime();
        const updatedPost = await new Api().update({
          id: post.id,
          ...state,
          dateCreated: post.dateCreated,
          dateModified: time
        });

        props.store.updatePost(updatedPost);
      }}
    />
  );
};
