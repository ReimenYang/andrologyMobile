<template>
  <div>
    <el-row
      type="flex"
      align="middle"
      class="topbar"
    >
      <el-col
        :span="18"
        class="topbarTitle"
      >
        分组管理
      </el-col>
      <el-col
        :span="6"
        class="btnGroup"
      ><button
          class="primary"
          @click="showDialog = true"
        >
          增加分组
        </button>
      </el-col>
    </el-row>
    <xnw-template-list
      :tableHeader="fileTableHeader"
      :tableData="list"
    >
      <template #default />
    </xnw-template-list>
    <add-testee-group
      :title="rowData.id?'编辑分组':'增加分组'"
      :type="rowData.id?'edit':'add'"
      :data="rowData"
      @close="hideDialog"
      @refresh="getList"
      v-if="showDialog"
    />
  </div>
</template>


<script>
import addTesteeGroup from './_addTesteeGroup.vue'
export default {
  components: { addTesteeGroup },
  data () {
    return {
      list: [],
      fileTableHeader: [
        { prop: 'index', label: '序号', width: 100, type: 'index' },
        { prop: 'groupName', label: '组名称' },
        { prop: 'groupDesc', label: '组描述' },
        {
          prop: 'btnList', label: '操作', btnList: [
            { text: '编辑', click: row => this.onBtn(row, 'edit') },
            { text: '删除', click: row => this.onBtn(row, 'del') },
          ]
        }
      ],
      rowData: {},
      showDialog: false
    }
  },
  async created () {
    await this.getList()
  },
  methods: {
    async getList () {
      this.list = (await this.request(this.api.andrology.projectMgt.getProjectGroupList)).data
      this.ready = true
    },
    hideDialog () {
      this.showDialog = false
      this.rowData = {}
    },
    async onBtn (row, type) {
      switch (type) {
        case 'edit':
          this.rowData = row
          console.log(row, type);
          this.showDialog = true
          break;
        case 'del':
          await this.request(this.api.andrology.projectMgt.deleteProjectGroup, row)
          await this.getList()
          break;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.topbar {
  padding: 10px 0;
  .topbarTitle {
    font-size: 18px;
  }
  .btnGroup {
    display: block;
    text-align: right;
  }
}
</style>