<template>
  <div>
    <div
      :style="{ backgroundImage: 'url(' + scrollBgList[scrollBgIndex] + ')' }"
      class="mlist-wrap"
    >
      <div class="mlist">
        <ScrollBarItem
          v-for="(item, index) in scrollList"
          :key="item.text"
          :text="
            index === currentIndex && startScroll && item.isNotPause
              ? item.desc
              : item.text
          "
          :is-not-pause="item.isNotPause && startScroll"
          :is-music-pause="item.isMusicpause"
          :class="{ active: index == currentIndex }"
        />
      </div>
      <div class="draw-button" @click="toDraw" />
    </div>
  </div>
</template>

<script>
import ScrollBarItem from '@/components/ScrollBarItem'

export default {
  components: {
    ScrollBarItem,
  },

  inject: ['playClickVoice'],

  props: {
    scrollList: {
      type: Array,
      default: () => [],
    },
    scrollBgIndex: {
      type: Number,
    },
  },

  data() {
    return {
      musicSrc: '',
      startScroll: false,
      currentIndex: 0,
      audioSrc: '',
      scrollBgList: [
        require('@/assets/scroll-bg1.png'),
        require('@/assets/scroll-bg2.png'),
        require('@/assets/scroll-bg3.png'),
        require('@/assets/scroll-bg4.png'),
      ],
    }
  },

  watch: {
    currentIndex(idx) {
      const el = document.querySelector('.mlist')
      const shouldScrollBottom = idx > 4

      el.scrollTo({
        top: shouldScrollBottom ? 9999 : 0,
        behavior: 'smooth',
      })
    },
  },

  mounted() {
    setTimeout(() => {
      this.startScroll = true
    }, 2000)
  },

  methods: {
    toDraw() {
      this.playClickVoice()

      this.$router.push({ name: 'Draw' })
    },

    changeCurrentIndex(index) {
      this.scrollList[this.currentIndex].isMusicpause = false
      this.scrollList[this.currentIndex].isNotPause = false
      this.scrollList[index].isNotPause = true
      this.currentIndex = index
      this.$emit('changemusicplaying', index)
    },
    topre() {
      let index = this.currentIndex
      if (index == 0) {
        index = this.scrollList.length - 1
      } else {
        index--
      }
      this.changeCurrentIndex(index)
    },
    topause(stateItem) {
      if (stateItem == 'toplay') {
        this.scrollList[this.currentIndex].isNotPause = true
      } else {
        this.scrollList[this.currentIndex].isNotPause = false
        this.scrollList[this.currentIndex].isMusicpause = true
      }
    },
    tonext() {
      let index = this.currentIndex
      if (index == this.scrollList.length - 1) {
        index = 0
      } else {
        index++
      }
      this.changeCurrentIndex(index)
    },
    tochangeaudio() {
      this.scrollList[this.currentIndex].isMusicpause = false
      this.scrollList[this.currentIndex].isNotPause = false
      this.currentIndex = 0
      this.scrollList[this.currentIndex].isNotPause = true
    },
  },
}
</script>

<style lang="less" scoped>
@media screen and (max-height: 720px) {
  .mlist-wrap {
    width: 558px;
    height: 504px;
    margin: 15px auto;
    font-size: 26px;
    padding-left: 30px;
    padding-right: 20px;
    padding-top: 65px;
    background-size: 558px 504px;
    .mlist {
      position: relative;
      width: 98%;
      height: 326px;
      padding-top: 4px;
      margin-bottom: 20px;
      text-align: center;
      -webkit-overflow-scrolling: auto;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        display: block;
        z-index: 2;
        width: 6px;
        height: 6px;
        background-color: transparent;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0px rgba(196, 25, 25, 0.5);
        border-radius: 10px;
      }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 0px rgba(207, 47, 47, 0.5);
        background-color: #D45252;
      }
    }

    .mlist::-webkit-scrollbar-track-piece {
      background-color: transparent;
    }

    .draw-button {
      .bgImg('../assets/to-draw-page.png');

      width: 98%;
      height: 70px;
      margin-top: 32px;
      border-radius: 10px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
    }
  }
}
@media screen and (min-height: 720px) {
  .mlist-wrap {
    width: 615px;
    height: 534px;
    margin-top: 25px !important;

    margin: 15px auto;
    font-size: 30px;
    padding-left: 35px;
    padding-top: 60px;

    background-size: 615px 534px;
    text-align: center;

    .mlist {
      width: 96%;
      height: 360px;
      padding-top: 4px;
      padding-bottom: 5px;
      margin-bottom: 20px;

      text-align: center;
      overflow-y: scroll;
       -webkit-overflow-scrolling: touch;

      &::-webkit-scrollbar {
        display: block;
        z-index: 2;
        width: 6px;
        height: 6px;
        background-color: transparent;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 0px rgba(196, 25, 25, 0.5);
        border-radius: 10px;
      }

      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 0px rgba(207, 47, 47, 0.5);
        background-color: #D45252;
      }
    }
    .draw-button {
      margin-top: 24px;
      margin-left: -10px;
      color: #d44a3f;
      width: 565px;
      height: 80px;
      .bgImg('../assets/to-draw-page.png');
      border-radius: 10px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      -o-user-select: none;
      user-select: none;
    }
  }
}

.active {
  .bgImg('../assets/active-item.png');

  color: #6b1414;
  font-weight: 200;
}
</style>
