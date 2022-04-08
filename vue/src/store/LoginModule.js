import { buildModuleTypes } from '@/helpers/store';
// import fetch from 'cross-fetch'
import 'cross-fetch/polyfill';

const URL = process.env.VUE_APP_API_URL_BASE

const moduleName = 'LoginModule';


export const namespaced = true;

export const state = {
  errors: [
  ],
  signup_errors: {
  },
  reset_password_errors: {
  },
  signup_success: false,
  send_email_success: false,
  reset_password_success: false,
  user: {
    authentication_token: '',
    password: '',
    email: '',
    id: 0,
  },
  login: false,
};

const GETTER_TYPES = {
  USER: 'USER',
  LOGIN: 'LOGIN',
  ERRORS: 'ERRORS',
  SIGNUP_ERRORS: 'SIGNUP_ERRORS',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SEND_EMAIL_SUCCESS: 'SEND_EMAIL_SUCCESS',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERRORS: 'RESET_PASSWORD_ERRORS',
};
const MUTATION_TYPES = {
  USER: 'USER',
  LOGIN: 'LOGIN',
  ERRORS: 'ERRORS',
  SIGNUP_ERRORS: 'SIGNUP_ERRORS',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SEND_EMAIL_SUCCESS: 'SEND_EMAIL_SUCCESS',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERRORS: 'RESET_PASSWORD_ERRORS',
};
const ACTION_TYPES = {
  LOGIN_ASYNC: 'LOGIN_ASYNC',
  SIGNUP_ASYNC: 'SIGNUP_ASYNC',
  LOGOUT_ASYNC: 'LOGOUT_ASYNC',
  SEND_EMAIL_ASYNC: 'SEND_EMAIL_ASYNC',
  RESET_PASSWORD_ASYNC: 'RESET_PASSWORD_ASYNC',
};

export const LOGIN_GETTER_TYPES = buildModuleTypes({
  moduleName,
  types: GETTER_TYPES,
});
export const LOGIN_MUTATION_TYPES = buildModuleTypes({
  moduleName,
  types: MUTATION_TYPES,
});
export const LOGIN_ACTION_TYPES = buildModuleTypes({
  moduleName,
  types: ACTION_TYPES,
});

export const getters = {
  [GETTER_TYPES.USER](state) {
    return state.user
  },
  [GETTER_TYPES.LOGIN](state) {
    return state.login
  },
  [GETTER_TYPES.ERRORS](state) {
    return state.errors;
  },
  [GETTER_TYPES.SIGNUP_ERRORS](state) {
    return state.signup_errors;
  },
  [GETTER_TYPES.SIGNUP_SUCCESS](state) {
    return state.signup_success;
  },
  [GETTER_TYPES.SEND_EMAIL_SUCCESS](state) {
    return state.send_email_success
  },
  [GETTER_TYPES.RESET_PASSWORD_SUCCESS](state) {
    return state.reset_password_success
  },
  [GETTER_TYPES.RESET_PASSWORD_ERRORS](state) {
    return state.reset_password_errors
  },
};

export const mutations = {
  [MUTATION_TYPES.USER](state, { user }) {
    state.user = user
  },
  [MUTATION_TYPES.LOGIN](state, { login }) {
    state.login = login
  },
  [MUTATION_TYPES.ERRORS](state, { errors }) {
    state.errors = errors
  },
  [MUTATION_TYPES.SIGNUP_ERRORS](state, { errors }) {
    state.signup_errors = errors
  },
  [MUTATION_TYPES.SIGNUP_SUCCESS](state, { success }) {
    state.signup_success = success
  },
  [MUTATION_TYPES.SEND_EMAIL_SUCCESS](state, { success }) {
    state.send_email_success = success
  },
  [MUTATION_TYPES.RESET_PASSWORD_SUCCESS](state, { success }) {
    state.reset_password_success = success
  },
  [MUTATION_TYPES.RESET_PASSWORD_ERRORS](state, { errors }) {
    state.reset_password_errors = errors
  },
};

export const actions = {
  [ACTION_TYPES.RESET_PASSWORD_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })
    context.commit(MUTATION_TYPES.RESET_PASSWORD_SUCCESS, { success: false })

    fetch(`${URL}/users/reset_password.json`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { 
        'X-CSRF-Token': localStorage.csrf,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        context.commit(MUTATION_TYPES.RESET_PASSWORD_SUCCESS, { success: true })
      } else {
        context.commit(MUTATION_TYPES.RESET_PASSWORD_SUCCESS, { success: false })
        context.commit(MUTATION_TYPES.RESET_PASSWORD_ERRORS, { errors: data.errors })
      }
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error)
      alert(error)
      context.commit(MUTATION_TYPES.RESET_PASSWORD_SUCCESS, { success: false })
      context.commit('toggle_loading', payload, { root: true })
    })
  },
  [ACTION_TYPES.SEND_EMAIL_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })
    context.commit(MUTATION_TYPES.SEND_EMAIL_SUCCESS, { success: false })

    fetch(`${URL}/users/send_email.json`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { 
        'X-CSRF-Token': localStorage.csrf,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        context.commit(MUTATION_TYPES.SEND_EMAIL_SUCCESS, { success: true })
      } else {
        context.commit(MUTATION_TYPES.SEND_EMAIL_SUCCESS, { success: false })
      }
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error)
      alert(error)
      context.commit(MUTATION_TYPES.SEND_EMAIL_SUCCESS, { success: false })
      context.commit('toggle_loading', payload, { root: true })
    })
  },
  [ACTION_TYPES.LOGOUT_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })

    fetch(`${URL}/users/logout.json`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { 
        'X-CSRF-Token': localStorage.csrf,
        'Content-type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        context.commit(MUTATION_TYPES.USER, { user: {} })
        context.commit(MUTATION_TYPES.LOGIN, { login: false })
      }
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error);
      alert(error)
      context.commit('toggle_loading', payload, { root: true })
    })
  },


  [ACTION_TYPES.LOGIN_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })

    fetch(`${URL}/users/login.json`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      if (data.errors) {
        const errors = data.errors
        context.commit(MUTATION_TYPES.ERRORS, { errors })
      } else {
        // LocalStorage に CSRF トークンを保存する
        localStorage.csrf = data.csrf;
  
        const user = data.user
        context.commit(MUTATION_TYPES.ERRORS, { errors: [] })
        context.commit(MUTATION_TYPES.USER, { user })
        context.commit(MUTATION_TYPES.LOGIN, { login: true })
      }
      context.commit('toggle_loading', payload, { root: true })
    })
    .catch((error) => {
      // console.error(error);
      alert(error)
      context.commit('toggle_loading', payload, { root: true })
    })
  },

  [ACTION_TYPES.SIGNUP_ASYNC](context, payload) {
    context.commit('toggle_loading', payload, { root: true })

    fetch(`${URL}/users.json`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(data => {
      // alert(JSON.stringify(data))
      if (data.errors) {
        context.commit(MUTATION_TYPES.SIGNUP_SUCCESS, { success: false })
        context.commit(MUTATION_TYPES.SIGNUP_ERRORS, { errors: data.errors })
      } else {
        context.commit(MUTATION_TYPES.SIGNUP_SUCCESS, { success: true })
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