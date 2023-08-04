<template>
  <div>
    <!-- 单选 -->
    <radio-group
      @change="radioChange"
      v-if="type==='radio'"
    >
      <div
        v-for="item in optionList"
        :key="item.id"
      >
        <label :class="['optionItem', item.checked === 'Y' && 'selected']">
          <div>
            <radio
              :value="String(item.id)"
              :checked="item.checked === 'Y'"
              class="radio"
            />
          </div>
          <div v-if="item.photoUrl">
            <image
              :src="item.photoUrl"
              mode="aspectFit"
              class="optionImage"
            />
          </div>
          <div
            class="optionText"
            v-if="item"
          >
            <!-- TODO -->
            <!-- 跳：{{ item.gotoQuestionId }} -->
            <!-- 量：{{item.quantizationQuestionnaireId}} -->
            <div>{{ item.optionText }}</div>
            <div class="node">{{ item.note }}</div>
          </div>

        </label>
        <div v-if="item.uiStyle === 'input'">
          <input
            class="input"
            v-model="item.optionValue"
            :type="'text'"
            @input.stop="onInputChange(item)"
          >
        </div>
        <div v-if="item.uiStyle === 'uploadImg' && item.checked === 'Y'">
          <upload-file
            :imgObj="{ url: item.userTestReportImage }"
            @onSuccess="imgObj => uploadSuccess(imgObj, item)"
            @onDel="delImage(item)"
          />
        </div>
      </div>
    </radio-group>

    <!-- 多选 -->
    <checkbox-group
      @change="checkboxChange"
      v-if="type === 'checkbox'"
    >
      <div
        v-for="item in optionList"
        :key="item.id"
      >
        <label :class="['optionItem', item.checked === 'Y' && 'selected']">
          <div>
            <checkbox
              :value="String(item.id)"
              :checked="item.checked === 'Y'"
              :disabled="disabledCheckbox(item)"
              class="checkbox"
            />
          </div>
          <div v-if="item.photoUrl">
            <image
              :src="item.photoUrl"
              mode="aspectFit"
              class="optionImage"
            />
          </div>
          <div
            class="optionText"
            v-if="item"
          >
            <!-- TODO -->
            <!-- 跳：{{ item.gotoQuestionId }} -->
            <!-- 量：{{item.quantizationQuestionnaireId}} -->
            <div>{{ item.optionText }}</div>
            <div class="node">{{ item.note }}</div>
          </div>
        </label>
        <div v-if="item.uiStyle === 'input'">
          <input
            class="input"
            v-model="item.optionValue"
            :type="'text'"
            @input.stop="onInputChange(item)"
          >
        </div>
        <div v-if="item.uiStyle === 'uploadImg' && item.checked === 'Y'">
          <upload-file
            :imgObj="{ url: item.userTestReportImage }"
            @onSuccess="imgObj => uploadSuccess(imgObj, item)"
            @onDel="delImage(item)"
          />
        </div>
      </div>
    </checkbox-group>
  </div>
