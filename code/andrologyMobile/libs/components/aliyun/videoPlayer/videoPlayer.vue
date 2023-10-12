<template>
  <div
    id="J_prismPlayer"
    v-bind="config"
  ></div>
</template>
<script>
import './sdk/g.alicdn.com_de_prismplayer_2.15.2_aliplayer-min.js'
import './sdk/g.alicdn.com_de_prismplayer_2.15.2_skins_default_aliplayer-min.css'
export default {
  props: {
    config: {
      type: Object,
      default: () => ({
        style: 'height: 500px;'
      })
    },
    playUrl: {
      type: String,
      default: () => ''//'https://video.andrologia.cn/customerTrans/7eb92a19f66d1c8bbcf92606f9d82f07/3f98ece3-1894e48d0a3-0006-150a-dec-16864.mp4'
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$nextTick(() => {
      new Aliplayer({
        id: 'J_prismPlayer',
        source: this.playUrl
      });
    })
  },
  methods: {
  }
}
</script>