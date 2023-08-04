<template>
  <!-- 多选 -->
  <el-checkbox-group
    v-if="col.type === 'checkbox'"
    v-model="form[col.prop]"
    v-bind="col.config"
  >
    <el-checkbox
      v-for="item in col.repeat"
      :key="item.value"
      v-bind="item"
      :name="col.prop"
    />
  </el-checkbox-group>

  <!-- 单选 -->
  <el-radio-group
    v-if="col.type === 'radio'"
    v-model="form[col.prop]"
    v-bind="col.config"
    @change="showData"
  >
    <el-radio
      v-for="item in col.repeat"
      :key="item.value"
      v-bind="item"
      :name="col.prop"
    />
  </el-radio-group>

  <!-- 开关组件 -->
  <div v-if="col.type === 'switch'">
    <el-switch
      v-for="(item, i) in col.repeat"
      :key="i"
      v-model="form[item.prop || col.prop]"
      v-bind="item.config"
    />
  </div>

  <!-- 输入 -->
  <div v-if="col.type === 'input'">
    <el-input
      v-for="(item, i) in col.repeat"
      :key="i"
      v-model.trim="form[item.prop || col.prop]"
      v-bind="item"
    />
  </div>

  <!-- 多行文本 -->
  <div v-else-if="col.type === 'textarea'">
    <el-input
      type="textarea"
      v-model.trim="form[col.prop]"
      v-bind="col.config"
    />
  </div>

  <!-- 下拉 -->
  <div v-if="col.type === 'select'">
    <el-select
      v-for="(item, i) in col.repeat"
      :key="i"
      v-model="form[item.prop || col.prop]"
      v-bind="item"
      @change="item.onChange"
    >
      <el-option
        v-for="option in item.options"
        :key="option.value"
        v-bind="option"
      />
    </el-select>
  </div>

  <!-- 数字输入框 -->
  <div v-if="col.type === 'number'">
    <el-input-number
      v-model="form[col.prop]"
      v-bind="col.config"
      @input="n=>col.onInput(n,col)"
    />
  </div>

  <!-- 时间选择 -->
  <div v-if="col.type === 'dateTimePicker'">
    <el-date-picker
      v-model="form[col.prop]"
      v-bind="col.config"
    />
  </div>

  <!-- 滑块 -->
  <div v-if="col.type==='slider'">
    <el-slider
      v-model="form[col.prop]"
      v-bind="col.config"
    >
    </el-slider>
  </div>

  <!-- 标签 -->
  <div v-if="col.type === 'tag'">
    <el-tag
      v-for="(item, i) in col.repeat"
      :key="i"
      v-bind="item.tagType(form[item.prop || col.prop])"
    >{{
      item.setLabel(form[item.prop || col.prop]) }}</el-tag>
  </div>

  <!-- 文本 -->
  <div
    v-if="!col.type || col.type === 'word'"
    v-bind="col.config"
  >{{ form[col.prop] }}</div>

  <!-- 对象 设置了层级限制 -->
  <div v-if="col.type === 'object' && count < 4">
    <el-collapse>
      <el-collapse-item title="对象设置">
        <xnw-template-form
          ref="object"
          :data="form"
          :repeat="formRepeat"
          :fromProp="fromProp"
          :gutter="gutter"
          :count="count + 1"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>

export default {
  name: 'xnwFromComponent',
  props: {
    col: {
      type: Object,
      default () {
        return {
          prop: 'schemeType', label: '服务类型',
          type: 'radio',
          repeat: [
            { label: '杉山服务', value: 'shanshan' },
            { label: '其他服务', value: 'other' }
          ]
        }
        // {
        //   label: '使用设备',
        //   type: 'switch',
        //   prop: 'schemeEquipment',
        //   span: 8,
        //   repeat: [
        //     {
        //       prop: 'schemeEquipment',
        //       options: [],
        //       config: {
        //         activeText: '设备A',
        //         inactiveText: '设备B'
        //       }
        //     }
        //   ]
        // }
        // {
        //   prop: 'schemeName', label: '选择服务',
        //   type: 'select',
        //   repeat: [
        //     {
        //       options: [{ label: '请选择', value: '' },
        // { label: '盆底康复', value: 'pe' },
        // { label: '腹直肌锻炼', value: 'm' }]
        //     }
        //   ]
        // }
        // { prop: 'serverTimes', label: '服务次数', type: 'number', config: { min: 1,max:100 } }
        // { prop: 'effectiveDate', label: '服务有效期', type: 'dateTimePicker', config: { type: 'daterange' } }
        // {
        //   prop: 'pasterType', label: '选择耗材',
        //   type: 'select',
        //   repeat: [
        //     {
        //       options: [
        //         { label: '请选择', value: '' },
        //         { label: 'A', value: 'a' },
        //         { label: 'B', value: 'b' }
        //       ]
        //     }
        //   ]
        // }
        // {
        //   prop: 'diseaseType', label: '病种类型', type: 'input',
        //   repeat: [
        //     { prop: 'diseaseType' }
        //   ]
        // }
        // {
        //   prop: 'doctorName', label: '开单人', type: 'input',
        //   repeat: [
        //     { prop: 'doctorName' }
        //   ]
        // }
        // { prop: 'orderTime', label: '开单时间', type: 'dateTimePicker', config: { type: 'date' } }
        // {          prop: 'userName', label: '服务对象', type: 'word'      }
      }
    },
    form: {
      type: Object,
      default () { return { schemeType: '杉山服务', serverTimes: 1, effectiveDate: '', schemeName: '', pasterType: '', diseaseType: '', doctorName: '', orderTime: '', userName: '' } }
    }
  },
  methods: {
    showData () {
      console.log(this.form, this.col.prop, this.form[this.col.prop])
    }
  }
}
</script>