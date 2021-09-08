<template>
  <div class="g-draw">
    <div
      class="page-lottery"
      :class="{ 'show-lottery': showResultPage }"
      :style="{
        display: this.$route.query.idx === undefined ? 'block' : 'none',
      }"
    >
      <div class="mp-text">时代留声机-抽取属于您的唱片</div>
      <!-- 抽奖盒子 -->
      <div v-show="!showPoster" class="m-card">
        <div class="slider">
          <ul
            class="clearfix card-wrapper"
            :class="{
              'start-move': false,
              'linear-move': isLinearMove,
              'end-move': isEndMove,
            }"
          >
            <li v-for="index in 8" :key="index">
              <div class="s-card">
                <span class="arr"></span>
                <span class="thin"></span>
              </div>
            </li>
          </ul>
        </div>

        <div class="glassmask">
          <span class="light"></span>
          <span class="light1"></span>
        </div>

        <!-- 按钮 -->
        <div v-if="showDrawBtn" class="cbtn" @click="handleDraw"></div>
      </div>

      <div class="text">聆听新青年的时代之声</div>
    </div>

    <!-- 结果页面 -->
    <div
      v-show="!showPoster"
      class="page-result"
      :class="{ 'page-result-show': showResultPage }"
    >
      <!-- cd 唱片 -->
      <div class="mp-disc">
        <span class="cd"></span>
        <span class="mask"></span>
      </div>
      <!-- 结果盒子 -->
      <div class="m-rscard">
        <div class="text01">
          <p
            v-for="(t, index) in textList"
            :key="index"
            v-html="enhanceName(t)"
          />
        </div>
        <!-- <div class="text02">
          <p
            v-for="(t, index) in textList.slice(2)"
            :key="index"
            v-html="enhanceName(t)"
          />
        </div> -->
        <div v-show="isPlay" class="btn" @click="changePlayState" />
        <div v-show="!isPlay" class="play-btn" @click="changePlayState" />
      </div>

      <!-- 按钮 -->
      <!-- <div class="m-btnbox" v-if="!isFromAct" :class="{ 'jc-center': !isMGTV }"> -->
      <div class="m-btnbox" v-if="!isFromAct">
        <div class="rbtn" @click="drawAgain" />
        <div class="rbtn poster-btn" @click="genPoster" />
      </div>
      <div
        class="open-act"
        v-else
        @click="$router.push({ name: 'Audition' })"
      />

      <div v-if="!isFromAct" class="open-more" @click="openMore" />
    </div>

    <Poster
      v-if="showPoster"
      :params="{ idx: rIdx }"
      ref="poster"
      :name="musicItem.author"
      :shareText="musicItem.shareText"
      :isMGTV="isMGTV"
      @close="closePoster"
    />
    <Share v-if="isMGTV" :visible="showPoster" @share="handleShare" />
    <AudioPlayer ref="audioPlayer" @ended="isPlay = false" />
    <audio
      :src="musicItem.src"
      ref="voiceAudio"
      class="audio-player"
      @ended="isPlay = false"
    />
    <audio
      src="https://ugc.hitv.com/platform_oss/1624812956449/音乐弹出.mp3"
      ref="drawAudio"
      class="audio-player"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { timer } from '@/utils/tools'
import Share from '@/components/Share.vue'
import Poster from '@/components/Poster.vue'
import AudioPlayer from '@/components/AudioPlayer.vue'

import { MUSIC_LIST } from './constant'

