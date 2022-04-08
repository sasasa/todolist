<template>
  <form v-on:submit.prevent="submitHandler">
    <div class="formbox">
      <label>内容：<input type="text" name="content" v-model.trim="fm.content"></label>
    </div>
    <div class="formbox">
      <label>〆切：<input v-bind:min="minDay" type="date" name="due_on" v-model="fm.due_on"></label>
    </div>
    <div class="formbox">
      <label>終了：<input type="checkbox" name="finished" v-model="fm.finished"></label>
    </div>
    <div class="formbox">
      <input type="submit" v-bind:value="submitWord">
    </div>
  </form>
</template>

<script>
import { now } from '@/helpers/date'

export default {
  name: 'FormAdd',
  props: {
    fm: {
      type: Object,
      required: true,
    },
    submitWord: {
      type: String,
      required: true,
    },
  },
  components: {
  },
  data() {
    return {
      
    }
  },
  computed: {
    minDay() {
      return now()
    }
  },
  methods: {
    submitHandler() {
      this.$emit('submit', { todo: this.fm })
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