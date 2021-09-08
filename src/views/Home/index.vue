<template>
  <div class="home">
    <div class="loading-text" :class="{ shining: isShining }">
      唱片正在加载中 ...
    </div>

    <PosterGenerator ref="posterGenerator" />
    <Loading ref="loading" />
    <Share ref="shareBar" />
  </div>
</template>

<script>
import pLimit from 'p-limit'
import { mapState } from 'vuex'
import Report from '@/utils/report'
import { loadImg, limitLoad } from '@/utils/tools'
import PosterGenerator from '@/components/PosterGenerator.vue'
import Loading from '@/components/Loading.vue'
import Share from '@/components/Share.vue'

const getAllImgs = () => {
  const req = require
// console.log(typeof require);
// console.log(req,'require');
  // console.log(req.context);
  var a = req.context('../../assets',true,/.png$/)
  console.log(a ,'a');
  a=a.keys()
  console.log(a ,'a');

  return req
    .context('../../assets', true, /.png$/)
    .keys()
    .map(x => 'assets/' + x.slice(2))
    .map(x => req('@/' + x))
}

export default {
  name: 'home',

  components: {
    Loading,
    PosterGenerator,
    Share,
  },

  data() {
    return {
      isShining: true,

      isLoadImg: false,

      timer: null,
    }
  },

  computed: {
    ...mapState(['userInfo', 'devicesInfo', 'isMGTV', 'isLogin', 'conf']),
  },

  mounted() {
    this.setShining()

    this.preloadResource().then(() => {
      const { idx } = this.$route.query

      if (idx !== undefined) {
        this.$router.push({ name: 'Draw', query: { idx } })
      } else {
        this.$router.push({ name: 'Audition' })
      }
    })
  },

  beforeDestroy() {
    clearInterval(this.timer)
  },

  methods: {
    setShining() {
      setInterval(() => {
        this.isShining = !this.isShining
      }, 1000)
    },

    preloadResource() {
      return Promise.all([this.preloadFont(), this.preloadImgs()])
    },

    preloadFont() {
      return new Promise(resolve => {
        document.fonts.ready.then(() => {
          resolve()
        })
      })
    },

    preloadImgs() {
      //imgs此时是一个数组，里面有所有要预加载的地址
      const imgs = getAllImgs()

      return limitLoad(imgs, loadImg, 8)
    },
  },
}
</script>

<style scoped lang="less">
.home {
  position: relative;
  .hw(100vh, 100vw);
  .bgImg('../../assets/img/home/bg.png');
  background-position: center;

  .loading-text {
    position: absolute;
    top: 54%;
    font-size: 24px;
    left: 52%;
    transform: translateX(-50%);
    color: #fff;
    font-family: ysx;
    font-weight: bold;
    opacity: 1;
    transition: all 1s;
  }

  .shining {
    opacity: 0.2;
  }
}
</style>
