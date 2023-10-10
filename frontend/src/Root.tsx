import { Provider } from "react-redux";
import { History } from "history";
import { Store } from "./store";
import AppRoutes from "./AppRoutes";

type Props = {
  store: Store;
  history: History;
};

const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

export default Root;
