import { buildModuleTypes } from '@/helpers/store';
// import fetch from 'cross-fetch'

// const URL = `http://192.168.99.100:3000/api`

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
    authentication_token: 'jjjjjjjjjjjjjjjjjj',
    password: 'jojo',
    email: 'eamail@email.com',
    name: 'ごとうたけし',
    id: 111,
  },
  login: false,
};

export const GETTER_TYPES = {
  USER: 'USER',
  LOGIN: 'LOGIN',
  ERRORS: 'ERRORS',
  SIGNUP_ERRORS: 'SIGNUP_ERRORS',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SEND_EMAIL_SUCCESS: 'SEND_EMAIL_SUCCESS',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERRORS: 'RESET_PASSWORD_ERRORS',
};
export const MUTATION_TYPES = {
  USER: 'USER',
  LOGIN: 'LOGIN',
  ERRORS: 'ERRORS',
  SIGNUP_ERRORS: 'SIGNUP_ERRORS',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SEND_EMAIL_SUCCESS: 'SEND_EMAIL_SUCCESS',
  RESET_PASSWORD_SUCCESS: 'RESET_PASSWORD_SUCCESS',
  RESET_PASSWORD_ERRORS: 'RESET_PASSWORD_ERRORS',
};
export const ACTION_TYPES = {
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
  [ACTION_TYPES.RESET_PASSWORD_ASYNC]: jest.fn(),
  [ACTION_TYPES.SEND_EMAIL_ASYNC]: jest.fn(),
  [ACTION_TYPES.LOGOUT_ASYNC]: jest.fn(),
  [ACTION_TYPES.LOGIN_ASYNC]: jest.fn(),
  [ACTION_TYPES.SIGNUP_ASYNC]: jest.fn(),
};