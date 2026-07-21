# Incomplete 2019 URL-parameter work

The final source commit after the stable published version is:

- Full commit: `aeab30571b5de4b36d7d0cc2a6c9e421f299e321`
- Parent/stable commit: `a7e3dbc29f`
- Commit page and complete diff: https://github.com/rdbartlett/fractal-tree-node/commit/aeab30571b5de4b36d7d0cc2a6c9e421f299e321

## What changed

- Added `js/params.js` to read drawing parameters from the page URL.
- Called the parameter loader from `index.js`.
- Prevented tutorial navigation from moving outside its valid slide range.
- Made the HUD appear on entering free-play mode.
- Disabled the tutorial by default.
- Removed the corresponding URL-sharing and control-explanation TODO item.

The stable build has one small interface quirk that this commit partly addresses: jumping directly to free-play mode leaves the HUD hidden while its internal visibility flag still says it is showing. Pressing `I` twice reveals it; following the tutorial normally reveals it at the expected stage.

## Why it is not deployed

The Wayback bundle contains nine Browserify modules and does not contain the new parameter module. Its HTML exactly matches the parent commit. Therefore the 2019 commit was later source work, not the version known to have run in production.

## Picking the thread up

Start from the `fractal-tree-node` repository at the full commit above. Rebuild `build.js`, then verify:

1. URLs with every supported numeric and boolean parameter.
2. Empty, malformed, repeated, and extreme query values.
3. Tutorial visibility when parameters are absent.
4. Back/forward navigation and shareable URLs.
5. Modern browser compatibility and dependency updates.

Keep the restored stable deployment available as the comparison baseline.
