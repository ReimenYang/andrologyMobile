<template>
  <iframe
    v-if="url"
    style="width: 100%;height:calc(100% - var(--header-height) * 1.5);border: none;"
    :src="url"
  />
</template>

<script>
export default {
  data () {
    return {
      url: '',
    }
  },
  async created () {
    this.url = (await this.request(this.api.andrology.bi.getBIReportUrl)).data.url
  }
}
</script>

