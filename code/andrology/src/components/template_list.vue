<template>
  <div
    class="template"
    :style="{height:templateHeight,...style}"
  >
    <div
      class="header"
      v-if="$slots.header"
    >
      <slot name="header">
        <div class="title">
          标题
        </div>
        <div class="control">
          <el-row>
            <el-button
              v-for="item in controlBtn"
              v-bind="item"
              :key="item.prop"
            >
              {{ item.label }}
            </el-button>
            <el-button
              plain
              :icon="showControl?'el-icon-arrow-up':'el-icon-arrow-down'"
              size="medium"
              @click="showControl=!showControl"
            />
          </el-row>
        </div>
      </slot>
    </div>
    <div
      class="search"
      v-if="$slots.search&&showControl"
    >
      <slot name="search">
        <xnw-template-form
          ref="form"
          :data="form"
          :repeat="formRepeat"
          :fromProp="fromProp"
          :gutter="20"
          v-if="showParams"
        />
        <div class="searchBtnList">
          <el-col>
            <el-button
              type="primary"
              @click="onSubmit"
            >
              搜索
            </el-button>
            <el-button @click="onReset">
              重置
            </el-button>
            <el-button @click="showParams=!showParams">
              {{ showParamsBtnText }}
            </el-button>
          </el-col>
          <el-col
            v-if="!$slots.header"
            :style="{marginLeft:'10px'}"
          >
            <el-button
              v-for="item in controlBtn"
              v-bind="item"
              :key="item.prop"
              @click="item.click"
            >
              {{ item.label }}
            </el-button>
          </el-col>
        </div>
      </slot>
    </div>
    <div class="main">
      <slot>
        <el-table
          v-if="tableHeight"
          :data="tableData"
          v-bind="tableProp"
          :maxHeight="tableHeight"
          @row-click="rowClick"
          @sortChange="sortChange"
        >
          <el-table-column
            v-for="item in tableHeader"
            v-bind="item"
            :key="item.prop"
          >
            <template #default="scope">
              <div v-if="item.prop==='btnList'">
                <el-button
                  v-for="btn in item.btnList"
                  v-bind="btn.bind"
                  @click="btn.click(scope.row)"
                  :key="btn.text"
                  size="small"
                  v-show="!btn.condition||btn.condition(scope.row)"
                >
                  {{ btn.text }}
                </el-button>
              </div>
              <div v-if="item.control">
                <el-image
                  v-if="item.control.image&&scope.row[item.prop].trim().split(' ')[0]"
                  :style="item.control.style"
                  :src="scope.row[item.prop].trim().split(' ')[0]"
                  :previewSrcList="scope.row[item.prop].trim().split(' ')"
                />

                <div v-else-if="item.control.click">
                  <span v-if="(typeof scope.row[item.prop])!=='string'">
                    <el-button
                      v-for="propItem in scope.row[item.prop]"
                      :key="propItem.id"
                      :style="item.control.style"
                      @click="item.control.click.fun&&item.control.click.fun(scope.row,propItem.id)"
                      type="text"
                      size="small"
                    >
                      {{ item.control.dict?(item.control.dict[propItem.label]||propItem.label):propItem.label }}
                    </el-button>
                  </span>

                  <el-button
                    v-else
                    :style="item.control.style"
                    @click="item.control.click.fun&&item.control.click.fun(scope.row)"
                    type="text"
                    size="small"
                  >
                    {{ item.control.dict?(item.control.dict[scope.row[item.prop]]||scope.row[item.prop]):scope.row[item.prop] }}
                  </el-button>
                </div>

                <span
                  v-else
                  :style="item.control.style"
                >{{ item.control.dict?(item.control.dict[scope.row[item.prop]]||scope.row[item.prop]):scope.row[item.prop] }}</span>
              </div>
              <div v-if="item.tag">

                <el-tag
                  v-for="(tag,i) in item.tag"
                  :key="i"
                  v-bind="tag.tagType(scope.row[item.prop||tag.prop])"
                >{{ tag.setLabel(scope.row[item.prop||tag.prop]) }}</el-tag>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </slot>
    </div>
    <div
      class="footer"
      v-if="$slots.footer"
    >
      <slot name="footer">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          v-bind="pagination"
          :pageCount="Math.ceil(pagination.total/pagination.pageSize)"
        />
      </slot>
    </div>
    <el-image-viewer
      v-if="showViewer"
      :onClose="viewerClose"
      :urlList="viewerList"
    />
  </div>
</template>

