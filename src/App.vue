<template>
  <div id="app">
    <MusicIcon ref="bgMusic" :style="{ opacity: showIcon ? 1 : 0 }" />

    <audio
      src="https://ugc.hitv.com/platform_oss/1624847081793/新鼠标2.mp3"
      ref="audioBtn"
    />

    <transition name="fade" mode="out-in">
      <router-view v-if="isInit" />
    </transition>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import MusicIcon from '@/components/MusicIcon.vue'

export default {
  components: {
    MusicIcon,
  },

  provide() {
    return {
      playClickVoice: this.playClickVoice,
      hideMusicIcon: this.hideMusicIcon,
      showMusicIcon: this.showMusicIcon,
      stopBgMusic: this.stopBgMusic,
    }
  },

  data() {
    return {
      isInit: false,

      showIcon: true,
    }
  },

  watch: {
    /**
     * 改变路由需要改变分享内容
     */
    '$route.name': function(name) {
      this.setShareInfo()
    },
  },

  mounted() {
    this.setShareInfo()
    this.initVconsole()
    this.api.getDeviceAndUserInfo().then(resp => {
      this.setDevicesInfo(resp[0])
      this.setUserInfo(resp[1])
      if (resp[1].uuid && resp[1].ticket) {
        this.setIsLogin(true)
      }
      this.setIsMGTV(this.utils.isMGTV())
      this.getConf()
      this.isInit = true
    })
  },
  methods: {
    playClickVoice() {
      this.$refs.audioBtn.play()
    },

    stopBgMusic() {
      this.$refs.bgMusic?.pause()
    },

    hideMusicIcon() {
      this.showIcon = false
    },

    showMusicIcon() {
      this.showIcon = true
    },

    setShareInfo() {
      const shareInfo = {
        title: '听见，100年里的今天——芒果TV', // 分享标题
        desc: '时代留声机带你，用“声音”探寻百年历史。', // 分享描述
        shareUrl: 'https://app.mgtv.com/partysday/#/', // 分享链接
        shareIcon:
          'https://ugc.hitv.com/platform_oss/5A4C8964F5C84E8EA4347C61C70FE236', // 分享图片
      }
      MgtvApi.callhandler('showShareMenus', shareInfo, null)
      this.utils.setWXShareInfo(shareInfo)
    },
    //获取页面aid
    async getConf() {
      try {
        let confRes = await this.api.getConf()
        if (confRes.data) {
          this.setConf(confRes.data.items)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    },
    initVconsole() {
      if (
        location.href.indexOf('debug') > -1 ||
        (location.hostname == 'http://172.31.28.233//' &&
          navigator.appVersion.indexOf('Mac OS') == -1)
      ) {
        let script = document.createElement('script')
        script.src = 'https://app.mgtv.com/js/vconsole.min.js'
        document.body.appendChild(script)
        script.onload = () => {
          new VConsole()
        }
      }
    },
    ...mapMutations([
      'setUserInfo',
      'setDevicesInfo',
      'setIsMGTV',
      'setIsLogin',
      'setConf',
    ]),
  },
  computed: mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf']),
}
</script>

<style lang="less" scoped>
@font-face {
  font-family: ys;
  src: url('./assets/方正颜宋简体_粗.TTF');
}

@font-face {
  font-family: ysx;
  src: url('./assets/方正颜宋简体.TTF');
}

.fade-enter {
  opacity: 0.2;
}

.fade-leave {
  opacity: 1;
}

.fade-enter-active {
  transition: opacity 0.6s ease;
}

.fade-leave-active {
  opacity: 0;
  transition: opacity 0.3s ease;
}
</style>
