<template>
  <div>
    <info type="edit" />
  </div>
</template>


<script>
import info from './_info.vue'
export default {
  components: { info },
  data () {
    return {
    }
  },
  async created () {
    let { projectCode, projectName } = this.$route.query
    if (!projectCode) return
    sessionStorage.projectCode = this.globalData.headers.projectCode = projectCode
    sessionStorage.projectName = projectName

    this.globalData.orgList = (await this.request(this.api.andrology.projectMgt.getProjectOrgList)).data
    this.globalData.groupList = (await this.request(this.api.andrology.projectMgt.getProjectGroupList)).data
  },

  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>