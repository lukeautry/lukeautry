import React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import ReactMde from "react-mde";
import Showdown from "showdown";
import { Store } from "../store";
import { Link } from "react-router-dom";
import { getPath } from "../../paths";
import "./editor.scss";

interface IEditorProps {
  store: Store;
  title: string;
  state: IEditorState;
  onSubmit: (state: IEditorState) => Promise<void>;
}

export interface IEditorState {
  title: string;
  description: string;
  slug: string;
  content: string;
}

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

@observer
export class Editor extends React.Component<IEditorProps> {
  @observable private title: string;
  @observable private description: string;
  @observable private slug: string;
  @observable private content: string;
  @observable private selectedTab: "write" | "preview" = "write";

  constructor(public readonly props: IEditorProps) {
    super(props);
    const { title, slug, content, description } = props.state;
    this.title = title;
    this.description = description;
    this.slug = slug;
    this.content = content;
  }

  public render() {
    return (
      <div className="editor p-v p-h">
        <div className="fl jc-sb ai-c">
          <div className="title">{this.props.title}</div>
          <Link to={getPath(p => p.list)} className="button is-link">
            Back to all posts
          </Link>
        </div>
        <form onSubmit={this.onSubmit}>
          <div className="field">
            <div className="control">
              <label className="label">Post Title</label>
              <input
                required={true}
                autoFocus={true}
                className="input is-primary"
                type="text"
                placeholder="Post Title (e.g. My Status Update)"
                onChange={event => (this.title = event.target.value)}
                value={this.title}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="label">Post Description</label>
              <textarea
                required={true}
                autoFocus={true}
                className="input is-primary"
                placeholder="Post Description"
                onChange={event => (this.description = event.target.value)}
                value={this.description}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="label">Post Slug</label>
              <input
                required={true}
                className="input is-primary"
                type="text"
                placeholder="Post Slug (e.g. status-update)"
                onChange={event => (this.slug = event.target.value)}
                value={this.slug}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="label">Content</label>
              <ReactMde
                value={this.content}
                onChange={value => (this.content = value)}
                selectedTab={this.selectedTab}
                onTabChange={tab => (this.selectedTab = tab)}
                generateMarkdownPreview={markdown =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
            </div>
          </div>
          <div className="fl jc-fe">
            <button className="button is-primary">Save</button>
          </div>
        </form>
      </div>
    );
  }

  private readonly onSubmit: React.ChangeEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    await this.props.onSubmit({
      content: this.content,
      slug: this.slug,
      title: this.title,
      description: this.description
    });
  };
}
