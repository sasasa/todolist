<template>
  <div class="edit">
    <h1>Edit</h1>
    <div>
      <form-todo
        v-on:submit="onSubmit"
        v-bind:fm="fm"
        v-bind:server_errors="errors"
        submitWord="更新する"
      />
    </div>
  </div>
</template>

<script>
// import { isEmpty } from '@/helpers/utils'
import FormTodo from '@/components/FormTodo'
import { TODO_GETTER_TYPES, TODO_ACTION_TYPES } from '@/store/TodoModule'
import { LOGIN_GETTER_TYPES } from '@/store/LoginModule';
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'edit',
  mixins: [
    Titleable,
  ],
  props: {
    id: {
      type: String,
      required: true,
    }
  },
  components: {
    FormTodo,
  },
  watch: {
    todo() {
      this.fm = Object.assign({}, this.todo)
    },
    success(value) {
      if (value === true) {
        this.$router.push('/todos')
      }
    },
  },

  created() {
    this.getTodoAsync()
  },
  data() {
    return {
      title: 'todolist | 更新',

      fm: {
        content: '',
        due_on: '',
        finished: false,
        id: 0,
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters[LOGIN_GETTER_TYPES.USER]
    },
    todo() {
      return this.$store.getters[TODO_GETTER_TYPES.TODO]
    },
    errors() {
      return this.$store.getters[TODO_GETTER_TYPES.UPDATE_ERRORS]
    },
    success() {
      return this.$store.getters[TODO_GETTER_TYPES.UPDATE_SUCCESS]
    },
  },
  methods: {
    getTodoAsync() {
      this.$store.dispatch(TODO_ACTION_TYPES.GET_TODO_ASYNC, { id: this.id, user: this.user })
    },

    onSubmit({ todo }) {
      this.$store.dispatch(TODO_ACTION_TYPES.UPDATE_TODO_ASYNC, { todo, user: this.user })
    },

  }
}
</script>



<style lang="scss" scoped>
.edit {
  width: 100%;
  min-height: 400px;
  position: relative;
}
</style>
