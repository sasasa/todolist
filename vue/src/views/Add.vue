<template>
  <div class="add">
    <h1>Add</h1>
    <div>
      <form-todo
        v-on:submit="onSubmit"
        v-bind:fm="fm"
        v-bind:server_errors="errors"
        submitWord="追加する"
      />
    </div>
  </div>
</template>

<script>
import FormTodo from '@/components/FormTodo'
import { oneWeekLater } from '@/helpers/date'
import { TODO_GETTER_TYPES, TODO_ACTION_TYPES } from '@/store/TodoModule'
import { LOGIN_GETTER_TYPES } from '@/store/LoginModule';
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'add',
  mixins: [
    Titleable,
  ],
  props: {
  },
  components: {
    FormTodo,
  },
  data() {
    return {
      title: 'todolist | 追加',

      fm: {
        content: '',
        due_on: oneWeekLater(),
        finished: false,
      }
    }
  },
  watch: {
    success(value) {
      if (value === true) {
        this.$router.push('/todos')
      }
    },
  },
  computed: {
    errors() {
      return this.$store.getters[TODO_GETTER_TYPES.ADD_ERRORS]
    },
    success() {
      return this.$store.getters[TODO_GETTER_TYPES.ADD_SUCCESS]
    },
    user() {
      return this.$store.getters[LOGIN_GETTER_TYPES.USER]
    },
  },
  methods: {
    onSubmit({ todo }) {
      this.$store.dispatch(TODO_ACTION_TYPES.ADD_TODO_ASYNC, { todo, user: this.user })
    },
  }
}
</script>


<style lang="scss" scoped>
</style>