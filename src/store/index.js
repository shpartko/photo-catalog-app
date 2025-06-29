import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const cacheUtils = {
  memoryCache: new Map(),

  CACHE_TTL: 5 * 60 * 1000,

  getCacheKey: (endpoint, params = {}) => {
    const paramsStr = Object.keys(params).length ? JSON.stringify(params) : '';
    return `${endpoint}${paramsStr}`;
  },

  isCacheValid: (cacheEntry) => {
    return (
      cacheEntry && Date.now() - cacheEntry.timestamp < cacheUtils.CACHE_TTL
    );
  },

  getFromCache: (key) => {
    const cacheEntry = cacheUtils.memoryCache.get(key);
    return cacheUtils.isCacheValid(cacheEntry) ? cacheEntry.data : null;
  },

  setCache: (key, data) => {
    cacheUtils.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },

  cleanupCache: () => {
    const now = Date.now();
    for (const [key, entry] of cacheUtils.memoryCache.entries()) {
      if (now - entry.timestamp > cacheUtils.CACHE_TTL) {
        cacheUtils.memoryCache.delete(key);
      }
    }
  },
};

setInterval(cacheUtils.cleanupCache, 60000);

const users = {
  namespaced: true,
  state: {
    users: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      const cacheKey = cacheUtils.getCacheKey('users');
      const cachedData = cacheUtils.getFromCache(cacheKey);

      if (cachedData) {
        commit('SET_USERS', cachedData);
        return;
      }

      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await axios.get('https://json.medrocket.ru/users/');
        commit('SET_USERS', res.data);
        cacheUtils.setCache(cacheKey, res.data);
      } catch (e) {
        commit('SET_ERROR', e.message || 'Ошибка сети');
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    getUsers: (state) => state.users,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
};

const albums = {
  namespaced: true,
  state: {
    albums: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_ALBUMS(state, albums) {
      state.albums = albums;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchAlbums({ commit }, userId) {
      const cacheKey = cacheUtils.getCacheKey('albums', { userId });
      const cachedData = cacheUtils.getFromCache(cacheKey);

      if (cachedData) {
        commit('SET_ALBUMS', cachedData);
        return;
      }

      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await axios.get(
          `https://json.medrocket.ru/albums?userId=${userId}`
        );
        commit('SET_ALBUMS', res.data);
        cacheUtils.setCache(cacheKey, res.data);
      } catch (e) {
        commit('SET_ERROR', e.message || 'Ошибка сети');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    clearAlbums({ commit }) {
      commit('SET_ALBUMS', []);
      commit('SET_ERROR', null);
    },
  },
  getters: {
    getAlbums: (state) => state.albums,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
};

const photos = {
  namespaced: true,
  state: {
    photos: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_PHOTOS(state, photos) {
      state.photos = photos;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
  },
  actions: {
    async fetchPhotos({ commit }, albumId) {
      const cacheKey = cacheUtils.getCacheKey('photos', { albumId });
      const cachedData = cacheUtils.getFromCache(cacheKey);

      if (cachedData) {
        commit('SET_PHOTOS', cachedData);
        return;
      }

      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const res = await axios.get(
          `https://json.medrocket.ru/photos?albumId=${albumId}`
        );
        commit('SET_PHOTOS', res.data);
        cacheUtils.setCache(cacheKey, res.data);
      } catch (e) {
        commit('SET_ERROR', e.message || 'Ошибка сети');
      } finally {
        commit('SET_LOADING', false);
      }
    },
    clearPhotos({ commit }) {
      commit('SET_PHOTOS', []);
      commit('SET_ERROR', null);
    },
  },
  getters: {
    getPhotos: (state) => state.photos,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
};

const favorites = {
  namespaced: true,
  state: {
    favorites: [],
    favoriteCache: {},
  },
  mutations: {
    SET_FAVORITES(state, favorites) {
      state.favorites = favorites;
      state.favoriteCache = {};
      favorites.forEach((photo) => {
        Vue.set(state.favoriteCache, photo.id, true);
      });
    },
    ADD_FAVORITE(state, photo) {
      state.favorites.push(photo);
      Vue.set(state.favoriteCache, photo.id, true);
    },
    REMOVE_FAVORITE(state, photoId) {
      state.favorites = state.favorites.filter((fav) => fav.id !== photoId);
      Vue.delete(state.favoriteCache, photoId);
    },
  },
  actions: {
    loadFavorites({ commit }) {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        commit('SET_FAVORITES', favorites);
      } catch {
        commit('SET_FAVORITES', []);
      }
    },
    toggleFavorite({ commit, state }, photo) {
      const isFavorite = state.favoriteCache[photo.id];
      if (isFavorite) {
        commit('REMOVE_FAVORITE', photo.id);
      } else {
        commit('ADD_FAVORITE', photo);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    removeFavorite({ commit, state }, photoId) {
      commit('REMOVE_FAVORITE', photoId);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
  getters: {
    getFavorites: (state) => state.favorites,
    isFavorite: (state) => (photoId) => {
      return !!state.favoriteCache[photoId];
    },
  },
};

const store = new Vuex.Store({
  modules: {
    users,
    albums,
    photos,
    favorites,
  },
});

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'favorites') {
      store.dispatch('favorites/loadFavorites');
    }
  });
}

export default store;
