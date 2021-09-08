<template>
  <div class="m-container">
    <MusicListShow
      class="m-play"
      @changemusicplaying="switchmusic"
      v-if="musicplaying"
      ref="musicList"
      :style="'opacity:' + mOpacity"
      :scroll-list="musicList[currentIndex]"
      :scroll-bg-index="currentIndex"
    />
    <div class="m-itemList" v-else :style="'opacity:' + (1 - mOpacity)">
      <div
        v-for="(item, index) in itemList"
        :key="item.id"
        class="m-item"
        draggable="false"
        :id="item.id"
      >
        <img
          :src="!item.isDraging ? item.imgSrc : item.aterSrc"
          draggable="true"
          @touchmove="touchmove"
          @touchstart.prevent="touchstart(index, $event)"
          @touchend.prevent="touchend(index, $event)"
          class="square-img"
          alt=""
        />

        <div class="touch" v-if="showTouch && index === 3" />
      </div>
    </div>

    <p ref="dragging" class="dragging" v-if="!musicplaying">
      长按唱片拖动到留声机处
    </p>
    <img
      class="drop-arm"
      src="@/assets/musicbox-arm.png"
      :style="'transform:rotate(' + armRotateDeg + 'deg)'"
      alt=""
      ref="droparm"
    />

    <img
      src="@/assets/musicbox-slot.png"
      ref="touchdrop"
      class="drop-img"
      draggable="false"
      :style="
        'opacity:' +
          (1 - mOpacity) +
          ';width:' +
          slotWidth +
          '%;margin-left:' +
          slotLeft +
          '%'
      "
      v-if="!musicplaying"
    />
    <img
      src="@/assets/base-musicbox.png"
      ref="musicbox"
      class="drop-img-rotate"
      draggable="false"
      :style="'opacity:' + mOpacity + ';animation-play-state:' + isrun + ';'"
      v-else
    />

    <div class="handler" ref="handler">
      <div>
        <button class="changedisc" @click="tochangeaudio"></button>
      </div>
      <div class="handler-bottombtn">
        <button id="btn" @click="topre" class="topre"></button
        ><button
          id="btn"
          ref="pausebutton"
          :class="playorpause"
          @click="topause"
        ></button
        ><button id="btn" class="tonext" @click="tonext"></button>
      </div>
    </div>
    <audio ref="audio" @ended="tonext" :src="musicSrc"></audio>
    <img
      src="@/assets/musicbox.png"
      ref="cloneitem"
      class="m-item-rightImg"
      draggable="false"
      alt=""
      srcset=""
      v-show="false"
    />
    <div class="mg-pup" v-show="musicplaying">
      <div
        class="run-content animation"
        ref="mgpup"
        :style="'animation-play-state:' + isrun + ';'"
      ></div>
    </div>
  </div>
</template>

<script>
import MusicListShow from '@/components/MusicListShow.vue'
import { timer } from '@/utils/tools'
import { musicList } from './constants'

