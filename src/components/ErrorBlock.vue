<template>
  <div class="error-block">
    <img src="@/assets/img/error.png" alt="Ошибка" class="error-img" />
    <div class="error-title">{{ title }}</div>
    <div class="error-sub">{{ subtitle }}</div>
  </div>
</template>

<script>
export default {
  name: 'ErrorBlock',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
  },
};
</script>
