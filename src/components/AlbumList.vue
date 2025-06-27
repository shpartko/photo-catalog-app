<template>
  <ul class="albums-list">
    <slot />
  </ul>
</template>

<script>
export default {
  name: 'AlbumList',
  props: {
    albums: { type: Array, required: true },
    openedAlbumId: { default: null },
    onToggleAlbum: { type: Function, required: true },
  },
};
</script>
