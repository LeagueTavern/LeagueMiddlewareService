/*
 * @Author: Coooookies admin@mitay.net
 * @Date: 2022-10-06 20:38:00
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2022-10-06 20:45:13
 * @FilePath: \LeaugeMiddleware\src\manager\types.ts
 * @Description:
 */
import type { iLcuClientIdentification, iLcuConnectSocketMsg } from '../lcu'

export type iLcuEventType = 'connected' | 'disconnected' | 'message'
export type iLcuEvent = (
  clientSymbol: symbol,
  clientIdentification: iLcuClientIdentification,
  message?: iLcuConnectSocketMsg<unknown>
) => void

export type iLcuEventMap = Map<
  symbol,
  {
    type: iLcuEventType
    handler: iLcuEvent
  }
>
