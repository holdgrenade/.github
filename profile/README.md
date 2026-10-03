<p align="center">
  <a href="https://www.holdgrenade.com"><img src="https://raw.githubusercontent.com/holdgrenade/.github/main/profile/grenade-logo.png" alt="The Grenade logo: a hand holding a grenade with three status toggles" height="200"></a>
</p>

# Grenade

**Run your AI coding agents from your pocket.** Grenade lets you watch and answer the AI coding agents running in terminals on your Mac or your Linux computer (Claude Code, Codex, or a plain shell) from your phone or from a Mac app.

[Website](https://www.holdgrenade.com) · [Install](https://www.holdgrenade.com/install) · [Guide](https://www.holdgrenade.com/guide) · [Security](https://www.holdgrenade.com/security) · [Blog](https://www.holdgrenade.com/blog)

## What it does

- **One list of every session, with a status color.** Amber needs an answer, green has finished, blue is working, grey is idle.
- **Answer from where you are.** Read the live terminal, and answer Claude Code's permissions, questions and plans on a card.
- **Type or talk.** Hold the mic, and your words become text you can fix before it is sent.
- **Start work away from the desk.** Open a new session in a folder, or resume a past Claude conversation.
- **Nothing gets lost.** Each agent runs in a tmux session on your own computer, so closing a window ends nothing, and your terminal can attach to the same session at any time.
- **No account.** A phone is paired by scanning a QR code on the Mac, and `grenade unpair` on the Mac ends a pairing at once.

## How it works

```
  iPhone, Android        same Wi‑Fi: directly               grenaded, the daemon       tmux sessions:
  or the Mac app   ───   anywhere else: through a relay ──► on your Mac            ──► Claude Code, Codex, shell
                         (end-to-end encrypted both ways)
```

- **On your Mac or Linux computer**, the `grenade` command starts each agent in a tmux session, and the `grenaded` daemon follows what the agents do through their hooks.
- **On the same Wi‑Fi**, the phone talks to the Mac directly.
- **From anywhere else**, the phone and the Mac both dial out to a relay, so the Mac needs no open port and no VPN. The relay forwards bytes it cannot read. We run the main one at `relay.holdgrenade.com`, and you can [host your own](https://www.holdgrenade.com/relay): its code is [`grenade-relay`](https://github.com/holdgrenade/grenade-relay).

## Get started

On the Mac:

```bash
brew install holdgrenade/tap/grenade   # brings Node and tmux
grenade setup                          # start at login, remote access, then a QR code for the phone
```

On Linux (systemd, Node 22 or newer; tested on Arch Linux, which Omarchy is built on):

```bash
curl -fsSL https://www.holdgrenade.com/install.sh | sh   # no sudo; checks the release's sha256
grenade setup
```

Then get an app and scan the QR code:

| App | Where |
| --- | --- |
| iPhone (iOS 17 or later) | [Grenade: Agent Remote on the App Store](https://apps.apple.com/app/grenade-agent-remote/id6818136871) |
| Mac (macOS 26 or later) | [Download Grenade.dmg](https://downloads.holdgrenade.com/mac/Grenade.dmg) |
| Android | Not released yet |

Every step and every command is on the [install page](https://www.holdgrenade.com/install).

## Repositories

| Repository | What it is |
| --- | --- |
| [`grenade-cli`](https://github.com/holdgrenade/grenade-cli) | The computer's side, for macOS and Linux: the `grenaded` daemon and the `grenade` command. MIT license. |
| [`grenade-relay`](https://github.com/holdgrenade/grenade-relay) | The relay that joins a phone to its Mac across networks. Run your own with Docker: [Self-host a relay](https://www.holdgrenade.com/relay). MIT license. |
| [`homebrew-tap`](https://github.com/holdgrenade/homebrew-tap) | The Homebrew tap behind `brew install holdgrenade/tap/grenade`. |

The apps and the protocol are in repositories that are not public.

## Security

Everything between a phone and a Mac is end-to-end encrypted, on the Wi‑Fi as well as through a relay. The phone pins the Mac's key when it pairs, from the QR code on the Mac's screen, never from a relay. A relay learns which Macs are online and their IP addresses, and never sees a terminal, a keystroke or a pairing token.

[Who can read what](https://www.holdgrenade.com/security) says what someone on your Wi‑Fi, a relay's operator and the holder of a lost phone can and cannot do. What is collected is in the [privacy policy](https://www.holdgrenade.com/privacy).

## Help

- Something does not work, in any part of Grenade: [open an issue on `grenade-cli`](https://github.com/holdgrenade/grenade-cli/issues).
- A security problem: [report it privately](https://github.com/holdgrenade/grenade-cli/security/advisories/new).
