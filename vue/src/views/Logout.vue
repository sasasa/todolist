<template>
  <form v-on:submit.prevent="submitted">
  </form>
</template>

<script>
import { LOGIN_ACTION_TYPES } from '@/store/LoginModule';
import { isAuthed } from '@/helpers/auth';

export default {
  name: 'Logout',
  data() {
    return {
    }
  },
  mounted() {
    this.submitted()
  },
  computed: {
    isAuthed() {
      return isAuthed()
    },
  },
  watch: {
    isAuthed(value) {
      if (value === false) {
        this.$router.push({ path: '/login' })
      }
    },
  },
  methods: {
    submitted() {
      this.$store.dispatch(LOGIN_ACTION_TYPES.LOGOUT_ASYNC)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>