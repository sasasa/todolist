<template>
  <form v-on:submit.prevent="submitHandler">
    <validation-observer v-slot="{ invalid }">
      <validation-provider name="内容" rules="required|min:5" v-slot="{ errors }">
        <div class="formbox">
          <label>内容：<input autocomplete="off" type="text" name="content" v-model.trim="fm.content"></label>
          <span class="error">{{ errors[0] }}</span>
          <span class="error" v-show="!errors[0] && error_content != ''">{{ error_content }}</span>
        </div>
      </validation-provider>
      <validation-provider name="〆切" rules="required" v-slot="{ errors }">
        <div class="formbox">
          <label>〆切：<input v-bind:min="minDay" type="date" name="due_on" v-model="fm.due_on"></label>
          <span class="error">{{ errors[0] }}</span>
          <span class="error" v-show="!errors[0] && error_due_on != ''">{{ error_due_on }}</span>
        </div>
      </validation-provider>
      <div class="formbox">
        <label>終了：<input type="checkbox" name="finished" v-model="fm.finished"></label>
      </div>
      <div class="formbox">
        <input class="btn-square" v-bind:disabled="invalid || user_invalid" type="submit" v-bind:value="submitWord">
      </div>
    </validation-observer>
  </form>
</template>

<script>
import { now } from '@/helpers/date'
import { ValidationProvider, ValidationObserver } from 'vee-validate';

export default {
  name: 'FormTodo',
  props: {
    fm: {
      type: Object,
      required: true,
    },
    server_errors: {
      type: Object,
      required: false,
    },
    submitWord: {
      type: String,
      required: true,
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      error_content: '',
      error_due_on: '',
      remember_content: '',
      remember_error_content: '',
      user_invalid: true,
    }
  },
  watch: {
    server_errors() {
      const e = this.server_errors
      this.error_content = e.content ? "内容" + e.content[0] : ''
      this.error_due_on = e.due_on ? "〆切" + e.due_on[0] : ''
      this.remember_content = this.fm.content
      this.user_invalid = true
    },
    fm: {
      handler() {
        if (this.fm.content === this.remember_content) {
          // エラーになった際の文言を再度入力されたらエラー表示する
          this.error_content = this.remember_error_content
          this.user_invalid = true
        }
        else if (this.error_content !== '' && this.fm.content.length >= 5) {
          // 重複エラーの際、入力が変更されたらエラー文言を消す
          this.remember_error_content = this.error_content
          this.error_content = ''
          this.user_invalid = false
        }
        else if (this.fm.content.length >= 5) {
          this.user_invalid = false
        }
      },
      deep: true,
    },
  },
  computed: {
    minDay() {
      return now()
    }
  },
  methods: {
    submitHandler() {
      this.$emit('submit', { todo: Object.assign({}, this.fm) })
    },

  }
}
</script>


<style lang="scss" scoped>
.add {
  width: 100%;
  min-height: 400px;
  position: relative;
}
.error {
  color: #f00000;
  height: 1em;
  display: inline-block;
  font-size: 0.75rem;
}
.formbox {
  margin-bottom: 10px;
  width: 18em;
  text-align: right;
}
.formbox input[type='text'],
.formbox input[type='date']
{
  padding: 6px;
  width: 14em;
}
label {
  display: block;
}
</style>