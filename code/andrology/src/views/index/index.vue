<template>
  <div
    class="infoMain"
    id="infoMain"
  >
    <div
      class="box"
      id="intro"
    >
      <dl>
        <dt>项目介绍</dt>
        <dd><el-input
            class="content"
            :value="projectDesc"
            disabled
            type="textarea"
            :rows="Math.ceil(projectDesc/47)"
          /></dd>
      </dl>
      <div id="myChart" />
    </div>
    <div class="box standard">
      <dl>
        <template
          v-for="({name,text}) in standard"
          :key="name"
        >
          <dt>{{ name }}</dt>
          <dd><el-input
              class="content"
              :value="text"
              disabled
              autosize
              type="textarea"
            /></dd>
        </template>
      </dl>
    </div>
    <div class="box download">
      <dl>
        <dt>项目文件</dt>
        <dd
          v-for="({id,fileName,fileUrl}) in fileList"
          :key="id"
          @click="downloadFile(fileUrl)"
        >{{ fileName }}</dd>
      </dl>
    </div>
    <div class="box videoList">
      <dl>
        <dt>项目视频</dt>
        <dd
          v-for="({id,videoName,videoUrl}) in videoList"
          :key="id"
          @click="onPlay(videoName,videoUrl)"
        >{{ videoName }}</dd>
      </dl>
    </div>
    <video-play
      v-bind="player"
      @close="hideDialog"
      v-if="videoPlayerDialog"
    />
  </div>
</template>

<script>
import videoPlay from '../projectCenter/_videoPlayer.vue'
export default {
  components: { videoPlay },
  data () {
    return {
      ready: 0,
      projectDesc: '',
      standard: [],
      fileList: [],
      videoList: [],
      player: { title: '', playUrl: '' },
      videoPlayerDialog: false,
      groupList: []
    }
  },
  async created () {
    if (!this.globalData.projectInfo) this.globalData.projectInfo = (await this.request(this.api.andrology.project.getProjectInfo)).data
    let intro = this.globalData.projectInfo
    this.fileList = intro.fileList
    this.videoList = intro.videoList
    this.projectDesc = intro.projectDesc
    this.standard = intro.criteriaList
    this.groupList = intro.groupList
    this.ready++
  },
  watch: {
    ready: function () {
      if (this.ready === 2) this.setChart()
    }
  },
  mounted () {
    this.ready++
    setTimeout(() => {
      let infoMain = document.getElementById('infoMain')
      let intro = document.getElementById('intro')
      console.log(intro.offsetHeight);
      infoMain.setAttribute('style', 'grid-template-rows:' + intro.offsetHeight + 'px')
    }, 300)
  },
  methods: {
    setChart () {
      // this.$root => app
      let myChart = this.$root.echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          // formatter: '{b}<br/>{a}:{c}<br/>{a1}:{c1}'
          formatter: ([a, b]) => `${a.name}<br/>${a.marker} ${a.seriesName}: <b>${a.value}</b><br/>${b.marker} ${b.seriesName}: <b>${b.value}</b>`
        },
        legend: {
          y: 'bottom',
          data: ['完成人数', '入组人数']
        },
        grid: { x: 60 },
        xAxis: [
          {
            axisLabel: { textStyle: { fontSize: 16 } },
            data: this.groupList.map(({ name }) => name)//['对照组', '试验组', 'xx组']
          },
          {
            axisLine: { show: false },
            axisTick: { show: false },
            data: this.groupList.map(() => '')// ['', '', '']
          }
        ],
        yAxis: {
          type: 'value',
          axisLabel: { formatter: '{value}' },
          splitLine: { show: false },
          splitArea: {
            show: true,
            areaStyle: { color: ['#f8f8f8', '#fff'] }
          }
        },
        series: [
          {
            name: '完成人数',
            type: 'bar',
            itemStyle: { normal: { color: 'rgba(67, 167, 255,1)', label: { show: true, textStyle: { fontSize: 16, color: '#0058a3' } } } },
            data: this.groupList.map(({ finishNums }) => finishNums)// [90, 91, 90]
          },
          {
            name: '入组人数',
            type: 'bar',
            xAxisIndex: 1,
            itemStyle: { normal: { color: 'rgba(67, 167, 255,0.5)', label: { show: true, textStyle: { fontSize: 16, color: '#0058a3' }, position: 'top' } } },
            data: this.groupList.map(({ joinNums }) => joinNums)// [150, 300, 281]
          }
        ]
      })

    },
    async downloadFile (url) {
      window.open(url, '_blank')
    },
    hideDialog () {
      this.videoPlayerDialog = false
    },
    async onPlay (title, url) {
      this.player.title = title
      this.player.playUrl = url
      this.videoPlayerDialog = true
    }
  }
}
</script>
<style lang="scss" scoped>
.infoMain {
  display: grid;
  justify-content: space-between;
  grid: auto / 1fr 1fr;
  gap: 20px;
  .box {
    padding: 20px;
    background-color: #fff;
    dt {
      padding-bottom: 5px;
      font-size: var(--font-h3);
      color: var(--theme-color);
    }
    dd {
      padding-bottom: 20px;
    }
    :deep(.el-textarea.is-disabled .el-textarea__inner) {
      background-color: transparent;
      box-shadow: none;
      overflow: hidden;
      font-size: var(--font-h4);
      line-height: 1.8;
      color: var(--color-normal);
    }
    :deep(textarea) {
      resize: none;
    }
    &#intro {
      align-self: start;
    }
    &.standard {
      grid-row: span 3;
    }
    &.download,
    &.videoList {
      dt {
        padding-bottom: 25px;
      }
      dd {
        &:hover {
          cursor: pointer;
          text-decoration: underline;
          color: var(--theme-color);
        }
        &::before {
          float: right;
          content: "下载";
          color: var(--theme-color);
        }
      }
    }
    &.videoList dd::before {
      content: "播放";
    }
  }
  #myChart {
    width: 100%;
    height: 300px;
  }
}
</style>