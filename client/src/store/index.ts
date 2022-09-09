import { configureStore, combineReducers } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./rootSaga";
import authReducer, { AUTH_SLICE_NAME } from "./auth/slice";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  [AUTH_SLICE_NAME]: authReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;

sagaMiddleware.run(rootSaga);
