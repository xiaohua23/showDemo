<template>
  <div
    class="m-icon rotate"
    :style="{ 'animation-play-state': animationState }"
    @click.stop="changePlayState"
  >
    <audio
      src="https://ugc.hitv.com/platform_oss/1624433537621/【背景音乐】八块腹肌 - 唱支山歌给党听-钢琴版.mp3"
      ref="musicIcon"
      class="audio-player"
      loop
    />
  </div>
</template>

<script>
import { timer } from '@/utils/tools'

export default {
  data() {
    return {
      animationState: 'paused',
    }
  },

  async mounted() {
    await timer()

    document.addEventListener('DOMContentLoaded', () => {
      this.$refs.musicIcon.play()
    })

    document.addEventListener(
      'touchstart',
      () => {
        this.changePlayState()
      },
      { once: true }
    )

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.animationState = 'paused'
        this.$refs.musicIcon?.pause()
      }
    })

    this.$refs.musicIcon.volume = 0.4
  },

  methods: {
    pause() {
      const player = this.$refs.musicIcon

      this.animationState = 'paused'
      player.pause()
    },

    async changePlayState() {
      const player = this.$refs.musicIcon

      player.paused ? player.play() : player.pause()

      await this.$nextTick()

      this.animationState = player.paused ? 'paused' : 'running'
    },
  },
}
</script>

<style lang="less" scoped>
.m-icon {
  // display: none;
  position: fixed;
  right: 52px;
  top: 44px;
  z-index: 100;
  .hw(64px, 64px);
  .bgImg('../assets/img/music-icon.png');

  .audio-player {
    position: fixed;
    bottom: -99999px;
    opacity: 0;
  }
}

.rotate {
  animation: r 10s linear infinite;
}

@keyframes r {
  from {
    transform: rotate(0deg);
    transform-origin: center;
  }
  to {
    transform: rotate(360deg);
    transform-origin: center;
  }
}
</style>
