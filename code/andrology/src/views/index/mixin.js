import base from '@/json/base.js'
import user from '@/json/user.js'
import scheme from '@/json/scheme.js'
import equipment from '@/json/equipment.js'
export default {
  data () {
    return {
      serviceType: base.serviceType,
      equipmentList: equipment.equipmentList,
      schemeList: scheme.schemeList,
      userList: user.userList
    }
  },
  methods: {
    // 切换工作室重新调用这个方法
    async init (form, data) {
      // 全局缓存当前工作室资料
      // this.globalData.studioInfo = (await this.request(this.api.sms.studioReserveInformation.getStudioWorkTimeList, { studioId: this.globalData.studioId })).data
      // 治疗项目
      // await this.globalData.getStudioProject()
      this.schemeList = this.globalData.project
      this.schemeList.forEach(item => {
        item.label = item.projectName
        item.value = item.projectName
        // item.id = item.id
      });
      // this.schemeList = this.globalData.studioInfo.deviceList
      // this.schemeList.forEach(item => {
      //   item.label = item.deviceType
      //   item.value = item.deviceType
      //   item.id = item.deviceId || item.id
      // });
      this.setSchemeList(form, data)
      // { type: '杉山服务', schemeType: '杉山服务', schemeName: '盆底康复', schemeTime: '20分钟', schemeEquipment: 'P2', label: '盆底康复', value: '盆底康复' }
    },
    // async getList ({ current = this.pagination.currentPage, size = this.pagination.pageSize }) {
    //   let _list = (await this.request(this.api.adminUms.basemedicalunit.page, { ...this.filterForm, current, size }, { headers: this.globalData.headers })).data
    //   _list = this.libs.data.listFormat(_list)
    //   this.list = _list.list
    //   this.pagination = { ...this.pagination, ..._list.pagination }
    // },
    setSchemeList (from, repeat) {
      // if (Object.keys(from).includes('equipmentType')) repeat.flat().find(item => item.prop === 'equipmentType').repeat = this.serviceType
      // if (Object.keys(from).includes('schemeType')) repeat.flat().find(item => item.prop === 'schemeType').repeat = this.serviceType

      //治疗项目
      if (Object.keys(from).includes('projectName')) {
        // let schemeList = [{ label: '请选择', value: '' }, ...this.schemeList.filter(item => item.type === from.schemeType)]
        let schemeList = [{ label: '请选择', value: '' }, ...this.schemeList]
        if (!from.schemeName) from.schemeName = schemeList[0].value
        let _schemeList = repeat.flat().find(item => item.prop === 'projectName')
        // let _schemeList = repeat.flat().find(item => item.prop === 'deviceType')
        if (_schemeList.repeat) _schemeList.repeat[0].options = schemeList
      }

      // if (Object.keys(from).includes('schemeEquipment')) {
      //   let equipmentList = [{ label: '请选择', value: '' }, ...this.equipmentList.filter(item => item.type === from.schemeType)]
      //   if (!from.schemeEquipment) from.schemeEquipment = equipmentList[0].value
      //   let _schemeEquipment = repeat.flat().find(item => item.prop === 'schemeEquipment')
      //   if (_schemeEquipment.repeat) _schemeEquipment.repeat[0].options = equipmentList
      // }
    },
    statusInit (typeStrList = ['无服务', '待预约', '已预约', '服务中', '服务完毕', '已过期', '标签1', '标签2']) {
      // 枚举所有状态，或者说明数量即可
      return typeStrList.map((n, i) => ({ tagType: item => this.getTagType(item[i]), setLabel: item => item[i] }))
    },
    getTagType (str) {
      let attr = { type: "", style: { margin: '.25em', display: str ? 'inline-flex' : 'none' } }
      const _typeList = {
        info: ['无服务', '服务完毕', '已过期'],
        warning: ['已预约'],
        success: ['服务中'],
        // '':['待预约']
      }
      for (let type in _typeList) {
        if (_typeList[type].includes(str)) {
          attr.type = type
          break
        }
      }
      return attr
    },
    delScheme (row) {
      console.log(row)
    }
  }
}