<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <span v-show="isAuthed()">
        <router-link to="/todos">Todos</router-link> |
        <router-link to="/add">Add Todo</router-link> |
        <router-link to="/logout">Logout</router-link>
      </span>
      <span v-show="!isAuthed()">
        <router-link to="/login">Login</router-link> |
        <router-link to="/signup">Signup</router-link>
      </span>
    </div>
    <transition name="page" mode="out-in">
      <router-view/>
    </transition>
    <vue-loading
      v-show="loading" 
      type="spin" 
      color="#333" 
      v-bind:size="{ width: '150px', height: '150px' }"
    />
  </div>
</template>

<script>
import { VueLoading } from 'vue-loading-template'
import { isAuthed } from '@/helpers/auth';

export default {
  name: 'App',
  components: {
    VueLoading,
  },
  data() {
    return {
    }
  },
  computed: {
    loading() {
      return this.$store.getters['loading']
    }
  },
  methods: {
    isAuthed() {
      return isAuthed()
    },
  },
}
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  margin: 0 auto;
  font-family: "游ゴシック体", YuGothic, "游ゴシック", "Yu Gothic", "メイリオ", sans-serif;
  font-weight: 500;
  font-feature-settings: "palt" 1;
  line-height: 1.8;
  font-size: 16px;
  width: 800px;
}

#nav {
  width: 800px;
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
[v-cloak] {
  display: none;
}
.vue-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.btn-square {
  border: none;
  outline: none;
  display: inline-block;
  padding: 0.5em 1em;
  text-decoration: none;
  background: #42b983;
  border-bottom: solid 1px #348d65;
  color: #fff;
  border-radius: 3px;
}
.btn-square:disabled {
  background: #a6b6af;
}
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>
