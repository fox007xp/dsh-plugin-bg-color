# dsh-plugin-bg-color

**简体中文** · [English](README.en.md)

在 DSH 里实时调整整窗、面板、浮层和侧边栏的背景色。每改一次颜色都直接作为主题 token 覆盖层生效，不重载页面。

## 功能

面板浮在 Web 界面右下角，提供：

- **8 套配色组合**，每套都同时写了浅色和深色两版，点一下不管当前是哪种模式都会立刻看到变化。所有预设都停在明度安全区（浅色版主底 ≥ `#ed`，深色版 ≤ `#2c`），这样主题自带的文字颜色不会被顶掉。
- **分区微调**：原生取色器 + 可直接粘贴的十六进制输入框。
- **浅色 / 深色分栏**：两个模式能分别调，面板上标了当前实际生效的是哪个。
- **全部重置**：撤掉覆盖层，回到内置配色。

选择存在 `localStorage` 的 `dsh-plugin-bg-color.regions` 里，刷新页面自动恢复。

## 改了哪些 token

用的是 `theme.overrideTokens()` 叠一层覆盖，不是替换主题，所以卸载时能干净撤掉。

| 区域 | Token |
|---|---|
| 整窗底色 | `--dsw-alias-bg-base` |
| 一级面板 | `--dsw-alias-bg-layer-1` |
| 二级面板 | `--dsw-alias-bg-layer-2` |
| 浮层与弹窗 | `--dsw-alias-bg-overlay` |
| 侧边栏 | `--dsw-specific-sidebar-fill` |

这些 token 名是 DSH 内部约定。将来改名只会让外观退化，不会让界面渲染崩掉。

## 安装

从插件市场装（Plugins → Custom plugin indexes 里加下面这个源，然后进 Discover）：

```
https://raw.githubusercontent.com/fox007xp/dsh-plugin-bg-color/main/index.json
```

或者直接装本地目录：

```
plugin_manager install_bundle, target: <本目录路径>
```

## 文件结构

| 文件 | 作用 |
|---|---|
| `index.js` | Host 半；不声明服务、没有配置。 |
| `client.js` | Client 半；面板 + token 覆盖层。 |
| `cordis.patch.yml` | 插入 `bg-color` 这一行。 |
| `locale/en.json`、`locale/zh.json` | 插件管理器里显示的中英标题与描述。 |
| `index.json` | 插件市场索引（format 1，git 源）。 |
| `icon.svg` | 原创图标。 |
| `.github/workflows/ci.yml` | CI：语法检查、官方校验器验索引、核对 pin 的 commit。 |
| `tooling/check.mjs` | 本地跑同一套检查。 |
| `VERIFICATION.md` | 验证记录：验过什么、怎么验的、哪些没验。 |

## 本地校验

push 到 main、打 tag 或提 PR 时，CI 会自动跑下面这套检查。本地复现：

```sh
npm install --no-save --no-package-lock --ignore-scripts @deepseek-ai/dsh-plugin-market-index@0.2.2-rc.1
node tooling/check.mjs
```

检查内容：三个 JS 文件的语法、`package.json` 与 locale JSON 可解析、`index.json` 通过**官方** `parseMarketIndex`（不是自己模拟的规则）、索引里最新版本号与 `package.json` 一致、每个 git 源 pin 的 commit 在本仓库确实存在、`cordis.patch.yml` 确实插入了本包。

tag 触发时只核对「tag 名 == `v<版本号>`」：release tag 指向的是装包的那个提交，索引由 main 上的后续提交更新，所以版本一致性检查只在分支和 PR 上跑。

## 验证记录

市场能否抓到、安装参数能否装上、装进 profile 后能否激活，逐条记在 [VERIFICATION.md](VERIFICATION.md)，包括明确标注「没有验证」的部分。

## 已知限制

- 只暴露上面 5 个背景 token；品牌色、边框色、文字色仍归主题管。
- 覆盖背景不会重算对比度：中间灰度会让文字看不清，所以预设刻意避开中间调。
- 面板挂在 `shell.overlay`，浮在所有列之上，任何视图下都能用。
- 索引更新有两层缓存：GitHub raw 的 CDN（实测约 50 秒）+ Host 的索引缓存（默认 10 分钟）。

## 许可证

MIT，见 `LICENSE`。
