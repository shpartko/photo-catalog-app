<template>
  <div id="app">
    <AppIcons />
    <nav class="tabs">
      <router-link to="/" exact-active-class="active-tab">Каталог</router-link>
      <router-link to="/favorites" exact-active-class="active-tab"
        >Избранное</router-link
      >
    </nav>
    <div class="catalog-wrapper">
      <router-view />
    </div>
  </div>
</template>

<script>
import AppIcons from '@/components/Icons.vue';

export default {
  name: 'App',
  components: {
    AppIcons,
  },
};
</script>

<style lang="scss">
@import '@/assets/style/global.scss';
</style>
