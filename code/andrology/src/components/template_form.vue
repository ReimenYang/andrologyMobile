<template>
  <el-form
    ref="form"
    :model="form"
    v-bind="fromProp"
  >
    <el-row
      :gutter="gutter"
      v-for="(row,rowIndex) in formRepeat"
      :key="rowIndex"
    >
      <el-col
        :span="col.span"
        v-for="(col,colIndex) in row"
        :key="colIndex"
      >
        <el-form-item
          :label="col.label"
          v-show="rowShow(col)"
        >
          <xnwFromComponent
            :col="col"
            :form="form"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'XnwTemplateForm',
  props: {
    data: {
      type: Object,
      default () {
        return {
          label: '字典项1',
          prop: 'prop1',
          dataType: 'dateTimePicker',
          defaultValue: 'Y',
          config: {}
        }
      }
    },
    repeat: {
      type: Array,
      default () {
        return [
          [{
            label: '名称',
            type: 'input',
            prop: '',
            span: 24,
            repeat: [
              { type: 'text', prop: 'label' }
            ]
          }], [{
            label: '键名',
            type: 'input',
            prop: '',
            span: 24,
            repeat: [
              { type: 'text', prop: 'prop' }
            ]
          }], [{
            label: '数据类型',
            type: 'radio',
            prop: 'dataType',
            span: 24,
            repeat: [
              { label: '布尔值', value: 'switch' },
              { label: '字符串', value: 'string' },
              { label: '数字', value: 'number' },
              { label: '日期', value: 'dateTimePicker' },
              { label: '对象', value: 'object' },
              { label: '数组', value: 'array' }
            ]
          }], [{
            label: '默认值',
            type: 'switch',
            prop: 'defaultValue',
            span: 24,
            relation: [{ key: 'form.dataType', value: 'switch' }],
            config: { 'activeValue': 'Y', 'inactiveValue': 'N' }
          }], [{
            label: '默认值',
            type: 'input',
            prop: '',
            span: 24,
            relation: [{ key: 'form.dataType', value: 'string' }],
            repeat: [
              { type: 'text', prop: 'defaultValue' }
            ]
          }], [{
            label: '默认值',
            type: 'input',
            prop: '',
            span: 24,
            relation: [{ key: 'form.dataType', value: 'number' }],
            repeat: [
              { type: 'number', prop: 'defaultValue', style: 'width:100px' }
            ]
          }], [{
            label: '控件设置',
            type: 'radio',
            prop: 'config',
            span: 24,
            relation: [{ key: 'form.dataType', value: 'dateTimePicker' }],
            repeat: [
              { label: '日期', value: 'date' },
              { label: '日期范围', value: 'daterange' },
              { label: '时间日期', value: 'datetime' },
              { label: '时间日期范围', value: 'datetimerange' }
            ]
          }], [{
            label: '',
            type: 'object',
            prop: 'config',
            span: 24,
            relation: [{ key: 'form.dataType', value: 'object' }]
          }]
        ]
      }
    },
    fromProp: {
      type: Object,
      default () { return { labelWidth: '80px' } }
    },
    gutter: {
      type: Number,
      default () { return 20 }
    },
    count: {
      type: Number,
      default () { return 1 }
    }
  },
  data () {
    return {
      form: this.data,
      formRepeat: this.repeat
    }
  },
  methods: {
    rowShow (col) {
      return col.relation ? col.relation.filter(condition => this.libs.object.getValue(condition.key, this) === condition.value).length > 0 : true
    }
  }
}
</script>
