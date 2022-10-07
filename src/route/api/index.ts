/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-07 22:28:00
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-07 22:29:42
 * @FilePath: \LeaugeMiddleware\src\route\api\index.ts
 * @Description: 
 */
import { Router } from 'express'
import { routes as getClientsRoutes } from './get-clients'

export const routes = Router()
routes.all('*', getClientsRoutes)
