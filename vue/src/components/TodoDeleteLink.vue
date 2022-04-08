<template>
  <span
    class="cmd"
    v-show="todo.finished"
    v-on:click="onClick"
  >[X]</span>
</template>

<script>
// v-showならばテストは通るがv-ifならばテストは通らない
export default {
  name: 'TodoDeleteLink',
  props: {
    todo: Object,
  },
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
    onClick() {
      this.$emit('delete', { todo: this.todo })
    }
  }
}
</script>

<style lang="scss" scoped>
.cmd {
  cursor: pointer;
  text-decoration: underline;
  margin-left: 5px;
}
</style>