export default {
  components: {
    MusicListShow,
  },

  inject: ['playClickVoice', 'stopBgMusic'],

  data() {
    return {
      showTouch: true,

      playorpause: 'topaused',
      armRotateDeg: 0,
      mOpacity: 0,
      slotWidth: 92,
      slotLeft: 4,
      musicplaying: false,
      musicSrc: '',
      //芒果仔跑不跑，转盘转不转
      isrun: 'running',
      //克隆的
      lastchild: null,
      isplayingMusic: false,
      //currentIndex是指第几个盒子
      currentIndex: '',
      //这是在盒子里播放第几首歌曲
      currentMusicIndex: 0,
      textItem: null,
      itemList: [
        {
          id: 'm101',
          imgSrc: require('@/assets/m-item1.png'),
          aterSrc: require('@/assets/sg.png'),
          isDraging: false,
        },
        {
          id: 'm102',
          imgSrc: require('@/assets/m-item2.png'),
          aterSrc: require('@/assets/nc-bg.png'),
          isDraging: false,
        },
        {
          id: 'm103',
          imgSrc: require('@/assets/m-item3.png'),
          aterSrc: require('@/assets/fz.png'),
          isDraging: false,
        },
        {
          id: 'm104',
          imgSrc: require('@/assets/m-item4.png'),
          aterSrc: require('@/assets/sd.png'),
          isDraging: false,
        },
      ],
      musicList: JSON.parse(JSON.stringify(musicList)),
    }
  },
  watch: {
    musicplaying(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        this.playorpause = 'topaused'
      }
    },
  },
  async mounted() {
    await timer(200)

    MgStat.send('pv', {}, { cntp: 'party_choRecord' })

    this.hideTouch()

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.$refs.audio.pause()
        this.$refs.musicList?.topause('topause')
        this.armRotateDeg = 0
        this.isrun = 'paused'
        this.playorpause = 'toplay'
      }
    })
  },
  methods: {
    hideTouch() {
      setTimeout(() => {
        this.showTouch = false
      }, 6500)
    },

    touchstart(index, e) {
      this.currentIndex = index
      this.itemList[index].isDraging = true
      this.musicSrc = this.musicList[this.currentIndex][
        this.currentMusicIndex
      ].musicSrc
      this.$refs.audio.load()
      this.lastchild = this.$refs.cloneitem.cloneNode(true)

      document.body.appendChild(this.lastchild)

      this.lastchild.style.cssText = `position:absolute;top:${
        e.targetTouches[0].pageY - 50
      }px;left:${
        e.targetTouches[0].pageX - 50
      }px;width:86px;opacity:1;border-radius: 50%;
      `
    },
    touchmove(e) {
      e.preventDefault()
      if (this.lastchild.offsetTop > this.$refs.touchdrop.offsetTop + 5) {
        this.slotWidth = 94
        this.slotLeft = 3
      } else {
        this.slotWidth = 92
        this.slotLeft = 4
      }
      this.lastchild.style.cssText = `position:absolute;top:${
        e.targetTouches[0].pageY - 50
      }px;left:${
        e.targetTouches[0].pageX - 50
      }px;width:86px;opacity:1;border-radius: 50%;`
    },
    async touchend(index, e) {
      this.itemList[index].isDraging = false

      if (this.lastchild.offsetTop > this.$refs.touchdrop.offsetTop + 5) {
        this.stopBgMusic()
        this.musicplaying = !this.musicplaying
        setTimeout(() => {
          this.$refs.handler.style = 'bottom :0px'
          this.armRotateDeg = 25
          this.mOpacity = 1
        })

        this.$nextTick(() => {
          this.$refs.audio.pause()
          this.$refs.audio.play()
        })
      }
      document.body.removeChild(this.lastchild)
      this.lastchild = null
      this.isrun = 'running'
    },
    topre() {
      this.playClickVoice()
      this.$refs.musicList.topre()
      this.playorpause = 'topaused'
      this.isrun = 'running'
    },
    topause(e) {
      this.playClickVoice()

      if (this.$refs.audio.paused) {
        this.$refs.audio.play()
        this.$refs.musicList.topause('toplay')
        this.armRotateDeg = 25
        this.isrun = 'running'

        this.playorpause = 'topaused'
      } else {
        this.$refs.audio.pause()
        this.$refs.musicList.topause('topause')
        this.armRotateDeg = 0
        this.isrun = 'paused'
        this.playorpause = 'toplay'
      }
    },
    tonext() {
      this.playClickVoice()

      this.$refs.musicList.tonext()
      this.playorpause = 'topaused'
      this.isrun = 'running'
    },
    tochangeaudio() {
      this.playClickVoice()

      this.$refs.musicList.tochangeaudio()
      this.$refs.audio.pause()
      this.currentMusicIndex = 0
      this.musicplaying = !this.musicplaying
      this.slotWidth = 92
      this.slotLeft = 4
      this.playorpause = 'topaused'
      setTimeout(() => {
        this.armRotateDeg = 0
        this.$refs.handler.style = 'bottom :-500px'
        this.mOpacity = 0
      }, 2)
      this.isrun = 'running'
    },
    switchmusic(index) {
      this.currentMusicIndex = index
      this.musicSrc = this.musicList[this.currentIndex][
        this.currentMusicIndex
      ].musicSrc
      this.$nextTick(() => {
        this.$refs.audio.pause()
        this.$refs.audio.play()
      })
      this.armRotateDeg = 25
      this.playorpause = 'topaused'
      this.isrun = 'running'
    },
  },
}
</script>

