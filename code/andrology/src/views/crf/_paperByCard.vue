<template>
  <div>
    <div class="preface">
      {{ paper.groupName }}
    </div>
    <div>
      <text class="desc">
        {{ paper.groupDesc }}
      </text>
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
  </div>
</template>
<script>
import question from './_question.vue'
import sdv from './_SDV.vue'
export default {
  // inject: ['testStage'],
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
  // watch: {
  //   paper: {
  //     handler: function () {
  //       console.log(this.paper, 55555);
  //       if (!this.paper.hasChanged) this.testStage().stage.hasChanged = this.paper.hasChanged = true
  //       if (this.$route.path.startsWith('/crf')) this.globalData.confirmMsg = '当前页面有信息未保存，确定仍要关闭页面？'
  //     },
  //     deep: true
  //   }
  // },
  // async created () {
  // window.paper = this
  // console.log('paper', this.paper);
  // }
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
  :deep(.question) {
    // border: var(--border-normal);
    // background-color: #fff;
    // .title {
    //   border-bottom: var(--border-normal);
    // }
    .content {
      margin: 20px 0 0;
      padding: 0 20px;
    }
  }
}
</style>
