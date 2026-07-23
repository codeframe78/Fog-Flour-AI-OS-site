# Fog & Flour AI OS — Public Roadmap

This repository publishes the intentionally public project overview for Fog &
Flour: a local-first bakery operating system, Android companion, and narrative
cookbook platform.

- Planned canonical site: <https://fog-flour.jamesjennison.net/>
- Temporary GitHub Pages preview:
  <https://james-jennison.github.io/Fog-Flour-AI-OS-site/>

The canonical site is not considered live until its separately approved
Webuzo, DNS, TLS, and production validation milestones are complete.

## Privacy boundary

This repository contains only intentionally public presentation files and
approved brand assets. Application source, operational systems, business
records, backups, credentials, signing material, and the detailed delivery
board remain private.

The build copies an explicit public allowlist into `dist/`. It must never be
changed to fetch from, name, link to, or upload material from a private
repository or project board.

## Roadmap updates

`roadmap.json` is updated only from verified, owner-approved public milestone
counts and forecasts. A feature merge does not complete a milestone by itself:
delivery cards, exit criteria, operational evidence, and required owner
approval must all be complete. Forecast ranges are planning information rather
than promises.

The roadmap is rendered into static HTML during the build. Visitors do not need
JavaScript to read it, and the public website never calls GitHub at runtime.

## Build and validate

Node.js 22 is used for the dependency-free build:

```bash
npm run validate
```

This command rebuilds `dist/`, verifies the exact deployment allowlist, checks
the privacy boundary and canonical metadata, and rejects missing local assets
or sensitive deployment file types.

Preview only the generated artifact:

```bash
python3 -m http.server 8080 --directory dist
```

Then open <http://127.0.0.1:8080/>.

## Deployment

No local command in this repository deploys to Webuzo or changes DNS. Production
preparation, artifact transfer, health checks, rollback, and the eventual
GitHub Pages transition are documented in
[`docs/WEBUZO-DEPLOYMENT.md`](docs/WEBUZO-DEPLOYMENT.md).

Milestone evidence is recorded in
[`docs/MILESTONE_20B_WEBUZO_READY_SITE.md`](docs/MILESTONE_20B_WEBUZO_READY_SITE.md).
