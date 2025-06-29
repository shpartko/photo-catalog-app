<template>
  <transition name="modal-overlay" appear>
    <div v-if="visible" class="modal-overlay" @click.self="onClose">
      <div class="modal-content">
        <button class="modal-close" @click="onClose" aria-label="Закрыть">
          <svg width="26" height="26">
            <use href="#icon-close" />
          </svg>
        </button>
        <img
          :src="photo && photo.url"
          :alt="photo && photo.title"
          class="modal-img"
        />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalPhoto',
  props: {
    photo: { type: Object, required: false, default: null },
    visible: { type: Boolean, required: true },
    onClose: { type: Function, required: true },
  },
  watch: {
    visible(val) {
      if (val) {
        this.lockScroll();
      } else {
        this.unlockScroll();
      }
    },
  },
  mounted() {
    if (this.visible) {
      this.lockScroll();
    }
  },
  beforeDestroy() {
    this.unlockScroll();
  },
  methods: {
    lockScroll() {
      const scrollbarWidth = this.getScrollbarWidth();
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = scrollbarWidth + 'px';
      }
    },
    unlockScroll() {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    },
    getScrollbarWidth() {
      return window.innerWidth - document.documentElement.clientWidth;
    },
  },
};
</script>
