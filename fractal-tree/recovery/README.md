# Fractal Tree recovery log

This directory records the three known generations of the Fractal Tree project and the evidence used for the July 2026 restoration.

## Deployed version: animated tutorial (2018, archived in 2020)

The page now served from `/fractal-tree/` is the latest version proven to have been published and working.

- Source repository: https://github.com/rdbartlett/fractal-tree-node
- Stable source commit: `a7e3dbc29f` (2018-06-04)
- Archived page: https://web.archive.org/web/20200930170702/http://richdecibels.com/fractal-tree/
- Archived generated bundle: https://web.archive.org/web/20201029045946id_/http://richdecibels.com/fractal-tree/build.js
- Archived HTML SHA-256: `b0b8ad4fb2dfb1a15c5b7890155e5385a7ebe9a7f57734c78c875f9d1514ba36`
- Restored HTML SHA-256: `c6cf6a31b51ded10627d829e2cc2cd8335f332b6b3370535092cad5c5f1d212e` (same source content with a trailing newline)
- Restored JavaScript SHA-256: `bbe2b626a266e2a52a1f6514c47ea3236944d03f60032250f20ae57f9382a3cf`

The archived HTML is byte-for-byte identical to `index.html` at the stable source commit. The bundle passes `node --check`.

Features include the guided tutorial, animated parameter ranges, presets, play/pause, orbit, point mode, colour controls, the text HUD, and keyboard operation.

## Older version: slider interface (2017)

The version previously served by this GitHub Pages repository is preserved at [legacy-2017/index.html](legacy-2017/index.html). Its supporting CSS and JavaScript remain in the parent `fractal-tree` directory.

Git restore point:

- Website commit before restoration: `11d7924`
- Original file: `11d7924:fractal-tree/index.html`
- Original website repository history: https://github.com/rdbartlett/richdecibels.com

This was a monolithic slider-based implementation with four presets and colour pickers. It entered the current repository during the January 2023 host migration.

## Incomplete follow-up: URL parameters (2019)

The newest source commit is preserved in its original repository and documented in [incomplete-2019/README.md](incomplete-2019/README.md).

- Commit: `aeab30571b5de4b36d7d0cc2a6c9e421f299e321`
- Date: 2019-04-07
- Source: https://github.com/rdbartlett/fractal-tree-node/commit/aeab30571b5de4b36d7d0cc2a6c9e421f299e321

It is one commit beyond the deployed stable version. It was not present in the archived production bundle, so it has deliberately not been included in the live restoration.

## Why the advanced version disappeared

The animated version was deployed directly from a separate local `fractal-tree-node` checkout to the old web server. It was never merged back into the website repository. The January 2023 migration therefore copied the older Git-tracked slider version over to the new GitHub Pages site.
