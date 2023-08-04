<template>
  <div class="serverItem">
    <el-descriptions
      :column="3"
      border
    >
      <el-descriptions-item
        :label="col.label"
        v-for="col in infoKeys"
        :key="col.prop"
        v-bind="col"
      >
        <xnwFromComponent
          :col="col"
          :form="data"
        />
      </el-descriptions-item>
      <el-descriptions-item label="服务记录">
        <xnw-template-list
          :tableHeader="tableHeader"
          :tableData="data.serviceRecord"
          :style="{width:'960px',height: (data.serviceRecord.length + 2) * 40 + 'px'}"
        >
          <template #default />
        </xnw-template-list>
      </el-descriptions-item>
    </el-descriptions>
    <div class="edit">
      <el-button
        @click="edit"
        v-if="!isEditing"
      >修 改</el-button>
      <el-button
        @click="sumbit"
        type="primary"
        v-if="isEditing"
      >提交修改</el-button>
    </div>
  </div>
</template>
<script>

import mixin from '@/views/index/mixin.js'
export default {
  name: 'serverItem',
  props: {
    data: {
      type: Object,
      default () { return {} }
    }
  },
  mixins: [mixin],
  data () {
    let _tagList = this.statusInit()
    return {
      infoKeys: [
        {
          prop: 'schemeType', label: '服务类型', labelClassName: 'itemLabel',
          // type: 'radio',

          repeat: [],
          config: { style: { width: '200px' } }
        },
        {
          prop: 'schemeName', label: '选择服务', labelClassName: 'itemLabel',
          // type: 'select',
          repeat: [
            {
              style: { width: '150px' },
              options: []
            }
          ]
        },
        {
          prop: 'diseaseType', label: '病种类型', labelClassName: 'itemLabel', //type: 'input',
          repeat: [
            { prop: 'diseaseType' }
          ]
        },
        { prop: 'schemeTime', label: '单次服务时长' },
        { prop: 'schemeEquipment', label: '使用设备' },
        { prop: 'serverTimes', label: '服务次数' },
        {
          prop: 'pasterType', label: '选择耗材',
          // type: 'select',
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
          prop: 'doctorName', label: '开单人', //type: 'input',
          repeat: [{ prop: 'doctorName' }]
        },
        { prop: 'orderTime', label: '开单时间', config: { type: 'date', style: { width: '150px' } } },
        { prop: 'effectiveDateFormat', label: '服务有效期', config: { type: 'daterange' } },
        {
          prop: 'status', label: '服务状态', type: 'tag', repeat: _tagList
        },
        { prop: 'updateTime', label: '更新时间', span: 2 }
      ],
      tableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'status', label: '状态', tag: _tagList },
        { prop: 'bookingTime', label: '预约时间' },
        { prop: 'schemeTime', label: '服务时间' }
      ],
      infoKeysDefaultType: {
        schemeType: 'radio',
        schemeName: 'select',
        diseaseType: 'input',
        schemeTime: 'word',
        schemeEquipment: 'word',
        serverTimes: 'word',
        pasterType: 'select',
        doctorName: 'input',
        orderTime: 'dateTimePicker',
        effectiveDateFormat: 'dateTimePicker',
        status: 'tag',
        updateTime: 'word'
      },
      isEditing: false
    }
  },
  created () {
    this.data.effectiveDateFormat = '从 ' + this.data.effectiveDate.join(' 到 ')
  },

  watch: {
    'data.schemeType': {
      handler () {
        this.data.schemeName = ''
        this.setSchemeList(this.data, this.infoKeys)
      },
      deep: true
    },
    'data.schemeName': {
      handler () {
        let { schemeTime, schemeEquipment } = this.schemeList.find(item => item.value === this.data.schemeName) || {}
        this.data.schemeTime = schemeTime
        this.data.schemeEquipment = schemeEquipment
      },
      deep: true
    }
  },
  methods: {
    edit () {
      this.setSchemeList(this.data, this.infoKeys)
      this.isEditing = true
      this.data.effectiveDateFormat = this.data.effectiveDate.map(str => new Date(str))
      this.data.orderTime = new Date(this.data.orderTime)
      this.infoKeys.forEach(item => item.type = this.infoKeysDefaultType[item.prop])
      this.tableHeader.push(
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '删除', click: this.rowClick, bind: { round: true, type: "primary" }, condition: item => item.status.includes('待预约') }
          ]
        })
    },
    sumbit () {
      this.isEditing = false
      this.tableHeader.pop()
      this.infoKeys.forEach(item => item.type = item.type === 'tag' ? 'tag' : 'word')
      // 模拟数据更新
      this.data.effectiveDateFormat = '从 2023-1-1 到 2023-1-10'
      this.data.orderTime = '2023-8-9'
    }
  }
}
</script>
<style lang="scss" scoped>
.serverItem {
  padding: 1em 0;
  margin: 1em 0;
  border-bottom: var(--border-normal);
}
:deep(.itemLabel) {
  width: 120px;
}
.edit {
  padding: 1em 0 0;
  text-align: center;
}
</style>