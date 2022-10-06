/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:41:03
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-06 22:39:56
 * @FilePath: \LeaugeMiddleware\src\lcu\index.ts
 * @Description:
 */
export * from './types'
export * from './parser'
import https from 'https'
import axios, { AxiosInstance } from 'axios'
import { encode as base64Encode } from 'js-base64'
import { WebSocket } from 'ws'
import type {
  iLcuConnectCert,
  iLcuSummonerInfo,
  iLcuConnectSocketMsg,
  iLcuEventMap,
  iLcuEventType,
  iLcuEvent
} from './types'

const httpsAgent = new https.Agent({
  rejectUnauthorized: false
})

export class LeagueClientConnector {
  private cert: iLcuConnectCert | null = null
  private httpClient: AxiosInstance | null = null
  private websocketClient: WebSocket | null = null

  private events: iLcuEventMap = new Map()
  private accountId = 0
  private puuid = ''
  private displayName = ''

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

  private emit(type: iLcuEventType, message?: iLcuConnectSocketMsg<unknown>) {
    const clientIdentification = this.getIdentification()

    this.events.forEach((event) => {
      if (event.type === type) {
        event.handler.call(null, clientIdentification, message)
      }
    })
  }

  // 分析LCU是否可用
  static check(cert: iLcuConnectCert) {
    const host = `${cert.protocol}://127.0.0.1:${cert.port}`
    const url = `/lol-summoner/v1/current-summoner`
    const headers = {
      Authorization: `Basic ${base64Encode(`riot:${cert.token}`)}`
    }

    return new Promise<iLcuSummonerInfo>((resolve, reject) => {
      axios
        .get<iLcuSummonerInfo>(`${host}${url}`, { headers, httpsAgent })
        .then(({ data }) => (data.accountId ? resolve(data) : reject()))
        .catch(reject)
    })
  }

  // 链接LCU http/ws 服务
  connect(cert: iLcuConnectCert) {
    return new Promise<iLcuSummonerInfo>((resolve, reject) => {
      const url = `/lol-summoner/v1/current-summoner`
      const baseURL = `${cert.protocol}://riot:${cert.token}@127.0.0.1:${cert.port}`
      const headers = {
        Authorization: `Basic ${base64Encode(`riot:${cert.token}`)}`
      }

      const httpClient = axios.create({
        baseURL,
        httpsAgent,
        headers
      })

      httpClient
        .get<iLcuSummonerInfo>(url)
        .then(({ data }) => {
          // 用户是否合法
          if (!data.accountId)
            return reject({
              type: 'LCU Http error',
              err: 'Account is wrongful'
            })

          // 链接websocket
          const websocketUrl = `wss://riot:${cert.token}@127.0.0.1:${cert.port}/`
          const websocketClient = new WebSocket(websocketUrl, {
            headers,
            rejectUnauthorized: false
          })
          // ws链接成功
          websocketClient.onopen = (event) => {
            // 注册实例
            this.cert = cert
            this.httpClient = httpClient
            this.websocketClient = websocketClient

            // 记录客户端状态
            this.accountId = data.accountId
            this.puuid = data.puuid
            this.displayName = data.displayName

            // 接收ws数据
            this.active()
            this.emit('connected')
            resolve(data)
          }

          // ws接受到消息
          websocketClient.onmessage = (event) => {
            const message = event.data
            if (typeof message !== 'string') return

            try {
              // 将LCU的内容转换成JSON
              const timeStamp = new Date().getTime()
              const dataType = 'json'
              const data = JSON.parse(message)
              // 接受到数据 转发到EventBus
              this.emit('message', data)
            } catch (e) {
              // 数据不对劲
              console.error('Unknown LCU message', message)
            }
          }

          // 链接错误
          websocketClient.onerror = (error) => {
            reject({
              type: 'LCU Websocket error',
              err: 'Websocket connect error'
            })
          }

          // ws关闭
          websocketClient.onclose = (event) => {
            this.cert = null
            this.httpClient = null
            this.websocketClient = null
            this.accountId = 0
            this.puuid = ''
            this.displayName = ''
            this.emit('disconnected')
          }
        })
        .catch((err) => {
          console.log(err)

          return reject({
            type: 'LCU Http error',
            err: "API client can't fetch anything"
          })
        })
    })
  }

  isAvailable() {
    return this.cert && this.httpClient && this.websocketClient
  }

  getIdentification() {
    return {
      accountId: this.accountId,
      puuid: this.puuid,
      displayName: this.displayName
    }
  }

  getCert() {
    return this.cert
  }

  private active() {
    this.websocketClient!.send(JSON.stringify([5, 'OnJsonApiEvent']))
  }
}
