<template>
  <div
    class="file"
    :style="templateHeight"
  >
    <el-row
      type="flex"
      align="middle"
      class="topbar"
    >
      <el-col
        :span="18"
        class="topbarTitle"
      >
        项目文档
      </el-col>
      <el-col
        :span="6"
        class="btnGroup"
      ><button
          class="primary"
          @click="uploadFileDialog = true"
        >
          上传文件
        </button>
      </el-col>
    </el-row>
    <xnw-template-list
      :tableHeader="fileTableHeader"
      :tableData="fileList"
    >
      <template #default />
    </xnw-template-list>
    <upload-file
      title="上传文件"
      @close="hideDialog"
      @refresh="getList"
      v-if="uploadFileDialog"
    />
    <el-row
      type="flex"
      align="middle"
      class="topbar"
    >
      <el-col
        :span="18"
        class="topbarTitle"
      >
        项目视频
      </el-col>
      <el-col
        :span="6"
        class="btnGroup"
      ><button
          class="primary"
          @click="uploadVideoDialog = true"
        >
          上传视频
        </button>
      </el-col>
    </el-row>
    <xnw-template-list
      :tableHeader="videoTableHeader"
      :tableData="videoList"
    >
      <template #default />
    </xnw-template-list>
    <upload-videos
      title="上传视频"
      @close="hideDialog"
      @finish="getList"
      v-if="uploadVideoDialog"
    />
    <vplayer
      v-bind="player"
      @close="hideDialog"
      v-if="videoPlayerDialog"
    />
  </div>
</template>


<script>
import uploadFile from './_uploadFile.vue'
import uploadVideos from './_uploadVideo.vue'
import vplayer from './_videoPlayer.vue'
export default {
  components: { uploadFile, uploadVideos, vplayer },
  data () {
    return {
      fileList: [],
      uploadFileDialog: false,
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'fileName', label: '文件名' },
        { prop: 'fileSeq', label: '排序' },
        { prop: 'updateDate', label: '上传时间' },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '查看', click: row => this.fileBtn(row, 'open') },
            // { text: '编辑', click: row => this.fileBtn(row, 'edit') },
            { text: '下载', click: row => this.fileBtn(row, 'download') },
            { text: '删除', click: row => this.fileBtn(row, 'del') },
          ]
        }
      ],
      videoList: [],
      uploadVideoDialog: false,
      videoTableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'videoName', label: '视频名称' },
        { prop: 'aliyunState', label: '状态' },
        { prop: 'videoSeq', label: '排序' },
        { prop: 'updateDate', label: '上传时间' },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '播放', click: row => this.videoBtn(row, 'play') },
            // { text: '编辑', click: row => this.videoBtn(row, 'edit') },
            { text: '下载', click: row => this.videoBtn(row, 'download') },
            { text: '删除', click: row => this.videoBtn(row, 'del') },
          ]
        }
      ],
      player: { title: '', playUrl: '' },
      videoPlayerDialog: false,
      templateHeight: '100vh'
    }
  },
  async created () {
    await this.getList()
  },
  mounted () {
    this.$nextTick(() => {
      this.templateHeight = `height:calc(100vh - ${this.$el.offsetTop + 10}px)`
    })
    window.onresize = () => {
      this.templateHeight = `height:calc(100vh - ${this.$el.offsetTop + 10}px)`
    }
  },
  methods: {
    async getList () {
      this.fileList = (await this.request(this.api.andrology.projectMgt.getProjectFileList)).data
      this.videoList = (await this.request(this.api.andrology.projectMgt.getProjectVideoList)).data
      this.ready = true
    },
    hideDialog () {
      this.uploadFileDialog = this.uploadVideoDialog = this.videoPlayerDialog = false
      console.log('hideDialog', this.uploadVideoDialog);
    },
    async fileBtn (row, type) {
      let url = row.fileUrl
      switch (type) {
        case 'open':
        case 'download':
          window.open(url, '_blank')
          break;
        case 'edit':
          console.log(row, type);
          break;
        case 'del':
          await this.request(this.api.andrology.projectMgt.deleteProjectFile, row)
          await this.getList()
          break;
      }
    },
    async videoBtn (row, type) {
      let url = row.fileUrl || row.videoUrl
      // let res, qq
      switch (type) {
        case 'download':
          window.open(url, '_blank')
          // res = await this.request({ method: 'GET', url, dataType: 'json' }, {}, { headers: this.globalData.headers, responseType: 'blob' })
          // qq = window.URL.createObjectURL(new Blob([res], {
          //   type: 'video/mp4'
          // }))
          // window.open(qq, '_blank')
          break;
        case 'edit':
          console.log(row, type);
          break;
        case 'del':
          await this.request(this.api.andrology.projectMgt.deleteProjectVideo, row)
          await this.getList()
          break;
        case 'play':
          console.log(row, type);
          this.player.title = row.videoName
          this.player.playUrl = row.videoUrl
          this.videoPlayerDialog = true
          break;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.file {
  display: flex;
  flex-direction: column;
}
.topbar {
  padding: 10px 0;
  .topbarTitle {
    font-size: 18px;
  }
  .btnGroup {
    display: block;
    text-align: right;
  }
}
</style>