<template>
  <div class="share-card">
    <div class="loading" v-if="isLoading">
      <div class="donut" />
    </div>

    <div class="share-wrapper">
      <template v-if="!isShowImg">
        <div class="name" :class="{ 'top-lower': !isShowImg }">
          <span v-for="(t, index) in name" :key="index">{{ t }}</span>
        </div>

        <div class="share-text" :class="{ left20: !isShowImg }">
          {{ shareText }}
        </div>

        <div class="qr-code" :style="`background-image:url('${qrcodeUrl}')`" />

        <div class="share-area" />
      </template>
      <img v-else :src="img" class="img" />
    </div>

    <div class="tip" v-if="!isMGTV">长按图片保存</div>

    <div class="share-bg" v-if="isMGTV" />
    <div class="close" @click="$emit('close')" />
  </div>
</template>

<script>
import qrcode from 'qrcode'
import html2canvas from 'html2canvas'
import { timer } from '@/utils/tools'

export default {
  props: {
    name: String,

    params: {
      type: Object,
      default: null,
    },

    shareText: {
      type: String,
      default: '',
    },

    isMGTV: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      qrcodeUrl: '',
      img: '',

      isLoading: false,
      isShowImg: false,
    }
  },

  watch: {
    params: {
      immediate: true,
      handler(p) {
        const { idx } = this.params
        const url = 'https://app.mgtv.com/partysday/#/?idx=' + idx

        qrcode.toDataURL(url).then(u => {
          this.qrcodeUrl = u
        })
      },
    },
  },

  async mounted() {
    this.isLoading = true

    const { idx } = this.params
    const u = 'https://app.mgtv.com/partysday/#/?idx=' + idx
    const url = await qrcode.toDataURL(u)
    this.qrcodeUrl = url

    if (!this.isMGTV) {
      await this.$nextTick()
      this.img = await this.genPoster()
      this.isShowImg = true
    }

    this.isLoading = false
  },

  methods: {
    genPoster() {
      const el = document.querySelector('.share-wrapper')

      return html2canvas(el, {
        allowTaint: false,
        useCORS: true,
        height: el.offsetHeight - 2,
        width: el.offsetWidth - 2,
        windowWidth: document.body.scrollWidth - 2,
        windowHeight: document.body.scrollHeight - 2,
        dpi: window.devicePixelRatio * 2,
        scale: 2,
      }).then(c => c.toDataURL('image/png'))
    },
  },
}
</script>

<style lang="less" scoped>
// @media screen and (max-height: 720px) {
//   .share-card {
//     transform: scala(0.9) !important;
//   }
// }

.share-card {
  position: absolute;
  left: 50%;
  top: 80px;
  transform: translateX(-50%);
  z-index: 101;

  .loading {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #650306;
    z-index: 23;

    @keyframes donut-spin {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    .donut {
      position: absolute;
      width: 60px;
      height: 60px;
      top: 40%;
      left: calc(50% - 30px);
      border: 6px solid rgba(0, 0, 0, 0.1);
      border-left-color: #7468f0;
      border-radius: 50%;
      animation: donut-spin 1.2s linear infinite;
    }
  }

  .share-wrapper {
    position: relative;
    z-index: 21;
    .hw(1012px, 644px);
    .bgImg('../assets/img/share.png');

    .img {
      .hw(1012px, 644px);
      border-radius: 8px;
      overflow: hidden;
    }
  }

  .tip {
    font-size: 28px;
    font-family: ysx;
    color: #eee;
    margin-top: 20px;
    text-align: center;
  }

  .share-bg {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: #650306;

    .hw(1012px, 644px);
  }

  .close {
    position: fixed;
    top: -32px;
    right: -32px;
    border-radius: 50%;
    z-index: 24;

    .hw(72px, 72px);
    .bgImg('../assets/close.png');
  }

  .name {
    position: absolute;
    display: flex;
    justify-content: space-around;
    top: 134px;
    left: 36px;
    width: 200px;
    font-weight: bold;
    font-size: 50px;
    color: #fff;

    span {
      font-family: ys;
    }
  }

  .top-lower {
    top: 132px;
  }

  .left20 {
    left: 20px;
  }

  .share-text {
    position: absolute;
    top: 360px;
    left: 40px;
    font-size: 30px;
    color: #ffd790;
    font-family: ysx;
  }

  .qr-code {
    .hw(112px, 112px);

    position: absolute;
    right: 29px;
    bottom: 24px;
    background-size: 100%;
    background-repeat: no-repeat;
    border-radius: 12px;
  }
}
</style>
