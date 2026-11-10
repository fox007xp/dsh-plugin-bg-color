window.__ModuleLoader__.load({
  id: 'dsh-plugin-bg-color',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useState } = React;

    /** Dictionary namespace owned by this plugin. */
    const NS = 'bgColor';
    /** Token-layer identity passed to theme.overrideTokens. */
    const SOURCE = 'dsh-plugin-bg-color';
    /** Where the last chosen colors survive a page reload. */
    const STORAGE_KEY = 'dsh-plugin-bg-color.regions';

    /** Regions the panel exposes: the CSS token plus its dictionary key. */
    const REGIONS = [
      { key: 'base', token: '--dsw-alias-bg-base', label: 'region.base' },
      { key: 'layer1', token: '--dsw-alias-bg-layer-1', label: 'region.layer1' },
      { key: 'layer2', token: '--dsw-alias-bg-layer-2', label: 'region.layer2' },
      { key: 'overlay', token: '--dsw-alias-bg-overlay', label: 'region.overlay' },
      { key: 'sidebar', token: '--dsw-specific-sidebar-fill', label: 'region.sidebar' },
    ];

    /**
     * Curated combinations. Each preset carries a light and a dark variant so one
     * click works whichever scheme is active; all of them stay at the safe ends
     * of the lightness range, so the theme's own label colors keep their contrast.
     */
    const PRESETS = [
      {
        id: 'sand',
        label: 'preset.sand',
        light: { base: '#f6f1e7', layer1: '#fdfaf3', layer2: '#efe8da', overlay: '#fffdf8', sidebar: '#ece4d5' },
        dark: { base: '#1c1813', layer1: '#241f19', layer2: '#2c261e', overlay: '#28221b', sidebar: '#181410' },
      },
      {
        id: 'mist',
        label: 'preset.mist',
        light: { base: '#eef2f7', layer1: '#f9fbfd', layer2: '#e4eaf1', overlay: '#ffffff', sidebar: '#e2e9f0' },
        dark: { base: '#131922', layer1: '#1a212c', layer2: '#222a36', overlay: '#1e2531', sidebar: '#10151d' },
      },
      {
        id: 'sage',
        label: 'preset.sage',
        light: { base: '#eef4ee', layer1: '#f8fbf8', layer2: '#e3ece4', overlay: '#fdfefd', sidebar: '#dfe9e1' },
        dark: { base: '#141a16', layer1: '#1a221d', layer2: '#212b25', overlay: '#1d2620', sidebar: '#101512' },
      },
      {
        id: 'lilac',
        label: 'preset.lilac',
        light: { base: '#f3eff7', layer1: '#fbf8fe', layer2: '#eae3f1', overlay: '#fefdff', sidebar: '#e6ddef' },
        dark: { base: '#18131c', layer1: '#201926', layer2: '#282030', overlay: '#241c2b', sidebar: '#140f18' },
      },
      {
        id: 'charcoal',
        label: 'preset.charcoal',
        light: { base: '#f3f4f5', layer1: '#fafafa', layer2: '#ebedee', overlay: '#ffffff', sidebar: '#e9ebec' },
        dark: { base: '#15171a', layer1: '#1c1f23', layer2: '#24282d', overlay: '#202429', sidebar: '#111316' },
      },
      {
        id: 'midnight',
        label: 'preset.midnight',
        light: { base: '#eef1f6', layer1: '#f8fafc', layer2: '#e3e8f0', overlay: '#ffffff', sidebar: '#e0e6ee' },
        dark: { base: '#0e141c', layer1: '#151d27', layer2: '#1c2632', overlay: '#18212c', sidebar: '#0b1017' },
      },
      {
        id: 'forest',
        label: 'preset.forest',
        light: { base: '#edf3ee', layer1: '#f7faf7', layer2: '#e2ebe4', overlay: '#fdfefd', sidebar: '#dee8e0' },
        dark: { base: '#101611', layer1: '#161d17', layer2: '#1d251e', overlay: '#192019', sidebar: '#0d120e' },
      },
      {
        id: 'plum',
        label: 'preset.plum',
        light: { base: '#f5eef2', layer1: '#fcf8fa', layer2: '#ede2e8', overlay: '#fffdfe', sidebar: '#e9dde4' },
        dark: { base: '#1a1218', layer1: '#231821', layer2: '#2c1f29', overlay: '#281b24', sidebar: '#161013' },
      },
    ];

    /** Simplified Chinese dictionary (the key-set source of truth). */
    const zh = {
      'button.open': '背景色',
      'panel.title': '背景色',
      'panel.close': '收起',
      'panel.hint': '改动立即生效，只存在本机。',
      'panel.presets': '配色组合',
      'panel.regions': '分区微调',
      'panel.reset': '全部重置',
      'mode.light': '浅色',
      'mode.dark': '深色',
      'mode.current': '当前',
      'row.clear': '清除该项',
      'row.unset': '未设置',
      'region.base': '整窗底色',
      'region.layer1': '一级面板',
      'region.layer2': '二级面板',
      'region.overlay': '浮层与弹窗',
      'region.sidebar': '侧边栏',
      'preset.sand': '暖沙',
      'preset.mist': '冷雾',
      'preset.sage': '淡青',
      'preset.lilac': '藕荷',
      'preset.charcoal': '炭黑',
      'preset.midnight': '墨蓝',
      'preset.forest': '松绿',
      'preset.plum': '深枣',
    };
    /** English dictionary, checked complete against the zh key set. */
    const en = {
      'button.open': 'Background',
      'panel.title': 'Background colors',
      'panel.close': 'Collapse',
      'panel.hint': 'Changes apply immediately and stay on this machine.',
      'panel.presets': 'Color combinations',
      'panel.regions': 'Fine tune',
      'panel.reset': 'Reset all',
      'mode.light': 'Light',
      'mode.dark': 'Dark',
      'mode.current': 'active',
      'row.clear': 'Clear this region',
      'row.unset': 'Not set',
      'region.base': 'Window base',
      'region.layer1': 'Primary surface',
      'region.layer2': 'Nested surface',
      'region.overlay': 'Overlays and popovers',
      'region.sidebar': 'Sidebar',
      'preset.sand': 'Warm sand',
      'preset.mist': 'Cool mist',
      'preset.sage': 'Soft sage',
      'preset.lilac': 'Lilac haze',
      'preset.charcoal': 'Charcoal',
      'preset.midnight': 'Midnight blue',
      'preset.forest': 'Deep forest',
      'preset.plum': 'Plum dusk',
    };

    /**
     * Accept `#rrggbb` with or without the leading hash.
     *
     * @param value - raw input from a picker or a text field.
     * @returns the lowercased `#rrggbb` form, or undefined when invalid.
     */
    function normalize(value) {
      if (typeof value !== 'string') return undefined;
      const text = value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(text)) return text.toLowerCase();
      if (/^[0-9a-fA-F]{6}$/.test(text)) return `#${text.toLowerCase()}`;
      return undefined;
    }

    /** An empty per-scheme color set. */
    function emptySets() {
      return { light: {}, dark: {} };
    }

    /** Read one scheme's tokens out of an untrusted object. */
    function readScheme(source) {
      const colors = {};
      if (source === null || typeof source !== 'object') return colors;
      for (const region of REGIONS) {
        const value = normalize(source[region.token]);
        if (value !== undefined) colors[region.token] = value;
      }
      return colors;
    }

    /** Read the persisted colors, discarding anything malformed. */
    function readStored() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return emptySets();
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== 'object') return emptySets();
        if (parsed.light === undefined && parsed.dark === undefined) {
          // Legacy layout: one flat token map that applied to both schemes.
          const flat = readScheme(parsed);
          return { light: { ...flat }, dark: { ...flat } };
        }
        return { light: readScheme(parsed.light), dark: readScheme(parsed.dark) };
      } catch {
        return emptySets();
      }
    }

    /** Persist the chosen colors; a failed write must not break the panel. */
    function writeStored(sets) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sets));
      } catch {
        /* storage disabled: colors still apply until reload */
      }
    }

    /**
     * Turn the per-scheme selection into the token layer the theme service wants,
     * which requires both a light and a dark value per token.
     */
    function toTokens(sets) {
      const tokens = {};
      for (const region of REGIONS) {
        const light = normalize(sets.light?.[region.token]);
        const dark = normalize(sets.dark?.[region.token]);
        const resolvedLight = light ?? dark;
        const resolvedDark = dark ?? light;
        if (resolvedLight !== undefined && resolvedDark !== undefined) {
          tokens[region.token] = { light: resolvedLight, dark: resolvedDark };
        }
      }
      return tokens;
    }

    /** Expand one preset into the per-scheme selection the panel edits. */
    function presetSets(preset) {
      const sets = emptySets();
      for (const region of REGIONS) {
        const light = normalize(preset.light[region.key]);
        const dark = normalize(preset.dark[region.key]);
        if (light !== undefined) sets.light[region.token] = light;
        if (dark !== undefined) sets.dark[region.token] = dark;
      }
      return sets;
    }

    //#region styles
    const mountStyle = {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '8px',
      pointerEvents: 'auto',
    };
    const triggerStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '999px',
      border: '1px solid var(--dsw-alias-border-l2)',
      background: 'var(--dsw-alias-bg-layer-1)',
      color: 'var(--dsw-alias-label-primary)',
      font: 'inherit',
      fontSize: '12px',
      lineHeight: '18px',
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(0,0,0,.14)',
    };
    const panelStyle = {
      width: '320px',
      maxHeight: '76vh',
      overflow: 'auto',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px',
      borderRadius: '12px',
      border: '1px solid var(--dsw-alias-border-l2)',
      background: 'var(--dsw-alias-bg-layer-1)',
      color: 'var(--dsw-alias-label-primary)',
      fontSize: '12px',
      boxShadow: '0 14px 36px rgba(0,0,0,.22)',
    };
    const headerStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      fontSize: '13px',
      fontWeight: 600,
    };
    const sectionStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      color: 'var(--dsw-alias-label-secondary)',
      fontSize: '11px',
      lineHeight: '16px',
    };
    const closeStyle = {
      border: 'none',
      background: 'transparent',
      color: 'var(--dsw-alias-label-secondary)',
      cursor: 'pointer',
      fontSize: '14px',
      lineHeight: 1,
      padding: '2px 4px',
      borderRadius: '6px',
    };
    const presetsStyle = {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '6px',
    };
    const chipBaseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      minWidth: 0,
      padding: '5px 7px',
      borderRadius: '8px',
      background: 'transparent',
      color: 'var(--dsw-alias-label-primary)',
      font: 'inherit',
      fontSize: '11px',
      lineHeight: '16px',
      cursor: 'pointer',
      textAlign: 'left',
    };
    const chipSwatchStyle = {
      display: 'inline-flex',
      flex: '0 0 auto',
      borderRadius: '3px',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.12)',
    };
    const chipSwatchCell = { width: '7px', height: '14px' };
    const chipLabelStyle = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
    const tabsStyle = {
      display: 'inline-flex',
      padding: '2px',
      borderRadius: '8px',
      border: '1px solid var(--dsw-alias-border-l2)',
      gap: '2px',
    };
    const tabBaseStyle = {
      padding: '2px 10px',
      borderRadius: '6px',
      border: 'none',
      background: 'transparent',
      color: 'var(--dsw-alias-label-secondary)',
      font: 'inherit',
      fontSize: '11px',
      lineHeight: '16px',
      cursor: 'pointer',
    };
    const tabActiveStyle = {
      background: 'var(--dsw-alias-bg-layer-2)',
      color: 'var(--dsw-alias-label-primary)',
    };
    const rowStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    };
    const labelStyle = {
      flex: '1 1 auto',
      minWidth: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };
    const swatchStyle = {
      width: '28px',
      height: '22px',
      padding: 0,
      border: '1px solid var(--dsw-alias-border-l2)',
      borderRadius: '6px',
      background: 'transparent',
      cursor: 'pointer',
    };
    const hexStyle = {
      width: '76px',
      boxSizing: 'border-box',
      padding: '3px 6px',
      border: '1px solid var(--dsw-alias-border-l2)',
      borderRadius: '6px',
      background: 'transparent',
      color: 'var(--dsw-alias-label-primary)',
      fontFamily: 'monospace',
      fontSize: '11px',
    };
    const clearStyle = {
      border: 'none',
      background: 'transparent',
      color: 'var(--dsw-alias-label-secondary)',
      cursor: 'pointer',
      fontSize: '14px',
      lineHeight: 1,
      padding: '2px 4px',
      borderRadius: '6px',
    };
    const hintStyle = {
      margin: 0,
      color: 'var(--dsw-alias-label-secondary)',
      fontSize: '11px',
      lineHeight: '16px',
    };
    const resetStyle = {
      alignSelf: 'flex-start',
      padding: '4px 10px',
      borderRadius: '8px',
      border: '1px solid var(--dsw-alias-border-l2)',
      background: 'transparent',
      color: 'var(--dsw-alias-label-primary)',
      font: 'inherit',
      fontSize: '12px',
      cursor: 'pointer',
    };
    //#endregion

    /**
     * One region row: a native color picker plus an editable hex field.
     *
     * The hex field keeps its own draft so a half-typed value never clears the
     * applied color; only a complete `#rrggbb` reaches the theme layer.
     *
     * @param props - locale translator, the region, its applied value, callbacks.
     */
    function RegionRow({ t, region, value, onPick, onClear }) {
      const applied = typeof value === 'string' ? value : '';
      const [draft, setDraft] = useState(applied);

      useEffect(() => {
        setDraft(applied);
      }, [applied]);

      const swatchValue = applied === '' ? '#808080' : applied;
      return h(
        'div',
        { style: rowStyle },
        h('span', { style: labelStyle, title: region.token }, t(region.label)),
        h('input', {
          type: 'color',
          value: swatchValue,
          'aria-label': t(region.label),
          style: swatchStyle,
          onInput: (event) => onPick(event.currentTarget.value.toLowerCase()),
          onChange: (event) => onPick(event.currentTarget.value.toLowerCase()),
        }),
        h('input', {
          type: 'text',
          value: draft,
          placeholder: t('row.unset'),
          spellCheck: false,
          'aria-label': `${t(region.label)} hex`,
          style: hexStyle,
          onChange: (event) => {
            const text = event.currentTarget.value;
            setDraft(text);
            const next = normalize(text);
            if (next !== undefined) onPick(next);
          },
        }),
        h(
          'button',
          {
            type: 'button',
            onClick: onClear,
            title: t('row.clear'),
            'aria-label': t('row.clear'),
            style: clearStyle,
          },
          '\u00d7',
        ),
      );
    }

    /** Services this client plugin needs. */
    const inject = ['slots', 'locale', 'theme'];

    /**
     * Mount the background-color panel and own the token-override layer.
     *
     * @param ctx - client root context.
     */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'bg-color: dictionaries');

      /** The active token-override layer of this plugin, or null before any edit. */
      let layer = null;

      /**
       * Apply the chosen colors as a theme token layer and persist them.
       *
       * @param sets - per-scheme token selections.
       */
      function paint(sets) {
        const tokens = toTokens(sets);
        if (layer !== null) {
          layer();
          layer = null;
        }
        layer = ctx.theme.overrideTokens(SOURCE, tokens);
        writeStored(sets);
      }

      ctx.effect(
        () => () => {
          if (layer !== null) {
            layer();
            layer = null;
          }
        },
        'bg-color: token layer',
      );

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'bg-color-panel',
            order: 900,
            locale: NS,
          },
          function BackgroundColors({ t }) {
            const [sets, setSets] = useState(readStored);
            const [presetId, setPresetId] = useState(null);
            const [mode, setMode] = useState(() => ctx.theme.getTheme().active.colorScheme);
            const [open, setOpen] = useState(false);

            // Restore the last saved colors once the panel mounts.
            useEffect(() => {
              const stored = readStored();
              if (Object.keys(toTokens(stored)).length > 0) paint(stored);
            }, []);

            /** The scheme the app is actually showing right now. */
            const activeScheme = ctx.theme.getTheme().active.colorScheme;
            const current = sets[mode] ?? {};

            const selectPreset = (preset) => {
              const next = presetSets(preset);
              setPresetId(preset.id);
              setSets(next);
              paint(next);
            };

            /** Set one region in the edited scheme; clearing removes it from both. */
            const setRegion = (token, raw) => {
              const next = { light: { ...sets.light }, dark: { ...sets.dark } };
              const value = normalize(raw);
              if (value === undefined) {
                delete next.light[token];
                delete next.dark[token];
              } else {
                next[mode][token] = value;
              }
              setPresetId(null);
              setSets(next);
              paint(next);
            };

            const resetAll = () => {
              const next = emptySets();
              setPresetId(null);
              setSets(next);
              paint(next);
            };

            const presetChips = PRESETS.map((preset) => {
              const variant = mode === 'light' ? preset.light : preset.dark;
              const selected = preset.id === presetId;
              return h(
                'button',
                {
                  key: preset.id,
                  type: 'button',
                  onClick: () => selectPreset(preset),
                  title: t(preset.label),
                  'aria-label': t(preset.label),
                  'aria-pressed': selected,
                  style: {
                    ...chipBaseStyle,
                    border: `1px solid ${selected ? 'var(--dsw-alias-brand-primary)' : 'var(--dsw-alias-border-l2)'}`,
                  },
                },
                h(
                  'span',
                  { style: chipSwatchStyle },
                  h('span', { style: { ...chipSwatchCell, background: variant.base } }),
                  h('span', { style: { ...chipSwatchCell, background: variant.layer2 } }),
                  h('span', { style: { ...chipSwatchCell, background: variant.sidebar } }),
                ),
                h('span', { style: chipLabelStyle }, t(preset.label)),
              );
            });

            const modeTabs = h(
              'div',
              { style: tabsStyle },
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => setMode('light'),
                  'aria-pressed': mode === 'light',
                  style: { ...tabBaseStyle, ...(mode === 'light' ? tabActiveStyle : {}) },
                },
                t('mode.light'),
              ),
              h(
                'button',
                {
                  type: 'button',
                  onClick: () => setMode('dark'),
                  'aria-pressed': mode === 'dark',
                  style: { ...tabBaseStyle, ...(mode === 'dark' ? tabActiveStyle : {}) },
                },
                t('mode.dark'),
              ),
            );

            const panel = h(
              'div',
              { style: panelStyle, role: 'dialog', 'aria-label': t('panel.title') },
              h(
                'div',
                { style: headerStyle },
                h('span', null, t('panel.title')),
                h(
                  'button',
                  {
                    type: 'button',
                    style: closeStyle,
                    onClick: () => setOpen(false),
                    title: t('panel.close'),
                    'aria-label': t('panel.close'),
                  },
                  '\u2715',
                ),
              ),
              h('div', { style: sectionStyle }, h('span', null, t('panel.presets'))),
              h('div', { style: presetsStyle }, ...presetChips),
              h(
                'div',
                { style: sectionStyle },
                h('span', null, `${t('panel.regions')} · ${t('mode.current')} ${t(activeScheme === 'light' ? 'mode.light' : 'mode.dark')}`),
                modeTabs,
              ),
              ...REGIONS.map((region) =>
                h(RegionRow, {
                  key: region.token,
                  t,
                  region,
                  value: current[region.token],
                  onPick: (value) => setRegion(region.token, value),
                  onClear: () => setRegion(region.token, null),
                }),
              ),
              h('p', { style: hintStyle }, t('panel.hint')),
              h('button', { type: 'button', style: resetStyle, onClick: resetAll }, t('panel.reset')),
            );

            const trigger = h(
              'button',
              {
                type: 'button',
                style: triggerStyle,
                onClick: () => setOpen(true),
                'aria-label': t('button.open'),
              },
              h(
                'svg',
                { viewBox: '0 0 16 16', width: 14, height: 14, 'aria-hidden': true },
                h('circle', { cx: 8, cy: 8, r: 7, fill: 'none', stroke: 'currentColor', strokeWidth: 1.4 }),
                h('circle', { cx: 5.6, cy: 6, r: 1.5, fill: 'currentColor' }),
                h('circle', { cx: 10.4, cy: 6, r: 1.5, fill: 'currentColor' }),
                h('circle', { cx: 8, cy: 10.6, r: 1.5, fill: 'currentColor' }),
              ),
              t('button.open'),
            );

            return h('div', { style: mountStyle }, open ? panel : trigger);
          },
        ),
      );
    }

    return {
      name: 'bg-color',
      inject,
      apply,
    };
  },
});
