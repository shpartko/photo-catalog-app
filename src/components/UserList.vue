<template>
  <ul class="users-list">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'UserList',
  props: {
    users: { type: Array, required: true },
    openedUserId: { default: null },
    onToggleUser: { type: Function, required: true },
  },
};
</script>
