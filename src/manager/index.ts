/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:38:35
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 14:09:56
 * @FilePath: \LeaugeMiddleware\src\manager\index.ts
 * @Description:
 */
import { LeagueClientConnector, commandLineParser } from '../lcu'
import { getProcessFromName, getCommandlineFromPid } from '../process'
import type { iLcuEventType, iLcuEventMap, iLcuEvent } from './types'
import type {
  iLcuConnectCert,
  iLcuConnectSocketMsg,
  iLcuClientIdentification
} from '../lcu'

export class LeagueClientManager {
  private clients: Map<symbol, LeagueClientConnector> = new Map()
  private events: iLcuEventMap = new Map()
  private autoIntervalHandle: NodeJS.Timer | null = null
  private autoIntervalDuration = 3000

  // EventBus
  on(type: iLcuEventType, handler: iLcuEvent): symbol {
    const symbol = Symbol()
    // 加入事件
    this.events.set(symbol, {
      type,
      handler
    })

    return symbol
  }

  off(symbol: symbol) {
    this.events.delete(symbol)
  }

  private emit(
    type: iLcuEventType,
    clientSymbol: symbol,
    clientIdentification: iLcuClientIdentification,
    message?: iLcuConnectSocketMsg<unknown>
  ) {
    this.events.forEach((event) => {
      if (event.type === type) {
        event.handler.call(null, clientSymbol, clientIdentification, message)
      }
    })
  }

  // 链接LCU client
  connect(cert: iLcuConnectCert) {
    // 是否已经连接过了
    if (this.isConnect(cert)) {
      return false
    }

    const client = new LeagueClientConnector()
    const clientSymbol = Symbol()
    const clientConnect = client.connect(cert)

    return new Promise<{ clientSymbol: symbol } & iLcuClientIdentification>(
      (resolve, reject) => {
        clientConnect
          .then(() => {
            // 连接成功
            // 绑定事件，并添加到类内储存起来

            const clientIdentification = client.getIdentification()
            const disconnectExecutorSymbol = client.on('disconnected', () => {
              this.clients.delete(clientSymbol)
              this.emit('disconnected', clientSymbol, clientIdentification)
              client.off(disconnectExecutorSymbol)
            })

            client.on('message', (_idfc, message) => {
              this.emit('message', clientSymbol, clientIdentification, message!)
            })

            this.clients.set(clientSymbol, client)
            this.emit('connected', clientSymbol, clientIdentification)

            resolve({
              ...clientIdentification,
              clientSymbol
            })
          })
          .catch(reject)
      }
    )
  }

  // 判断目标客户端是否被连接过
  isConnect(cert: iLcuConnectCert) {
    let isConnect = false
    // 遍历已连接的客户端 判断目标cert是否已经连接
    this.clients.forEach((client) => {
      const currentCert = client.getCert()!
      if (currentCert.token === cert.token && currentCert.port === cert.port) {
        isConnect = true
      }
    })

    return isConnect
  }

  // 获取所有client
  getClients() {
    return this.clients
  }

  // 通过symbol取出client
  getClientBySymbol(symbol: symbol): LeagueClientConnector | null {
    let client: LeagueClientConnector | null = null

    this.getClients().forEach((currentClient, currentSymbol) => {
      if (symbol === currentSymbol) client = currentClient
    })

    return client
  }

  // 通过puuid取出client
  getClientByPuuid(puuid: string): LeagueClientConnector | null {
    let client: LeagueClientConnector | null = null

    this.getClients().forEach((currentClient, currentSymbol) => {
      if (puuid === currentClient.getIdentification().puuid) {
        client = currentClient
      }
    })

    return client
  }

  // 启用自动寻找客户端
  enableAutoConnect() {
    const handler = async () => {
      try {
        const processList = await getProcessFromName('LeagueClientUx.exe')
        // 遍历已经获取的LCU进程列表 使用Commandline解析器解析命令行
        // 提取出有效信息后 使用连接器进行连接
        processList.forEach(async (process) => {        
          const cmd = await getCommandlineFromPid(process.processId)
          
          if (cmd[0] == null) {
            console.error("getCommandlineFromPid Err: ", cmd[1])
            return;
          }
          
          const cert = commandLineParser(cmd[0])

          // cert是否可用，且没有被连接过
          if (cert.available && !this.isConnect(cert)) {
            const clientConnect = this.connect(cert)

            // 连接已建立
            if (clientConnect) {
              clientConnect
                .then((info) => {
                  // console.log(info, cert)
                })
                .catch((err) => {
                  console.error(err, cert)
                })
            }
          }
        })
      } catch (err) {
        console.error(err)
      }
    }

    if (!this.autoIntervalHandle) {
      this.autoIntervalHandle = setInterval(handler, this.autoIntervalDuration)
      handler()
    }
  }

  // 禁用自动寻找客户端
  disableAutoConnect() {
    if (this.autoIntervalHandle) {
      clearInterval(this.autoIntervalHandle)
      this.autoIntervalHandle = null
    }
  }
}
