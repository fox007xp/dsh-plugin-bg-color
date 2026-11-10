# dsh-plugin-bg-color

[中文](#中文) | [English](#english)

在 DSH 里实时调整整窗、面板、浮层和侧边栏的背景色，内置浅色/深色配色组合。

每改一次颜色都直接作为主题 token 覆盖层生效，不重载页面。

---

<a id="中文"></a>
## 中文

### 功能

面板浮在 Web 界面右下角，提供：

- **8 套配色组合**，每套都同时写了浅色和深色两版，点一下不管当前是哪种模式都会立刻看到变化。所有预设都停在明度安全区（浅色版主底 ≥ `#ed`，深色版 ≤ `#2c`），这样主题自带的文字颜色不会被顶掉。
- **分区微调**：原生取色器 + 可直接粘贴的十六进制输入框。
- **浅色 / 深色分栏**：两个模式能分别调，面板上标了当前实际生效的是哪个。
- **全部重置**：撤掉覆盖层，回到内置配色。

选择存在 `localStorage` 的 `dsh-plugin-bg-color.regions` 里，刷新页面自动恢复。

### 改了哪些 token

用的是 `theme.overrideTokens()` 叠一层覆盖，不是替换主题，所以卸载时能干净撤掉。

| 区域 | Token |
|---|---|
| 整窗底色 | `--dsw-alias-bg-base` |
| 一级面板 | `--dsw-alias-bg-layer-1` |
| 二级面板 | `--dsw-alias-bg-layer-2` |
| 浮层与弹窗 | `--dsw-alias-bg-overlay` |
| 侧边栏 | `--dsw-specific-sidebar-fill` |

这些 token 名是 DSH 内部约定。将来改名只会让外观退化，不会让界面渲染崩掉。

### 安装

从插件市场装（Plugins → Custom plugin indexes 里加下面这个源，然后进 Discover）：

```
https://raw.githubusercontent.com/fox007xp/dsh-plugin-bg-color/main/index.json
```

或者直接装本地目录：

```
plugin_manager install_bundle, target: <本目录路径>
```

### 文件结构

| 文件 | 作用 |
|---|---|
| `index.js` | Host 半；不声明服务、没有配置。 |
| `client.js` | Client 半；面板 + token 覆盖层。 |
| `cordis.patch.yml` | 插入 `bg-color` 这一行。 |
| `locale/en.json`、`locale/zh.json` | 插件管理器里显示的中英标题与描述。 |
| `index.json` | 插件市场索引（format 1，git 源）。 |
| `icon.svg` | 原创图标。 |

### 已知限制

- 只暴露上面 5 个背景 token；品牌色、边框色、文字色仍归主题管。
- 覆盖背景不会重算对比度：中间灰度会让文字看不清，所以预设刻意避开中间调。
- 面板挂在 `shell.overlay`，浮在所有列之上，任何视图下都能用。

### 许可证

MIT，见 `LICENSE`。

---

<a id="english"></a>
## English

### What it does

The panel sits in the bottom-right corner of the Web UI. It offers:

- **Eight curated combinations**, each defined for both the light and the dark scheme, so one click works whichever scheme is active. All of them stay at the safe ends of the lightness range (light bases at `#ed` or lighter, dark bases at `#2c` or darker), so the theme's own text colors keep their contrast.
- **Per-region fine tuning** with a native color picker plus an editable hex field.
- **Light / dark tabs** to edit the two schemes separately; the panel marks which scheme is currently live.
- **Reset all**, which removes the override layer and returns to the built-in palette.

Selections persist in `localStorage` under `dsh-plugin-bg-color.regions`.

### What it changes

It layers a `theme.overrideTokens()` override instead of replacing the theme, so the override is removed cleanly when the plugin is uninstalled.

| Region | Token |
|---|---|
| Window base | `--dsw-alias-bg-base` |
| Primary surface | `--dsw-alias-bg-layer-1` |
| Nested surface | `--dsw-alias-bg-layer-2` |
| Overlays and popovers | `--dsw-alias-bg-overlay` |
| Sidebar | `--dsw-specific-sidebar-fill` |

The token names are DSH internals. A rename in a future release degrades appearance but does not break rendering.

### Install

From the plugin market (add this source under Plugins → Custom plugin indexes, then open Discover):

```
https://raw.githubusercontent.com/fox007xp/dsh-plugin-bg-color/main/index.json
```

Or install the local directory:

```
plugin_manager install_bundle, target: <path to this directory>
```

### Layout

| File | Role |
|---|---|
| `index.js` | Host half; no services, no config. |
| `client.js` | Client half; the panel and the token-override layer. |
| `cordis.patch.yml` | Inserts the `bg-color` row. |
| `locale/en.json`, `locale/zh.json` | Display title and description for the plugin manager. |
| `index.json` | Plugin market index (format 1, git source). |
| `icon.svg` | Original artwork. |

### Limitations

- Only the five background tokens above are exposed; brand, border, and label colors stay with the active theme.
- Overriding a background token does not recompute contrast; a mid-tone color can make text hard to read, which is why the presets avoid mid tones.
- The panel is mounted in `shell.overlay`, so it floats above every column and is available in every view.

### License

MIT. See `LICENSE`.
