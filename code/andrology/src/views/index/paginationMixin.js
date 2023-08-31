export default {
  data () {
    return {
      list: [],
      filterShow: true,
      fromProp: { labelWidth: '130px' },
      resultList: [],
      pagination: { ...this.globalData.pagination },
    }
  },
  watch: {
    filterForm: {
      handler: function () {
        this.onFilter()
      },
      deep: true
    }
  },
  methods: {
    onPage ({ current = this.pagination.currentPage || 1, size = this.pagination.pageSize, total = this.list.length }, list = this.list) {
      this.resultList = list.slice((current - 1) * size, current * size)
      this.pagination.currentPage = current
      this.pagination.pageSize = size
      this.pagination.total = total
    },
    async onFilter () {
      await this.getList()
      this.list = this.list.filter(item => {
        let _boolen = true
        let _createDate = ''
        for (let { prop, type } of this.filterRepeat.flat()) {
          let _value = this.filterForm[prop]
          if (!_value || _value === '全部') continue
          switch (type) {
            case 'input':
              _boolen = item[prop].includes(_value)
              break;
            case 'dateTimePicker':
              if (_value.length) {
                _createDate = new Date(item.createDate.replace(/-/img, '/'))
                _boolen = _value[0] < _createDate && _createDate < (_value[1] - 0 + 1000 * 60 * 60 * 24)
              }
              break;
            case 'checkbox':
              if (_value.length) _boolen = _value.includes(item[prop])
              break;
            default:
              _boolen = item[prop] === _value
              break;
          }
          if (!_boolen) break
        }
        return _boolen
      })
      this.pagination.total = this.list.length
      return this.onPage({})
    }
  }
}