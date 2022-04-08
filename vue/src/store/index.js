

import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

import * as TodoModule from './TodoModule';
import * as LoginModule from './LoginModule';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  modules: {
    TodoModule,
    LoginModule,
  },
  state: {
    loading: false,
  },
  getters: {
    ['loading'](state) {
      return state.loading;
    },
  },
  mutations: {
    ['toggle_loading'](state) {
      state.loading = !state.loading 
    },
  },
  plugins: [createPersistedState()],
});

