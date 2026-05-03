# Vercel deploy skill

This repo now includes reusable deployment instructions for both Codex and Claude Code.

## Codex

- Skill path: `.codex/skills/vercel-portfolio-deploy`
- Main skill file: `.codex/skills/vercel-portfolio-deploy/SKILL.md`
- Repo-specific notes: `.codex/skills/vercel-portfolio-deploy/references/repo-notes.md`

Example prompt:

```text
Use $vercel-portfolio-deploy to deploy this repo to Vercel, verify the public alias, and check whether production auto-deploy is wired.
```

## Claude Code

- Command path: `.claude/commands/vercel-portfolio-deploy.md`
- Slash command name: `/vercel-portfolio-deploy`

Example prompt:

```text
/vercel-portfolio-deploy
```

## What they cover

- local build validation before deploy
- Vercel project linking and rename checks
- syncing `OPENROUTER_API_KEY` to Vercel production
- production deploy and public alias verification
- fixing `*.vercel.app` access issues caused by Vercel SSO protection
- keeping production in sync with `main` through `.github/workflows/vercel-production.yml`

## Current target

- Vercel project: `porfolio-leduy`
- Public alias: `https://porfolio-leduy.vercel.app`

If that alias changes later, update `references/repo-notes.md` first so the skill stays in sync with the live project.
