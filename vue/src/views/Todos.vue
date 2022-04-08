<template>
  <div class="todos">
    <h1>Todos</h1>
    <tab-box
      v-bind:fm="fm"
      v-bind:notFinishedTodosCount="notFinishedTodos.length"
      v-bind:todosCount="todos.length"      
    />
    <transition-group tag="ul">
      <li v-for="todo of searchedTodos()" v-bind:key="todo.id">
        <todo-finish-box
          v-bind:todo="todo"
          v-on:finish="onFinish"
        />
        <todo
          v-bind:todo="todo"
          v-on:navigate="onNavigate"
        />
        <todo-delete-link
          v-bind:todo="todo"
          v-on:delete="onDelete"
        />
      </li>
    </transition-group>
  </div>
</template>


<script>
import { oneWeekBefore } from '@/helpers/date'
import Todo from '@/components/Todo'
import TodoFinishBox from '@/components/TodoFinishBox'
import TodoDeleteLink from '@/components/TodoDeleteLink'
import TabBox from '@/components/TabBox'
import { TODO_GETTER_TYPES, TODO_ACTION_TYPES } from '@/store/TodoModule';
import { LOGIN_GETTER_TYPES } from '@/store/LoginModule';
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'Todos',
  mixins: [
    Titleable,
  ],
  components: {
    Todo,
    TodoFinishBox,
    TodoDeleteLink,
    TabBox,
  },
  data() {
    return {
      title: 'todolist | 一覧',

      fm: {
        expiredStr: oneWeekBefore(), // 2019-10-21
        finished: 'all',//[all, finished, not_finished]
        activeTab: 'A',//[A, B]
      },
    }
  },
  mounted() {
    return this.$store.dispatch(TODO_ACTION_TYPES.GET_TODOS_ASYNC, { user: this.user })
  },
  computed: {
    user() {
      return this.$store.getters[LOGIN_GETTER_TYPES.USER]
    },
    todos() {
      return this.$store.getters[TODO_GETTER_TYPES.TODOS]
    },
    sortedTodos() {
      return this.todos.slice().sort((a, b) => { 
        return a.id < b.id ? 1 : -1
      })
    },
    notFinishedTodos() {
      return this.sortedTodos.filter((todo) => {
        return !todo.finished
      })
    },
    finishedTodos() {
      return this.sortedTodos.filter((todo) => {
        return todo.finished
      })
    },
    timeSortedTodos() {
      return this.todos.slice().sort((a, b) => { 
        return Date.parse(a.due_on) > Date.parse(b.due_on) ? 1 : -1
      })
    },
  },
  methods: {
    searchedTodos() {
      if (this.fm.activeTab === 'A') {
        switch (this.fm.finished) {
          case 'all':
            return this.sortedTodos
          case 'not_finished':
            return this.notFinishedTodos
          case 'finished':
            return this.finishedTodos
        }
      } else {
        return this.getTodosByTime(this.fm.expiredStr)
      }
    },
    getTodosByTime(timeStr) {
      let compared = Date.parse(timeStr)
      if (compared) {
        return this.timeSortedTodos.filter((todo) => {
          return Date.parse(todo.due_on) >= compared
        })
      } else {
        return this.timeSortedTodos
      }
    },
    onFinish({ todo }) {
      return this.$store.dispatch(TODO_ACTION_TYPES.UPDATE_TODO_ASYNC, { todo, user: this.user })
    },
    onNavigate({ todo }) {
      return this.$router.push(`/edit/${todo.id}`)
    },
    onDelete({ todo }) {
      if (confirm("削除しますか？")) {
        return this.$store.dispatch(TODO_ACTION_TYPES.REMOVE_TODO_ASYNC, { todo, user: this.user })
      }
    },
  },
}
</script>


<style lang="scss" scoped>
.v-enter-active,
.v-leave-active,
.v-move {
  transition: all .5s;
}
.v-leave-active {
  position: absolute;
}
.v-enter,
.v-leave-to {
  transform: translateX(40%) rotate(-6deg);
  opacity: 0;
}
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

</style>