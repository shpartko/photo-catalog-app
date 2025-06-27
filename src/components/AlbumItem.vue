<template>
  <li class="album-item">
    <div @click.stop="onToggle(album.id)" class="album-header">
      <span class="toggle-btn">
        <svg
          v-if="!opened"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="#117DC1" />
          <path d="M9 16H23" stroke="white" stroke-width="2" />
          <path d="M16 9L16 23" stroke="white" stroke-width="2" />
        </svg>
        <svg
          v-else
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="16" fill="#117DC1" />
          <path d="M23 16L9 16" stroke="white" stroke-width="2" />
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
