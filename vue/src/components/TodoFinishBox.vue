<template>
  <input
    type="checkbox"
    v-bind:checked="todo.finished"
    v-on:click="onClick"
  />
</template>

<script>
export default {
  name: 'TodoFinishBox',
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
    onClick(evt) {
      const checked = evt.target.checked;
      
      this.$emit('finish', {
        todo: {
          content: this.todo.content,
          due_on: this.todo.due_on,
          // finished: !this.todo.finished,
          finished: checked,
          id: this.todo.id,
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>

</style>