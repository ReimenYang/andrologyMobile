<template>
  <div>
    <div class="preface">
      {{ paper.groupName }}
    </div>
    <div
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
    </div>
    <div
      class="content"
      v-else
    >
      <el-table
        :data="paper.questionList"
        v-bind="paper.table.tableProp"
      >
        <el-table-column
          v-for="item in paper.table.tableHeader"
          v-bind="item"
          :key="item.prop"
        >
          <template
            #default="scope"
            v-if="item.isSDV"
          >
            <sdv :question="scope.row" />
          </template>
          <template
            #default="scope"
            v-else-if="item.type"
          >
            <xnwFromComponent
              :col="item"
              :form="scope.row"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <text class="desc">
        {{ paper.groupDesc }}
      </text>
    </div>
  </div>
</template>
<script>
import question from './_question.vue'
import sdv from './_SDV.vue'
export default {
  components: { sdv, question },
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
  watch: {
    paper: {
      handler: function () {
        console.log('hasChanged')
        this.paper.hasChanged = true
        // if (this.question.uiStyle === 'dateTimePicker') this.question.questionAnswer = this.libs.data.dateNow(this.question.questionAnswer, 'xxxx-xx-xx')
      },
      deep: true
    }
  },
  async created () {
    window.paper = this
    console.log('paper', this.paper);
  }
}
</script>
<style lang="scss" scoped>
.preface {
  margin: 20rpx 0;
}
.desc {
  color: var(--color-tips);
  font-size: var(--font-h4);
  margin: 20rpx 0;
}
.content :deep(.question) {
  // border: var(--border-normal);
  // background-color: #fff;
  // .title {
  //   border-bottom: var(--border-normal);
  // }
  .content {
    padding: 0 20rpx;
  }
}
</style>
