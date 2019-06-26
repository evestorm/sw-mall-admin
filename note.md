# 后端编写步骤

## 准备工作

### 安装 egg 并初始化项目

全局安装 egg （已经安装过的忽略）：

```shell
npm i egg-init -g
```

然后开始初始化项目：

```shell
mkdir sw-mall-admin && cd sw-mall-admin # 你可以换成自己的项目名
npm init egg --type=simple
npm i
```

p.s. 上述初始化过程请科学上网。而且有可能仍然失败，如果失败请多尝试几次。

初始化完成之后你会看到类似下面这段话：

```shell
...egg started on http://127.0.0.1:7001 (2335ms)
```

然后打开此网址你就会看到朴实的 `hi, egg` 字样。到此初始化项目工作已经完成。

### 安装与配置数据库

安装对应的插件 [egg-mysql](https://github.com/eggjs/egg-mysql) ：

```shell
$ npm i egg-mysql
```

在 `config/plugin.js` 中开启插件：

```js
mysql: {
  enable: true,
  package: 'egg-mysql',
},
```

在 `config/config.default.js` 中配置数据库连接信息：

```js
// 配置数据库信息
config.mysql = {
  client: {
    host: '127.0.0.1', // 主机
    port: '8889', // 端口号
    user: 'root', // 用户名
    password: 'root', // 密码
    database: 'sw-mall',  // 数据库名
  },
  app: true,  // 是否加载到 app 上，默认开启
  agent: false, // 是否加载到 agent 上，默认关闭
};
```

### 导入数据库文件

我已经把本地的数据库导出为 [sw-mall.sql](#) 文件，各位需要自行导入到本地的 mysql 中。

### 测试数据库连接

一切准备好后，我们现在可以上手写个简单的查询来测试数据库连接是否正常了。

#### 在 service 层编写数据查询

首先在 `app` 目录下新建 `service` 文件夹，然后建立一个 `test.js` 文件键入下面代码：

```js
'use strict';

const Service = require('egg').Service;

class TestService extends Service {
  /**
   * 查询所有商品分类
   * @return {object} 分类列表
   */
  async findAll() {
    const results = await this.app.mysql.select('category');
    return { results };
  }
}

module.exports = TestService;
```

p.s. 如果不太明白 Service 层的作用，可以点击 [此处](https://eggjs.org/zh-cn/tutorials/mysql.html#service-%E5%B1%82) 查看官方文档。

#### 在 Controller 中获取 Service 数据

编辑 `app/controller/home.js` 文件，新建 test 测试方法：

```js
async test() {
  const { ctx } = this;
  const category = await ctx.service.test.findAll();
  ctx.body = category;
}
```

#### 配置路由

编辑 `app/router.js` 文件配置路由：

```js
// 表示当访问 127.0.0.1:7000/test 时，调用 controller/home.js 下的 test 方法
router.get('/test', controller.home.test);
```

完成上述步骤后可访问 `127.0.0.1:7000/test` 查看效果。如果一切正常，你将会得到下面的数据结构：

```json
{
  "results": [
    {
      "ID": 1,
      "MALL_CATEGORY_NAME": "新鲜水果",
      ...
    },
    ...
  ]
}
```

## 编写注册接口

### 在 Service 中编写查询方法

首先在 `app/service` 文件夹中新建 `admin` 文件夹，并在其中创建 `user.js` 文件，这里负责从数据库中查询符合条件的数据，例如 `findOne` 方法可以根据「email」找到符合条件的管理员。目前我们仅需要实现下列方法：

- findOne（根据邮箱查找目标管理员）
- add（添加一个新管理员）

具体代码见 `app/service/admin/user.js` ，这里不再赘述。

### 安装 bcrypt 和 gravatar

存储密码很重要的一步就是加密，我们采用 bcrypt 帮助我们给密码加盐；同时我们的管理员表的字段中还包含一个 avatar 字段，我们又采用 gravatar 帮我们获取或生成管理员账户的头像。

接下来我们安装它们：

```shell
npm i bcrypt gravatar
```

### 在 Controller 中编写注册逻辑

首先在 `controller` 文件夹下新建 `admin` 文件夹并创建 `user.js`，然后在其中引入刚刚安装的两个包：

```js
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
```

接着在下方新建 `register` 方法编写注册逻辑：

```js
async register() {
  const { ctx } = this;
  ctx.body = ctx.request.body;
  // 判断邮箱是否已经注册过
  const user = await ctx.service.admin.user.findOne(ctx.body.email);
  if (user) {
    ctx.status = 400;
    ctx.body = {
      code: 0,
      msg: '邮箱已被注册!',
    };
  } else {
    let { name, email, password, role } = ctx.body;
    // 加盐
    const salt = bcrypt.genSaltSync(10);
    // 生成hash密码
    const hash = bcrypt.hashSync(password, salt);
    password = hash;
    // 获取/生成全球头像（当该邮箱从未注册过，返回一个默认头像，否则返回用户头像）
    const avatar = gravatar.url(email, {
      s: '200', r: 'pg', d: 'mm',
    });
    const result = await ctx.service.admin.user.add({
      name, email, password, avatar, role,
    });
    if (result) {
      const { user } = await ctx.service.admin.user.findOne(email);
      ctx.status = 200;
      ctx.body = {
        code: 0,
        msg: '恭喜你，注册成功！',
        data: user,
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 1,
        msg: '注册失败，请稍后重试',
      };
    }
  }
}
```

编写完成后使用 Postman 来测试接口：

![测试注册接口](./screenshots/测试注册接口.png)

大功告成~

## 编写登录接口

我们的登录接口采用 jwt 方案，所以首先来安装 jwt：

```shell
npm i jsonwebtoken
```

在 `app/controller/admin/user.js` 中引入：

```js
const bcrypt = require('bcrypt');
```

接着在该文件中创建 `login` 方法编写逻辑代码：

```js
async login() {
  const { ctx } = this;
  const { email, password } = ctx.request.body;
  // 根据email查找该管理员
  const user = await ctx.service.admin.user.findOne(email);
  if (user) {
    const hashpwd = user.password;
    // 比对密码是否一致，一致生成 token 登录成功
    await ctx.service.admin.user.comparePassword(password, hashpwd).then(isMatch => {
      if (isMatch) {
        const { id, name, avatar, identity } = user;
        const rule = { id, name, avatar, identity };
        // jwt.sign('规则', '加密名字', '过期时间')
        const token = jwt.sign(rule, 'lance', { expiresIn: 3600 });
        ctx.status = 200;
        ctx.body = {
          code: 0,
          msg: 'success',
          token: 'Bearer ' + token,
        };
      } else {
        ctx.status = 400;
        ctx.body = {
          code: 1,
          msg: '登录失败，请检查用户名或密码是否填写正确！',
        };
      }
    }).catch(err => {
      ctx.status = 400;
      ctx.body = {
        code: 1,
        msg: err,
      };
    });
  } else {
    ctx.status = 404;
    ctx.body = {
      code: 1,
      msg: '用户不存在！',
    };
  }
}
```

上述代码可以用下面的伪代码概括：

```js
根据用户输入的邮箱在数据库中查找是否存在
如果存在：
  比较用户密码是否与数据库密码一致（利用bcrypt）
  如果一致：
    返回生成的token（利用jwt）
  不一致：
    返回用户登录失败
不存在：
  返回用户不存在
```

完成登录接口的编写后，你可以访问 `127.0.0.1:7000/admin/login` 接口进行登录，登录成功后API会返回token给你，然后你就可以带着这个token来请求当前登录用户的个人数据了。请求个人数据的接口我们定义为 `admin/user` ，该API接收一个 token ，当 token 存在并且没有过期时，该API返回用户的个人数据，下面我们就来编写这个接口。

## 使用 egg-passport-jwt 验证 token

### 安装两个包

首先在命令行键入下面命令来安装包：

```shell
npm i egg-passport egg-passport-jwt
```

### 配置并开启插件

然后在配置文件中声明启用：

> config/plugin.js

```js
passport: {
  enable: true,
  package: 'egg-passport',
},
passportJwt: {
  enable: true,
  package: 'egg-passport-jwt',
},
```

> config/config.default.js

```js
// 配置 passport-jwt
config.passportJwt = {
  secret: 'lance',
};
```

### 挂载路由

接下来我们回到 `app/router.js` 中挂载 jwt ：

```js
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.passport.authenticate('jwt', { session: false, successReturnToOrRedirect: null });
  // admin
  ...
  // 配置路由
  router.get('/admin/user', jwt, controller.admin.user.user);
};
```

### 用户信息处理

现在我们需要在项目根目录下新建 `app.js` 文件，并在其中去数据库里查询用户是否存在：

```js
module.exports = app => {
  app.passport.verify(async (ctx, user) => {
    // 检查用户
    const existsUser = await app.mysql.get('admin', { id: user.payload.id });
    return existsUser;
  });
};
```

至此，我们就完成了所有的配置。

### 在 Controller 中编写 user 方法

最后我们还需要在 `app/controller/admin/user.js` 文件下编写 `user` 方法：

```js
async user() {
  const { ctx } = this;
  // 使用 ctx.isAuthenticated() 判断是否登录。
  if (ctx.isAuthenticated()) {
    const { id, name, avatar, email, identity } = ctx.user;
    ctx.status = 200;
    ctx.body = {
      code: 0,
      msg: '获取信息成功！',
      data: { id, name, avatar, email, identity },
    };
  }
}
```

现在我们使用 Postman 来测试 `admin/user` 这个 API 能否正常工作：

1. 首先通过 `admin/login` 接口获取 token：

  ![获取token](./screenshots/获取token.png)

2. 带着 token 请求 `admin/user` 接口获取管理员个人信息：

  ![获取管理员信息](./screenshots/获取管理员信息.png)

搞定~