export default {
  components: {
    AudioPlayer,
    Poster,
    Share,
  },

  inject: ['playClickVoice', 'hideMusicIcon', 'showMusicIcon'],

  data() {
    return {
      showResultPage: false,

      showPoster: false,
      showDrawBtn: true,

      isDrawClick: false,
      isStartMove: false,
      isLinearMove: false,
      isEndMove: false,
      isFromAct: false,
      isPlay: false,

      rIdx: null,
      musicItem: {},
    }
  },

  computed: {
    ...mapState(['isMGTV', 'isLogin']),

    textList() {
      if (!this.musicItem.text) return ''

      const { text } = this.musicItem

      return text.split(' ')
    },
  },

  async mounted() {
    await timer(500)

    MgStat.send('pv', {}, { cntp: 'party_getAudio' })

    const { idx } = this.$route.query

    if (idx !== undefined) {
      this.getActByIndex(+idx)
    } else {
      this.$nextTick(this.startMove)
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.audioPause()
      }
    })
  },

  methods: {
    getActByIndex(idx) {
      this.musicItem = MUSIC_LIST[idx]
      this.showResultPage = true
      this.isFromAct = true

      this.setShareInfo(
        `和${this.musicItem.author}一起，聆听百年间的声音——芒果TV`,
        this.musicItem.shareText
      )
      // this.$refs.audioPlayer.play(this.musicItem.src)
    },

    async handler() {
      // this.isLinearMove = false
      await this.$nextTick()

      if (this.isDrawClick) {
        setTimeout(() => {
          this.isEndMove = true
        })
        this.isLinearMove = false
        this.isDrawClick = false

        setTimeout(() => {
          this.$refs.drawAudio?.play()
        }, 2100)
      } else {
        // this.isLinearMove = true
      }
  },

    async startMove() {
      const el = document.querySelector('.card-wrapper')

      this.isStartMove = true

      // await timer(1850)

      this.isStartMove = false
      this.isLinearMove = true

      await this.$nextTick()

      el.removeEventListener('animationiteration', this.handler)
      el.addEventListener('animationiteration', this.handler)

      this.showDrawBtn = true
    },

    getMusicItem() {
      const len = MUSIC_LIST.length
      const RandomIndex = Math.floor(Math.random() * len)

      this.rIdx = RandomIndex

      return MUSIC_LIST[RandomIndex]
    },

    /** 抽奖 */
    async handleDraw() {
      this.playClickVoice()

      MgStat.send(
        'click',
        {},
        {
          cont: '点击确认抽取',
          label: 'btn',
          mod: 'get_audio',
          cntp: 'party_getAudio',
          addr: '',
          direct: 'cntp',
        }
      )

      this.isDrawClick = true
      this.showDrawBtn = false
      this.isPlay = true

      const el = document.querySelector('.card-wrapper')

      this.musicItem = this.getMusicItem()
      this.setShareInfo(
        `和${this.musicItem.author}一起，聆听百年间的声音——芒果TV`,
        '百年风华，“声”情礼赞！快来获取你的声音盲盒吧~'
      )

      el.addEventListener(
        'animationend',
        async () => {
          await timer(800)

          this.showResultPage = true
          this.audioPlay()

          await timer(600)
          this.isEndMove = false
        },
        { once: true }
      )
    },

    enhanceName(t) {
      let text = t
      const name = this.musicItem.author
      const { alias } = this.musicItem
      let instead = name

      if (t.includes(name) || t.includes(alias)) {
        let idx = t.indexOf(name)
        if (idx === -1) {
          idx = t.indexOf(alias)
          instead = alias
        }

        text =
          t.slice(0, idx) +
          `<span class="name">${instead}</span>` +
          t.slice(idx + instead.length)
      }

      return text
    },

    changePlayState() {
      this.playClickVoice()

      const player = this.$refs.voiceAudio
      player.paused ? this.audioPlay() : this.audioPause()
    },

    async audioPause() {
      await this.$nextTick()
      this.$refs.voiceAudio?.pause()
      this.isPlay = false
    },

    async audioPlay() {
      await this.$nextTick()
      this.$refs.voiceAudio?.play()
      this.isPlay = true
    },

    genPoster() {
      this.playClickVoice()
      this.hideMusicIcon()

      MgStat.send(
        'click',
        {},
        {
          cont: '点击生成海报',
          label: 'btn',
          mod: 'cre_poster',
          cntp: 'party_getAudio',
          addr: '',
          direct: 'cntp',
        }
      )

      this.audioPause()
      this.showPoster = true
    },

    openMore() {
      // TODO 改回id
      // if (!this.isMGTV) {
      //   this.utils.callApp('imgotv://channel?vclassId=789&from=sdlsj')
      //   return
      // }

      this.utils.jumpPage('https://m.mgtv.com/subchannel/1988.html')
    },

    async drawAgain() {
      this.playClickVoice()

      MgStat.send(
        'click',
        {},
        {
          cont: '点击再抽一次',
          label: 'btn',
          mod: 'get_try_audio',
          cntp: 'party_getAudio',
          addr: '',
          direct: 'cntp',
        }
      )

      this.isLinearMove = false
      this.isStartMove = false
      this.isEndMove = false

      await this.$nextTick()

      this.setShareInfo()
      this.audioPause()
      this.idx = null
      this.showResultPage = false

      this.startMove()
    },

    closePoster() {
      this.showPoster = false
      this.showMusicIcon()
    },

    async handleShare(type) {
      const shareTypeMap = {
        moments: 1,
        wechat: 2,
        weibo: 3,
        qq: 4,
        qzone: 5,
      }

      MgStat.send(
        'click',
        {
          sharetype: shareTypeMap[type],
          fcv: 'c_posterpop',
        },
        {
          cont: '点击渠道分享',
          label: 'btn',
          mod: 'share',
          cntp: 'party_getAudio',
          addr: '',
          direct: 'cntp',
        }
      )

      try {
        const url = await this.$refs.poster.genPoster()

        const shareObject = {
          type,
          style: '1',
          shareUrl: url,
          title: '',
          shareDesc: '',
          shareIcon: '',
        }

        MgtvApi.callhandler('shareTo', shareObject)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    },

    setShareInfo(
      title = '听见，100年里的今天——芒果TV',
      desc = '时代留声机带你，用“声音”探寻百年历史。'
    ) {
      const params = this.rIdx === null ? '' : `?idx=${this.rIdx}`
      const shareInfo = {
        title: title, // 分享标题
        desc: desc, // 分享描述
        shareUrl: 'https://app.mgtv.com/partysday/#/' + params, // 分享链接
        shareIcon:
          'https://ugc.hitv.com/platform_oss/5A4C8964F5C84E8EA4347C61C70FE236', // 分享图片
      }
      MgtvApi.callhandler('showShareMenus', shareInfo, null)
      this.utils.setWXShareInfo(shareInfo)
    },
  },
}
</script>

