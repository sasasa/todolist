<template>
  <div>
    <h1>パスワード再設定:メール送信</h1>
    <form v-on:submit.prevent="submitted">
      <transition name="open">
        <div v-show="success && open" class="formbox message" v-on:click="open = !open">
          メールを送信しました。ご確認お願いします。
        </div>
      </transition>
      <div class="formbox">
        <label>メール：
          <input type="text" name="email" placeholder="メール" v-model="user.email">
        </label>
      </div>
      <div class="formbox">
        <button class="btn-square" type="submit">メール送信</button>
      </div>
    </form>
  </div>
</template>

<script>
import { LOGIN_GETTER_TYPES, LOGIN_ACTION_TYPES } from '@/store/LoginModule';
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'SendEmail',
  mixins: [
    Titleable,
  ],
  data() {
    return {
      title: 'todolist | パスワード再設定:メール送信',
      open: false,
      user: {
        email: '',
      },
    }
  },
  computed: {
    success() {
      return this.$store.getters[LOGIN_GETTER_TYPES.SEND_EMAIL_SUCCESS]
    },
  },
  watch: {
    success(value) {
      this.user.email = ''
      if (value) {
        this.open = true
      } else {
        this.open = false
      }
    },
  },
  methods: {
    submitted() {
      this.$store.dispatch(LOGIN_ACTION_TYPES.SEND_EMAIL_ASYNC, { user: this.user })
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
.open-enter-active,
.open-leave-active {
  transition: opacity 0.3s;
}
.open-enter,
.open-leave-to {
  opacity: 0;
}
.message {
  cursor: pointer;
}
</style>