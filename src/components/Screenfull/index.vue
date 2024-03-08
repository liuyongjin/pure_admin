<template>
 
</template>

<script>
import screenfull from 'screenfull'

export default {
  props: {
    isContainer: {
      type: Boolean,
      default: true
    }
  },
  name: 'Screenfull',
  data() {
    return {
      refEle: '',
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
    this.refEle = this.$options.parent.$el
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: '不支持全屏',
          type: 'warning'
        })
        return false
      }
      if (this.isContainer) {
        screenfull.toggle(this.refEle)
      } else {
        screenfull.toggle()
      }
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>