<template>
  <div class="share" :class="{ show: visible }">
    <div class="share-item pyq" @click="$emit('share', 'moments')"></div>
    <div class="share-item wx" @click="$emit('share', 'wechat')"></div>
    <div class="share-item wb" @click="$emit('share', 'weibo')"></div>
    <div class="share-item qq" @click="$emit('share', 'qq')"></div>
    <div
      v-if="!isAndroid"
      class="share-item qz"
      @click="$emit('share', 'qzone')"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      shareType: '',
      isAndroid: /android/.test(navigator.userAgent.toLowerCase()),
    }
  },

  methods: {
    show() {
      document.documentElement.addEventListener('click', this.close)
    },

    close() {
      document.documentElement.removeEventListener('click', this.close)
    },

    handleShare(type) {
      this.shareType = type
    },
  },
}
</script>

<style lang="less" scoped>
.share {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  height: 140px;
  width: 100%;
  bottom: -140px;
  padding: 0 62px;
  left: 0;
  right: 0;
  z-index: 22;
  background-color: #fff;
  transition: all 0.1s;

  .share-item {
    height: 70px;
    width: 70px;
    border-radius: 4px;
    background-color: salmon;

    &:nth-child(5n) {
      margin-right: 0;
    }
  }

  .pyq {
    .bgImg('../assets/share-wechat-pyq.png');
  }

  .wx {
    .bgImg('../assets/share-wechat-hy.png');
  }

  .qq {
    .bgImg('../assets/share-qq.png');
  }

  .wb {
    .bgImg('../assets/share-weibo.png');
  }

  .qz {
    .bgImg('../assets/share-qzone.png');
  }
}

.show {
  bottom: 0;
  transition: all 0.1s;
}
</style>
