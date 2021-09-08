<template>
  <div v-if="visible" class="poster-wrapper">
    <div class="mask" />

    <div class="poster-stencil">
      <!-- <img class="bg-img" src="../assets/meiziji.webp" /> -->

      <div class="qrcode">
        <img :src="qrcodeUrl" class="qr-img" />
      </div>
    </div>

    <div class="content">
      <div class="poster">
        <img v-if="posterUrl" :src="posterUrl" class="poster-img" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import html2canvas from 'html2canvas'
import qrcode from 'qrcode'
import Report from '@/utils/report'

export default {
  name: 'poster',

  components: {},

  props: {
    visible: Boolean,
  },

  data() {
    return {
      qrcodeUrl: '',

      posterUrl: '',
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf']),
  },

  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.$nextTick(this.generatePoster)
        }
      },
    },
  },

  mounted() {
    if (!this.isMGTV) Report.pv()

    qrcode.toDataURL(location.href).then(url => {
      this.qrcodeUrl = url
    })
  },

  methods: {
    async generatePoster() {
      const posterEl = document.querySelector('.poster-stencil')
      const canvas = await html2canvas(posterEl)

      this.posterUrl = canvas.toDataURL('image/png')
    },
  },
}
</script>

<style scoped lang="less">
.poster-wrapper {
  height: 100vh;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  width: 100%;
  position: fixed;
  z-index: 999;

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .poster-stencil {
    display: flex;
    position: relative;
    height: 800px;
    display: flex;
    left: -9999px;

    .qrcode {
      position: absolute;
      bottom: 10px;
      right: 10px;
      height: 100px;
      width: 100px;

      .qr-img {
        height: 100%;
        width: 100%;
      }
    }
  }

  .content {
    position: absolute;
    width: 420px;
    height: 800px;
    left: 50%;
    top: 120px;
    transform: translateX(-50%);
    box-shadow: 0 0 0 4px #f4aab9;

    .poster {
      width: 420px;
      height: 800px;

      .poster-img {
        height: 100%;
        width: 100%;
      }
    }
  }

  .bg-img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}
</style>
