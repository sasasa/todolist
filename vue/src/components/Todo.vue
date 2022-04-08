<template>
  <div
    class="todo"
    v-bind:class="{ 
      done: todo.finished,
      expired: isExpired(),
    }"
    v-on:click="onClick"
  >{{ todo.id }}. {{ todo.content }} 〆切({{ todo.due_on }})</div>
</template>

<script>
export default {
  name: 'Todo',
  props: {
    todo: Object
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    isExpired() {
      return Date.parse(this.todo.due_on) < Date.now()
    },
    onClick() {
      this.$emit('navigate', { todo: this.todo })
    },
  }
}
</script>

<style lang="scss" scoped>
.todo {
  display: inline-block;
  cursor: pointer;
  margin-left: 0.5em;
}
.todo:hover {
  color: #fff;
  background-color: #333;
}
.done {
  text-decoration: line-through;
}
.expired {
  color: red;
}
</style>