<style lang="less">
.g-draw {
  position: relative;
  padding-top: 100px;
  .hw(100vh, 100vw);
  .bgImg('../../assets/img/bg.png');
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: 100% 100%;
  overflow: hidden;

  .page-lottery {
    position: absolute;
    top: 100px;
    left: 0;
    z-index: 6;
    width: 100%;
    height: 100%;

    .title {
      .hw(157px, 500px);
      .bgImg('../../assets/img/draw/title.png');
      position: relative;
      left: 20px;
      margin-top: 212px;
    }

    .box-wrapper {
      .hw(747px, 677px);
      .bgImg('../../assets/img/draw/box.png');
      position: relative;
      margin-top: 63px;

      .btn {
        .hw(111px, 288px);
        .bgImg('../../assets/img/draw/btn.png');
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 37px;
      }
    }

    .text {
      font-size: 28px;
      color: #eee;
      font-family: ysx;
      .hw(39px, 400px);
      text-align: center;
      margin: 69px auto 0;
    }

    .mp-text {
      width: 646px;
      height: 190px;
      margin: 0 auto 50px;
      .bgImg('../../assets/img/phonograph/text01.png');
      text-indent: -9999px;
    }
    .m-card {
      position: relative;
      width: 658px;
      height: 746px;
      margin: 0 auto;
      padding-top: 106px;
      .bgImg('../../assets/img/phonograph/bg-box01.png');
      text-indent: -9999px;
      .cbtn {
        position: absolute;
        left: 50%;
        bottom: 25px;
        width: 364px;
        height: 140px;
        margin-left: -182px;
        .bgImg('../../assets/img/phonograph/btn01.png');
      }
      .slider {
        position: absolute;
        top: 190px;
        left: 84px;
        overflow: hidden;
        width: 500px;
        height: 360px;

        ul {
          position: absolute;
          width: (380px * 9);
          padding-left: 60px;
          box-sizing: border-box;
          transform: translate3d(0, 0, 0);
          li {
            float: left;
            margin-bottom: 40px;
            list-style: none;
          }
        }
        .s-card {
          position: relative;
          float: left;
          width: 380px;
          height: 326px;
          .arr {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
            width: 326px;
            height: 326px;
            .bgImg('../../assets/img/phonograph/card01.png');
          }
          .thin {
            position: absolute;
            top: 24px;
            left: 140px;
            z-index: 2;
            width: 258px;
            height: 260px;
            .bgImg('../../assets/img/phonograph/cd01.png');
          }
        }
      }
      .glassmask {
        overflow: hidden;
        position: absolute;
        top: 106px;
        left: 38px;
        z-index: 12;
        width: 579px;
        height: 456px;
        .light {
          position: absolute;
          left: -25%;
          top: 0;
          width: 100px;
          height: 456px;
          background-image: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1)
          );
          background-image: -webkit-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1)
          );
          -webkit-transform: skewx(-45deg);
          transform: skewx(-45deg);
          animation: lightFun 4.2s ease infinite;
          -webkit-animation: lightFun 4.2s ease infinite;
        }
        .light1 {
          position: absolute;
          left: -35%;
          top: 0;
          width: 30px;
          height: 456px;
          background-image: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1)
          );
          background-image: -webkit-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.2),
            rgba(255, 255, 255, 0.1)
          );
          -webkit-transform: skewx(-45deg);
          transform: skewx(-45deg);
          animation: lightFun1 4.2s ease infinite;
          -webkit-animation: lightFun1 4.2s ease infinite;
        }
      }
    }
  }

  .page-result {
    display: none;
    position: absolute;
    top: 100px;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    .mp-disc {
      overflow: hidden;
      position: relative;
      z-index: 8;
      width: 420px;
      height: 230px;
      margin: 0 auto;
      .cd {
        position: absolute;
        top: 80px;
        left: 0;
        width: 420px;
        height: 420px;
        .bgImg('../../assets/img/phonograph/cd02.png');
      }
      .mask {
        position: absolute;
        bottom: -30px;
        left: 0;
        width: 420px;
        height: 150px;
        .bgImg('../../assets/img/phonograph/cd02-mask.png');
      }
    }
    .m-rscard {
      position: relative;
      width: 658px;
      height: 746px;
      margin: -28px auto 40px;
      padding-top: 120px;
      .bgImg('../../assets/img/phonograph/bg-box02.png');
      text-align: center;

      .name {
        font-size: 36px;
        color: #fff;
        margin-left: 10px;
        font-family: ys;
      }

      p {
        margin-bottom: 35px;
        padding: 0 18px;
        font-size: 30px;
        font-family: ysx;
        color: #ffdba7;
        text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
      }
      .btn {
        position: absolute;
        right: 20px;
        bottom: 20px;

        .hw(78px, 191px);
        .bgImg('../../assets/img/draw/pause.png');
        text-indent: -9999px;
      }

      .play-btn {
        .hw(78px, 191px);
        .bgImg('../../assets/img/draw/play.png');
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
    }
    .m-btnbox {
      display: flex;
      justify-content: space-between;
      padding: 60px;

      .rbtn {
        display: inline-block;
        width: 288px;
        height: 111px;
        .bgImg('../../assets/img/phonograph/btn1.png');
      }

      .poster-btn {
        .bgImg('../../assets/img/phonograph/gen-poster.png');
      }
    }

    .jc-center {
      justify-content: center;
    }

    .open-act {
      .hw(116px, 524px);
      .bgImg('../../assets/open-act-btn.png');

      position: relative;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
    }

    .open-more {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      .hw(40px, 228px);
      .bgImg('../../assets/open-more.png');
    }
  }

  // 动画
  .slider {
    .start-move {
      animation: 2s move ease-in forwards;
    }

    .linear-move {
      animation: 1.3s move linear infinite forwards;
    }

    .end-move {
      animation: 1.8s move ease-out forwards;

      li:nth-child(7) {
        animation: 0.3s 1.9s moveCard linear forwards;
        .thin {
          animation: 0.3s 2s moveThin linear forwards;
        }
      }
    }
  }

  .show-lottery {
    animation: 0.5s moveHidePage linear forwards;
  }
  .page-result-show {
    display: block;
    animation: 0.5s moveShowPage linear forwards;
  }

  // 结果页动画
  .page-result-show {
    opacity: 0;
    .mp-disc {
      .cd {
        animation: 1.6s 0.5s moveDisc linear forwards;
      }
    }
    .text01 {
      opacity: 0;
      animation: fadeinUp 2.2s 0.2s ease forwards;
    }
    .text02 {
      opacity: 0;
      animation: fadeinUp 1.2s 1.2s ease forwards;
    }
    .btn {
      opacity: 0;
      animation: 0.8s moveShowPage linear forwards;
    }
  }
}

