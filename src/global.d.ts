/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-09-05 20:59:43
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 14:43:23
 * @FilePath: \LeaugeMiddleware\src\global.d.ts
 * @Description:
 */
import { LeagueClientManager } from './manager'
import { Server } from './server'

declare global {
  var LCUManager: LeagueClientManager
  var LCUServer: Server
}

export {}
