<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <el-descriptions
      :column="1"
      border
    >
      <el-descriptions-item
        :label="col.label"
        v-for="col in infoKeys"
        :key="col.prop"
        v-bind="col.config"
      >
        <xnwFromComponent
          :col="col"
          :form="form"
        />

      </el-descriptions-item>

      <el-descriptions-item label="签名">
        <upload-file
          :uploadApi="api.andrology.file.updateFile"
          @finish="finish"
          :config="uploadConfig"
          :dataList="form.userSignatureUrl?[{url:form.userSignatureUrl}]:[]"
        />
      </el-descriptions-item>
    </el-descriptions>
    <div class="formFooter">
      <button
        class="btn"
        @click="$emit('close')"
      >取消</button>
      <button
        class="btn primary"
        @click="confirm"
      >{{type === 'add'?'创建':'保存'}}</button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
    },
    type: {
      type: String,
      default: () => 'add'
    }
  },
  data () {
    return {
      showDialog: false,
      width: '800px',
      infoKeys: [{
        prop: 'userName', label: '姓名', type: 'input', repeat: [{ prop: 'userName' }]
      }, {
        prop: 'userPhone', label: '手机号', type: 'input', repeat: [{ prop: 'userPhone' }]
      }, {
        prop: 'userEmail', label: '电子邮箱', type: 'input', repeat: [{ prop: 'userEmail' }]
      }, {
        prop: 'userWeixin', label: '微信号', type: 'input', repeat: [{ prop: 'userWeixin' }]
      }, {
        prop: 'userPosition', label: '身份', type: 'radio', repeat: [
          { label: '医生', value: '医生' },
          { label: '研究员', value: '研究员' },
          { label: '技师', value: '技师' },
          { label: '其他', value: '其他' }
        ]
      }, {
        prop: 'userTitle', label: '头衔', type: 'input', repeat: [{ prop: 'userTitle' }]
      }],
      form: {
        userName: '',
        userPhone: '',
        userEmail: '',
        userWeixin: '',
        userPosition: '',
        userTitle: '',
        userSignatureUrl: ''
      },
      uploadConfig: { listType: 'picture-card', multiple: false, autoUpload: true, limit: 1 }
    }
  },
  async created () {
    this.form = (await this.request(this.api.andrology.user.getUserInfo)).data
    this.showDialog = true
  },
  methods: {
    async confirm () {
      let res = await this.request(this.api.andrology.user.modifyUserInfo, this.form)
      if (res.code !== 200) return
      this.$emit('close')
    },
    async finish (fileList) {
      console.log(fileList);
      this.form.userSignatureUrl = fileList[0].response.data.fileUrl
    }
  }
}
</script>