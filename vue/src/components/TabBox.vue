<template>
  <div class="tab_box">
    <ul class="tab_list">
      <li class="a" v-on:click="tabChange('A')" v-bind:class="{active: fm.activeTab === 'A'}">終了・未終了</li>
      <li class="b" v-on:click="tabChange('B')" v-bind:class="{active: fm.activeTab === 'B'}">〆切</li>
    </ul>
    <div class="article">
      <FinishedBox
        key="finished-box"
        v-if="fm.activeTab === 'A'"
        v-model="fm.finished"
        v-bind:notFinishedTodosCount="notFinishedTodosCount"
        v-bind:todosCount="todosCount"
      />
      <ExpiredSearch
        key="expired-search"
        v-else-if="fm.activeTab === 'B'"
        v-model="fm.expiredStr"
      />
    </div>
  </div>
</template>


<script>
import FinishedBox from '@/components/FinishedBox'
import ExpiredSearch from '@/components/ExpiredSearch'

export default {
  name: 'TabBox',
  props: {
    fm: {
      type: Object,
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
  components: {
    FinishedBox,
    ExpiredSearch,
  },
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
    tabChange(currentTab){
      this.fm.activeTab = currentTab
    },
  },
}
</script>


<style lang="scss" scoped>
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
.tab_list {
  overflow: hidden;
}
.tab_list li {
  float: left;
  padding: 10px 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: .3s;
  border-radius: 8px 8px 0 0 / 8px 8px 0 0;
}
.tab_list li:not(:first-child) {
  border-left: none;
}
.tab_list li.active {
  background-color: #333;
  border-color: #333;
  color: #fff;
  cursor: auto;
}
.article {
  overflow: hidden;
  margin-top: -1px;
}
.article > div {
  width: 320px;
  padding: 20px;
  border: 1px solid #ccc;
  margin-bottom: 50px;
}
</style>