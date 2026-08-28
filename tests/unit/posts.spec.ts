import { expect, test } from "@playwright/test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { listPosts } from "@/lib/posts";

const frontmatter = (over: Record<string, unknown>) =>
  `---
title: ${over.title ?? "A post"}
date: ${over.date ?? "2026-08-01"}
summary: ${over.summary ?? "A summary."}
tags: ${JSON.stringify(over.tags ?? ["one"])}
---

Body.
`;

const writePost = (dir: string, name: string, body: string) =>
  writeFileSync(join(dir, name), body, "utf8");

test("caches only the production post catalogue", async () => {
  expect(listPosts()).toBe(listPosts());

  const dir = mkdtempSync(join(tmpdir(), "posts-"));
  try {
    writePost(dir, "first.mdx", frontmatter({ title: "First" }));
    expect(listPosts(dir).map((post) => post.slug)).toEqual(["first"]);

    writePost(dir, "second.mdx", frontmatter({ title: "Second" }));
    expect(listPosts(dir).map((post) => post.slug)).toEqual([
      "second",
      "first",
    ]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("parses frontmatter posts and sorts them newest-first", async () => {
  const dir = mkdtempSync(join(tmpdir(), "posts-"));
  try {
    writePost(dir, "older.mdx", frontmatter({ title: "Older", date: "2026-08-01" }));
    writePost(dir, "newer.mdx", frontmatter({ title: "Newer", date: "2026-08-27" }));

    const posts = listPosts(dir);

    expect(posts.map((p) => p.slug)).toEqual(["newer", "older"]);
    expect(posts[0]).toMatchObject({
      slug: "newer",
      title: "Newer",
      date: "2026-08-27",
      summary: "A summary.",
      tags: ["one"],
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("rejects a post whose frontmatter breaks the metadata contract", async () => {
  const dir = mkdtempSync(join(tmpdir(), "posts-"));
  try {
    writePost(
      dir,
      "broken.mdx",
      "---\ntitle: No date or summary\ntags: []\n---\n\nBody.\n",
    );

    expect(() => listPosts(dir)).toThrow(/broken\.mdx/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("rejects an impossible calendar date", async () => {
  const dir = mkdtempSync(join(tmpdir(), "posts-"));
  try {
    writePost(dir, "impossible.mdx", frontmatter({ date: "2026-02-31" }));

    expect(() => listPosts(dir)).toThrow(
      /impossible\.mdx frontmatter needs a valid calendar date/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("rejects an impossible calendar date written as a YAML string", async () => {
  const dir = mkdtempSync(join(tmpdir(), "posts-"));
  try {
    writePost(dir, "impossible.mdx", frontmatter({ date: '"2026-02-31"' }));

    expect(() => listPosts(dir)).toThrow(
      /impossible\.mdx frontmatter needs a valid calendar date/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("ignores files that are not mdx posts", async () => {
  const dir = mkdtempSync(join(tmpdir(), "posts-"));
  try {
    writePost(dir, "real.mdx", frontmatter({}));
    writePost(dir, "notes.txt", "not a post");

    const posts = listPosts(dir);

    expect(posts.map((p) => p.slug)).toEqual(["real"]);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
