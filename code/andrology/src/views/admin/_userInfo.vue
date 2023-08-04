<template>
  <div class="userInfo">
    <el-descriptions border>
      <el-descriptions-item
        label="用户名称"
        width="120"
      >{{ userInfo.userName }}</el-descriptions-item></el-descriptions>
    <div class="title">项目记录</div>
    <service-item
      v-for="item in userInfo.serviceList"
      :key="item.id"
      :data="item"
    />
  </div>
</template>
<script>

import json from '@/json/user.js'
import serviceItem from './_serviceItem.vue'
export default {
  name: 'addServer',
  components: { serviceItem },
  props: {
    data: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      userInfo: json.userInfo
    }
  },
  methods: {
    edit () {
      this.form.effectiveDateFormat = this.form.effectiveDate.map(str => new Date(str))
      this.form.orderTime = new Date(this.form.orderTime)
      this.infoKeys.forEach(item => item.type = this.infoKeysDefaultType[item.prop])
      this.tableHeader.push(
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '删除', click: this.rowClick, bind: { round: true, type: "primary" }, condition: item => item.status === '待预约' }
          ]
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  margin-top: 1em;
  font-size: var(--font-h3);
}
</style>