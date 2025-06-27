<template>
  <div class="photos-grid">
    <PhotoCard
      v-for="photo in photos"
      :key="photo.id"
      :photo="photo"
      :isFavorite="favorites.some((fav) => fav.id === photo.id)"
      :onToggleFavorite="onToggleFavorite"
      :onClick="onPhotoClick"
      :onHover="onPhotoHover"
      :onLeave="onPhotoLeave"
    />
  </div>
</template>

<script>
import PhotoCard from './PhotoCard.vue';

export default {
  name: 'PhotoGrid',
  components: { PhotoCard },
  props: {
    photos: { type: Array, required: true },
    favorites: { type: Array, required: true },
    onToggleFavorite: { type: Function, required: true },
    onPhotoClick: { type: Function, required: false },
    onPhotoHover: { type: Function, required: false },
    onPhotoLeave: { type: Function, required: false },
  },
};
</script>
