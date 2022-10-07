/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-07 20:21:29
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 22:34:55
 * @FilePath: \LeaugeMiddleware\src\route\api\get-clients.ts
 * @Description:
 */

import { Router } from 'express'
import type { iLcuClientIdentification, iLcuConnectCert } from '@src/lcu'
const routes = Router()

routes.get('/get-clients', (req, res) => {
  const clients: (iLcuClientIdentification & iLcuConnectCert)[] = []

  LCUManager.getClients().forEach((client) => {
    clients.push({
      ...client.getIdentification(),
      ...client.getCert()!
    })
  })

  res.json(clients)
})

export { routes }
