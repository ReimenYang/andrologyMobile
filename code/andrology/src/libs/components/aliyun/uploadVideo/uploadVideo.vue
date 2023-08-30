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
          上传文件
        </button>
      </slot>
    </el-upload>
    <div class="formFooter">
      <button
        class="btn"
        @click="$emit('close')"
      >取消</button>
      <button
        class="btn primary"
        v-if="!upload.autoUpload"
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
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>

import './sdk/lib/aliyun-oss-sdk-6.17.1.min.js'
import './sdk/aliyun-upload-sdk-1.5.5.min'
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
      // auth: {},
      uploader: {}
    }
  },
  async created () {
    let { urlApi, apiGroup } = this.libs.configProject
    let { method, url, group } = this.uploadApi
    let _group = group ? apiGroup[group] : ''
    let action = urlApi + _group + url // + '?' + encodeURI(_keyValue)
    // if (url.startsWith('http')) action = url
    this.upload = {
      accept: ".mp4,.flv,.mov,.mp3",
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
      },
      //文件上传失败
      onError: async (response, file, fileList) => {
        // console.log('文件上传失败', response, file, fileList)
      },
      onPreview: (file) => {
        this.dialogImageUrl = file.response.url
        this.dialogVisible = true
      },
      onRemove: (file, fileList) => {
        // console.log('onRemove', file, fileList)
      },
      onChange: (file, fileList) => {
        console.log('onChange', file, fileList)

        let fileReader = new FileReader()
        fileReader.readAsDataURL(file.raw)
        fileReader.onload = e => this.videoDataUrl = e.currentTarget.result
        this.videoData = file
        console.log(file.size / 1024 / 1024)
        this.uploader.addFile(file.raw, null, null, null, '{"Vod":{}}');
        this.upload.fileList = fileList
      },
      // 自动上传
      autoUpload: false,
      // 文件列表的类型 'text' | 'picture' | 'picture-card'
      listType: 'text',
      ...this.config
    }
    this.uploader = new AliyunUpload.Vod({
      //userID，必填，您可以使用阿里云账号访问账号中心（https://account.console.aliyun.com/），即可查看账号ID
      userId: "1711986291337316",
      //上传到视频点播的地域，默认值为'cn-shanghai'，
      //eu-central-1，ap-southeast-1
      region: "cn-shenzhen",
      //分片大小默认1 MB，不能小于100 KB（100*1024）
      partSize: 1048576,
      //并行上传分片个数，默认5
      parallel: 5,
      //网络原因失败时，重新上传次数，默认为3
      retryCount: 3,
      //网络原因失败时，重新上传间隔时间，默认为2秒
      retryDuration: 2,
      //开始上传
      'onUploadstarted': async uploadInfo => {
        console.log('onUploadstarted', uploadInfo);

        this.uploader.setUploadAuthAndAddress(uploadInfo, this.auth.uploadAuth, this.auth.uploadAddress, this.auth.videoId)
        await this.request(this.api.andrology.projectMgt.addProjectVideo, { videoName: "string.mp4", aliyunVideoId: this.auth.videoId })
      },
      //文件上传成功
      'onUploadSucceed': async uploadInfo => {
        console.log('onUploadSucceed1111', uploadInfo);
        let _file = this.upload.fileList.find(item => item.uid === uploadInfo.file.uid)
        if (_file) _file.status = 'succeed'
        this.finishUpload()
      },
      //文件上传失败
      'onUploadFailed': (uploadInfo, code, message) => {
        console.log('onUploadFailed', uploadInfo, code, message);
        this.finishUpload()
      },
      //文件上传进度，单位：字节
      'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
        console.log('onUploadProgress', uploadInfo, totalSize, loadedPercent);
      },
      //上传凭证或STS token超时
      'onUploadTokenExpired': function (uploadInfo) {
        console.log('onUploadTokenExpired', uploadInfo);
      },
      //全部文件上传结束
      'onUploadEnd': function (uploadInfo) {
        console.log('onUploadEnd', uploadInfo);
      }
    });
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
      await this.uploader.startUpload()
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
