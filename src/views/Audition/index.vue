<template>
  <div class="audition">
    <div class="desc">
      <div class="text text1">近百载</div>
      <div class="text text2">和平、统一、发展</div>
      <div class="text text3">无数的声音不断响起</div>
      <div class="text text3">. . .</div>
    </div>

    <div class="btn" @click="handleClick" />

    <div class="guide">指导单位：中共湖南省委党史研究院</div>
  </div>
</template>

<script>
import { timer } from '@/utils/tools'

export default {
  inject: ['playClickVoice'],

  data() {
    return {}
  },

  async mounted() {
    await timer(200)

    MgStat.send('pv', {}, { cntp: 'party_actHome' })
  },

  methods: {
    handleClick() {
      MgStat.send(
        'click',
        {},
        {
          cont: '点击收听',
          label: 'btn',
          mod: 'get_listen',
          cntp: 'party_actHome',
          addr: 'https://app.mgtv.com/partysday/#/album',
          direct: 'cntp',
        }
      )

      this.playClickVoice()

      this.$router.push({ name: 'Album' })
    },
  },
}
</script>

<style lang="less" scoped>
.audition {
  @keyframes show {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .hw(100vh, 100vw);
  .bgImg('../../assets/img/audition/bg.png');

  .desc {
    position: fixed;
    right: 58px;
    bottom: 320px;

    .text {
      opacity: 0;
      width: 380px;
      text-align: right;
      font-size: 28px;
      color: #fff;
      font-weight: bold;
      font-family: ys;
      margin-bottom: 12px;
    }

    .text1 {
      animation: 1s 0.5s show forwards;
    }

    .text2 {
      animation: 0.8s 1.5s show forwards;
    }

    .text3 {
      animation: 1s 2.5s show forwards;
    }
  }

  .btn {
    position: fixed;
    right: 52px;
    bottom: 110px;
    .hw(110px, 344px);
    .bgImg('../../assets/img/audition/listen.png');
  }

  .guide {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 30px;
    font-family: ysx;
    font-size: 28px;
    color: #fff;
    white-space: nowrap;
  }
}

@media screen and (width: 414px) {
  .audition {
    .bgImg('../../assets/img/audition/bg1.png');
    background-position: 0 20%;
  }
}

@media screen and (max-height: 667px) {
  .audition {
    .bgImg('../../assets/img/audition/bg1.png');
    background-position: 0 20%;
  }
}
</style>
