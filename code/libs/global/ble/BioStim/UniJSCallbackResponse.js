/**
 * 杉山ble治疗仪结果格式化类
 * power by 志凡
 */
export class UniJSCallbackResponse {
  constructor(type, data) {
    this.callBackType = type
    this.callBackData = JSON.stringify(data)
  }
}
