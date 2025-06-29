<template>
  <div
    class="photo-card"
    @mouseenter="onHover && onHover($event, photo.title)"
    @mousemove="onHover && onHover($event, photo.title)"
    @mouseleave="onLeave && onLeave()"
  >
    <img
      :src="photo.thumbnailUrl"
      :alt="photo.title"
      @click.stop="onClick && onClick(photo)"
    />
    <img
      class="star-icon"
      :src="
        isFavorite
          ? require('@/assets/img/star_active.png')
          : require('@/assets/img/star_empty.png')
      "
      :alt="isFavorite ? 'В избранном' : 'Добавить в избранное'"
      @click.stop="onToggleFavorite && onToggleFavorite(photo)"
    />
  </div>
</template>

<script>
export default {
  name: 'PhotoCard',
  props: {
    photo: { type: Object, required: true },
    isFavorite: { type: Boolean, required: true },
    onToggleFavorite: { type: Function, required: true },
    onClick: { type: Function, required: false },
    onHover: { type: Function, required: false },
    onLeave: { type: Function, required: false },
  },
};
</script>
