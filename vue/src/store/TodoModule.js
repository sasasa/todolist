import { buildModuleTypes } from '@/helpers/store';
// import fetch from 'cross-fetch'
import 'cross-fetch/polyfill';

const URL = process.env.VUE_APP_API_URL_BASE

const moduleName = 'TodoModule';


export const namespaced = true;

export const state = {
  todo: {
    content: '',
    due_on: '',
    finished: false,
    id: 0,
  },
  todos: [
  ],
  add_errors: {
    content: [],
  },
  add_success: false,
  update_errors: {
    content: [],
  },
  update_success: false,
};

const GETTER_TYPES = {
  TODOS: 'TODOS',
  TODO: 'TODO',
  ADD_ERRORS: 'ADD_ERRORS',
  ADD_SUCCESS: 'ADD_SUCCESS',
  UPDATE_ERRORS: 'UPDATE_ERRORS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
};
const MUTATION_TYPES = {
  GET_TODO: 'GET_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  GET_TODOS: 'GET_TODOS',
  REMOVE_TODO: 'REMOVE_TODO',
  ADD_TODO: 'ADD_TODO',
  ADD_ERRORS: 'ADD_ERRORS',
  ADD_SUCCESS: 'ADD_SUCCESS',
  UPDATE_ERRORS: 'UPDATE_ERRORS',
  UPDATE_SUCCESS: 'UPDATE_SUCCESS',
};
const ACTION_TYPES = {
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
  [GETTER_TYPES.TODOS](state) {
    return state.todos;
  },
  [GETTER_TYPES.TODO](state) {
    return state.todo;
  },
  [GETTER_TYPES.ADD_ERRORS](state) {
    return state.add_errors;
  },
  [GETTER_TYPES.ADD_SUCCESS](state) {
    return state.add_success;
  },
  [GETTER_TYPES.UPDATE_ERRORS](state) {
    return state.update_errors;
  },
  [GETTER_TYPES.UPDATE_SUCCESS](state) {
    return state.update_success;
  },
};

export const mutations = {
  [MUTATION_TYPES.GET_TODO](state, { todo }) {
    state.todo = todo
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
  [MUTATION_TYPES.ADD_ERRORS](state, { errors }) {
    state.add_errors = errors
  },
  [MUTATION_TYPES.ADD_SUCCESS](state, { success }) {
    state.add_success = success
  },
  [MUTATION_TYPES.UPDATE_ERRORS](state, { errors }) {
    state.update_errors = errors
  },
  [MUTATION_TYPES.UPDATE_SUCCESS](state, { success }) {
    state.update_success = success
  },
};

export const actions = {
  [ACTION_TYPES.GET_TODO_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })
    fetch(`${URL}/todos/${payload.id}.json?user_email=${payload.user.email}`, { 
      method: 'GET',
      headers: {
        Authorization: `Bearer ${payload.user.authentication_token}`,
      }
    })
    .then(response => {
      if (200 <= response.status < 300 && response.ok) {
        return response.json();
      } else {
        throw new Error(`status NG ${response.status}:${response.statusText}`);
      }
    })
    .then(todo => {
      context.commit(MUTATION_TYPES.GET_TODO, { todo })
      // console.log(`--------------${ todo.id }`)
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error);
      
      alert(error)
      context.commit('toggle_loading', payload, { root: true })
    })
  },

  [ACTION_TYPES.GET_TODOS_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })
    fetch(`${URL}/todos.json?user_email=${payload.user.email}`, { 
      method: 'GET',
      headers: {
        Authorization: `Bearer ${payload.user.authentication_token}`,
      }
    })
    .then(response => {
      if (200 <= response.status < 300 && response.ok) {
        return response.json();
      } else {
        throw new Error(`status NG ${response.status}:${response.statusText}`);
      }
    })
    .then(todos => {
      context.commit(MUTATION_TYPES.GET_TODOS, { todos })
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error);
      alert(error)
      context.commit('toggle_loading', payload, { root: true })
    })
  },

  [ACTION_TYPES.REMOVE_TODO_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })
    fetch(`${URL}/todos/${payload.todo.id}.json?user_email=${payload.user.email}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
      headers: { 
        'Content-type': 'application/json',
        'X-CSRF-Token': localStorage.csrf,
        Authorization: `Bearer ${payload.user.authentication_token}`,
      },
    })
    .then(response => {
      if (200 <= response.status < 300 && response.ok) {
        return response.json();
      } else {
        throw new Error(`status NG ${response.status}:${response.statusText}`);
      }
    })
    .then((todo) => {
      todo
      context.commit(MUTATION_TYPES.REMOVE_TODO, payload)
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error);
      alert(error)
      context.commit('toggle_loading', payload, { root: true })
    })
  },

  [ACTION_TYPES.UPDATE_TODO_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })
    context.commit(MUTATION_TYPES.UPDATE_SUCCESS, { success: false })
    const id = payload.todo.id
    delete payload.todo.id
    fetch(`${URL}/todos/${id}.json?user_email=${payload.user.email}`, {
      method: 'PUT',
      mode: 'cors',
      credentials: 'include',
      headers: { 
        'Content-type': 'application/json',
        'X-CSRF-Token': localStorage.csrf,
        Authorization: `Bearer ${payload.user.authentication_token}`,
      },
      body: JSON.stringify(payload.todo),
    })
    .then(res => res.json())
    .then(todo => {
      if (todo.errors) {
        context.commit(MUTATION_TYPES.UPDATE_ERRORS, { errors: todo.errors })
      } else {
        context.commit(MUTATION_TYPES.UPDATE_TODO, { todo })
        context.commit(MUTATION_TYPES.UPDATE_SUCCESS, { success: true })
      }
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error);
      alert(error)
      context.commit('toggle_loading', payload, { root: true })
    })
  },

  [ACTION_TYPES.ADD_TODO_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })
    context.commit(MUTATION_TYPES.ADD_SUCCESS, { success: false })
    fetch(`${URL}/todos.json?user_email=${payload.user.email}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { 
        'Content-type': 'application/json',
        'X-CSRF-Token': localStorage.csrf,
        Authorization: `Bearer ${payload.user.authentication_token}`,
      },
      body: JSON.stringify(payload.todo),
    })
    .then(response => {
      if (200 <= response.status < 300 && response.ok) {
        return response.json();
      } else if (response.status === 422) {
        return response.json();//validation error
      } else {
        throw new Error(`status NG ${response.status}:${response.statusText}`);
      }
    })
    .then(todo => {
      if (todo.errors) {
        context.commit(MUTATION_TYPES.ADD_ERRORS, { errors: todo.errors })
      } else {
        context.commit(MUTATION_TYPES.ADD_TODO, { todo })
        context.commit(MUTATION_TYPES.ADD_SUCCESS, { success: true })
      }
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error);
      alert(error)
      context.commit('toggle_loading', payload, { root: true })
    })
  },
};