/**
 * 杉山ble治疗仪指令构造器
 * power by 志凡
 */
const head = 'DATA:'
const head2 = 'ACK:'
const end = '\r\n\0'

/**
 * 开始训练
 *
 * @return
 */
function getBegin () {
  return getCmd('k,7')
}

/**
 * 暂停
 *
 * @return
 */
function getWait () {
  return getCmd('k,6')
}

/**
 * 下一阶段
 *
 * @return
 */
function getNextPhase () {
  return getCmd('k,5')
}

/**
 * 结束训练方案
 *
 * @return
 */
function getCleanSetting () {
  return getCmd('k,8')
}

/**
 * 链接设备
 *
 * @return
 */
function getCmdConnect () {
  return getCmd('c')
}

/**
 * 左侧电流增加
 *
 * @return
 */
function getCmdAddLeftMa () {
  return getCmd('k,1')
}

/**
 * 左侧电流减少
 *
 * @return
 */
function getCmdSubLeftMa () {
  return getCmd('k,2')
}

/**
 * 右侧电流增加
 *
 * @return
 */
function getCmdAddRightMa () {
  return getCmd('k,3')
}


/**
 * 右侧电流减少
 *
 * @return
 */
function getCmdSubRightMa () {
  return getCmd('k,4')
}

/**
 *参数’m’参数命令前发两条’d’
 * @return
 */
function getCmdSubDMa () {
  return getCmd('d,100,200')
}

/**
 * 获取设备信息
 * @return
 */
function getCmdDeviceInfo () {
  return getCmd('c,99')
}

function getCmd (meddle) {
  let sum = getSum(meddle)
  let res = `${head}${meddle},${sum}${end}`
  console.log(res)
  return res
}

function getSum (meddle) {
  let cs = meddle
  let sum = 0
  for (let i = 0; i < cs.length; i++) {
    let c = cs[i]
    let regW = /(\w+)/
    let regD = /(\d+)/
    if (c.match(regW)) {
      if (i === (cs.length - 1) && c.match(regD)) {
        sum += parseInt(c)
      } else {
        sum += c.charCodeAt()
      }
    }
  }
  return sum
}

const DeviceCmd = {
  getBegin,
  getWait,
  getNextPhase,
  getCleanSetting,
  getCmdConnect,
  getCmdAddLeftMa,
  getCmdSubLeftMa,
  getCmdAddRightMa,
  getCmdSubRightMa,
  getCmdSubDMa,
  getCmdDeviceInfo,
  head,
  head2,
  end
}

export default DeviceCmd
