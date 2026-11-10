import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMarketIndex } from '@deepseek-ai/dsh-plugin-market-index';

/** Repository root: this file lives in <root>/tooling. */
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const indexPath = join(root, 'index.json');
const indexUrl = process.env.MARKET_INDEX_URL ?? 'https://raw.githubusercontent.com/fox007xp/dsh-plugin-bg-color/main/index.json';

// A release tag marks the commit that carries the package itself; the index is
// updated by a later commit on main. So on a tag the version cross-check must
// not run, or every release would fail for being one commit early.
const ref = process.env.GITHUB_REF ?? '';
const isTag = ref.startsWith('refs/tags/');
const tagName = isTag ? ref.slice('refs/tags/'.length) : undefined;

const problems = [];
const note = (message) => console.log(`ok   ${message}`);
const fail = (message) => {
  problems.push(message);
  console.log(`FAIL ${message}`);
};

/** Parse a JSON file, recording a readable failure instead of throwing. */
function readJson(path, label) {
  try {
    const value = JSON.parse(readFileSync(path, 'utf8'));
    note(`${label} parses`);
    return value;
  } catch (error) {
    fail(`${label} does not parse: ${error.message}`);
    return undefined;
  }
}

const pkg = readJson(join(root, 'package.json'), 'package.json');
for (const locale of ['locale/en.json', 'locale/zh.json']) {
  readJson(join(root, locale), locale);
}

// Files the bundle cannot run without.
for (const file of ['index.js', 'client.js', 'cordis.patch.yml', 'icon.svg']) {
  if (existsSync(join(root, file))) note(`${file} exists`);
  else fail(`${file} is missing`);
}

// The market index must satisfy format 1; the official validator decides that,
// not a local reimplementation.
let plugin;
try {
  const document = JSON.parse(readFileSync(indexPath, 'utf8'));
  const index = parseMarketIndex(document, indexUrl);
  note(`index.json satisfies format 1 (${index.plugins.length} plugin(s))`);
  if (pkg !== undefined) plugin = index.plugins.find((entry) => entry.name === pkg.name);
} catch (error) {
  fail(`index.json is invalid: ${error.message}`);
}

if (pkg !== undefined && plugin === undefined) {
  fail(`index.json does not list ${pkg.name}`);
}

if (pkg !== undefined && plugin !== undefined) {
  const latest = plugin.versions[0];
  if (latest === undefined) {
    fail(`${pkg.name} lists no version`);
  } else if (isTag) {
    // Tag mode: the tag names the release, and the package version must agree.
    if (tagName !== `v${pkg.version}`) {
      fail(`tag ${tagName} does not match package version v${pkg.version}`);
    } else {
      note(`tag ${tagName} matches package version`);
    }
    if (latest.version === pkg.version) note(`index already lists ${pkg.version}`);
    else note(`index still at ${latest.version}; main updates it after this tag`);
  } else if (latest.version !== pkg.version) {
    fail(`latest index version ${latest.version} does not match package.json ${pkg.version}`);
  } else {
    note(`latest index version matches package.json (${pkg.version})`);
  }

  // A git source must pin a commit that exists in this repository, so the
  // published index can always be installed.
  for (const version of plugin.versions) {
    if (version.source.type !== 'git') continue;
    try {
      execFileSync('git', ['cat-file', '-e', `${version.source.commit}^{commit}`], { cwd: root, stdio: 'ignore' });
      note(`${version.version} pins commit ${version.source.commit.slice(0, 12)} that exists here`);
    } catch {
      fail(`${version.version} pins commit ${version.source.commit} which is not in this repository`);
    }
  }

  const patch = readFileSync(join(root, 'cordis.patch.yml'), 'utf8');
  if (patch.includes(pkg.name)) note('cordis.patch.yml inserts this package');
  else fail(`cordis.patch.yml does not insert ${pkg.name}`);
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s)`);
  process.exitCode = 1;
} else {
  console.log('\nall checks passed');
}
