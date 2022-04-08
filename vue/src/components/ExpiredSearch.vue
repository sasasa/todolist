<template>
    <div class="expired_search">
      <label for="date">〆切が
        <input id="date" type="date" v-model="expiredStr">までを表示する
      </label>
    </div>
</template>

<script>

export default {
  name: 'ExpiredSearch',
  components: {
  },
  created() {
  },
  data() {
    return {
    }
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  computed: {
    expiredStr: {
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
input[type='date']
{
  padding: 6px;
}
.expired_search > label {
  display: inline-block;
  margin-bottom: 40px;
}

</style>