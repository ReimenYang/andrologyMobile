<template>
  <el-dialog
    top="5vh"
    :title="title"
    v-model="showDialog"
    :width="width"
  >
    <info
      type="add"
      @confirm="dialogConfirm"
      @close="$emit('close')"
    />
  </el-dialog>
</template>
<script>
import info from './_info.vue'
export default {
  name: 'AddProject',
  components: { info },
  props: {
    title: {
      type: String,
      default: () => '新增'
    }
  },
  data () {
    return {
      showDialog: true,
      width: '1300px'
    }
  },
  methods: {
    async dialogConfirm () {
      this.$emit('close')
      this.$emit('refresh')
    }
  }
}
</script>