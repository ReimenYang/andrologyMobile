import data from './index'
async function initUni () {
  data.systemInfo = (await uni.getSystemInfo())[1]
  data.processEnv = process.env
}
export default initUni
