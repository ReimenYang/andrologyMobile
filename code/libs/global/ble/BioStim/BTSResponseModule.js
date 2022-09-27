/**
 * 杉山ble治疗仪指令校验器
 * power by 志凡
 */
export class BTSResponseModule {
  constructor(statusPages) {
    try {
      // console.log(statusPages)
      // 检验并对包进行封装
      if (statusPages.toUpperCase().startsWith('ACK')) {
        this.isFullPackage = true
      } else {
        let datas = statusPages.split(',')
        let cmd = datas[0].substring(datas[0].indexOf(':') + 1, datas[0].length).trim()
        let sum = datas[10].replace(/\D/g, '')
        this.count = datas[1] // 状态数据包每发送一次自动加1，最小值为0~9
        this.numPhase = datas[2] // 当前执行第几阶段，最小值为1
        this.intensityCHL = datas[3] // 当前左通道刺激强度，0 ~ 995
        this.intensityCHR = datas[4] // 当前右通道刺激强度，0 ~ 995
        this.bat = datas[5] // 当前电池状态，0 ~ 100
        /**
         * 运行状态，可以是
         * 运行，1
         * 暂停，2
         * 停止，3
         */
        this.stateRunning = datas[6]
        /**
         * 阶段状态
         * 上升，1
         * 平台，2
         * 下降，3
         * 休息，4
         */
        this.statePhase = datas[7]
        /**
         * 剩余时间，0~3600
         * 这个的话只要大于3600就不显示了
         */
        this.remainingTime = datas[8]
        /**
         * 波形阶段状态，百分比，30代表百分之三十该阶段状态时间，
         * 如当<StatePhase>为1，<Wavepercent>为30，当前运行到上升阶段百分之30的位置
         */
        this.wavepercent = datas[9]
        let i = cmd.charAt(0).charCodeAt()
        i += parseInt(this.count)
        i += parseInt(this.numPhase)
        i += parseInt(this.intensityCHL)
        i += parseInt(this.intensityCHR)
        i += parseInt(this.bat)
        i += parseInt(this.stateRunning)
        i += parseInt(this.statePhase)
        i += parseInt(this.remainingTime)
        i += parseInt(this.wavepercent)
        this.isFullPackage = (i === sum) ? true : false
      }
    } catch (err) {
      console.log(err)
    }
    this.rawData = statusPages
  }
}
