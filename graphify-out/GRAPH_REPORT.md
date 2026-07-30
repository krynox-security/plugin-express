# Graph Report - plugin-express  (2026-07-30)

## Corpus Check
- 9 files · ~3,817 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 99 nodes · 125 edges · 9 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2fdc4c04`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- index.ts
- compilerOptions
- integration.test.ts
- devDependencies
- keywords
- middleware.ts
- @krynox/captcha-express
- Changelog

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 12 edges
2. `verifyKrynox()` - 9 edges
3. `keywords` - 8 edges
4. `krynoxCaptcha()` - 6 edges
5. `@krynox/captcha-express` - 6 edges
6. `KrynoxResult` - 5 edges
7. `KrynoxMiddlewareConfig` - 4 edges
8. `krynoxWidgetScript()` - 4 edges
9. `krynoxWidget()` - 4 edges
10. `express` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Request` --references--> `KrynoxResult`  [EXTRACTED]
  src/middleware.ts → src/verify.ts
- `krynoxCaptcha()` --calls--> `verifyKrynox()`  [EXTRACTED]
  src/middleware.ts → src/verify.ts
- `KrynoxMiddlewareConfig` --references--> `KrynoxResult`  [EXTRACTED]
  src/middleware.ts → src/verify.ts

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (19): description, exports, files, homepage, license, main, name, publishConfig (+11 more)

### Community 1 - "index.ts"
Cohesion: 0.24
Nodes (14): backoff(), delay(), isAbort(), KrynoxAgent, KrynoxHuman, parse(), randomKey(), RiskLevel (+6 more)

### Community 2 - "compilerOptions"
Cohesion: 0.12
Nodes (15): ES2021, src, compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, lib, module (+7 more)

### Community 3 - "integration.test.ts"
Cohesion: 0.29
Nodes (4): hits, PlaneHit, retryCounts, SUCCESS_PAYLOAD

### Community 4 - "devDependencies"
Cohesion: 0.18
Nodes (11): express, devDependencies, express, @types/express, @types/node, typescript, peerDependencies, express (+3 more)

### Community 5 - "keywords"
Cohesion: 0.25
Nodes (8): keywords, bot, captcha, express, krynox, middleware, privacy, proof-of-work

### Community 6 - "middleware.ts"
Cohesion: 0.48
Nodes (6): clientIp(), Express, krynoxCaptcha(), KrynoxMiddlewareConfig, Request, KrynoxResult

### Community 7 - "@krynox/captcha-express"
Cohesion: 0.25
Nodes (7): Configuration — `krynoxCaptcha(config)`, Honeypot, @krynox/captcha-express, Reliability, The result — `req.krynox`, Verify middleware, Widget embed

### Community 8 - "Changelog"
Cohesion: 0.40
Nodes (4): [0.1.0] - 2026-07-22, Added, Changelog, [Unreleased]

## Knowledge Gaps
- **48 isolated node(s):** `name`, `version`, `description`, `captcha`, `krynox` (+43 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `keywords` to `package.json`?**
  _High betweenness centrality (0.291) - this node is a cross-community bridge._
- **Why does `express` connect `keywords` to `integration.test.ts`, `middleware.ts`?**
  _High betweenness centrality (0.249) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `name`, `version`, `description` to the rest of the system?**
  _48 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._