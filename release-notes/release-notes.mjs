#!/usr/bin/env node
/**
 * The CHANGELOG.md bullets for one version, written by Claude for the people who read that repo's changelog.
 *
 *   node release-notes.mjs [<previous tag>]   the commits since that tag (all of them when it is empty), from git
 *   node release-notes.mjs --lines            bullets already written, read from stdin, to rewrite
 *   node release-notes.mjs --commits          the commits whose hashes are on stdin, one per line (an old version's)
 *
 * Prints "- " lines and nothing else. Who reads the notes is RELEASE_NOTES_READER ("people using Grenade on their
 * iPhone"). Without ANTHROPIC_API_KEY, or when the call fails or the answer is not a list of bullets, it prints the
 * commit subjects as they are, so a release never waits on the model. Merges and github-actions[bot]'s commits are
 * left out. Node 22, no dependencies: every repo's release workflow downloads this one file and runs it.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const MODEL = process.env.RELEASE_NOTES_MODEL || "claude-haiku-5-5";
const READER = process.env.RELEASE_NOTES_READER || "people using Grenade";
const NOTHING = "- No change of its own.";

const args = process.argv.slice(2);
const fromLines = args.includes("--lines");
const fromCommits = args.includes("--commits");
const since = args.find((a) => !a.startsWith("--")) || "";

/** The commits since `since` (or the ones named on stdin) that a person wrote: subject, body and the files they touched. */
function commits() {
  const range = fromCommits ? ["--no-walk=unsorted", ...readFileSync(0, "utf8").split(/\s+/).filter(Boolean)] : since ? [`${since}..HEAD`] : ["HEAD"];
  if (fromCommits && range.length === 1) return [];
  const out = execFileSync("git", ["log", ...range, "--no-merges", "--name-only", "--format=%x1e%an%x1f%s%x1f%b%x1f"], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return out
    .split("\x1e")
    .filter((r) => r.trim())
    .map((r) => {
      const [author, subject, body, files] = r.split("\x1f");
      return { author, subject: subject.trim(), body: body.trim(), files: files.trim().split("\n").filter(Boolean) };
    })
    .filter((c) => c.author !== "github-actions[bot]");
}

/** What the model reads: each commit's subject, the start of its body, and its first files. */
function describe(list) {
  const text = list
    .map((c) => {
      const body = c.body.replace(/^Co-Authored-By:.*$/gim, "").trim().slice(0, 600);
      const files = c.files.slice(0, 15).join(", ") + (c.files.length > 15 ? `, and ${c.files.length - 15} more` : "");
      return [`* ${c.subject}`, body && `  ${body.replace(/\n/g, "\n  ")}`, files && `  files: ${files}`].filter(Boolean).join("\n");
    })
    .join("\n\n");
  return text.slice(0, 40_000);
}

const SYSTEM = `You write release notes for Grenade. Grenade lets people watch and drive AI coding agents (Claude Code, Codex, a plain shell) running in terminals on their computer from their phone, the Mac app, or Chrome.

This changelog is read by ${READER}. From the changes you are given, write the notes for one version.

- Answer with Markdown bullet lines only, each starting with "- ". No heading, no introduction, nothing after.
- One bullet per change this reader would notice; fold changes that are one change into one bullet. At most 8 bullets.
- Say what changed for the reader, in plain words: what they can now do, what looks or works differently, what was fixed. Not how the code changed.
- Leave out what this reader never sees: tests, CI, refactors, code comments, developer docs, version bumps, CHANGELOG edits. If nothing is left, answer exactly "- Small fixes and improvements."
- Use only what the changes say. Never invent a feature, a number or a reason.
- No people's names, no file paths, no code identifiers unless the reader types them (a command, a setting).`;

async function rewrite(input) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system: SYSTEM,
          messages: [{ role: "user", content: `The changes in this version:\n\n${input}` }],
        }),
        signal: AbortSignal.timeout(60_000),
      });
      if (!res.ok) {
        console.error(`release-notes: ${res.status} ${(await res.text()).slice(0, 300)}`);
        if (res.status < 500 && res.status !== 429) return null;
        continue;
      }
      const json = await res.json();
      return bullets(json.content?.map((b) => b.text || "").join("") || "");
    } catch (error) {
      console.error(`release-notes: ${error.message}`);
    }
  }
  return null;
}

/** The answer if it is what a CHANGELOG section holds (1 to 10 "- " lines), else null. */
function bullets(text) {
  const lines = text.trim().split("\n").map((l) => l.trimEnd()).filter(Boolean);
  const ok = lines.length >= 1 && lines.length <= 10 && lines.every((l) => /^- \S/.test(l) && l.length <= 400);
  return ok ? lines.join("\n") : null;
}

let plain, input;
if (fromLines) {
  plain = readFileSync(0, "utf8").trim();
  input = plain;
} else {
  const list = commits();
  plain = list.map((c) => `- ${c.subject}`).join("\n");
  input = describe(list);
}
if (!plain) {
  console.log(NOTHING);
} else {
  console.log((await rewrite(input)) ?? plain);
}
