<!--
 * @Author: Coooookies admin@mitay.net
 * @Date: 2023-03-23 14:50:26
 * @LastEditors: Coooookies admin@mitay.net
 * @LastEditTime: 2023-03-25 00:21:36
 * @FilePath: \LeagueMiddlewareService\README.md
 * @Description:
-->

# LeagueMiddleware

用于连接英雄联盟客户端(LeagueClientUpdate API)的中间组件

<p>
  <a href="https://nodejs.org/">
    <img src="https://img.shields.io/node/v/nodejs/latest?style=flat-square" alt="node-current (tag)">
  </a>
  <a href="https://github.com/LeagueTavern/LeagueMiddlewareService/issues">
    <img src="https://img.shields.io/github/issues/LeagueTavern/LeagueMiddlewareService?logo=github&style=flat-square" alt="GitHub Issues">
  </a>
</p>

### 💻 平台支持

- [x] Windows
- [ ] Macos(计划支持)

---

### 🍹 接口

本中间件在启动后，会开放`HTTP` `WEBSOCKET`两个服务。

- `HTTP`部分的**默认端口**为`59101`，负责发送请求给`客户端`，比如获取`精粹数量` `分解皮肤碎片`
- `WEBSOCKET`部分负责转发所有与`客户端`的数据给`使用者`，比如`房间创建事件`，`玩家状态变动事件`

#### `HTTP`接口

##### 1. 获取所有已连接客户端的数据

```
GET /get/get-clients
```

```JSON
// Response
[
    {
        "accountId": "accountId", // 账户ID
        "puuid": "15911e14-89af-d8ad-2a29-ab8c1998ced2", // 账户PUUID
        "displayName": "displayName", // 账户名称
        "port": 53021, // 端口
        "token": "Ka9gf_aiNF0dFK1KAg-", // token
        "protocol": "https" // 协议 http/https
    },
    {
        "accountId": "accountId",
        "puuid": "15911e14-89af-d8ad-2a29-ab8c1998ced2",
        "displayName": "displayName",
        "port": 53021,
        "token": "Ka9gf_aiNF0dFK1KAg-",
        "protocol": "https"
    },
    ...
]
```

##### 2. 发送请求给指定客户端

```
GET /client/:puuid/:url(*)
POST /client/:puuid/:url(*)
PUT /client/:puuid/:url(*)
PATCH /client/:puuid/:url(*)
DELETE /client/:puuid/:url(*)
OPTIONS /client/:puuid/:url(*)
HEAD /client/:puuid/:url(*)
```

```JSON
// Response
// 返回对应LCU请求的结果
// ...
```

:warning: 本请求需自行携带相应的 `query-param` `params` `body`

```
🌰 例子 & 解释
GET /client/15911e14-89af-d8ad-2a29-ab8c1998ced2/lol-summoner/v1/current-summoner
    /client/(puuid)                             /(url)
```

#### `WEBSOCKET`通信

该服务只会转发来自`LCU`通信隧道传输的数据和客户端的`加入/退出`信息，**不会回应用户发送的任何信息**。以下是你会接收到的 3 种数据：

```json
// 客户端加入事件
{
  "type": "CLIENT_JOINED",
  "identification": {
    "accountId": "accountId", // 账户ID
    "puuid": "15911e14-89af-d8ad-2a29-ab8c1998ced2", // 账户PUUID
    "displayName": "displayName" // 账户名称
  }
}
```

```json
// 客户端关闭事件
{
  "type": "CLIENT_LEFT",
  "identification": {
    "accountId": "accountId", // 账户ID
    "puuid": "15911e14-89af-d8ad-2a29-ab8c1998ced2", // 账户PUUID
    "displayName": "displayName" // 账户名称
  }
}
```

```json
// 客户端隧道消息事件
{
  "type": "CLIENT_MESSAGE",
  "identification": {
    "accountId": "accountId", // 账户ID
    "puuid": "15911e14-89af-d8ad-2a29-ab8c1998ced2", // 账户PUUID
    "displayName": "displayName" // 账户名称
  },
  "message": {
    "eventType": "", // Method
    "uri": "/lol-xxxx/v1/xxxxx/xxxxx", //
    "data": {
      // 数据
      // 请参考RIOT开发者文档
    }
  }
}
```

---

### 🍗 项目启动

#### 安装

```bash
npm install
```

#### 调试

```bash
npm run dev
```

#### 编译

```bash
npm run build
```

#### 打包

###### `Windows`平台

```bash
npm run build:exe
```
