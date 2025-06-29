<template>
  <li class="user-item" @click="onToggle(user.id)">
    <div class="user-header">
      <span class="toggle-btn">
        <svg v-if="!opened" width="32" height="32">
          <use href="#icon-plus" />
        </svg>
        <svg v-else width="32" height="32">
          <use href="#icon-minus" />
        </svg>
      </span>
      <span class="user-title">{{ user.name }}</span>
    </div>
    <slot v-if="opened"></slot>
  </li>
</template>

<script>
export default {
  name: 'UserItem',
  props: {
    user: { type: Object, required: true },
    opened: { type: Boolean, required: true },
    onToggle: { type: Function, required: true },
  },
};
</script>
