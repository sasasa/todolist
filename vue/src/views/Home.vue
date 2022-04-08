<template>
  <div class="home">
    <h1>Home</h1>
    <p>Todoリストでやるべきことを管理しましょう。</p>
    <ul>
      <li>ログインして自分のやることを管理しましょう</li>
      <li>やることの〆切を設定可能です</li>
      <li>〆切を過ぎたら<span class="red">赤く</span>なって教えてくれます</li>
      <li>サーバーにデータを記録するので安心です</li>
    </ul>
  </div>
</template>

<script>
import { Titleable } from '@/mixin/titleable'

export default {
  name: 'home',
  mixins: [
    Titleable,
  ],
  components: {
  },
  data() {
    return {
      title: 'todolist | Home',

    }
  },
  computed: {
  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.red {
  color: red;
}

</style>