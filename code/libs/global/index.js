import user from './user'// 用户相关业务
import wechat from './wechat'// 微信相关业务
import uniLogin from './uniLogin'// uniapp一键登录
import ble from './ble'// uniapp蓝牙ble基础类
import tools from './tools'// 工具集
import project from '@/projectConfig.js'

if (!project.projectType.app) ble = {}

export default { global: { user, wechat, uniLogin, ble, tools } }
