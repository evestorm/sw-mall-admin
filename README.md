# admin-mall

## 介绍

一款在线商城的后台管理系统项目。后端采用 Egg + MySQL ，前端采用 Vue + Element 。

### 线上地址

- [后台管理系统](http://mall.evelance.cn/admin)
- 账号：admin@qq.com
- 密码：admin@qq.com

### 前端项目地址

- [sw-mall](https://github.com/evestorm/sw-mall)

## 技术栈

### 前端

- Vue全家桶
- Element-UI

### 后端

- EggJS
- MySQL

## 使用

下载[此sql文件](sw-mall.sql)将其导入你自己的mysql文件中。

### 安装

分别在根目录和 `client` 目录下执行 `npm install` 安装所需要的包。

### 启动

启动 egg ：

```shell
npm run dev
```

启动 vue ：

```shell
cd client
npm run serve
```

### 快速登录

- 账号：admin@qq.com
- 密码：admin@qq.com

### 项目编写说明

想要了解该项目的大致构建流程？点击[此处查看编写说明](./note_with_toc.md)

## 功能

- [x] 登录/注册
  - [x] 管理员权限
  - [x] JWT验证
- [x] 首页（EchartJS）
  - [x] 周注册用户
  - [x] 周商品上新
  - [x] 商品销量前十
- [x] 商品
  - [x] 分类添加与删除
  - [x] 商品添加与删除
  - [x] 商品推荐
