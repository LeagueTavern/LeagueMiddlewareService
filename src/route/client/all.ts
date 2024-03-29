/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-07 20:21:29
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 22:28:41
 * @FilePath: \LeaugeMiddleware\src\route\client\all.ts
 * @Description:
 */

import https from 'https'
import { Router } from 'express'
import { getRandomLocalAddress } from '../../util/net'
const routes = Router()

routes.all('/:puuid/:url(*)', (req, res) => {
  const puuid = req.params.puuid
  const url = req.params.url
  const method = req.method
  const query = req.query
  const body = req.body

  const client = LCUManager.getClientByPuuid(puuid)
  if (!client) {
    res.status(404)
    res.json({
      type: 'CLIENT_NOT_FOUND',
      puuid
    })
    return
  }
  const httpClient = client.getHttpClientInstance()
  const cert = client.getCert()
  
  // 使用本地随机地址
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
    localAddress: getRandomLocalAddress(),
    localPort: cert?.port
  })
  
  const httpRequest = httpClient({
    url,
    method,
    params: query,
    data: body,
    httpsAgent:httpsAgent
  })

  const httpResponseCallback = (status: number, body: unknown) => {
    res.status(status)
    res.json(body)
  }

  httpRequest
    .then((response) => {
      httpResponseCallback(response.status, response.data)
    })
    .catch((err) => {
      const response = err.response

      if (response) {
        httpResponseCallback(response.status, response.data)
      } else {
        res.status(503)
        res.send(`{"type":"CLIENT_NOT_RESPONSE","puuid":${puuid},"err":${err}}`)
      }
    })
})

export { routes }
