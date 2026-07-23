# Milestone 20B — Webuzo-ready Fog & Flour project site

Status: **Local implementation complete; not pushed or deployed**

## Model and reasoning checkpoint

| Field                     | Decision                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Current model             | GPT-5.6 Sol                                                                                            |
| Current reasoning         | Medium                                                                                                 |
| Required reasoning        | Medium                                                                                                 |
| Model or reasoning change | None                                                                                                   |
| Why                       | This is a bounded static-site hardening and build task; High or xhigh would not materially improve it. |
| Expected usage impact     | Moderate                                                                                               |

## Objective and scope

Preserve the existing Fog & Flour visual identity while preparing a
privacy-safe, accessible, deterministic static artifact for the approved
`fog-flour.jamesjennison.net` hostname.

| Field                                      | Value                                    |
| ------------------------------------------ | ---------------------------------------- |
| Size                                       | Medium                                   |
| Estimated real-world Codex completion time | 60–120 minutes                           |
| Repository affected                        | `Fog-Flour-AI-OS-site` only              |
| Files affected                             | Public site, build, validation, and docs |
| Hostname represented                       | `fog-flour.jamesjennison.net`            |
| Webuzo components affected                 | None                                     |
| Production impact                          | None                                     |
| Owner input required                       | None during local implementation         |

This milestone does not create a Webuzo domain, DNS record, document root,
certificate, redirect, backup, persistent process, GitHub secret, Pages
transition, or production deployment.

## Approved implementation

- Reuse the current static site and preserve its visual direction.
- Remove obsolete personal Pages metadata and private-board links.
- Add master-site and public-status navigation.
- Pre-render the owner-curated roadmap for no-JavaScript resilience.
- Keep essential content visible on first paint.
- Repair mobile navigation, contrast, and accessible naming.
- Add canonical, social, search, manifest, and custom-error foundations.
- Add a strict domain-scoped Apache policy.
- Produce only an explicit allowlisted `dist/` artifact.
- Document isolated deployment and rollback.

The public roadmap figures remain those already intentionally published on July
19, 2026. This milestone does not infer a milestone change from newer private
repository activity.

## Validation plan

- Run deterministic build and artifact validation.
- Verify no private repository, private-board, personal Pages, credential,
  internal path, or origin-address content enters `dist/`.
- Check HTML structure, local links, metadata, static roadmap, security policy,
  search files, and custom error behavior.
- Test with JavaScript disabled, reduced motion, keyboard navigation, and
  narrow mobile through large desktop layouts.
- Run Lighthouse and accessibility checks against the local production
  artifact.
- Review and commit only milestone-related changes without pushing or
  deploying.

## Validation results

Completed July 23, 2026:

| Check                                                            | Result                                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| Deterministic build and public allowlist                         | Pass — 14 files, 264.1 KiB                                          |
| Static roadmap                                                   | Pass — eight milestones and 14/42 verified cards rendered into HTML |
| Privacy and sensitive-file checks                                | Pass                                                                |
| Canonical, social, search, manifest, master, and status metadata | Pass                                                                |
| HTML validation                                                  | Pass                                                                |
| JavaScript-disabled first paint                                  | Pass                                                                |
| Responsive visual review                                         | Pass at 390×844 and 1440×1000                                       |
| Reduced-motion support                                           | Pass — motion is removed by the existing media query                |
| Mobile Lighthouse                                                | 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO  |
| Desktop Lighthouse                                               | 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO  |
| Custom 404 accessibility and best practices                      | 100 / 100                                                           |
| Diff whitespace validation                                       | Pass                                                                |

The deployment-artifact manifest digest is
`7d4b2e05e672dccbe556102917cd3d595e4a1e408ed58fd3c056a4ededf86e6d`.
It identifies the sorted SHA-256 manifest of the final 14-file `dist/` output
at validation time. A fresh digest must be recorded from the exact approved
commit before any deployment.

## Rollback

Revert the isolated milestone commit. GitHub Pages and every production system
remain unchanged throughout this local milestone.

## Remaining approval gates

- Push the implementation commit
- Create the Webuzo domain and document root
- Create Cloudflare DNS
- Enroll Webuzo Automatic SSL
- Deploy to staging or production
- Publish or disable the GitHub Pages transition
- Mark Fog & Flour live on the master website