<script>
export default {
  name: 'XnwTemplateList',
  props: {
    filterShow: {
      type: Boolean,
      default () { return true }
    },
    filterForm: {
      type: Object,
      default () {
        return {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        }
      }
    },
    filterRepeat: {
      type: Array,
      default () {
        return [
          [{
            label: '活动名称',
            type: 'input',
            prop: '',
            span: 12,
            repeat: [
              { type: 'text', prop: 'name' }
            ]
          }, {
            label: '活动区域',
            type: 'select',
            prop: '',
            span: 12,
            repeat: [
              {
                prop: 'region', value: 0, filterable: true, multiple: true, placeholder: '请选择活动区域', options: Array.from({ length: 3 }).map((_, idx) => ({
                  value: `选项${idx + 1}`,
                  label: `${['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'][idx % 10]}${idx}`,
                })),
              }
            ]
          }
          ], [{
            label: '活动性质',
            type: 'checkbox',
            prop: 'type',
            span: 24,
            repeat: [
              { label: '美食/餐厅线上活动', value: 0 },
              { label: '地推活动', value: 1 },
              { label: '线下主题活动', value: 2 },
              { label: '单纯品牌曝光', value: 3 }
            ]
          }], [{
            label: '活动时间',
            type: 'dateTimePicker',
            prop: '',
            span: 24
          }], [{
            label: '即时配送',
            type: 'switch',
            prop: 'delivery',
            span: 24
          }], [{
            label: '特殊资源',
            type: 'radio',
            prop: 'resource',
            span: 24,
            repeat: [
              { label: '线上品牌商赞助', value: 0 },
              { label: '线下场地免费', value: 1 }
            ]
          }], [{
            label: '活动形式',
            type: 'input',
            prop: '',
            span: 24,
            repeat: [
              { type: 'textarea', prop: 'desc' }
            ]
          }
          ]
        ]
      }
    },
    tableHeader: {
      type: Array,
      default () {
        return [
          { prop: 'select', label: '选择', width: 50, type: 'selection', fixed: 'left' }, // type:selection / index / expand
          { prop: 'num', label: '序号', width: 50, type: 'index', fixed: 'left' },
          { prop: 'date', label: '日期', width: 150, sortable: 'custom' },
          { prop: 'name', label: '姓名', width: 120 },
          { prop: 'province', label: '省份', width: 120 },
          { prop: 'address', label: '地址', width: 600 },
          { prop: 'zip', label: '邮编', width: 120 },
          // { prop: 'right', label: '操作', width: 120, fixed: 'right' }
        ]
      }
    },
    pagination: {
      type: Object,
      default () {
        return {
          currentPage: 1,
          pageSizes: [20, 50, 100, 200],
          pageSize: 20,
          layout: 'total, sizes, prev, pager, next, jumper',
          total: 30
        }
      }
    },
    tableData: {
      type: Array,
      default () {
        return Array.from({ length: 30 }).map((_, idx) => ({
          date: '2016-05-0' + idx,
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333,
        }))
      }
    },
    tableProp: {
      type: Object,
      default () {
        return { style: { width: '100%' } }
      }
    },
    fromProp: {
      type: Object,
      default () {
        return { labelWidth: '80px' }
      }
    },
    showViewer: {
      type: Boolean,
      default () { return false }
    },
    viewerList: {
      type: Array,
      default () {
        return []
      }
    },
    controlBtn: {
      type: Array,
      default () {
        return [
          // { prop: 'name', label: '朴素按钮', icon: 'el-icon-edit', plain: true, click: () => { console.log('朴素按钮') } }, // size:medium / small / mini;type:primary / success / warning / danger / info / text
          // { prop: 'province', label: '提交', icon: 'el-icon-check', type: 'primary', plain: true, click: () => { console.log('提交') } },
          // { prop: 'address', label: '添加', icon: 'el-icon-plus', type: 'success', plain: true, click: () => { console.log('添加') } },
          // { prop: 'del', label: '删除', icon: 'el-icon-delete', type: 'danger', plain: true, click: () => { console.log('删除') } }
        ]
      }
    },
    style: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      templateHeight: 0,
      showControl: this.filterShow,
      tableHeight: '',
      form: this.filterForm,
      formRepeat: this.filterRepeat,
      showParams: true,
      showParamsBtnText: '收起'
    }
  },
  watch: {
    showControl () { this.setTableHeight() },
    showParams (val) {
      this.showParamsBtnText = val ? '收起' : '展开'
      this.setTableHeight()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.templateHeight = `calc(100vh - ${this.$el.offsetTop + 10}px)`
      this.setTableHeight()
    })
    window.onresize = () => {
      this.setTableHeight()
    }
  },
  methods: {
    setTableHeight () {
      this.tableHeight = 0
      setTimeout(() => {
        this.tableHeight = this.$el.querySelector('.main').offsetHeight
      }, 50)// 这个值打太小可能导致高度不合理
    },
    handleSizeChange (size) {
      console.log(`每页 ${size} 条`)
      this.$emit('sizeChange', { current: this.pagination.currentPage, size })
    },
    handleCurrentChange (current) {
      console.log(`当前页: ${current}`)
      this.$emit('sizeChange', { current, size: this.pagination.pageSize })
    },
    rowClick (row) {
      console.log(row)
      this.$emit('rowClick', row)
    },
    onSubmit () {
      console.log(this.$refs.form.form)
      this.$emit('getList', {})
    },
    onReset () {
      Object.keys(this.form).forEach(key => this.form[key] = '')
    },
    viewerClose () {
      this.$emit('viewerClose', {})
    },
    sortChange (e) {
      this.$emit('sortChange', e)
    }
  }
}
</script>

<style scoped lang="scss">
.template {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .header,
  .search,
  .main,
  .footer {
    padding: var(--space-normal);
    // border: var(--border-normal);
    // border-radius: var(--border-radius);
    background-color: #fff;
    // box-shadow: var(--shadow-light);
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-h3);
  }
  .search {
    margin-bottom: var(--space-normal);
    border: none;
  }
  .main {
    padding: 0;
    flex: 1;
  }
  .header + div,
  .footer {
    border-top: 0;
  }
}
</style>