<style scoped lang="less">
@keyframes rotateImg {
  from {
    transform: rotate(0deg);
    transform-origin: center;
  }
  to {
    transform: rotate(360deg);
    transform-origin: center;
  }
}

.animation {
  width: 129px;
  height: 133px;
  background-image: url("../../assets/img/sprites.png");
  background-size: 2077px 137px;
  transform: translate(6px, 7px);
  background-repeat: no-repeat;
  animation-name: keyframes-MGpup;
  animation-duration: 1s;
  animation-delay: 0s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  animation-timing-function: steps(1);
}

@keyframes keyframes-MGpup {
  0% {
    width: 101px;
    height: 131px;
    background-image: url('../../assets/img/sprites.png');
    background-size: 2077px 137px;
    transform: translate(6px, 7px);
  }

  5.00% {
    width: 100px;
    height: 129px;
    background-position: -101px 0px;
    transform: translate(9px, 8px);
  }

  15.00% {
    width: 97px;
    background-position: -201px 0px;
    transform: translate(16px, 7px);
  }

  20.00% {
    width: 102px;
    height: 131px;
    background-position: -298px 0px;
    transform: translate(16px, 6px);
  }

  25.00% {
    width: 107px;
    height: 132px;
    background-position: -400px 0px;
    transform: translate(16px, 5px);
  }

  30.00% {
    width: 113px;
    height: 134px;
    background-position: -507px 0px;
    transform: translate(16px, 4px);
  }

  35.00% {
    width: 118px;
    height: 135px;
    background-position: -620px 0px;
  }

  40.00% {
    width: 128px;
    background-position: -738px 0px;
    transform: translate(10px, 5px);
  }

  45.00% {
    width: 129px;
    height: 136px;
    background-position: -866px 0px;
    transform: translate(11px, 5px);
  }

  50.00% {
    width: 90px;
    height: 134px;
    background-position: -995px 0px;
    transform: translate(10px, 6px);
  }

  55.00% {
    width: 96px;
    background-position: -1085px 0px;
    transform: translate(11px, 7px);
  }

  60.00% {
    width: 95px;
    height: 132px;
    background-position: -1181px 0px;
    transform: translate(14px, 8px);
  }

  65.00% {
    width: 97px;
    background-position: -1276px 0px;
    transform: translate(16px, 7px);
  }

  70.00% {
    width: 102px;
    height: 134px;
    background-position: -1373px 0px;
    transform: translate(16px, 6px);
  }

  75.00% {
    width: 107px;
    height: 136px;
    background-position: -1475px 0px;
    transform: translate(16px, 5px);
  }

  80.00% {
    width: 113px;
    height: 137px;
    background-position: -1582px 0px;
    transform: translate(16px, 4px);
  }

  85.00% {
    width: 119px;
    background-position: -1695px 0px;
    transform: translate(15px, 4px);
  }

  90.00% {
    width: 129px;
    height: 136px;
    background-position: -1814px 0px;
    transform: translate(9px, 5px);
  }

  95.00%,
  100% {
    width: 134px;
    background-position: -1943px 0px;
    transform: translate(6px, 5px);
  }
}

