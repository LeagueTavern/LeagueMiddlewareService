export * from './morgan'

function getTime(timestamp?: number) {
  const currentDate = timestamp ? new Date(timestamp) : new Date()
  const lengthFormat = (t: string) => (t.length < 2 ? `0${t}` : t)

  const currentHours = currentDate.getHours() + ''
  const currentMinutes = currentDate.getMinutes() + ''
  const currentSeconds = currentDate.getSeconds() + ''

  return (
    '[' +
    lengthFormat(currentHours) +
    ':' +
    lengthFormat(currentMinutes) +
    ':' +
    lengthFormat(currentSeconds) +
    ']'
  )
}

// 连接成功提示
export function log_connected(remoteAddress: string) {
  console.log(`${getTime()}[WEBSOCKET:CONNECTED] ${remoteAddress}`)
}

// 连接失败提示
export function log_disconnected(remoteAddress: string) {
  console.log(`${getTime()}[WEBSOCKET:DISCONNECTED] ${remoteAddress}`)
}

// 综合提示
export function log_logger(message: string, type: 'HTTP' | 'WEBSOCKET') {
  console.log(`${getTime()}[HTTP:${type}] ${message}`)
}

// 客户端加入提示
export function log_client_join(puuid: string, displayName: string) {
  console.log(`${getTime()}[LCU:JOINED] ${displayName}(${puuid})`)
}

// 客户端退出提示
export function log_client_leave(puuid: string, displayName: string) {
  console.log(`${getTime()}[LCU:LEFT] ${displayName}(${puuid})`)
}

// 客户端消息提示
export function log_client_message(
  puuid: string,
  displayName: string,
  uri: string
) {
  console.log(
    `${getTime()}[LCU:MESSAGE] ${displayName}(${puuid}) -> uri:${uri}`
  )
}

// 客户端未知消息提示
export function log_client_unknown_message(
  puuid: string,
  displayName: string,
  length: number
) {
  console.error(
    `${getTime()}[LCU:ERROR] Unknown data from ${displayName}(${puuid}), length: ${length}`
  )
}

// 客户端连接失败提示
export function log_client_connect_error(
  port: number,
  token: string,
  reason: string
) {
  console.error(
    `${getTime()}[LCU:ERROR] An error occurred while connecting to client:${port}(token:${token}), reason: ${reason}`
  )
}
