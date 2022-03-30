import { getCategoryList, createCategory, updateCategory, deleteCategory } from '../services/api'
import { message } from 'antd';

export default {
  namespace: 'category',

  state: {
    add: { count: 0 },
    edit: { count: 0 },
    fileUp: { count: 0 },
    del: { count: 0 }
  },

  subscriptions: {
    setup({ dispatch, history }) {
    },
  },

  effects: {
    *CategoryList({ payload }, { call, put }) {
      const response = yield call(getCategoryList, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      yield put({ type: 'list', ...response });
    },
    *CategoryAdd({ payload }, { call, put }) {
      const response = yield call(createCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Category Created!", 5); }
      yield put({ type: 'add', ...response });
    },
    *CategoryEdit({ payload }, { call, put }) {
      const response = yield call(updateCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Category Updated!", 5); }
      yield put({ type: 'edit', ...response });
    },
    *deleteCategory({ payload }, { call, put }) {
      const response = yield call(deleteCategory, payload);
      if (!response.status) { message.error(response.msg || response.message || response.err, 5); }
      if (response.status) { message.success("Category Deleted!", 5); }
      yield put({ type: 'del', ...response });
    },
    *clearAction({ payload }, { call, put }) {
      yield put({ type: 'clear'});
    },
  
  },

  reducers: {
    list(state, action) {
      return { ...state, list: action };
    },
    add(state, action) {
      action.count = state.add.count + 1;
      return { ...state, add: action };
    },
    edit(state, action) {
      action.count = state.edit.count + 1;
      return { ...state, edit: action };
    },
    del(state, action) {
      action.count = state.del.count + 1;
      return { ...state, del: action };
    },
    clear(state, action) {
      return { ...state, edit:{count:0}, del:{count:0}};
      },
  },
};