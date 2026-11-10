# dsh-plugin-bg-color

[简体中文](README.md) · **English**

Adjust the background color of the DSH window, surfaces, overlays, and sidebar, live. Every change is applied immediately as a theme token layer, so nothing reloads.

## What it does

The panel sits in the bottom-right corner of the Web UI. It offers:

- **Eight curated combinations**, each defined for both the light and the dark scheme, so one click works whichever scheme is active. All of them stay at the safe ends of the lightness range (light bases at `#ed` or lighter, dark bases at `#2c` or darker), so the theme's own text colors keep their contrast.
- **Per-region fine tuning** with a native color picker plus an editable hex field.
- **Light / dark tabs** to edit the two schemes separately; the panel marks which scheme is currently live.
- **Reset all**, which removes the override layer and returns to the built-in palette.

Selections persist in `localStorage` under `dsh-plugin-bg-color.regions`.

## What it changes

It layers a `theme.overrideTokens()` override instead of replacing the theme, so the override is removed cleanly when the plugin is uninstalled.

| Region | Token |
|---|---|
| Window base | `--dsw-alias-bg-base` |
| Primary surface | `--dsw-alias-bg-layer-1` |
| Nested surface | `--dsw-alias-bg-layer-2` |
| Overlays and popovers | `--dsw-alias-bg-overlay` |
| Sidebar | `--dsw-specific-sidebar-fill` |

The token names are DSH internals. A rename in a future release degrades appearance but does not break rendering.

## Install

### From the plugin market

Prerequisite: the market is off by default in DSH. Enable the official experimental bundle first, or the Plugins page never grows a Discover tab.

1. Plugins page → **Experimental plugins** → enable **Custom plugin indexes**
2. Open **Discover** and add this address as an index source:

```
https://raw.githubusercontent.com/fox007xp/dsh-plugin-bg-color/main/index.json
```

3. Once the index is fetched, "Background colors" appears in the list — press Install

If that switch does not exist, the market is not enabled yet — step 2 has nothing to attach to, so do step 1 first.

### From a local directory

Useful when you edit the code and want to see the result immediately:

```
plugin_manager install_bundle, target: <path to this directory>
```

## Layout

| File | Role |
|---|---|
| `index.js` | Host half; no services, no config. |
| `client.js` | Client half; the panel and the token-override layer. |
| `cordis.patch.yml` | Inserts the `bg-color` row. |
| `locale/en.json`, `locale/zh.json` | Display title and description for the plugin manager. |
| `index.json` | Plugin market index (format 1, git source). |
| `icon.svg` | Original artwork. |
| `.github/workflows/ci.yml` | CI: syntax, the official validator, pinned-commit check. |
| `tooling/check.mjs` | Runs the same checks locally. |
| `VERIFICATION.md` | What was verified, how, and what was not. |

## Local checks

CI runs these on every push to main, tag, and pull request. To reproduce locally:

```sh
npm install --no-save --no-package-lock --ignore-scripts @deepseek-ai/dsh-plugin-market-index@0.2.2-rc.1
node tooling/check.mjs
```

It checks the three JavaScript files parse, `package.json` and the locale JSON parse, `index.json` passes the **official** `parseMarketIndex` (not a local imitation of its rules), the index's latest version matches `package.json`, every git source pins a commit that exists in this repository, and `cordis.patch.yml` actually inserts this package.

On a tag it only checks that the tag is `v<version>`: a release tag marks the commit that carries the package, while the index is updated by a later commit on main, so the version cross-check runs on branches and pull requests only.

## Verification

Whether the market fetches the index, whether its install target actually installs, and whether the plugin activates in a profile are recorded one by one in [VERIFICATION.md](VERIFICATION.md), including the parts explicitly marked as not verified.

## Limitations

- Only the five background tokens above are exposed; brand, border, and label colors stay with the active theme.
- Overriding a background token does not recompute contrast; a mid-tone color can make text hard to read, which is why the presets avoid mid tones.
- The panel is mounted in `shell.overlay`, so it floats above every column and is available in every view.
- Index updates pass two caches: GitHub raw's CDN (about 50 seconds in testing) and the Host's index cache (10 minutes by default).

## License

MIT. See `LICENSE`.
