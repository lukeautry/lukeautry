import React from "react";
import { Switch, Route, Redirect } from "react-router";
import { getPath } from "../paths";
import { Create } from "./editor/create";
import { observable } from "mobx";
import { Store } from "./store";
import { Api } from "./api";
import { observer } from "mobx-react";
import { List } from "./list/list";
import { Edit } from "./editor/edit";

@observer
export class App extends React.Component {
  @observable private store?: Store;

  constructor(props: {}) {
    super(props);
    this.initialize();
  }

  public render() {
    const store = this.store;
    if (!store) {
      return null;
    }

    return (
      <Switch>
        <Route
          path={getPath(p => p.create)}
          render={() => <Create store={store} />}
        />
        <Route
          path={getPath(p => p.edit)}
          render={props => <Edit store={store} match={props.match} />}
        />
        <Route
          path={getPath(p => p.list)}
          render={() => <List store={store} />}
        />
        <Redirect to={getPath(p => p.list)} />
      </Switch>
    );
  }

  private async initialize() {
    const data = await new Api().get();
    this.store = new Store(Object.values(data));
  }
}
