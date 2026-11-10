# dsh-plugin-bg-color

Adjust the background color of the DSH window, surfaces, overlays, and sidebar from a floating panel. Every change is applied immediately as a theme token layer, so nothing reloads.

## What it does

The panel sits in the bottom-right corner of the Web UI. It offers:

- **Eight curated combinations**, each defined for both the light and the dark scheme, so one click works whichever scheme is active. All of them stay at the safe ends of the lightness range, so the theme's own text colors keep their contrast.
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

```
plugin_manager install_bundle, target: <path to this directory>
```

Or add it to a plugin market index and install it from the Discover tab.

## Layout

| File | Role |
|---|---|
| `index.js` | Host half; no services, no config. |
| `client.js` | Client half; the panel and the token-override layer. |
| `cordis.patch.yml` | Inserts the `bg-color` row. |
| `locale/en.json`, `locale/zh.json` | Display title and description for the plugin manager. |
| `icon.svg` | Original artwork. |

## Limitations

- Only the five background tokens above are exposed; brand, border, and label colors stay with the active theme.
- Overriding a background token does not recompute contrast; a mid-tone color can make text hard to read, which is why the presets avoid mid tones.
- The panel is mounted in `shell.overlay`, so it floats above every column and is available in every view.

## License

MIT. See `LICENSE`.
