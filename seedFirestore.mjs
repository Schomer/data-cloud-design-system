#!/usr/bin/env node
// seedFirestore.mjs
// One-time script to upload all local data to Firestore using the REST API.
// Run: node seedFirestore.mjs

import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_ID = 'malloy-data';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const ROOT = __dirname;
const THEMES_DIR = join(ROOT, 'backend', 'themes');
const APPS_DIR = join(ROOT, 'frontend', 'src', 'generated_apps');

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (e) {
    console.warn(`  ⚠ Could not read ${path}: ${e.message}`);
    return null;
  }
}

function walkDir(dir, base = dir) {
  const results = [];
  if (!existsSync(dir)) return results;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...walkDir(full, base));
    } else {
      results.push({ fullPath: full, relativePath: relative(base, full) });
    }
  }
  return results;
}

// Convert a JS object to Firestore Value format
function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

// Convert a JS object to Firestore document format (top level)
function toFirestoreDoc(data) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] = toFirestoreValue(v);
  }
  return { fields };
}

// Write a document to Firestore using REST API
async function writeDoc(docPath, data) {
  const url = `${BASE_URL}/${docPath}`;
  const body = toFirestoreDoc(data);
  
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to write ${docPath}: ${res.status} ${text}`);
  }
}

async function seedThemes() {
  console.log('\n📁 Seeding themes...');
  const themeDirs = readdirSync(THEMES_DIR);
  
  for (const themeId of themeDirs) {
    const themeDir = join(THEMES_DIR, themeId);
    if (!statSync(themeDir).isDirectory()) continue;
    
    const metadata = readJson(join(themeDir, 'metadata.json'));
    if (!metadata) {
      console.log(`  ⚠ Skipping ${themeId} — no metadata.json`);
      continue;
    }
    
    console.log(`  📦 Theme: ${metadata.name || themeId}`);
    
    await writeDoc(`themes/${themeId}`, {
      id: themeId,
      name: metadata.name || themeId,
      description: metadata.description || '',
      thumbnail: metadata.thumbnail || '',
    });
    
    const specs = readJson(join(themeDir, 'specs.json'));
    if (specs && Object.keys(specs).length > 0) {
      await writeDoc(`themes/${themeId}/data/specs`, specs);
      console.log(`    ✓ specs.json`);
    }
    
    const chartColors = readJson(join(themeDir, 'chart_colors.json'));
    if (chartColors && Object.keys(chartColors).length > 0) {
      await writeDoc(`themes/${themeId}/data/chartColors`, chartColors);
      console.log(`    ✓ chart_colors.json`);
    }
  }
}

async function seedSkills() {
  console.log('\n📝 Seeding skills from dak_default...');
  const skillsDir = join(THEMES_DIR, 'dak_default', 'generated_skills');
  if (!existsSync(skillsDir)) {
    console.log('  ⚠ No generated_skills directory found');
    return;
  }
  
  const skillFiles = walkDir(skillsDir);
  let count = 0;
  
  for (const { fullPath, relativePath } of skillFiles) {
    if (!relativePath.endsWith('.md')) continue;
    
    const content = readFileSync(fullPath, 'utf-8');
    const docId = relativePath.replace(/\//g, '__');
    
    await writeDoc(`skills/${docId}`, { path: relativePath, content });
    count++;
    if (count % 10 === 0) {
      console.log(`  ... seeded ${count} skills so far`);
    }
  }
  
  console.log(`  ✓ Seeded ${count} skill files`);
}

async function seedApps() {
  console.log('\n🎮 Seeding generated apps...');
  if (!existsSync(APPS_DIR)) {
    console.log('  ⚠ No generated_apps directory found');
    return;
  }
  
  const jsonFiles = readdirSync(APPS_DIR).filter(f => f.endsWith('.json'));
  let count = 0;
  
  for (const jsonFile of jsonFiles) {
    const appId = jsonFile.replace('.json', '');
    const metadata = readJson(join(APPS_DIR, jsonFile));
    if (!metadata) continue;
    
    const jsxPath = join(APPS_DIR, `${appId}.jsx`);
    if (existsSync(jsxPath)) {
      metadata.code = readFileSync(jsxPath, 'utf-8');
    }
    
    await writeDoc(`apps/${appId}`, metadata);
    count++;
  }
  
  console.log(`  ✓ Seeded ${count} apps`);
}

async function seedConfig() {
  console.log('\n⚙️  Seeding config...');
  
  await writeDoc('config/activeTheme', { activeThemeId: 'dak_default' });
  console.log('  ✓ activeTheme → dak_default');
  
  const themePref = readJson(join(THEMES_DIR, 'dak_default', 'theme_pref.json'));
  await writeDoc('config/uiTheme', { theme: themePref?.theme || 'light' });
  console.log(`  ✓ uiTheme → ${themePref?.theme || 'light'}`);
}

async function main() {
  console.log('🔥 Seeding Firestore for Hyperskills (malloy-data)...');
  
  await seedThemes();
  await seedSkills();
  await seedApps();
  await seedConfig();
  
  console.log('\n✅ Seeding complete!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
