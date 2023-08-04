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
        @change="onChange"
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
            v-if="item.type"
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
    console.log('paper', this.paper);
  },
  methods: {
    update () {
      let _target = this.$refs.question
      if (!_target) return
      let _isObject = this.libs.object.isObject(_target)
      if (_isObject) _target.update()
      else _target.forEach(item => { item.update() })
    },
    onChange (question) {
      // this.testTarget().questionChange(question)
      // this.update()
    }
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
