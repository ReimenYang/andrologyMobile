<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <ul style="font-size: 16px;line-height: 2;margin-bottom: 20px;">
      <li>温馨提示</li>
      <li>1. 请将数据填充至导入模板后，上传文件</li>
      <li>2. 提交后，请稍后到“导入结果”中查看</li>
    </ul>
    <upload-file
      :uploadApi="api.andrology.data.importQuestionnaire"
      :config="config"
      @finish="finish"
    />
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => '新增'
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
      showDialog: true,
      width: '600px'
    }
  },
  methods: {
    async finish () {
      this.$emit('close')
    }
  }
}
</script>