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
    let projectCode = this.$route.query.projectCode
    if (!projectCode) return
    sessionStorage.projectCode = this.globalData.headers.projectCode = projectCode
  },

  methods: {
  }
}
</script>
<style lang="scss" scoped>
</style>