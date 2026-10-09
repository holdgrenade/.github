# .github (the folder `github-profile` in the workspace)

The repo `holdgrenade/.github`: what a visitor sees at `github.com/holdgrenade`, and the community files GitHub applies to every repo of the organization that has none of its own. It is public, so it takes no secrets, no private paths and no personal data.

## Files

```
profile/README.md                    the organization's profile page: what Grenade is, how it works, install, repos, security, help
profile/grenade-logo.png             the logo on that page: a copy of grenade-website/public/brand/grenade-logo-512.png
SECURITY.md                          the security policy of every repo: where to report a vulnerability privately
.github/ISSUE_TEMPLATE/problem.yml   the issue form of every repo
.github/ISSUE_TEMPLATE/config.yml    the links beside that form (private security report, the guide)
release-notes/release-notes.mjs      every repo's CHANGELOG writer: Claude's notes on a version's commits (each release workflow downloads it)
README.md                            what this repo is, for someone who opens it
```

## Rules

- **Show only what a user can get today.** The profile lists an app with a link once that link opens, and a repo once it is public. Android links to its Google Play listing; the private repos (apps, protocol) are named only as "not public". `grenade-relay` is public and listed.
- **The words are the website's.** Status colors, the three steps and the security claims say what `holdgrenade.com` says (`/`, `/install`, `/security`). When the website changes one of them, change it here.
- **The image has an absolute address** (`raw.githubusercontent.com/holdgrenade/.github/main/profile/grenade-logo.png`), so it shows on the profile page as well as in the repo. Never redraw the logo: copy it again from `grenade-website/public/brand/` when it changes.
- **Security reports go to private vulnerability reporting on `grenade-cli`** (turned on in that repo's settings), whichever part they are about, because it is the public repo the website sends people to; a report about the relay may also go to `grenade-relay`, which has it on too.
- **`release-notes/release-notes.mjs` is run by every repo's release workflow**, downloaded from `main` at each release, so a push here changes the next release notes of all of them: try it first in a repo (`node ../github-profile/release-notes/release-notes.mjs <previous tag>`, with `ANTHROPIC_API_KEY` and `RELEASE_NOTES_READER` set). Node 22 and no dependencies, and it must never fail a release: with no key, a failed call or an answer that is not a list of bullets it prints the commit subjects. The key is the repo secret `ANTHROPIC_API_KEY` in each versioned repo (the organization is on GitHub Free, where an organization secret does not reach a private repo). The model sees commit subjects, bodies and file names, never code.
- No version and no release: a push to `main` changes the profile at once, so read the page at `github.com/holdgrenade` after a push.
