<template>
  <div id="app">
    <nav>
      <router-link to="/">Tìm Kiếm - </router-link>
      <router-link to="/calculate">Máy Tính - </router-link>
      <router-link to="/hello">Lời chào</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
};
</script>

<style>
nav {
  margin-bottom: 20px;
}
</style>