<template>
  <div class="studio">
    <div class="top">
      <div class="img"><el-image :src="logo" @click="handlePicturePreview({ url: this.logo })"></el-image></div>
      <div class="hospital">
        <div class="name">{{ list.hospitalName }}</div>
        <div>医院地址: {{ list.address }}</div>
        <div>联系电话：{{ list.phone }}</div>
      </div>
    </div>
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="预约公告" name="booking">
          <div class="switch">
            <span class="txt">是否发布:</span>
            <el-switch v-model="list.isSend" active-color="#4d88f9" inactive-color="#999">
            </el-switch>
          </div>
          <div class="inputSet">
            <el-input type="textarea" :maxlength="500" :rows="6" placeholder="所有患者在进入治疗预约时将收到发布的公告内容。"
              v-model="list.notice">
            </el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="单位信息" name="unit" class="unit">
          <div class="logo">
            <span class="logotitle">医院logo:</span>
            <el-upload action="https://testbl.xinuowang.com/pigx-admin/v1/api/sys-file/upload3bucket/product-public"
              listType="picture-card" :onRemove="handleRemove" :onPreview="handlePicturePreview" :limit="1"
              :beforeUpload="beforeUpload" :onSuccess="handleAvatarSuccess" :headers="globalData.headers"
              :fileList="fileList">
              <i class="iconfont icon-plus" />
            </el-upload>
          </div>
          <div class="formSet">
            <el-form :column="1" border>
              <el-form-item :label="col.label" v-for="col in infoKeys" :key="col.prop">
                <xnwFromComponent :col="col" :form="form" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>


      </el-tabs>
    </div>
    <div class="btn"><el-button type="primary" @click="saveClick">保存</el-button></div>
    <el-dialog v-model="dialogVisible">
      <el-image width="250px" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'booking',
      textarea: '',
      infoKeys: [
        { prop: 'hospitalName', label: '医院名称', type: 'input', repeat: [{ prop: 'hospitalName', placeholder: '请输入医院名称', maxlength: 50 }] },
        { prop: 'address', label: '医院地址', type: 'input', repeat: [{ prop: 'address', placeholder: '请输入医院地址', maxlength: 50 }] },
        { prop: 'phone', label: '联系电话', type: 'input', repeat: [{ prop: 'phone', placeholder: '请输入联系电话', maxlength: 12 }] },
      ],
      list: {},
      logo: '',
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: '',
      form: {
        hospitalName: '',
        address: '',
        phone: ''
      },
    }
  },
  async created () {
    this.studioId = this.globalData.studioId
    this.project = this.globalData.project
    await this.init()
  },
  methods: {
    async init () {
      let data = (await this.request(this.api.sms.studioHomePage.getByStudioId, { studioId: this.studioId })).data
      this.list = data || {}
      if (!this.list) return
      if (this.list.isSend === 'Y') this.list.isSend = true
      else this.list.isSend = false
      this.logo = JSON.parse(JSON.stringify(this.list.logo))
      if (this.fileList.length === 0) this.fileList.push({ url: this.logo })
      this.form = JSON.parse(JSON.stringify(this.list))
    },

    async saveClick () {
      if (!this.list.logo) return this.$message({ message: '请上传医院logo图片', type: 'info' })
      // if (!this.list.notice) return this.$message({ message: '请填写医院公告', type: 'info' })
      if (!this.form.hospitalName) return this.$message({ message: '请填写医院名称', type: 'info' })
      if (!this.form.address) return this.$message({ message: '请填写医院地址', type: 'info' })
      // if (!this.form.phone) return this.$message({ message: '请填写医院电话', type: 'info' })
      let { hospitalName, address, phone, id } = this.form
      let params = { studioId: this.studioId, logo: this.list.logo, isSend: this.list.isSend ? 'Y' : 'N', notice: this.list.notice, hospitalName, address, phone, id }
      let data = (await this.request(this.api.sms.studioHomePage[this.list.id ? 'updateById' : 'save'], { ...params }))
      if (data.data) this.$message({ message: data.msg, type: 'success' })
      this.list.logo = ''
      await this.init()
      // console.log(data, params, 89898);
    },
    handleClick (tab, event) {
      console.log(tab, event, tab.props, tab.props.name);
    },
    async handleRemove (file) {
      this.list.logo = ''
      console.log(file)
    },
    handlePicturePreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 20
      if (!isLt2M) {
        this.$message.error('上传logo图片大小不能超过 20MB!')
      }
      return isLt2M
    },
    async handleAvatarSuccess (response, file) {
      this.list.logo = response.data.url
      // console.log(response, file, 9911, this.list.logo)
    },
  }
}
</script>
<style lang="scss" scoped>
.studio {
  padding: 0 10px;

  .top {
    width: 35%;
    padding-top: 20px;
    display: flex;
    justify-content: space-around;

    .img {
      width: 150px;
      height: 150px;
      object-fit: cover;

      :deep(.el-image) {
        width: 100%;
        height: 100%;
      }
    }

    .hospital {
      color: #999;
      line-height: 1.5;
      font-size: 14px;

      .name {
        font-size: 18px;
        color: #000;
      }
    }

  }

  .tab {
    margin-top: 30px;

    .switch {
      color: #999;

      .txt {
        margin-right: 10px;
      }
    }

    .unit {
      color: #999;

      .logo {
        display: flex;

        .logotitle {
          margin-right: 10px;
        }
      }

      .formSet {
        margin-top: 30px;

        :deep(.el-input) {
          width: 500px;
        }
      }
    }


  }

  .btn {
    margin-top: 60px;
    display: flex;
    justify-content: end;

    :deep(.el-button) {
      margin-right: 30px;
      width: 100px;
    }
  }
}
</style>