<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <div
      id="J_prismPlayer"
      style="height: 500px;"
    >222</div>
  </el-dialog>
</template>
<script>
import '@/libs/components/vue/upload/g.alicdn.com_de_prismplayer_2.15.2_aliplayer-min.js'
import '@/libs/components/vue/upload/g.alicdn.com_de_prismplayer_2.15.2_skins_default_aliplayer-min.css'
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
    }
  },
  data () {
    return {
      showDialog: false,
      width: '600px'
    }
  },
  watch: {
    title: {
      handler () {
        this.showDialog = !!this.title
      },
      immediate: true
    },
    showDialog: function () {
      if (!this.showDialog) this.title = ''
    }
  },

  mounted () {
    this.$nextTick(() => {
      new Aliplayer({
        id: 'J_prismPlayer',
        source: 'https://video.andrologia.cn/customerTrans/7eb92a19f66d1c8bbcf92606f9d82f07/3f98ece3-1894e48d0a3-0006-150a-dec-16864.mp4',
      });
    })
  },
  methods: {
    async finish (fileList) {
      // 上传结果做得不够细致
      let list = fileList.map(item => item.response.data)
      let res = await this.request(this.api.andrology.projectMgt.addProjectFile, list)
      if (res.code !== 200) return
      this.$emit('close')
      this.$emit('refresh')
    }
  }
}
</script>