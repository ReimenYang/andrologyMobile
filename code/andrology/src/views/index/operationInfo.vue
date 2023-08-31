<template>
  <div>
    <div
      class="box"
      :style="{display: showInfo?'flex':'block'}"
    >
      <div
        v-if="showInfo"
        class="bg"
      >
        <div
          class="topbar"
          style="padding-top: 10px;"
        >
          <div class="topbarTitle">{{ info.organizationName }}</div>
          <div lass="btnGroup">
            <button
              class="primary"
              @click="exportReport"
            >
              导出
            </button>
          </div>
        </div>

        <el-descriptions
          :column="2"
          border
        >
          <el-descriptions-item
            :label="col.label"
            v-for="col in infoKeys"
            :key="col.prop"
            v-bind="col.config"
          >
            <div class="label">{{ info[col.prop] }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div
        class="topbar"
        v-if="!showInfo"
      >
        <div class="topbarTitle">项目月度统计</div>
        <div lass="btnGroup">
          <button
            class="primary"
            @click="exportReport"
          >
            导出
          </button>
        </div>
      </div>
      <div
        id="myChart"
        :style="{width:showInfo? 'calc(100% - 530px)':'100%'}"
      />
    </div>
    <div class="pieBox">
      <div
        v-for="id in ['joinChart','finishChart','tableDataChart']"
        :key="id"
        :id="id"
        :style="{width:'30%',height:'300px'}"
      />
    </div>
    <xnw-template-list
      :tableHeader="tableHeader"
      :tableData="tableData"
      :style="{height:'500px'}"
    >
      <template #default />
    </xnw-template-list>
  </div>
</template>
<script>
export default {
  data () {
    return {
      ready: 0,
      monthList: [],
      organizationList: [],
      groupList: [],
      showInfo: false,
      info: {},
      infoKeys: [
        { prop: 'createDate', label: '开展日期' },
        { prop: 'targetNums', label: '目标人数' },
        { prop: 'joinNums', label: '入组人数' },
        { prop: 'finishNums', label: '完成人数' },
        { prop: 'finishRate', label: '完成率' },
        { prop: 'finishNumsByMonth', label: '月均完成人数' },
        { prop: 'dropNums', label: '脱落人数' },
        { prop: 'stopNums', label: '中止人数' },
      ],
      tableHeader: [],
      tableData: []
    }
  },
  async created () {
    await this.getList()
    this.ready++
  },
  watch: {
    ready: function () {
      if (this.ready === 2) this.setChart()
    }
  },
  mounted () {
    this.ready++
  },
  methods: {
    async getList () {
      let { projectCode, projectName, projectState } = this.$route.query
      if (projectCode) {
        sessionStorage.projectCode = this.globalData.headers.projectCode = projectCode
        sessionStorage.projectName = projectName
        sessionStorage.projectState = projectState
        this.globalData.orgList = (await this.request(this.api.andrology.projectMgt.getProjectOrgList)).data
        this.globalData.groupList = (await this.request(this.api.andrology.projectMgt.getProjectGroupList)).data
      }

      this.globalData.projectInfo = (await this.request(this.api.andrology.project.getProjectInfo)).data
      switch (this.globalData.projectInfo.dataPrivilege) {
        case '本机构':
          this.showInfo = true
          this.info = (await this.request(this.api.andrology.project.getProjectOrgReport)).data
          this.info.createDate = this.info.createDate.slice(0, 10)
          this.tableData = this.info.userList
          this.tableHeader = [
            { prop: 'index', label: '序号', width: 55, type: 'index' },
            { prop: 'userName', label: '医师姓名' },
            { prop: 'joinNums', label: '入组人数' },
            { prop: 'finishNums', label: '完成人数' },
            { prop: 'finishNumsByMonth', label: '月均完成人数' },
            { prop: 'dropNums', label: '脱落人数' },
            { prop: 'stopNums', label: '中止人数' },
            { prop: 'currentMonthJoinNums', label: '当月入组人数' },
            { prop: 'currentMonthFinishNums', label: '当月完成人数' }
          ]
          break;
        case '全部机构':
          this.info = (await this.request(this.api.andrology.project.getProjectFullReport)).data
          this.tableData = this.info.organizationList
          this.tableHeader = [
            { prop: 'index', label: '序号', width: 55, type: 'index' },
            { prop: 'organizationName', label: '机构名称' },
            { prop: 'createDate', label: '开展日期' },
            { prop: 'joinNums', label: '入组人数' },
            { prop: 'finishNumsByMonth', label: '月均完成人数' },
            { prop: 'finishNums', label: '完成人数总数' },
            { prop: 'targetNums', label: '目标完成人数' },
            { prop: 'dropNums', label: '脱落人数' },
            { prop: 'stopNums', label: '中止人数' },
            { prop: 'currentMonthJoinNums', label: '当月入组人数' },
            { prop: 'currentMonthFinishNums', label: '当月完成人数' }
          ]
          this.tableData.forEach(item => item.createDate = item.createDate.slice(0, 10))
          break;
      }
      this.monthList = this.info.monthList
      this.groupList = this.info.groupList
    },
    setChart () {
      let myChart = this.$root.echarts.init(document.getElementById('myChart'))
      let joinNums = this.monthList.map(({ joinNums }) => joinNums)
      let totalJoinNums = this.monthList.map(({ totalJoinNums }) => totalJoinNums)
      let joinNumsInterval = Math.ceil(Math.max.apply(null, joinNums) / 5)
      let totalJoinNumsInterval = Math.ceil(Math.max.apply(null, totalJoinNums) / 5)
      let barOption = {
        type: 'bar',
        tooltip: { valueFormatter: value => value + ' 人' },
        stack: '入组人数',
        xAxisIndex: 1
      }
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: { color: '#999' }
          }
        },
        legend: {
          data: ['入组人数', '完成人数', '脱落人数', '中止人数', '累计入组人数'],
          top: 20
        },
        grid: { left: 60, right: 60, top: 50, bottom: 40 },
        xAxis: [{
          type: 'category',
          data: this.monthList.map(({ month }) => month.slice(0, 10)),
          axisPointer: { type: 'shadow' }
        }, {
          axisLine: { show: false },
          axisTick: { show: false },
          data: this.monthList.map(() => '')// ['', '', '']
        }],
        yAxis: [joinNumsInterval, totalJoinNumsInterval].map(interval => ({
          type: 'value',
          max: interval * 5,
          interval,
          axisLabel: { formatter: '{value} 人' }
        })),
        series: [
          { ...barOption, name: '入组人数', stack: '', xAxisIndex: 0, data: joinNums },
          { ...barOption, name: '完成人数', data: this.monthList.map(({ finishNums }) => finishNums) },
          { ...barOption, name: '脱落人数', data: this.monthList.map(({ dropNums }) => dropNums) },
          { ...barOption, name: '中止人数', data: this.monthList.map(({ stopNums }) => stopNums) },
          {
            name: '累计入组人数',
            type: 'line',
            yAxisIndex: 1,
            tooltip: { valueFormatter: value => value + ' 人' },
            data: totalJoinNums
          }]
      })

      let joinOption = {
        title: {
          text: '受试者分组情况统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   orient: 'vertical',
        //   bottom: 'bottom'
        // },
        // color: ['#5470c6', '#91cc75'],
        series: [
          {
            type: 'pie',
            radius: '70%',
            data: this.groupList.map(({ name, joinNums: value }) => ({ name, value }))
          }
        ]
      }
      let joinChart = this.$root.echarts.init(document.getElementById('joinChart'))
      joinChart.setOption(joinOption)

      let finishChart = this.$root.echarts.init(document.getElementById('finishChart'))
      let finishOption = { ...joinOption }
      finishOption.title.text = '受试者完成情况统计'
      finishOption.series[0].data = this.groupList.map(({ name, finishNums: value }) => ({ name, value }))
      finishChart.setOption(finishOption)

      let tableDataChart = this.$root.echarts.init(document.getElementById('tableDataChart'))
      let tableDataOption = { ...joinOption }
      tableDataOption.title.text = '受试者入组情况统计'
      tableDataOption.series[0].data = this.tableData.map(({ userName, organizationName, joinNums: value }) => ({ name: this.showInfo ? userName : organizationName, value }))
      tableDataChart.setOption(tableDataOption)
    },
    async exportReport () {
      let res = await this.request(this.api.andrology.project[this.showInfo ? 'exportProjectOrgReport' : 'exportProjectFullReport'], {}, { headers: this.globalData.headers, responseType: 'blob' })
      let url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
      window.open(url, '_blank')
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  justify-content: space-between;
}
.pieBox {
  padding: 10px 0;
  margin: 0 0 10px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
}
.label {
  width: 100px;
  line-height: 35px;
}
#myChart {
  height: 300px;
  margin: 0 0 10px 0;
  background-color: #fff;
}
.bg {
  width: 500px;
  height: 290px;
  padding: 0 10px 10px;
  background-color: #fff;
}
</style>