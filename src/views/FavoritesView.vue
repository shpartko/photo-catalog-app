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
import { mapGetters, mapActions } from 'vuex';
import ModalPhoto from '@/components/ModalPhoto.vue';

export default {
  name: 'FavoritesView',
  components: { ModalPhoto },
  data() {
    return {
      error: null,
      modalPhoto: null,
    };
  },
  computed: {
    ...mapGetters('favorites', ['getFavorites']),
    favorites() {
      return this.getFavorites;
    },
  },
  mounted() {
    this.loadFavorites();
  },
  methods: {
    ...mapActions('favorites', ['loadFavorites', 'removeFavorite']),
    removeFromFavorites(photoId) {
      this.removeFavorite(photoId);
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
      this.loadFavorites();
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/style/favorites.scss';
</style>
