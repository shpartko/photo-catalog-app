<template>
  <div id="app">
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

<style lang="scss">
@import '@/assets/style/global.scss';
</style>
