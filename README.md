# Joybook Tampermonkey

## 安装
1. 第一步 [Tampermonkey BETA](https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf) [必须]
2. 第二步 [测试版](https://github.com/PC6live/joybook-tampermonkey/raw/master/dist/joybook.user.js)

## 使用说明

此模块主要解决的是使用朋友的账号时观看历史，收藏，评论，点评，短评，弹幕，动态和消息不同步至自己账号很不方便的问题，如果妮打算用这个来实现买一个号多人用，我劝你还是洗洗睡吧，B 站想封就封，学生党 3 人一起买一个大会员账号使用本插件一起享受大会员带来的画质我个人觉得是比较合适的。

## 操作说明

1. 登录账号。
2. 等待自动刷新直到可以再次登录。
3. 确认左下角出现刚才登陆过的账号头像（普通用户蓝色边框，大会员用户粉红边框）。
4. 登录另一个账号（第一步是会员账户，则登录你的账户，反之亦然）。
5. 刷新并允许弹出的 Tampermonkey 跨源资源请求。

## 注意事项

1. 如果无法正常使用，可以点击左下角头像清除数据之后并禁用其他 Tampermonkey 脚本再次尝试。
2. csrf校验失败，清除数据之后重新登录。

## 本地构建

- 安装 [Node.js](https://nodejs.org) Current 或者 LTS 版本
- 安装依赖 npm install 或者 yarn
- 构建生产版本使用 yarn build 或者 npm run build
