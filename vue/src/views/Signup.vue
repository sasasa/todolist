<template>
  <div>
    <h1>サインアップ</h1>
    <form v-on:submit.prevent="submitted">
      <div class="formbox">
        <label>名前：
          <input type="text" name="name" placeholder="名前" v-model="user.name">
        </label>
        <span v-show="error_name != ''" class="error">{{ error_name }}</span>
      </div>
      <div class="formbox">
        <label>メール：
          <input type="text" name="email" placeholder="メール" v-model="user.email">
        </label>
        <span v-show="error_email != ''" class="error">{{ error_email }}</span>
      </div>
      <div class="formbox">
        <label>パスワード：
          <input type="password" name="password" placeholder="パスワード" v-model="user.password">
        </label>
        <span v-show="error_password != ''" class="error">{{ error_password }}</span>
      </div>
      <div class="formbox">
        <button class="btn-square" type="submit">登録</button>
      </div>
    </form>
  </div>
</template>

<script>
// LOGIN_GETTER_TYPES, 
import { LOGIN_GETTER_TYPES, LOGIN_ACTION_TYPES } from '@/store/LoginModule';
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'Signup',
  mixins: [
    Titleable,
  ],
  data() {
    return {
      title: 'todolist | サインアップ',

      user: {
        name: '',
        email: '',
        password: '',
      },
      error_name: '',
      error_email: '',
      error_password: '',
    }
  },
  computed: {
    success() {
      return this.$store.getters[LOGIN_GETTER_TYPES.SIGNUP_SUCCESS]
    },
    errors() {
      return Object.assign({}, this.$store.getters[LOGIN_GETTER_TYPES.SIGNUP_ERRORS])
    }
  },
  watch: {
    success(value) {
      if (value) {
        this.$router.push('/login')
      }
    },
    errors() {
      const e = this.errors
      this.error_name = e.name ? '名前' + e.name[0] : ''
      this.error_email = e.email ? 'メール' + e.email[0] : ''
      this.error_password = e.password ? 'パスワード' + e.password[0] : ''
    },
  },
  methods: {
    submitted() {
      return this.$store.dispatch(LOGIN_ACTION_TYPES.SIGNUP_ASYNC, { user: this.user })
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