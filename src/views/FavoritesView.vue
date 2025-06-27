<template>
  <div class="favorites-view">
    <div v-if="favorites.length === 0" class="empty-favorites">
      <img src="@/assets/img/empty.png" alt="Пусто" class="empty-img" />
      <div class="empty-title">Список избранного пуст</div>
      <div class="empty-sub">Добавляйте изображения, нажимая на звездочки</div>
    </div>
    <div v-else class="favorites-grid">
      <div v-for="photo in favorites" :key="photo.id" class="favorite-card">
        <img
          :src="photo.thumbnailUrl"
          :alt="photo.title"
          class="favorite-img"
          @click="openModal(photo)"
          style="cursor: pointer"
        />
        <img
          class="star-icon"
          src="@/assets/img/star_active.png"
          alt="Удалить из избранного"
          @click="removeFromFavorites(photo.id)"
        />
        <div class="favorite-title">{{ photo.title }}</div>
      </div>
    </div>
    <div v-if="error" class="error-block">
      <img src="@/assets/img/error.png" alt="Ошибка" class="error-img" />
      <div class="error-title">Сервер не отвечает</div>
      <div class="error-sub">Уже работаем над этим</div>
    </div>
    <ModalPhoto
      :photo="modalPhoto"
      :visible="!!modalPhoto"
      :onClose="closeModal"
    />
  </div>
</template>

<script>
import ModalPhoto from '@/components/ModalPhoto.vue';

export default {
  name: 'FavoritesView',
  components: { ModalPhoto },
  data() {
    return {
      favorites: this.getFavoritesFromStorage(),
      error: null,
      modalPhoto: null,
    };
  },
  mounted() {
    window.addEventListener('storage', this.syncFavorites);
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.syncFavorites);
  },
  methods: {
    getFavoritesFromStorage() {
      try {
        return JSON.parse(localStorage.getItem('favorites')) || [];
      } catch {
        this.error = 'Ошибка чтения избранного';
        return [];
      }
    },
    syncFavorites() {
      this.favorites = this.getFavoritesFromStorage();
    },
    removeFromFavorites(photoId) {
      this.favorites = this.favorites.filter((fav) => fav.id !== photoId);
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    openModal(photo) {
      this.modalPhoto = photo;
    },
    closeModal() {
      this.modalPhoto = null;
    },
  },
  watch: {
    $route() {
      this.favorites = this.getFavoritesFromStorage();
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/style/favorites.scss';
</style>
