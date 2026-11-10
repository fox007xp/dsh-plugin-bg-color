# 验证记录

这里记录「这个插件能装、能跑、市场能收」是怎么被实际验证过的，以及哪些**没有**验证。

English summary at the end.

## 环境

| 项 | 值 |
|---|---|
| DSH 版本 | `0.2.2-rc.1`（desktop profile） |
| 平台 | Windows，DSH 桌面版 |
| 市场能力 | `@deepseek-ai/dsh-experimental-plugin-market-bundle`（官方实验 bundle，需手动启用） |
| 索引地址 | `https://raw.githubusercontent.com/fox007xp/dsh-plugin-bg-color/main/index.json` |

## 已验证

### 1. 索引满足 format 1

用**官方校验器**判定，不是本地模拟规则：

```sh
npm install --no-save --no-package-lock --ignore-scripts @deepseek-ai/dsh-plugin-market-index@0.2.2-rc.1
node tooling/check.mjs
```

`parseMarketIndex()` 通过，且同时核对：三个 JS 文件语法、`package.json` 与 locale JSON 可解析、索引最新版本号与 `package.json` 一致、每个 git 源 pin 的 commit 在本仓库存在、`cordis.patch.yml` 确实插入了本包。

证据：GitHub Actions `ci` 的 run #4（main）与 #5（`refs/tags/v1.1.2`）均为 success。

### 2. Host 真的能抓取、解析、算兼容性

在 DSH 里把上面那个 raw URL 配成市场索引后，用 `plugin_market` 工具查询：

```json
{
  "name": "dsh-plugin-bg-color",
  "title": "Background colors",
  "author": "fred.li",
  "category": "appearance",
  "installation": { "status": "installed", "installedVersion": "1.1.2" },
  "defaultVersion": {
    "version": "1.1.2",
    "compatibility": { "compatible": true },
    "install": {
      "target": "git+https://github.com/fox007xp/dsh-plugin-bg-color.git#45a12f62a0e6fba4f11a0e397b4e4696fe53aa9a"
    }
  }
}
```

说明：标题、描述、author、category、排序值都解析出来了；`compatible: true` 是 Host 按 DSH 版本算的；`install.target` 是市场交给 `pluginManager.installBundle` 的原样参数。

### 3. 市场给出的安装参数确实能装

在临时目录里直接装这个参数（不碰任何 profile）：

```sh
npm install "git+https://github.com/fox007xp/dsh-plugin-bg-color.git#<commit>"
```

成功，解出的包含 `client.js`、`index.js`、`cordis.patch.yml`、`locale/*.json`、`icon.svg`、`README.md`、`LICENSE`、`package.json`，`dsh.bundle` 与 `dsh.client` 段完整。

### 4. 装进 profile 后能激活

`plugin_manager install_bundle` 装进 desktop profile 后：

- `shell.overlay` slot 里出现 occupant `id: bg-color-panel`、`active: true`（Client 半挂上了）；
- 面板本身在右下角，点开是配色组合 + 5 个区域滑杆。

### 5. 一次 npm 源的市场安装也跑通过

发布链路上另外验证过一次「市场索引 → npm registry → install_bundle」：本机起静态 registry（供 packument + tarball，其余路径转发 npmjs），市场返回 `target: dsh-plugin-bg-color@1.1.0` + registry，`install_bundle` 装成功。

那次暴露了一个真实约束：**`install_bundle` 的 `registry` 参数作用于整个 profile**，pnpm 会拿这个 registry 去解析所有依赖，所以自定义 registry 必须能服务全部依赖，或者只在 npm 存在真正可用的源时才用 npm 源。当前索引用的是 git 源，不受这条影响。

## 没有验证

以下几条明确未验证，不要当作已验证：

1. **像素级观感**：没有浏览器控制能力，面板的实际位置、配色对比度、在窄屏下的表现都没被自动验证过；只确认了 slot 注册为 active。
2. **从 Discover 页面点击安装的 UI 路径**：市场侧返回的安装参数是 Discover 内部调用的同一组参数，但按钮链路没有逐个点过。原因是本项目早前一次 `remove_bundle`（移除 `link:` 形态安装）把源码目录清空过，之后不再在桌面 profile 上重复这套有风险的装/卸动作。
3. **他人机器上的安装**：只在上面这一台 Windows 机器验证过；macOS / Linux 未测。
4. **私有仓库场景**：git 源安装依赖 https 可达；私有仓库需要本机凭据，未测。
5. **DSH 版本兼容范围**：`package.json` 没有声明 `engines.dsh`（避免 prerelease 版本区间把安装卡住），所以 Host 只按「无要求」判兼容。将来 DSH 若改主题 token 名，插件的覆盖会失效但不影响渲染。

## 一个已知的时序特性

索引更新有两层缓存：

- GitHub raw 的 CDN：实测约 **50 秒**后新内容可见（用轮询验证过）；
- Host 自己的索引缓存：`cacheTtlMs` 默认 **10 分钟**。

所以发新版后市场不会立刻看到新版本。要立刻生效，可以关掉再打开市场 bundle 让服务重载（会清掉内存缓存）。

---

## English summary

This file records what was actually verified for this plugin, and what was not.

**Verified:** the index passes the official `parseMarketIndex` validator (also run in CI); a running DSH Host fetches the raw index, resolves title/description/author/category, reports `compatible: true`, and hands out the exact `git+https://…#<commit>` install target; that target installs in a scratch directory and yields a complete bundle; the plugin activates in a profile (`shell.overlay` occupant `active: true`); and one npm-registry variant of the same market flow installed successfully.

**Not verified:** the rendered pixels (no browser control here), the Discover "Install" button click path (the parameters it passes are the ones above), other operating systems, private repositories, and DSH version compatibility beyond "no `engines.dsh` requirement".

Index updates also propagate slowly: GitHub raw's CDN took about 50 seconds in testing, and the Host caches index documents for 10 minutes by default.
