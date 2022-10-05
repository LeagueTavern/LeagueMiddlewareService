/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-04 19:41:03
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-05 21:40:09
 * @FilePath: \LeaugeMiddleware\src\lcu\connector.ts
 * @Description:
 */

import axios, { AxiosInstance } from 'axios'
import { encode as base64Encode } from 'js-base64'
import { WebSocket } from 'ws'
import type { iLcuConnectCert, iLcuSummonerInfo } from './types'

export class LeagueClientConnector {
  private cert: iLcuConnectCert | null = null
  private httpClient: AxiosInstance | null = null
  private websocketClient: WebSocket | null = null

  // 分析LCU是否可用
  static check(cert: iLcuConnectCert) {
    const host = `${cert.protocol}://127.0.0.1:${cert.port}`
    const url = `/lol-summoner/v1/current-summoner`
    const headers = {
      Authorization: `Basic ${base64Encode(`riot:${cert.token}`)}`
    }

    return new Promise<iLcuSummonerInfo>((resolve, reject) => {
      axios
        .get<iLcuSummonerInfo>(`${host}${url}`, { headers })
        .then(({ data }) => (data.accountId ? resolve(data) : reject()))m
        .catch(reject)
    })
  }

  // 链接LCU http/ws 服务
  connect(cert: iLcuConnectCert) {
    return new Promise((resolve, reject) => {
      const url = `/lol-summoner/v1/current-summoner`
      const baseURL = `${cert.protocol}://127.0.0.1:${cert.port}`
      const httpClient = axios.create({
        baseURL,
        headers: {
          Authorization: `Basic ${base64Encode(`riot:${cert.token}`)}`
        }
      })

      httpClient
        .get<iLcuSummonerInfo>(url)
        .then(({ data }) => {
          // 用户是否合法
          if (!data.accountId) return reject()

          // 链接websocket
          const websocketUrl = `wss://riot:${cert.token}@127.0.0.1:${cert.port}/`
          const websocketClient = new WebSocket(websocketUrl)

          websocketClient.onopen = (event) => {}
          websocketClient.onmessage = (event) => {}
          websocketClient.onerror = (event) => {}
          websocketClient.onclose = (event) => {}
        })
        .catch(reject)
    })
  }

  isAvailable() {
    return this.cert && this.httpClient && this.websocketClient
  }
}
