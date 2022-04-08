<template>
  <div>
    <h1>パスワード再設定</h1>
    <form v-on:submit.prevent="submitted">
      <div class="formbox">
        <label>パスワード：
          <input type="password" name="password" placeholder="パスワード" v-model="user.password">
        </label>
        <span v-show="error_password != ''" class="error">{{ error_password }}</span>
      </div>
      <div class="formbox">
        <label>パスワード(確認)：
          <input type="password" name="password_confirmation" placeholder="パスワード(確認)" v-model="user.password_confirmation">
        </label>
        <span v-show="error_password_confirmation != ''" class="error">{{ error_password_confirmation }}</span>
      </div>
      <div class="formbox">
        <button class="btn-square" type="submit">パスワード再設定</button>
      </div>
    </form>
  </div>
</template>

<script>
import { LOGIN_GETTER_TYPES, LOGIN_ACTION_TYPES } from '@/store/LoginModule';
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'ResetPassword',
  mixins: [
    Titleable,
  ],
  props: {
    token: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      title: 'todolist | パスワード再設定',
      user: {
        password: '',
        password_confirmation: '',
        reset_password_token: this.token,
      },
      error_password: '',
      error_password_confirmation: '',
    }
  },
  computed: {
    success() {
      return this.$store.getters[LOGIN_GETTER_TYPES.RESET_PASSWORD_SUCCESS]
    },
    errors() {
      return Object.assign({}, this.$store.getters[LOGIN_GETTER_TYPES.RESET_PASSWORD_ERRORS])
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
      this.error_password = e.password ? 'パスワード' + e.password[0] : ''
      this.error_password_confirmation = e.password_confirmation ? 'パスワード(確認)' + e.password_confirmation[0] : ''
    },
  },
  methods: {
    submitted() {
      this.$store.dispatch(LOGIN_ACTION_TYPES.RESET_PASSWORD_ASYNC, { user: this.user })
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