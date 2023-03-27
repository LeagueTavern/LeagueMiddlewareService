/*
 * @Author: zyxeeker zyxeeker@gmail.com
 * @Date: 2023-03-27 16:30:29
 * @LastEditors: zyxeeker zyxeeker@gmail.com
 * @LastEditTime: 2023-03-27 16:56:58
 * @FilePath: \LeaugeMiddleware\src\util\net.ts
 * @Description: 网络请求工具函数
 */

// 生成本地随机地址
export function getRandomLocalAddress() {
  return `127.${Math.round(Math.random() * 254)}.${Math.round(Math.random() * 254)}.${Math.round(Math.random() * (250 - 2))}`
}