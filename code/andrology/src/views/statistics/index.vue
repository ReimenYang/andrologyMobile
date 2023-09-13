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
    window.addEventListener('message', this.messageListener)
    this.url = (await this.request(this.api.andrology.bi.getBIReportUrl)).data.url
  },
  methods: {
    messageListener (event) {
      // Quick BI地址，如使用其他地址可自行补充
      const quickBIURL = [this.url];
      if (quickBIURL.includes(event.origin)) {
        // 使用postMessage传出的高度
        console.log('Quick BI Dashboard Height:', event.data.height);
        // 使用postMessage传出的仪表板页面ID
        console.log('Quick BI Dashboard Id:', event.data.pageId);
      }
      // 主动请求Quick BI仪表板高度
      // 嵌入Quick BI仪表板的Iframe
      const iframe = document.querySelector('iframe');
      // message传入的data中必须包含{ getDashboardHeight: true }
      iframe.contentWindow.postMessage({ getDashboardHeight: true }, '*');
    }

  }
}
</script>

