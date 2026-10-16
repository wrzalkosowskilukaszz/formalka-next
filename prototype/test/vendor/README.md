# Test-only third-party code

| File | What | Source | Integrity |
|---|---|---|---|
| `axe-core-4.13.0.min.js` | axe-core 4.13.0, the accessibility rules engine run by `e2e.mjs` (doc 18 §5.1, D2) | `npm pack axe-core@4.13.0`, 16.10.2026 | sha256 `c24f097b…a0c1`; matches the package's own `sri-history.json` (`sha256-wk8Je9L0…RwoME=`) and the registry's sha512 for the tarball |
| `AXE-CORE-LICENSE.txt` | Its licence, MPL-2.0 | the same package | — |

It is loaded only into the test browser, never into the prototype's page or build.
