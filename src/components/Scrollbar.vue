<template>
  <div class="item" ref="item">
    <div class="left"><i>123</i></div>

    <div class="scrollingNav" ref="scrollingNav" :style="'left:' + left + 'px'">
      {{ text }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },

    isPause: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      left: 0,
      itemWidth: 0,
      scrollingNavWidth: 0,
      pauseAnimate: null,
    }
  },

  watch: {
    isPause(pause) {
      if (pause) {
        window.cancelAnimationFrame(this.pauseAnimate)
      } else {
        this.pauseAnimate = window.requestAnimationFrame(this.animate)
      }
    },
  },

  methods: {
    scrollingMove() {
      if (this.left <= this.scrollingNavWidth * -1) {
        this.left = this.itemWidth + 20
      } else {
        this.left--
      }
    },
    animate() {
      this.scrollingMove()
      this.pauseAnimate = window.requestAnimationFrame(this.animate)
    },
    initAnimation() {
      this.itemWidth = this.$refs.item.clientWidth
      this.scrollingNavWidth = this.$refs.scrollingNav.clientWidth
      this.left = this.itemWidth + 20
      this.animate()
    },
  },

  mounted() {
    this.initAnimation()
  },
}
</script>

<style lang="less" scoped>
.item {
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  color: #ffffff;
  font-weight: 760;
  line-height: 34px;
  border: 0.5px solid #cfcfcf;
  border-radius: 25px;

  overflow: hidden;
  background-color: #5b6371;

  .left {
    position: absolute;
    left: 0px;
    width: 100px;
    height: 33px;
    z-index: 1;
    border-radius: 25px;
    background-color: #bfc7d4;
  }
  .scrollingNav {
    position: absolute;
    white-space: nowrap;
    height: 40px;
    overflow: hidden;
  }
}
</style>
