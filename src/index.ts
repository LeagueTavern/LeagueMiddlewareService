/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:38:35
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-03-20 19:55:02
 * @FilePath: \LeagueMiddlewareService\src\index.ts
 * @Description:
 */

import { LeagueClientManager } from './manager'
import { Server } from './server'

global.LCUManager = new LeagueClientManager()
global.LCUServer = new Server()

LCUManager.on('connected', (symbol, identification) =>
  LCUServer.sendMessageToAllClients(
    JSON.stringify({
      type: 'CLIENT_JOINED',
      identification
    })
  )
)

LCUManager.on('disconnected', (symbol, identification) =>
  LCUServer.sendMessageToAllClients(
    JSON.stringify({
      type: 'CLIENT_LEFT',
      identification
    })
  )
)

LCUManager.on('message', (symbol, identification, message) =>
  LCUServer.sendMessageToAllClients(
    JSON.stringify({
      message: message![2],
      type: 'CLIENT_MESSAGE',
      identification
    })
  )
)

LCUManager.enableAutoConnect()
LCUServer.listen(59101)