@media screen and (max-height: 740px) {
  .page-lottery {
    top: 10px !important;
  }

  .page-result {
    top: 10px !important;
    transform: scale(0.85);
  }

  .m-btnbox {
    padding-top: 20px !important;
    padding-bottom: 40px !important;
  }
}

@media screen and (width: 414px) {
  .page-lottery {
    top: 40px !important;
  }

  .page-result {
    top: 10px !important;
    transform: scale(0.85);
  }

  .m-btnbox {
    padding-top: 10px !important;
    padding-bottom: 40px !important;
  }
}

@keyframes move {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-2280px);
  }
}

@keyframes moveCard {
  0% {
    transform: scale(1) translateY(0%);
  }
  100% {
    transform: scale(1.04) translateY(-5px);
  }
}

@keyframes moveThin {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: scale(1.04) translateX(12px);
  }
}

@keyframes moveHidePage {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes moveShowPage {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes moveDisc {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-80px);
  }
}

/* 淡入 */
@keyframes fadeinUp {
  0% {
    opacity: 0;
    transform: translateY(10%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/************** light ***************/
@keyframes lightFun {
  0% {
    left: -60%;
  }
  30% {
    left: -60%;
  }
  50% {
    left: 140%;
  }
  100% {
    left: 140%;
  }
}
@keyframes lightFun1 {
  0% {
    left: -42%;
  }
  30% {
    left: -42%;
  }
  50% {
    left: 140%;
  }
  100% {
    left: 140%;
  }
}
</style>
