<script>
export default {
  async onLaunch (option) {
    let isMobile = this.libs.configProject.systemInfo.deviceType === 'phone'
    // if (!isMobile) return location.href = 'http://10.10.20.101:9000/web/#/user/login?' + this.libs.object.paramsToKeyValue(option.query)
    if (!isMobile) return location.href = 'https://sci.andrologia.cn/web/#/user/login?' + this.libs.object.paramsToKeyValue(option.query)
    console.log('App Launch', option)
    let isLoginPage = option.path.startsWith('pages/login/login')
    let _projectCode = option.query.projectCode
    let globalData = this.libs.configProject.globalData
    let _userInfo = this.libs.data.getStorage('userInfo')
    if (!_userInfo && isLoginPage) return
    if (!_userInfo && !isLoginPage) return uni.redirectTo({ url: '/pages/login/login?projectCode=' + _projectCode })
    globalData.userInfo = JSON.parse(_userInfo)
    if (_projectCode) globalData.userInfo.projectCode = _projectCode
    let { beforeunload, loginToken, projectCode } = globalData.userInfo
    console.log(new Date() - beforeunload, (new Date() - beforeunload > 3 * 1000), !loginToken, globalData.userInfo)
    if (isLoginPage || !projectCode) return
    globalData.headers = { token: loginToken, projectCode }
    if ((new Date() - beforeunload > 3 * 1000) || !loginToken) {
      // 根据用户角色判断跳转路径 todo
      let url = location.href.split('#')[0] + `#/pages/login/login?projectCode=${projectCode}`
      history.pushState(null, null, url)
      window.addEventListener('popstate', () => history.pushState(null, null, url))
      return location.replace(url)
    }
    globalData.projectState = (await this.request(this.api.andrology.project.getProjectBaseInfo)).data.projectState
    globalData.orgList = (await this.request(this.api.andrology.projectMgt.getProjectOrgList)).data
    globalData.groupList = (await this.request(this.api.andrology.projectMgt.getProjectGroupList)).data
  },
  onShow: function () {
    console.log('App Show')
    window.addEventListener('beforeunload', () => {
      try {
        let _userInfo = JSON.parse(this.libs.data.getStorage('userInfo'))
        _userInfo.beforeunload = new Date() - 0
        this.libs.data.setStorage('userInfo', JSON.stringify(_userInfo))
      } catch (e) {
        console.log(e)
      }
    })
  },
  onHide: function () {
    // console.log('App Hide')
  },
  globalData: {},
}
</script>

<style>
@import "./assets/css/reset.scss";
@import "./assets/fonts/iconfont.css";
@import "//at.alicdn.com/t/font_2308054_fi39pku6shj.css";
page {
  background: var(--color-background);
}
/* cover 抹平平台差异 */
.dialogBody .uni-grid-wrap {
  width: 100vw !important;
}
/*每个页面公共css */
</style>
