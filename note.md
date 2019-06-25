# 后端编写步骤

## 初始化项目

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
