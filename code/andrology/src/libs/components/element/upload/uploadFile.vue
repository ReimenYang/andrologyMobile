<template>
  <div>
    <el-upload
      ref="upload"
      v-bind="upload"
    >
      <i
        class="el-icon-plus"
        v-if="upload.listType === 'picture-card'"
      />
      <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      <slot
        name="trigger"
        v-if="upload.listType !== 'picture-card'"
      >
        <button class="btn plain">
          选取文件
        </button>
      </slot>
    </el-upload>
    <div
      class="formFooter"
      v-if="!upload.autoUpload"
    >
      <button
        class="btn"
        @click="$emit('close')"
      >取消</button>
      <button
        class="btn primary"
        :loading="isUploading"
        @click="submitUpload"
      >
        确认上传
      </button>
    </div>
    <el-dialog
      v-model="dialogVisible"
      appendToBody
    >
      <el-image
        fit="cover"
        :src="dialogImageUrl"
      />
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    dataList: {
      type: Array,
      default () {
        return []
      }
    },
    uploadApi: {
      type: Object,
      default () {
        return {}
      }
    },
    auth: {
      type: Object,
      default () {
        return {}
      }
    },
    config: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      isUploading: false,
      upload: {},
    }
  },
  async created () {
    let { urlApi, apiGroup } = this.libs.configProject
    let { method, url, group } = this.uploadApi
    let _group = group ? apiGroup[group] : ''
    let action = urlApi + _group + url // + '?' + encodeURI(_keyValue)
    // if (url.startsWith('http')) action = url
    this.upload = {
      // accept: ".mp4,.flv,.mov,.mp3",
      // 上传的地址
      data: {},
      action,
      // 设置上传的请求头部
      headers: this.globalData.headers,
      // 设置上传请求方法
      method,
      //是否支持多选文件
      multiple: true,
      // 是否禁用上传
      disabled: false,
      // 上传的文件列表 有默认列表的情况未处理 todo
      fileList: JSON.parse(JSON.stringify(this.dataList)),
      beforeUpload: async () => {
        // console.log('beforeUpload未定义');
        return true
      },
      // 文件上传中处理
      onProgress: (event, file, fileList) => {
        // console.log('文件上传中处理', event, file, fileList)
      },
      // 文件上传成功处理
      onSuccess: async (response, file, fileList) => {
        // console.log('文件上传成功处理', response, file, fileList)
        this.finishUpload()
      },
      //文件上传失败
      onError: async (response, file, fileList) => {
        // console.log('文件上传失败', response, file, fileList)
      },
      onPreview: (file) => {
        console.log(file.url);
        this.dialogImageUrl = file.url || file.response.data.fileUrl
        this.dialogVisible = true
      },
      onRemove: (file, fileList) => {
        console.log('onRemove', file, fileList)
      },
      onChange: (file, fileList) => {
        console.log('onChange', file, fileList)

        let fileReader = new FileReader()
        fileReader.readAsDataURL(file.raw)
        fileReader.onload = e => this.videoDataUrl = e.currentTarget.result
        this.upload.fileList = fileList
      },
      onExceed: (files, fileList) => {
        // console.log('onExceed', this.config.autoUpload, files, fileList);
        fileList.shift()
        this.$refs.upload.handleStart(files[0])
        if (this.config.autoUpload) this.submitUpload()
      },
      // 自动上传
      autoUpload: false,
      // 文件列表的类型 'text' | 'picture' | 'picture-card'
      listType: 'text',
      ...this.config
    }
  },
  // computed: {},
  // watch: {
  //   dataList: {
  //     handler: function () {
  //       this.upload.fileList = JSON.parse(JSON.stringify(this.dataList))
  //     },
  //     deep: true
  //   },
  // },
  methods: {
    // 文件提交处理
    async submitUpload () {
      let readyList = this.upload.fileList.filter(item => item.status === "ready")
      if (!readyList.length) return this.$emit('close')
      this.isUploading = true
      this.$refs.upload.submit()
      this.isUploading = false
    },
    finishUpload () {
      let readyList = this.upload.fileList.filter(item => item.status === "ready")
      console.log(this.upload.fileList, readyList, readyList.length);
      if (readyList.length) return

      this.$emit('finish', this.upload.fileList)
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-upload-list) {
  min-height: 300px;
  .el-upload-list__item-name {
    line-height: 2.5;
    font-size: 18px;
  }
}
</style>
