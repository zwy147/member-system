<template>
  <div class="main">
    <!-- link不能使用，因为他是内置的标签，可以加上前缀 -->
    <app-link v-show="$route.path !== '/home1'" ></app-link>
    <router-view></router-view>
  </div>
</template>
<script>
import AppLink from './Link.vue'
export default {
  components:{
    AppLink
  }
}
</script>