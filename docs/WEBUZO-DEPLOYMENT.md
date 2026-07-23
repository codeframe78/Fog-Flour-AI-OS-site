# Webuzo deployment

Status: **Prepared locally; domain creation and deployment are not authorized by this document**

## Production contract

- Canonical hostname: `https://fog-flour.jamesjennison.net`
- Source repository: `James-Jennison/Fog-Flour-AI-OS-site`
- Webuzo user: `jamesjen`
- Proposed document root: `/home/jamesjen/fog-flour.jamesjennison.net`
- Output type: static files from `dist/`
- Runtime, process manager, reverse proxy, scheduled task, and database: none
- Edge: Cloudflare proxied DNS with Full (Strict) TLS
- Origin certificate: Webuzo Automatic SSL

Webuzo must remain authoritative for the exact document root. The proposed path
must be confirmed after Webuzo creates the domain and before any upload.

## Build contract

```bash
npm run validate
```

Only the resulting `dist/` directory is eligible for deployment. The build uses
an explicit public-file allowlist and pre-renders the owner-curated roadmap.
Source, Git metadata, credentials, private documentation, dependency
directories, logs, and source maps must never enter the document root.

## Promotion contract

Every deployment requires separate owner approval and must:

1. resolve the exact Webuzo-managed domain, user, and document root;
2. confirm Automatic SSL and Cloudflare Full (Strict) readiness;
3. capture and restore-test the current Webuzo and document-root state;
4. rebuild and validate the exact approved source commit;
5. stage the artifact in an isolated candidate path;
6. preserve ownership, permissions, and Webuzo-managed ACME paths;
7. validate Apache syntax before promotion;
8. retain the prior release and arm automatic rollback;
9. verify origin and edge routes, TLS, redirects, headers, metadata, the custom
   404, master/status navigation, and unaffected sites; and
10. capture and restore-test the production state.

No generated virtual host, global server configuration, shared service, mail
service, or unrelated domain may be changed.

## GitHub Pages transition

After the Webuzo deployment passes production validation, publish a lightweight
`noindex` transition page at the former GitHub Pages URL for 30 days. It should
link to the new hostname and declare the new URL as canonical. Disabling Pages,
changing repository homepage metadata, and publishing the transition page each
remain separate GitHub approval gates.

## Rollback

Atomically restore the retained prior document root and rerun the complete
origin, edge, mail-boundary, and unaffected-site validation matrix. The
pre-deployment Restic snapshot is the secondary recovery path.