</template>
<script>
export default {
  inject: ['testPaper'],
  props: {
    data: {
      type: Object,
      default: () => { return {} }
    },
    type: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      optionList: this.testTarget().getQuestion(this.data.id).optionList,
      // checkedList: [],
      inputChange: false,
      timeoutTaskIds: []
    }
  },
  // created () {
  // this.checkedList = this.data.optionList.map(item => item.checked)
  // },
  methods: {
    update () {
      let _question = this.testTarget().getQuestion(this.data.id)
      // 注意问卷之间跳转可能存在时机问题
      if (!_question) return
      this.optionList = _question.optionList
      // 调试校验代码 缺主问卷
      let _option = this.optionList.filter(option => option.quantizationQuestionnaireRule && option.checked === 'Y')
      if (_option.length) this.testTarget().checkMeaeure()

      _option = this.optionList.filter(option => option.quantizationQuestionnaireId && option.checked === 'Y')
      if (_option.length) this.testTarget().toNextPaper()

      // this.checkedList = this.data.optionList.map(item => item.checked)
      this.inputChange = false
    },
    disabledCheckbox (opetion) {
      if (!this.data.maxChoose) return false
      if (opetion.checked === 'Y') return false
      return this.optionList.filter(item => item.checked === 'Y').length >= this.data.maxChoose
    },
    // checkClass (i) {
    //   return ['optionItem', this.checkedList[i] === 'Y' && 'selected']
    // },
    radioChange (e) {
      let measurePaper = this.testTarget().processList.find(item => item.proName === 'measure')
      if (!this.inputChange) {
        this.optionList.forEach(item => {
          item.checked = String(item.id) === e.detail.value ? 'Y' : 'N'
        })
        if (measurePaper) measurePaper.questionAll.find(item => item.id === this.data.id).optionList.forEach(item => {
          item.checked = String(item.id) === e.detail.value ? 'Y' : 'N'
        })
      }

      this.onChange(e)

      let paper = this.testTarget().getPaper()

      // 实时刷新题目数组（id=33的题目"您是否感到来自工作、生活或健康问题的压力？"，此题在最后一题时会动态增减题目数，造成下面的Plan3判断出错，故要实时刷新）
      // this.testTarget().$set(this.testTarget().measureIds, paper.proName, this.testTarget().setMeasureIds())
      // let measurePaper = this.testTarget().processList.find(item => item.proName === 'measure')
      // if (measurePaper) {
      //   measurePaper.questionList = measurePaper.questionAll.filter(item => this.testTarget().getMeasureIds().includes(item.quantizationQuestionnaireId))
      // }
      // 刷新下一题/提交问卷
      this.testTarget().toNextPaper()

      // 以下几种情况不要自动下一步：Plan.1:基本信息页里的单选; Plan.2:选中后需要填写值的，上传图片的; Plan3:提交页面的题型是单选
      if (this.testTarget().getPaper().uiStyle === 'list') return
      if (this.optionList.filter(item => item.checked === 'Y' && !item.optionValue
        && (item.uiStyle === 'input' || item.uiStyle === 'uploadImg')).length > 0) return

      let realQuestionList = paper.questionList.filter(question => !paper.jumpIds.includes(question.id))
      if (this.testTarget().activeIndex === this.testTarget().processList.length - 1
        && this.data.id === realQuestionList.slice(-1)[0].id) return

      this.clearTimeOutTask()
      let qid = this.data.id
      let timeoutID = setTimeout(() => { this.testTarget().onConfirm(() => { return qid }) }, 500)
      this.timeoutTaskIds.push(timeoutID)
    },
    clearTimeOutTask () {
      this.timeoutTaskIds.forEach(item => {
        clearTimeout(item)
      })
      this.timeoutTaskIds = []
    },
    checkboxChange (e) {
      // checkbox-group @change會監聽所包含組件的change,同樣會觸發checkbox-group的 @change事件,但e.detail.value不會返回選項數據
      if (!e.detail.value) return this.onChange(e)
      // 点击前的选项
      let oldChecked = this.optionList.filter(item => item.checked === 'Y').map(item => String(item.id))
      // 点击后的选项
      let newChecked = e.detail.value || []
      console.log(newChecked, oldChecked)
      // debugger
      // 排他项
      let exclutionIds = this.optionList.filter(item => item.isExclution === 'Y').map(item => String(item.id))
      // 本次点击项
      let nowChecked = newChecked.find(id => !oldChecked.includes(id))
      // 本次选择是否排他项
      let checkExclution = exclutionIds.includes(nowChecked)

      if (checkExclution) newChecked = e.detail.value = [nowChecked]
      if (!checkExclution) newChecked = e.detail.value = newChecked.filter(id => !exclutionIds.includes(id))
      this.optionList.forEach(item => { item.checked = newChecked.includes(String(item.id)) ? 'Y' : 'N' })
      // let exclutionChecked = this.libs.array.intersection(exclutionIds, '', e.detail.value)
      // if (exclutionChecked.length) {
      //   this.optionList.forEach(item => {
      //     item.checked = exclutionChecked[0] === item.id ? 'Y' : 'N'
      //   })
      // }
      // 一般情况
      // if (!exclutionChecked.length) {
      //   if (!this.inputChange) {
      //     this.optionList.forEach(item => {
      //       item.checked = newChecked.includes(String(item.id)) ? 'Y' : 'N'
      //     })
      //   }
      // }
      this.onChange(e)
    },
    uploadSuccess (imgObj, option) {
      option.userTestReportImage = imgObj.url
      this.onChange()
    },
    delImage (option) {
      option.userTestReportImage = ''
      this.onChange()
    },
    onInputChange (item) {
      this.inputChange = true
      item.checked = 'Y'
      if (!item.optionValue) item.checked = 'N'
    },
    onChange () {
      this.$emit('change', this.data)
    }
  }
}
</script>
<style lang="scss" scoped>
.optionItem {
  padding: 15rpx 0;
  display: flex;
}

.selected {
  color: var(--theme-color);
  font-weight: bold;
}

.optionImage {
  width: 240rpx;
  height: 240rpx;
}

.optionText {
  flex: 1;
}

.node {
  color: var(--color-tips);
  font-size: var(--font-h5);
  margin: 20rpx 0;
}

.checkbox,
.radio {
  margin-right: 10rpx;
  transform: scale(0.8);
}

.input {
  width: 100%;
  height: 65rpx;
  padding: 14rpx;
  box-sizing: border-box;
  outline-style: none;
  border: var(--border-normal);
  border-radius: var(--border-radius);
  background-color: #fff;
}
</style>

