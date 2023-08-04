<template>
  <el-descriptions
    :column="1"
    border
  >
    <el-descriptions-item
      :label="col.label"
      v-for="col in infoKeys"
      :key="col.prop"
    >
      <xnwFromComponent
        :col="col"
        :form="form"
      />
    </el-descriptions-item>
  </el-descriptions>
</template>
<script>

import mixin from '@/views/index/mixin.js'
export default {
  name: 'addServer',
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
        {
          prop: 'schemeType', label: '服务类型',
          type: 'radio',
          repeat: []
        },
        {
          prop: 'schemeName', label: '选择服务',
          type: 'select',
          repeat: [{ options: [] }]
        },
        { prop: 'schemeTime', label: '单次服务时长', type: 'word' },
        { prop: 'schemeEquipment', label: '使用设备', type: 'word' },
        { prop: 'serverTimes', label: '服务次数', type: 'number', config: { min: 1, max: 100 } },
        {
          prop: 'pasterType', label: '选择耗材',
          type: 'select',
          repeat: [
            {
              options: [
                { label: '请选择', value: '' },
                { label: 'A', value: 'a' },
                { label: 'B', value: 'b' }
              ]
            }
          ]
        },
        {
          prop: 'diseaseType', label: '病种类型', type: 'input',
          repeat: [
            { prop: 'diseaseType' }
          ]
        },
        {
          prop: 'doctorName', label: '开单人', type: 'input',
          repeat: [
            { prop: 'doctorName' }
          ]
        },
        { prop: 'orderTime', label: '开单时间', type: 'dateTimePicker', config: { type: 'date' } },
        { prop: 'effectiveDate', label: '服务有效期', type: 'dateTimePicker', config: { type: 'daterange' } },
        { prop: 'userName', label: '服务对象', type: 'word' }
      ],
      form: {
        schemeType: '杉山服务',
        schemeName: '',
        serverTimes: 1,
        schemeTime: '',
        schemeEquipment: '',
        effectiveDate: '',
        pasterType: '',
        diseaseType: '',
        doctorName: '',
        orderTime: '',
        userName: ''
      }
    }
  },
  created () {
    this.setSchemeList(this.form, this.infoKeys)
    this.form.userName = this.data.userName
  },
  watch: {
    'form.schemeType': {
      handler () {
        this.form.schemeTime = ''
        this.form.schemeName = ''
        this.form.schemeEquipment = ''
        this.setSchemeList(this.form, this.infoKeys)
      },
      deep: true
    },
    'form.schemeName': {
      handler () {
        let { schemeTime, schemeEquipment } = this.schemeList.find(item => item.value === this.form.schemeName) || {}
        this.form.schemeTime = schemeTime
        this.form.schemeEquipment = schemeEquipment
      },
      deep: true
    }
  }
}
</script>