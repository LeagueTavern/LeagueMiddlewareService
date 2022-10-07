/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-07 14:55:10
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 22:32:48
 * @FilePath: \LeaugeMiddleware\src\route\index.ts
 * @Description:
 */

import type { Express } from 'express'
import { routes as clientRoutes } from './client'
import { routes as apiRoutes } from './api'

export function render(app: Express) {
  app.use('/client', clientRoutes)
  app.use('/api', apiRoutes)
}