.m-container {
  .hw(100vh, 100vw);
  .bgImg('../../assets/bg.png');

  box-sizing: border-box;
  overflow: hidden;

  .m-play {
    margin-top: 100px;
    transition: all 0.6s linear;
  }
  .m-itemList {
    margin-top: 100px;
    display: flex;
    flex-wrap: wrap;
    transition: all 0.6s linear;
    justify-content: center;
  }
  .m-item {
    position: relative;
    width: 284px;
    height: 225px;
    display: inline-block;
    margin-left: 32px;
    padding: 4px 0 0 4px;
    text-align: left;
    vertical-align: middle;
    z-index: 1;
    .square-img {
      width: 100%;
      height: 100%;
    }

    @keyframes shining {
      0% {
        opacity: 0;
        transform: scale(0.8);
      }

      50% {
        opacity: 1;
        transform: scale(1);
      }

      100% {
        opacity: 0;
        transform: scale(0.8);
      }
    }

    .touch {
      .hw(134px, 148px);
      .bgImg('../../assets/touch.png');

      position: absolute;
      bottom: -18px;
      right: 0px;
      animation: 2s shining 3 forwards;
    }
  }

  .dragging {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 30px;
    color: #ffb7b2;
    font-family: ysx;
  }

  .drop-arm {
    position: fixed;
    left: 40px;
    transition: all 0.4s linear;
    bottom: 490px;
    transform-origin: 10.5% 63%;
    width: 455px;
    height: 124px;
    z-index: 4;
  }

  .drop-img {
    position: fixed;
    bottom: -78px;
    transition: opacity 0.6s linear;
  }

  @media screen and (min-height: 720px) {
    .drop-img-rotate {
      position: fixed;
      bottom: -68px;
      left: 4%;
      animation: rotateImg 10s linear infinite;
      width: 90%;
    }
    .mg-pup {
      position: fixed;
      z-index: 20;
      width: 129px;
      height: 133px;
      background-size: 129px 133px;
      left: 50%;
      transform: translateX(-50%);
      bottom: 590px;
    }
    .handler {
      position: fixed;
      bottom: -458px;
      transition: all 0.4s ease-in-out;
      text-align: center;
      .bgImg('../../assets/handler-bg.png');
      z-index: 6;
      width: 100%;
      height: 458px;
      button {
        margin: 0 5px;
      }
      .changedisc {
        position: absolute;
        right: 25px;
        bottom: 200px;
        width: 191px;
        height: 78px;
        .bgImg('../../assets/changedisc.png');
      }
      .handler-bottombtn {
        margin-top: 273px;
      }
      .topre {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/topre.png);
        background-size: 226px 98px;
      }
      .topaused {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/topaused.png);
        background-size: 226px 98px;
      }
      .toplay {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/toplay.png);
        background-size: 226px 98px;
      }
      .tonext {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/tonext.png);
        background-size: 226px 98px;
      }
    }
  }

  @media screen and (max-height: 720px) {
    .drop-img-rotate {
      position: fixed;
      bottom: -135px;
      width: 90%;
      left: 5%;
      animation: rotateImg 10s linear infinite;
    }
    .mg-pup {
      position: fixed;
      z-index: 20;
      width: 129px;
      height: 133px;
      background-size: 129px 133px;
      transform: translateX(-50%);
      margin-left: 50%;
      bottom: 530px;
    }
    .handler {
      position: fixed;
      bottom: -500px;
      transition: all ease-in-out 0.4s;
      text-align: center;
      .bgImg('../../assets/handler-bg.png');
      z-index: 6;
      width: 100%;
      height: 390px;
      button {
        margin: 0 5px;
      }
      .changedisc {
        position: absolute;
        right: 25px;
        bottom: 135px;
        width: 191px;
        height: 78px;
        .bgImg('../../assets/changedisc.png');
      }
      .handler-bottombtn {
        margin-top: 270px;
      }
      .topre {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/topre.png);
        background-size: 226px 98px;
      }
      .topaused {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/topaused.png);
        background-size: 226px 98px;
      }
      .toplay {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/toplay.png);
        background-size: 226px 98px;
      }
      .tonext {
        width: 226px;
        height: 98px;
        display: inline-block;
        background: url(../../assets/tonext.png);
        background-size: 226px 98px;
      }
    }
  }

  @media screen and (max-height: 620px) {
    .drop-img-rotate {
      position: fixed;
      bottom: -135px;
      width: 85%;
      left: 7.5%;
      animation: rotateImg 10s linear infinite;
    }
    .mg-pup {
      position: fixed;
      z-index: 20;
      width: 129px;
      height: 133px;
      background-size: 129px 133px;
      transform: translateX(-50%);
      margin-left: 50%;
      bottom: 498px;
    }
    .drop-arm {
      position: fixed;
      left: 40px;
      transition: all 0.4s linear;
      bottom: 470px;
      transform-origin: 10.5% 63%;
      width: 455px;
      height: 124px;
      z-index: 4;
    }
  }
}
</style>
