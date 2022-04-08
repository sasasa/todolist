<template>
  <div>
    <div class="finished_box">
      <label for="finished">
        <input name="finished" id="finished" type="radio" value="finished" v-model="finished">終了
      </label>
      <label for="not_finished">
        <input name="finished" id="not_finished" type="radio" value="not_finished" v-model="finished">未終了
      </label>
      <label for="all">
        <input name="finished" id="all" type="radio" value="all" v-model="finished">全て
      </label>
    </div>
    <div class="not_finished_count">
      まだ終わってない
      <span class="not-finished-todos-count">{{notFinishedTodosCount}}</span> / 
      <span class="todos-count">{{todosCount}}</span>件
    </div>
  </div>
</template>

<script>

export default {
  name: 'FinishedBox',
  components: {
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    notFinishedTodosCount: {
      type: Number,
      required: true,
    },
    todosCount: {
      type: Number,
      required: true,
    },
  },
  created() {
  },
  data() {
    return {

    }
  },
  computed: {
    finished: {
      get() {
        return this.value
      }, 
      set(newValue) {
        if (this.value !== newValue) {
          this.$emit('input', newValue)
        }
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.finished_box {
  margin-bottom: 5px;
}
.not_finished_count {
  margin-bottom: 20px;
}
</style>