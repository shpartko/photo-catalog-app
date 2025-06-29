<template>
  <li class="album-item">
    <div @click.stop="onToggle(album.id)" class="album-header">
      <span class="toggle-btn">
        <svg v-if="!opened" width="32" height="32">
          <use href="#icon-plus" />
        </svg>
        <svg v-else width="32" height="32">
          <use href="#icon-minus" />
        </svg>
      </span>
      <span class="album-title">{{ album.title }}</span>
    </div>
    <slot v-if="opened"></slot>
  </li>
</template>

<script>
export default {
  name: 'AlbumItem',
  props: {
    album: { type: Object, required: true },
    opened: { type: Boolean, required: true },
    onToggle: { type: Function, required: true },
  },
};
</script>
