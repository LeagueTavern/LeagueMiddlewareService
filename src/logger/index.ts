export * from './morgan'

function getTime(timestamp?: number) {
  const currentDate = timestamp ? new Date(timestamp) : new Date();
  const lengthFormat = (t: string) => t.length < 2 ? `0${t}` : t;

  const currentHours = currentDate.getHours() + '';
  const currentMinutes = currentDate.getMinutes() + '';
  const currentSeconds = currentDate.getSeconds() + '';

  return "[" + lengthFormat(currentHours) + ":" +
    lengthFormat(currentMinutes) + ":" +
    lengthFormat(currentSeconds) + "]"
}

// 连接成功提示
export function log_connected(remoteAddress: string) {
  console.log(`${getTime()}[WEBSOCKET] Client ${remoteAddress} connected`)
}

// 接收数据提示
export function log_receiveMessage(message: string, remoteAddress: string) {
  console.log(`${getTime()}[WEBSOCKET] Receive data from client ${remoteAddress}, length: ${message.length}`)
}

// 综合提示
export function log_logger(message: string, type: 'HTTP' | 'WEBSOCKET') {
  console.log(`${getTime()}[${type}] ${message}`)
}