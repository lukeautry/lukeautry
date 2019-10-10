import React from "react";
import { Editor } from "./editor";
import { Store } from "../store";
import { Api } from "../api";

interface ICreateProps {
  store: Store;
}

export const Create: React.SFC<ICreateProps> = props => {
  return (
    <Editor
      title="Create Blog Post"
      store={props.store}
      state={{
        slug: "",
        content: "",
        title: "",
        description: ""
      }}
      onSubmit={async state => {
        const time = new Date().getTime();
        const post = await new Api().create({
          ...state,
          dateCreated: time,
          dateModified: time
        });

        props.store.addPost(post);
      }}
    />
  );
};
