/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:38:35
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 22:24:54
 * @FilePath: \LeaugeMiddleware\src\index.ts
 * @Description:
 */

import { LeagueClientManager } from './manager'
import { Server } from './server'

const LCUManager = new LeagueClientManager()
global.LCUManager = LCUManager

const LCUServer = new Server()
LCUManager.on('connected', (symbol, identificationm) => {
  console.log('join', identificationm)
})

LCUManager.on('disconnected', (symbol, identificationm) => {
  console.log('leave', identificationm)
})

LCUManager.on('message', (symbol, identificationm, message) => {
  console.log('message', identificationm, message![2])
})

LCUManager.enableAutoConnect()
LCUServer.listen(59101)

console.log('Running')
