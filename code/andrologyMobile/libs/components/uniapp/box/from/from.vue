<template>
  <view class="form">
    <!-- #ifdef MP-WEIXIN  -->
    <view
      v-for=" item in configs.data"
      :key="item.title"
      :class="'formGroup ' + (!!(item.onclick || item.picker || item.link) && 'more ') + item.setClass"
      :style="item.style"
      @click="onclick(item)"
    >
      <view class="title">
        {{ item.title }}
      </view>
      <view class="txt">
        <!-- 数字控件 -->
        <xnw-number
          v-if="item.number"
          :min="item.number.min"
          :max="item.number.max"
          :step="item.number.step"
          :typeDisabled="item.number.typeDisabled"
          :style="item.number.style"
          :value="item.number.value"
          :disabled="item.number.disabled"
          @change="val=> onchange(val,item,{},'number')"
          @minus="val => onMinus(val,item)"
          @plus="val => onPlus(val,item)"
        />
        <!-- 输入框控件 -->
        <input
          class="input"
          v-else-if="item.input"
          :placeholder="item.input.placeholder"
          v-model="item.input.value"
          :password="item.input.password"
          @input="(e)=>oninput('',item,e,'input')"
          @focus="(e)=>oninput('',item,e,'focus')"
          @blur="(e)=>oninput('',item,e,'blur')"
          @confirm="(e)=>oninput('',item,e,'confirm')"
          @keyboardheightchange="(e)=>oninput('',item,e,'keyboardheightchange')"
        >
        <!-- 多选控件 -->
        <checkbox-group
          @change="(e)=>onchange('',item,e,'checkbox')"
          class="checkbox"
          v-else-if="item.checkbox"
        >
          <label
            class="label"
            v-for="obj in item.checkbox.data"
            :key="obj.value"
          >
            <checkbox
              :label="obj.label"
              :value="obj.value"
              :disabled="obj.disabled"
              :checked="obj.checked"
              :color="obj.color"
              :style="obj.style"
              class="checkbox"
            />
            <text class="text">{{ obj.label }}</text>
          </label>
        </checkbox-group>
        <!-- 单选控件 -->
        <radio-group
          @change="(e)=>onchange('',item,e,'radio')"
          class="radio"
          v-else-if="item.radio"
        >
          <label
            class="label"
            v-for="obj in item.radio.data"
            :key="obj.value"
          >
            <radio
              :label="obj.label"
              :value="obj.value"
              :disabled="obj.disabled"
              :checked="obj.checked"
              :color="obj.color"
              :style="obj.style"
              class="radio"
            />
            <text class="text">{{ obj.label }}</text>
          </label>
        </radio-group>
        <!-- 开关 -->
        <switch
          class="switch"
          :checked="item.checked"
          :style="item.style"
          v-else-if="item.switch"
          @change="(e)=>onchange('',item,e,'switch')"
        />
        <!-- 文本域控件 -->
        <textarea
          class="textarea"
          v-else-if="item.textarea"
          :placeholder="item.textarea.placeholder"
          v-model="item.textarea.value"
          @input="(e)=>ontextarea('',item,e,'input')"
          @focus="(e)=>ontextarea('',item,e,'focus')"
          @blur="(e)=>ontextarea('',item,e,'blur')"
          @confirm="(e)=>ontextarea('',item,e,'confirm')"
          @keyboardheightchange="(e)=>ontextarea('',item,e,'keyboardheightchange')"
          @linechange="(e)=>ontextarea('',item,e,'linechange')"
        />
        <!-- 链接 -->
        <view
          class="link"
          v-else-if="item.link"
          @click="onclick(item,'link')"
        >
          {{ item.link.label }}
        </view>
        <!-- 文本 -->
        <view
          class="text"
          v-else
        >
          {{ item.textContent }}
        </view>
      </view>
    </view>
    <!-- #endif -->

    <!-- #ifndef MP-WEIXIN  -->
    <!-- 小程序不支持v-bind,临时屏蔽 -->
    <view
      v-for=" item in config.data"
      :key="item.title"
      :class="getFromGroupClass(item)"
      :style="item.style"
      @click="onclick(item)"
    >
      <view class="title">
        {{ item.title }}
      </view>
      <view class="txt">
        <!-- 数字控件 -->
        <xnw-number
          v-if="item.number"
          :min="item.number.min"
          :max="item.number.max"
          :step="item.number.step"
          :typeDisabled="item.number.typeDisabled"
          :style="item.number.style"
          :value="item.number.value"
          :disabled="item.number.disabled"
          @change="val=> onchange(val,item,{},'number')"
          @minus="val => onMinus(val,item)"
          @plus="val => onPlus(val,item)"
        />
        <!-- 文本域控件 -->
        <textarea
          class="textarea"
          v-else-if="item.textarea"
          v-bind="item.textarea"
          v-model="item.textarea.value"
          @input="(e)=>ontextarea('',item,e,'input')"
          @focus="(e)=>ontextarea('',item,e,'focus')"
          @blur="(e)=>ontextarea('',item,e,'blur')"
          @confirm="(e)=>ontextarea('',item,e,'confirm')"
          @keyboardheightchange="(e)=>ontextarea('',item,e,'keyboardheightchange')"
          @linechange="(e)=>ontextarea('',item,e,'linechange')"
        />
        <!-- 输入框控件 -->
        <input
          class="input"
          v-else-if="item.input"
          v-bind="item.input"
          v-model="item.input.value"
          :password="item.input.password"
          @input="(e)=>oninput('',item,e,'input')"
          @focus="(e)=>oninput('',item,e,'focus')"
          @blur="(e)=>oninput('',item,e,'blur')"
          @confirm="(e)=>oninput('',item,e,'confirm')"
          @keyboardheightchange="(e)=>oninput('',item,e,'keyboardheightchange')"
        >
        <!-- 多选控件 -->
        <checkbox-group
          @change="(e)=>onchange('',item,e,'checkbox')"
          class="checkbox"
          v-else-if="item.checkbox"
        >
          <label
            class="label"
            v-for="obj in item.checkbox.data"
            :key="obj.value"
          >
            <checkbox
              v-bind="obj"
              class="checkbox"
            />
            <text class="text">{{ obj.label }}</text>
          </label>
        </checkbox-group>
        <!-- 单选控件 -->
        <radio-group
          @change="(e)=>onchange('',item,e,'radio')"
          class="radio"
          v-else-if="item.radio"
        >
          <label
            class="label"
            v-for="obj in item.radio.data"
            :key="obj.value"
          >
            <radio
              v-bind="obj"
              class="radio"
            />
            <text class="text">{{ obj.label }}</text>
          </label>
        </radio-group>
        <!-- 开关 -->
        <switch
          class="switch"
          v-bind="item.switch"
          v-else-if="item.switch"
          @change="(e)=>onchange('',item,e,'switch')"
        />
        <!-- 选择控件 -->
        <picker
          v-else-if="item.picker"
          v-bind="item.picker"
          @change="(e)=>onchange('',item,e,'picker')"
        >
          <view class="picker">
            {{ item.picker.range[item.picker.value]||'请选择' }}
          </view>
        </picker>

        <!-- 日期选择控件 -->
        <picker
          v-else-if="item.datePicker"
          mode="date"
          v-bind="item.datePicker"
          @change="(e)=>onchange('',item,e,'datePicker')"
        >
          <view class="datePicker">
            {{ item.datePicker.value||'请选择' }}
          </view>
        </picker>
        <!-- 链接 -->
        <view
          class="link"
          v-else-if="item.link"
          v-bind="item.link"
          @click="onclick(item.link)"
        >
          {{ item.link.label }}
        </view>
        <!-- 文本 -->
        <view
          class="text"
          v-else
        >
          {{ item.textContent }}
        </view>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  name: 'XnwFrom',
  props: {
    /**
     * 设置from的对象数据，key是输出对像的字段名
     */
    config: {
      type: Object,
      default: () => {
        return {
          data: [{
            key: 'id', title: '数字控件', setClass: '', style: '',
            number: { value: 2, min: 1, max: 3, disabled: false, change: (val) => console.log('数字控件', val) }
          }, {
            key: 'info', title: '描述', setClass: '', style: '',
            textarea: { value: '傲娇妹子一枚', maxlength: '500', placeholder: '请描述', input: (val) => console.log('描述', val) }
          }, {
            key: 'name', title: '输入框', setClass: '', style: '',
            input: { value: '张三', placeholder: '请输入', input: (val) => console.log('输入框', val) }
          }, {
            key: 'isBaby', title: '开关', setClass: '', style: '',
            switch: { checked: true, disabled: false, color: 'red', style: 'transform:scale(0.7)', change: (val) => console.log('开关', val) }
          }, {
            key: 'hobby', title: '复选框', setClass: '', style: '',
            checkbox: {
              data: [
                { label: '撒娇', value: '1', disabled: false, checked: false, color: 'red', style: 'transform:scale(0.7)' },
                { label: '烹饪', value: '2', disabled: false, checked: false, color: 'red', style: 'transform:scale(0.7)' }
              ],
              change: (val) => console.log('复选框', val)
            }
          }, {
            key: 'sex', title: '单选框', text: '', setClass: '', style: '',
            radio: {
              data: [
                { label: '男', value: '1', disabled: false, checked: false, color: 'red', style: 'transform:scale(0.7)' },
                { label: '女', value: '2', disabled: false, checked: false, color: 'red', style: 'transform:scale(0.7)' }
              ],
              change: (val) => console.log('单选框', val)
            },
          }, {
            key: 'city', title: '选择', setClass: '', style: '',
            picker: { value: 1, mode: 'selector', range: ['广州', '深圳', '顺德'], disabled: false, change: (val) => console.log('选择', val) }
          }, {
            key: 'blog', title: '链接', setClass: '', style: '',
            link: { label: '微博昵称', url: '/?a=1' }
          }]
        }
      }
    },
    wxConfig: {
      type: String,
      default: ''
    },
    /**
     * config.data里面的对象的值是否与控件的表现同步
     */
    autoValue: {
      type: Boolean,
      default: () => true
    },
  },
  data () {
    return {
      configs: { data: [] }
    }
  },
  created () {
    this.configs = this.config
    // #ifdef MP-WEIXIN
    // 微信小程序
    // 经过多重传值会丢失绑定关系，方法也会丢失
    // 当变量处理比较复杂的情况下，this.globalData[this.wxConfig]未及时就绪，需要注意时机
    if (this.wxConfig) this.configs = this.globalData.wxPage[this.wxConfig]
    console.log(this.wxConfig, this.config, this.configs)
    // #endif
  },
  // #ifdef MP-WEIXIN
  updated () {
    if (this.wxConfig) this.configs = this.globalData.wxPage[this.wxConfig]
  },
  // #endif
  methods: {
    getFromGroupClass (item) {
      return 'formGroup ' + (!!(item.onclick || item.picker || item.link) && 'more ') + item.setClass
    },
    onclick (item, component) {
      if (item.url) return this.libs.data.page.navigateTo(item.url)
      let onclick = item.onclick
      // #ifdef MP-WEIXIN
      let _item = this.globalData.wxPage[this.wxConfig].data.find(({ key }) => key === item.key)
      onclick = component ? (_item[component].onclick) : _item.onclick
      console.log(_item, item, onclick)
      // #endif
      if (onclick) return onclick(component ? item[component] : item)
    },
    onchange (val, item, e, component) {
      let change = item[component].change
      switch (component) {
        case 'checkbox':
          val = item.checkbox.data.filter(obj => e.detail.value.includes(obj.value))
          if (this.autoValue) item.checkbox.data.forEach(obj => obj.checked = e.detail.value.includes(obj.value))
          break
        case 'radio':
          val = item.radio.data.find(obj => obj.checked) || {}
          if (this.autoValue) item.radio.data.forEach(obj => obj.checked = e.detail.value === obj.value)
          console.log(item, e.detail)
          break
        case 'number':
          if (this.autoValue) item.number.value = val
          break
        case 'switch':
          val = e.detail.value
          if (this.autoValue) item.switch.checked = val
          break
        case 'picker':
          // 这里应该做扩展
          val = item.picker.range[e.detail.value]
          if (this.autoValue) item.picker.value = e.detail.value
          break
        case 'datePicker':
          // 这里应该做扩展
          if (this.autoValue) item.datePicker.value = e.detail.value
          break
        default:
          break
      }
      // #ifdef MP-WEIXIN
      let _item = this.globalData.wxPage[this.wxConfig].data.find(({ key }) => key === item.key)
      change = _item[component].change
      if (this.autoValue) {
        switch (component) {
          case 'checkbox':
            _item.checkbox.data.forEach(obj => obj.checked = e.detail.value.includes(obj.value))
            break
          case 'radio':
            _item.radio.data.forEach(obj => obj.checked = e.detail.value === obj.value)
            break
          case 'number':
            _item.number.value = val
            break
          case 'switch':
            _item.switch.checked = val
            break
          case 'picker':
            item.picker.value = e.detail.value
            break
        }
      }
      console.log(val, item, _item)
      // #endif
      if (change) return change(val, item, e, component, 'change')
    },
    onMinus (val, item) {
      // #ifndef MP-WEIXIN
      if (item.number.onMinus) return item.number.onMinus(val, item, 'minus')
      // #endif
      // #ifdef MP-WEIXIN
      if (this.globalData.currentChange) return this.globalData.currentChange(val, item, 'minus')
      // #endif
    },
    onPlus (val, item) {
      // #ifndef MP-WEIXIN
      if (item.number.onPlus) return item.number.onPlus(val, item, 'plus')
      // #endif
      // #ifdef MP-WEIXIN
      if (this.globalData.currentChange) return this.globalData.currentChange(val, item, 'plus')
      // #endif
    },
    ontextarea (val, item, e, action) {
      switch (action) {
        case 'input':
        case 'confirm':
        case 'focus':
        case 'blur':
        case 'keyboardheightchange':
        case 'linechange':
          val = e.detail
          break
      }
      if (item.textarea[action]) return item.textarea[action](val, item, e, 'textarea', action)
    },
    oninput (val, item, e, action) {
      switch (action) {
        case 'input':
        case 'confirm':
        case 'focus':
        case 'blur':
        case 'keyboardheightchange':
          val = item.text
          break
      }
      if (item.input[action]) return item.input[action](val, item, e, 'input', action)
    },
    getFromData () {
      let fromData = {}
      this.config.data.forEach(item => {
        let _val
        if (item.number) _val = item.number.value
        if (item.textarea) _val = item.textarea.value
        if (item.input) _val = item.input.value
        if (item.switch) _val = item.switch.checked
        if (item.checkbox) _val = item.checkbox.data.filter(obj => obj.checked)
        if (item.radio) _val = item.radio.data.filter(obj => obj.checked)
        if (item.picker) _val = item.picker.range[item.picker.value]
        if (item.link) _val = item.link.label
        fromData[item.key] = _val
      })
      return fromData
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  background: #fff;
  margin-top: 30rpx;
  .formGroup {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: solid 1px #eee;
    .title {
      width: 5em;
      font-size: 32rpx;
    }
    .txt {
      flex: 1;
      font-size: 32rpx;
      text-align: right;
      &.highLight {
        color: #ff3d40;
      }
      &:after {
        display: block;
        content: attr(note);
        font-size: 24rpx;
        color: #999;
      }
      .input {
        width: 100%;
        padding: 5px;
        font-size: 16px;
        line-height: 30px;
        border: solid 1px #ddd;
      }
      .textarea {
        width: 100%;
        height: 150rpx;
        padding: 5px;
        text-align: left;
        border: solid 1px #ddd;
      }
      .checkbox ::v-deep .uni-checkbox-input:hover {
        border-color: inherit;
      }
    }
    &.more:after {
      padding-left: 10rpx;
      align-self: center;
      content: "\e856";
      font-family: "iconfont";
      color: #999;
    }
  }
}
</style>
