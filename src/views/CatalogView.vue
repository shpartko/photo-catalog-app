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
import { mapGetters, mapActions } from 'vuex';
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
      openedUserId: null,
      openedAlbumId: null,
      tooltip: {
        visible: false,
        text: '',
        x: 0,
        y: 0,
      },
      modalPhoto: null,
    };
  },
  computed: {
    ...mapGetters('users', ['getUsers', 'isLoading', 'getError']),
    ...mapGetters('albums', ['getAlbums', 'isLoading', 'getError']),
    ...mapGetters('photos', ['getPhotos', 'isLoading', 'getError']),
    users() {
      return this.getUsers;
    },
    loading() {
      return this.isLoading;
    },
    error() {
      return this.getError;
    },
    albums() {
      return this.getAlbums;
    },
    photos() {
      return this.getPhotos;
    },
    albumsLoading() {
      return this.$store.getters['albums/isLoading'];
    },
    albumsError() {
      return this.$store.getters['albums/getError'];
    },
    photosLoading() {
      return this.$store.getters['photos/isLoading'];
    },
    photosError() {
      return this.$store.getters['photos/getError'];
    },
  },
  created() {
    this.fetchUsers();
    this.loadFavorites();
  },
  methods: {
    ...mapActions('users', ['fetchUsers']),
    ...mapActions('albums', ['fetchAlbums', 'clearAlbums']),
    ...mapActions('photos', ['fetchPhotos', 'clearPhotos']),
    ...mapActions('favorites', ['toggleFavorite', 'loadFavorites']),
    async toggleUser(userId) {
      if (this.openedUserId === userId) {
        this.openedUserId = null;
        this.clearAlbums();
        this.openedAlbumId = null;
        this.clearPhotos();
        return;
      }
      this.openedUserId = userId;
      this.openedAlbumId = null;
      this.clearPhotos();
      await this.fetchAlbums(userId);
    },
    async toggleAlbum(albumId) {
      if (this.openedAlbumId === albumId) {
        this.openedAlbumId = null;
        this.clearPhotos();
        return;
      }
      this.openedAlbumId = albumId;
      await this.fetchPhotos(albumId);
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
