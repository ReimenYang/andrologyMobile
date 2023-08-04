<template>
  <el-descriptions :column="1" border>
    <el-descriptions-item :label="col.label" v-for="col in infoKeys" :key="col.prop">
      <xnwFromComponent :col="col" :form="form" />
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>

import mixin from '@/views/index/mixin.js'
export default {
  name: 'updateEquipment',
  props: {
    data: {
      type: Object,
      default () { return {} }
    }
  },
  mixins: [mixin],
  data () {
    return {
      infoKeys: [
        { prop: 'deviceType', label: '设备名称', type: 'input', repeat: [{ prop: 'deviceType', placeholder: '请输入设备的名称，如xx设备1号机' }] },
        // { prop: 'delFlag', label: '是否启用', type: 'switch', repeat: [{ prop: 'delFlag', options: [], config: {} }] },
        { prop: 'sort', label: '排序', type: 'number', config: { min: 1, max: 100 }, repeat: [{ prop: 'sort', placeholder: '按先大后小排序' }] },
        { prop: 'brand', label: '品牌', type: 'input', repeat: [{ prop: 'brand', placeholder: '请输入设备类型的名称' }] },
        { prop: 'model', label: '型号', type: 'input', repeat: [{ prop: 'model', placeholder: '请输入设备类型的名称' }] },
        { prop: 'location', label: '位置', type: 'input', repeat: [{ prop: 'location', placeholder: '请输入设备类型的名称' }] },
      ],
      form: {
        deviceType: '',
        delFlag: true,
        sort: 1,
        brand: '',
        model: '',
        location: ''
      }
    }
  },
  created () {
    if (this.data.deviceType) for (let name in this.data) this.form[name] = this.data[name]
    this.form.delFlag = this.data.status !== '关闭'
    this.setSchemeList(this.form, this.infoKeys)
  }
}
</script>