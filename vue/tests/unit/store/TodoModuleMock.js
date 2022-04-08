import { buildModuleTypes } from '@/helpers/store';
// import fetch from 'cross-fetch'

// const URL = `http://192.168.99.100:3000`

const moduleName = 'TodoModule';


export const namespaced = true;

export const state = {
  loading: false,
  todo: {
    content: 'テスト1',
    due_on: '2019-10-10',
    finished: false,
    id: 1,
  },
  todos: [
    {
      "id": 1,
      "content": "ちょっと筋トレする",
      "finished": false,
      "due_on": "2019-10-06"
    },
    {
      "id": 2,
      "content": "3キロ走る",
      "finished": false,
      "due_on": "2019-10-04"
    },
    {
      "id": 3,
      "content": "牛乳を買う",
      "finished": true,
      "due_on": "2019-10-08"
    },
    {
      "id": 4,
      "content": "Vue.jsの勉強をする!!",
      "finished": false,
      "due_on": "2019-10-03"
    },
    {
      "id": 5,
      "content": "運動不足を解消する",
      "finished": true,
      "due_on": "2019-10-14",
    },
  ]
};

const GETTER_TYPES = {
  LOADING: 'LOADING',
  TODOS: 'TODOS',
  TODO: 'TODO',
};
const MUTATION_TYPES = {
  GET_TODO: 'GET_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  GET_TODOS: 'GET_TODOS',
  TOGGLE_LOADING: 'TOGGLE_LOADING',
  REMOVE_TODO: 'REMOVE_TODO',
  ADD_TODO: 'ADD_TODO',
};
export const ACTION_TYPES = {
  GET_TODO_ASYNC: 'GET_TODO_ASYNC',
  UPDATE_TODO_ASYNC: 'UPDATE_TODO_ASYNC',
  GET_TODOS_ASYNC: 'GET_TODOS_ASYNC',
  REMOVE_TODO_ASYNC: 'REMOVE_TODO_ASYNC',
  ADD_TODO_ASYNC: 'ADD_TODO_ASYNC',
};

export const TODO_GETTER_TYPES = buildModuleTypes({
  moduleName,
  types: GETTER_TYPES,
});
export const TODO_MUTATION_TYPES = buildModuleTypes({
  moduleName,
  types: MUTATION_TYPES,
});
export const TODO_ACTION_TYPES = buildModuleTypes({
  moduleName,
  types: ACTION_TYPES,
});

export const getters = {
  [GETTER_TYPES.LOADING](state) {
    return state.loading;
  },
  [GETTER_TYPES.TODOS](state) {
    return state.todos;
  },
  [GETTER_TYPES.TODO](state) {
    return state.todo;
  },
};

export const mutations = {
  [MUTATION_TYPES.GET_TODO](state, { todo }) {
    state.todo = todo
  },
  [MUTATION_TYPES.TOGGLE_LOADING](state) {
    state.loading = !state.loading 
  },
  [MUTATION_TYPES.GET_TODOS](state, { todos }) {
    state.todos = todos
  },
  [MUTATION_TYPES.REMOVE_TODO](state, { todo }) {
    state.todos = state.todos.filter((t)=>{
      return t.id !== todo.id
    })
  },
  [MUTATION_TYPES.UPDATE_TODO](state, { todo }) {
    state.todos.forEach((t)=>{
      if(t.id === todo.id) {
        t.finished = todo.finished
        t.content = todo.content
        t.due_on = todo.due_on
      }
    })
  },
  [MUTATION_TYPES.ADD_TODO](state, { todo }) {
    state.todos.push(todo)
  },
};


export const actions = {
  [ACTION_TYPES.GET_TODO_ASYNC]: jest.fn(),

  [ACTION_TYPES.GET_TODOS_ASYNC]: jest.fn(),

  [ACTION_TYPES.REMOVE_TODO_ASYNC]: jest.fn(),

  [ACTION_TYPES.UPDATE_TODO_ASYNC]: jest.fn(),

  [ACTION_TYPES.ADD_TODO_ASYNC]: jest.fn(),
};