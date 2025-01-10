# Joybook Tampermonkey

## 停止维护
根据b站大会员规则第六条，本脚本暂停维护。

## 安装
1. 在 chrome 应用商店安装 [Tampermonkey BETA](https://chrome.google.com/webstore/detail/tampermonkey-beta/gcalenpjmijncebpfijmoaglllgpjagf)
2. 点击[脚本](https://github.com/PC6live/joybook-tampermonkey/raw/master/dist/joybook.user.js)或者[Greasy Fork](https://greasyfork.org/zh-CN/scripts/449163-bilibili-joybook)进行安装

## 脚本说明

1. 共享大会员权限给普通账号
2. 不同步观看历史、收藏、评论、点评、短评、弹幕、动态、消息等内容。

## 操作说明

1. 登录账号。
2. 等待自动刷新直到可以再次登录。
3. 确认左下角出现刚才登陆过的账号头像（普通用户蓝色边框，大会员用户粉红边框）。
4. 登录另一个账号（第一步是会员账户，则登录你的账户，反之亦然）。
5. 刷新。

## 注意事项

1. 如果无法正常使用，尝试在禁用所有扩展和其他 Tampermonkey 脚本后再次尝试。

## 本地构建

- 安装 [Node.js](https://nodejs.org) Current 或者 LTS 版本
- 安装依赖 npm install
- 构建生产版本使用 npm run build
