<template>
  <div>
    <h1>ログイン</h1>
    <form v-on:submit.prevent="submitted">
      <div class="formbox" v-show="error_message !== ''">
        <span class="error">{{ error_message }}</span>
      </div>
      <div class="formbox">
        <label>メール：
          <input type="text" name="email" placeholder="メール" v-model="user.email">
        </label>
      </div>
      <div class="formbox">
        <label>パスワード：
          <input type="password" name="password" placeholder="パスワード" v-model="user.password">
        </label>
      </div>
      <div class="formbox">
        <button class="btn-square" type="submit">ログイン</button>
      </div>
      <div class="formbox">
        <router-link to="/send_email">パスワードを再設定する</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { LOGIN_GETTER_TYPES, LOGIN_ACTION_TYPES } from '@/store/LoginModule';
import { isAuthed } from '@/helpers/auth';
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'Login',
  mixins: [
    Titleable,
  ],
  data() {
    return {
      title: 'todolist | ログイン',

      user: {
        email: '',
        password: '',
      },
      error_message: '',
    }
  },
  computed: {
    errors() {
      return this.$store.getters[LOGIN_GETTER_TYPES.ERRORS]
    },
    isAuthed() {
      return isAuthed()
    },
  },
  watch: {
    isAuthed(value) {
      if (value) {
        let path
        if ("backuri" in this.$route.query && this.$route.query.backuri.match(/^\//)) {
          path = this.$route.query.backuri
        } else {
          path = '/'
        }
        this.$router.push({ path })
      }
    },
    errors() {
      const e = this.errors
      this.error_message = e.length > 0 ? e[0] : ''
    },
  },
  methods: {
    submitted() {
      this.$store.dispatch(LOGIN_ACTION_TYPES.LOGIN_ASYNC, { user: this.user })
    },
  },
}
</script>

<style lang="scss" scoped>
.formbox {
  margin-bottom: 10px;
  width: 22em;
  text-align: right;
}
.formbox input[type='text'],
.formbox input[type='password']
{
  padding: 6px;
  width: 12em;
}
label {
  display: block;
}
.error {
  color: #f00000;
  height: 1em;
  display: inline-block;
  font-size: 0.75rem;
}
</style>