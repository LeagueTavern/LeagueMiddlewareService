/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-07 14:16:08
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 14:57:35
 * @FilePath: \LeaugeMiddleware\src\server\index.ts
 * @Description:
 */
import Express from 'express'
import WebSocket from 'ws'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import { morganMiddleware } from '../logger'
import { render } from '../route'

export class Server {
  private app = Express()
  private port = 0
  private httpServer = http.createServer(this.app)
  private websocketServer = new WebSocket.Server({
    server: this.httpServer,
    path: '/'
  })

  constructor() {
    const corsOption = {
      origin: '*',
      optionsSuccessStatus: 200
    }

    // body-parser 解析请求
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(bodyParser.json())
    this.app.use(cors(corsOption))
    this.applyLogger()
    this.applyRender()
  }

  private applyLogger() {
    this.app.use(morganMiddleware)
  }

  private applyRender() {
    render(this.app)
  }

  getHttpServer() {
    return this.httpServer
  }

  getWebsocketServer() {
    return this.websocketServer
  }

  listen(port: number, ev?: () => void) {
    // TCP/IP 端口规则 0-65535
    if (port <= 0 || port >= 65535)
      throw new Error('PORT need to be set between 0-65535')
    this.port = port
    this.httpServer.listen(this.port, () => {
      console.log(`HTTP: http://127.0.0.1:${this.port}/`)
      console.log(`WEBSOCKET: ws://127.0.0.1:${this.port}/`)
      if (ev) ev()
    })
  }
}
