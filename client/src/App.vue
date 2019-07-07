<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import jwtDecode from 'jwt-decode'
import { isEmpty } from './utils/index'

export default {
  name: 'app',
  created() {
    if (localStorage.token) {
      const decode = jwtDecode(localStorage.token)
      this.$store.dispatch('setAuthenticated', isEmpty(decode))
      this.$store.dispatch('setUser', decode)
    }
  }
}
</script>

<style lang="stylus">
html,
body,
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  width 100%
  height 100%
</style>
