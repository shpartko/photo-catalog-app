<template>
  <transition name="modal-overlay" appear>
    <div v-if="visible" class="modal-overlay" @click.self="onClose">
      <div class="modal-content">
        <button class="modal-close" @click="onClose" aria-label="Закрыть">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.00049 1L25 24.9995" stroke="white" stroke-width="2" />
            <path d="M24.9995 1L1 24.9995" stroke="white" stroke-width="2" />
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
      const scrollBarWidth = this.getScrollbarWidth();
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = scrollBarWidth + 'px';
      }
    },
    unlockScroll() {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    },
    getScrollbarWidth() {
      const scrollDiv = document.createElement('div');
      scrollDiv.style.visibility = 'hidden';
      scrollDiv.style.overflow = 'scroll';
      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '100px';
      document.body.appendChild(scrollDiv);
      const innerDiv = document.createElement('div');
      innerDiv.style.width = '100%';
      scrollDiv.appendChild(innerDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - innerDiv.offsetWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    },
  },
};
</script>
