import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const hubPath = resolve(rootDir, "index.html");

const projects = [
  {
    title: "Frutas dos Lemures",
    url: "https://davirolim.github.io/frutas-dos-lemures/"
  },
  {
    title: "Safari de Sons",
    url: "https://davirolim.github.io/safari-de-sons/"
  },
  {
    title: "Conta os Bichinhos",
    url: "https://davirolim.github.io/conta-os-bichinhos/"
  },
  {
    title: "Cade o Nariz do Natan?",
    url: "https://davirolim.github.io/natan-body-parts/"
  },
  {
    title: "Natan e a Escova da Floresta",
    url: "https://davirolim.github.io/natan-escova-floresta/"
  }
];

test("Natan's Land hub lists every project with live links", () => {
  const html = readFileSync(hubPath, "utf8");

  assert.match(html, /<title>\s*Natan's Land\s*<\/title>/);
  assert.match(html, /<h1[^>]*>\s*Natan's Land\s*<\/h1>/);

  for (const project of projects) {
    assert.ok(html.includes(project.title), `${project.title} should be visible`);
    assert.ok(html.includes(project.url), `${project.title} should link to GitHub Pages`);
  }
});

test("local card artwork referenced by the hub exists", () => {
  const html = readFileSync(hubPath, "utf8");
  const sourceMatches = [...html.matchAll(/src="\.\/([^"]+)"/g)].map((match) => match[1]);

  assert.ok(sourceMatches.length >= projects.length, "expected at least one image per project");

  for (const source of sourceMatches) {
    assert.ok(existsSync(resolve(rootDir, source)), `${source} should exist`);
  }
});

test("Natan is the central hero character", () => {
  const html = readFileSync(hubPath, "utf8");
  const heroMatch = html.match(/<img class="guide" src="\.\/([^"]+)" alt="" \/>/);

  assert.ok(heroMatch, "expected a central hero guide image");
  assert.equal(heroMatch[1], "safari-de-sons/assets/images/natan-jungle.png");
});
