import { configureStore, Action, AnyAction } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { ThunkAction, ThunkDispatch } from "redux-thunk";
import createRootReducer from "./rootReducer";

export const history = createBrowserHistory();
const rootReducer = createRootReducer(history);

export type RootState = ReturnType<typeof rootReducer>;

export const configuredStore = (initialState?: RootState) => {
  // Create Store
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
  return store;
};

export const store = configuredStore();
export type AppDispatch = typeof store.dispatch;
export type ReduxState = ReturnType<typeof rootReducer>;
export type TypedDispatch = ThunkDispatch<ReduxState, any, AnyAction>;
export const useAppDispatch = () => useDispatch<TypedDispatch>();
export const useAppSelector: TypedUseSelectorHook<ReduxState> = useSelector;
export type Store = ReturnType<typeof configuredStore>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
