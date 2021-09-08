<template>
  <div class="item" ref="item">
    <div class="item-rightwrap">
      <div
        class="scrollingNav"
        ref="scrollingNav"
        :style="'left:' + left + 'px'"
      >
        {{ text }}
      </div>
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
    isNotPause: {
      type: Boolean,
      default: false,
    },
    isMusicPause: {
      type: Boolean,
    },
  },

  data() {
    return {
      left: 0,

      leftCache: 0,

      itemWidth: 0,
      scrollingNavWidth: 0,
      pauseAnimate: null,
    }
  },
  watch: {
    isNotPause(newvalue, oldvalue) {
      if (!newvalue) {
        this.leftCache = this.left
        this.left = 0
      } else {
        this.left = this.leftCache
      }

      this.$nextTick(() => {
        if (newvalue != oldvalue) {
          this.initAnimation()
          if (newvalue == false) window.cancelAnimationFrame(this.pauseAnimate)
        } else {
          window.cancelAnimationFrame(this.pauseAnimate)
        }
      })
    },
    isMusicPause(newvalue) {
      if (newvalue == false) {
        this.left = 0
      }
    },
  },
  methods: {
    scrollingMove() {
      if (this.left <= this.scrollingNavWidth * -1) {
        this.left = this.itemWidth * 1
      } else {
        this.left = this.left - 0.6
      }
    },
    animate() {
      this.scrollingMove()
      this.pauseAnimate = window.requestAnimationFrame(this.animate)
    },
    initAnimation() {
      this.itemWidth = this.$refs.item.clientWidth
      this.scrollingNavWidth = this.$refs.scrollingNav.clientWidth
      if (!this.isMusicPause) {
        this.left = 0
      }
      if (this.isNotPause) {
        this.animate()
      }
    },
  },
  mounted() {
    this.initAnimation()
  },
  beforeDestroy() {
    this.cancelAnimationFrame(this.animate)
    this.cancelAnimationFrame(this.pauseAnimate)
  },
}
</script>

<style lang="less" scoped>
@media screen and (max-height: 720px) {
  .item {
    position: relative;
    box-sizing: border-box;
    width: 98%;
    height: 48px;
    color: #e96161;
    font-weight: 760;
    line-height: 65px;
    border-radius: 4px;
    overflow: hidden;
    .bgImg('../assets/noactive-item.png');
    background-position: center;
    margin-bottom: 14px;
    padding-left: 60px;
    .item-rightwrap {
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .scrollingNav {
      position: absolute;
      white-space: nowrap;
      height: 45px;
      line-height: 50px;
      overflow: hidden;
      font-family: ysx;
    }
  }
}

@media screen and (min-height: 720px) {
  .item {
    position: relative;
    box-sizing: border-box;
    width: 98%;
    height: 55px;
    color: #e96161;
    font-weight: 760;
    line-height: 65px;
    border-radius: 4px;
    overflow: hidden;
    .bgImg('../assets/noactive-item.png');
    background-position: center;

    margin-bottom: 14px;
    padding-left: 65px;
    .item-rightwrap {
      height: 100%;
      position: relative;
      overflow: hidden;
    }
    .scrollingNav {
      position: absolute;
      white-space: nowrap;
      height: 65px;
      line-height: 65px;
      overflow: hidden;
      font-family: ysx;
    }
  }
}
</style>
