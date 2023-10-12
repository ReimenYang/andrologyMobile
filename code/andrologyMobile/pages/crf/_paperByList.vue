<template>
  <view>
    <view class="preface">
      {{ paper.groupName }}
    </view>
    <view>
      <text class="desc">
        {{ paper.groupDesc }}
      </text>
    </view>
    <view
      class="content"
      v-if="paper.uiStyle !== 'table'"
    >
      <question
        v-for=" (question,i) in paper.questionList"
        :key="question.questionId"
        :question="question"
        :index="i+1+'. '"
        ref="question"
      />
    </view>
    <view
      class="content"
      v-else
    >
      <view
        v-for="question in paper.questionList"
        :key="question.questionId"
        class="box"
      >
        <view
          v-for="item in paper.table.tableHeader.filter(item=>item.label)"
          :key="item.prop"
          class="row"
        >
          <view class="label">
            {{ item.label }}
          </view>
          <view>
            <picker
              v-if="item.type==='select'"
              :range="item.repeat[0].options"
              rangeKey="label"
              @change="(e)=>onchange('',item,e,'picker')"
            >
              <view class="picker">
                {{ item.repeat[0].options[item.value].label||'请选择' }}
              </view>
            </picker>
            <input
              class="input"
              v-else-if="item.type==='input'"
              v-model="question[item.prop]"
            >
            <view v-else>
              {{ question[item.prop] }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import question from './_question.vue'
export default {
  components: { question },
  provide () {
    return {
      testPaper: () => this
    }
  },
  props: {
    paper: {
      type: Object,
      default: () => ({})
    }
  },
  async created () {
    window.paper = this
    console.log('paper', this.paper)
  },
}
</script>
<style lang="scss" scoped>
.preface {
  font-size: var(--font-h4);
}
.desc {
  color: var(--color-tips);
  font-size: var(--font-h4);
}
.content {
  margin: 20px 0 0;
  .box {
    padding: 20rpx;
    margin-bottom: 30rpx;
    border-bottom: var(--border-normal);
    .row {
      display: flex;
      line-height: 80rpx;
      .label {
        width: 5em;
        color: var(--color-tips);
      }
      .input {
        height: 60rpx;
        margin-top: 10rpx;
        padding: 0 20rpx;
        border: var(--border-normal);
      }
    }
  }
}
</style>
