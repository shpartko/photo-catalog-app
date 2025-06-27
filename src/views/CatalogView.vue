<template>
  <div class="catalog-view" :class="{ centered: loading }">
    <LoaderBlock v-if="loading" />
    <ErrorBlock
      v-else-if="error"
      title="Сервер не отвечает"
      subtitle="Уже работаем над этим"
    />
    <UserList
      v-else
      :users="users"
      :openedUserId="openedUserId"
      :onToggleUser="toggleUser"
    >
      <template v-for="user in users">
        <UserItem
          :key="user.id"
          :user="user"
          :opened="openedUserId === user.id"
          :onToggle="toggleUser"
        >
          <div v-if="openedUserId === user.id" class="albums-block">
            <LoaderBlock v-if="albumsLoading" />
            <ErrorBlock
              v-else-if="albumsError"
              title="Сервер не отвечает"
              subtitle="Уже работаем над этим"
            />
            <AlbumList
              v-else
              :albums="albums"
              :openedAlbumId="openedAlbumId"
              :onToggleAlbum="toggleAlbum"
            >
              <template v-for="album in albums">
                <AlbumItem
                  :key="album.id"
                  :album="album"
                  :opened="openedAlbumId === album.id"
                  :onToggle="toggleAlbum"
                >
                  <div v-if="openedAlbumId === album.id" class="photos-block">
                    <LoaderBlock v-if="photosLoading" />
                    <ErrorBlock
                      v-else-if="photosError"
                      title="Сервер не отвечает"
                      subtitle="Уже работаем над этим"
                    />
                    <PhotoGrid
                      v-else
                      :photos="photos"
                      :favorites="favorites"
                      :onToggleFavorite="toggleFavorite"
                      :onPhotoClick="openModal"
                      :onPhotoHover="showTooltip"
                      :onPhotoLeave="hideTooltip"
                    />
                  </div>
                </AlbumItem>
              </template>
            </AlbumList>
          </div>
        </UserItem>
      </template>
    </UserList>
    <div
      v-if="tooltip.visible"
      class="photo-tooltip"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
    >
      {{ tooltip.text }}
    </div>
    <ModalPhoto
      :photo="modalPhoto"
      :visible="!!modalPhoto"
      :onClose="closeModal"
    />
  </div>
</template>

<script>
import axios from 'axios';
import UserList from '@/components/UserList.vue';
import UserItem from '@/components/UserItem.vue';
import AlbumList from '@/components/AlbumList.vue';
import AlbumItem from '@/components/AlbumItem.vue';
import ModalPhoto from '@/components/ModalPhoto.vue';
import LoaderBlock from '@/components/Loader.vue';
import ErrorBlock from '@/components/ErrorBlock.vue';

export default {
  name: 'CatalogView',
  components: {
    UserList,
    UserItem,
    AlbumList,
    AlbumItem,
    PhotoGrid: () => import('@/components/PhotoGrid.vue'),
    ModalPhoto,
    LoaderBlock,
    ErrorBlock,
  },
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      openedUserId: null,
      albums: [],
      albumsLoading: false,
      albumsError: null,
      openedAlbumId: null,
      photos: [],
      photosLoading: false,
      photosError: null,
      tooltip: {
        visible: false,
        text: '',
        x: 0,
        y: 0,
      },
      favorites: this.getFavoritesFromStorage(),
      modalPhoto: null,
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get('https://json.medrocket.ru/users/');
        this.users = res.data;
      } catch (e) {
        this.error = e.message || 'Ошибка сети';
      } finally {
        this.loading = false;
      }
    },
    async toggleUser(userId) {
      if (this.openedUserId === userId) {
        this.openedUserId = null;
        this.albums = [];
        this.albumsError = null;
        this.openedAlbumId = null;
        this.photos = [];
        this.photosError = null;
        return;
      }
      this.openedUserId = userId;
      this.albums = [];
      this.albumsLoading = true;
      this.albumsError = null;
      this.openedAlbumId = null;
      this.photos = [];
      this.photosError = null;
      try {
        const res = await axios.get(
          `https://json.medrocket.ru/albums?userId=${userId}`
        );
        this.albums = res.data;
      } catch (e) {
        this.albumsError = e.message || 'Ошибка сети';
      } finally {
        this.albumsLoading = false;
      }
    },
    async toggleAlbum(albumId) {
      if (this.openedAlbumId === albumId) {
        this.openedAlbumId = null;
        this.photos = [];
        this.photosError = null;
        return;
      }
      this.openedAlbumId = albumId;
      this.photos = [];
      this.photosLoading = true;
      this.photosError = null;
      try {
        const res = await axios.get(
          `https://json.medrocket.ru/photos?albumId=${albumId}`
        );
        this.photos = res.data;
      } catch (e) {
        this.photosError = e.message || 'Ошибка сети';
      } finally {
        this.photosLoading = false;
      }
    },
    showTooltip(event, text) {
      this.tooltip.visible = true;
      this.tooltip.text = text;
      this.tooltip.x = event.clientX + 12;
      this.tooltip.y = event.clientY + 12;
    },
    moveTooltip(event) {
      this.tooltip.x = event.clientX + 12;
      this.tooltip.y = event.clientY + 12;
    },
    hideTooltip() {
      this.tooltip.visible = false;
      this.tooltip.text = '';
    },
    isFavorite(photoId) {
      return this.favorites.some((fav) => fav.id === photoId);
    },
    toggleFavorite(photo) {
      if (this.isFavorite(photo.id)) {
        this.favorites = this.favorites.filter((fav) => fav.id !== photo.id);
      } else {
        this.favorites = [...this.favorites, photo];
      }
      localStorage.setItem('favorites', JSON.stringify(this.favorites));
    },
    getFavoritesFromStorage() {
      try {
        return JSON.parse(localStorage.getItem('favorites')) || [];
      } catch {
        return [];
      }
    },
    openModal(photo) {
      this.modalPhoto = photo;
    },
    closeModal() {
      this.modalPhoto = null;
    },
  },
};
</script>

<style lang="scss">
@import '@/assets/style/catalog.scss';
</style>
