<template>
  <audio :src="src" ref="player" class="audio-player" />
</template>

<script>
export default {
  data() {
    return {
      src: '',
    }
  },

  methods: {
    play(src) {
      if (src) this.src = src

      const player = this.$refs.player

      player.addEventListener('loadeddata', () => {
        player.play()
      })
    },

    pause() {
      this.$refs.player?.pause()
    },

    changePlayState() {
      const player = this.$refs.player

      player.paused ? player.play() : this.pause()
    },
  },
}
</script>

<style lang="less" scoped>
.audio-player {
  position: fixed;
  bottom: -99999px;
  opacity: 0;
}
</style>
