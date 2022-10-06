/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:38:35
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-06 22:43:30
 * @FilePath: \LeaugeMiddleware\src\index.ts
 * @Description:
 */

import { LeagueClientManager } from './manager'

const LCUManager = new LeagueClientManager()
LCUManager.on('connected', (symbol, identificationm) => {
  console.log('join', identificationm)
})

LCUManager.on('disconnected', (symbol, identificationm) => {
  console.log('leave', identificationm)
})

LCUManager.on('message', (symbol, identificationm, message) => {
  console.log('message', identificationm, message)
})

LCUManager.enableAutoConnect()
console.log('Running')
