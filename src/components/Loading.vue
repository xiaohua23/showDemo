<template>
  <div v-if="visible" class="loading" @touch.prevent>
    <div class="icon">
      转圈
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    }
  },

  methods: {
    show() {
      this.visible = true
    },

    close() {
      this.visible = false
    },
  },
}
</script>

<style lang="less" scoped>
.loading {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
