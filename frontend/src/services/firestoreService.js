// DAK Hyperskills — Firestore Data Service
// Replaces all /api/* calls with direct Firestore reads/writes.

import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

// ============================================================
// Themes
// ============================================================

export async function getThemes() {
  const snapshot = await getDocs(collection(db, 'themes'));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createTheme({ sourceThemeId, name, description }) {
  const newId = crypto.randomUUID();
  const newMeta = { id: newId, name, description: description || '', thumbnail: '' };

  // Copy specs and chart colors from source theme if it exists
  if (sourceThemeId) {
    const [sourceSpecs, sourceColors] = await Promise.all([
      getSpecs(sourceThemeId),
      getChartColors(sourceThemeId),
    ]);
    const batch = writeBatch(db);
    batch.set(doc(db, 'themes', newId), newMeta);
    if (sourceSpecs && Object.keys(sourceSpecs).length > 0) {
      batch.set(doc(db, 'themes', newId, 'data', 'specs'), sourceSpecs);
    }
    if (sourceColors && Object.keys(sourceColors).length > 0) {
      batch.set(doc(db, 'themes', newId, 'data', 'chartColors'), sourceColors);
    }
    await batch.commit();
  } else {
    await setDoc(doc(db, 'themes', newId), newMeta);
  }

  return newMeta;
}

export async function updateTheme(themeId, data) {
  await updateDoc(doc(db, 'themes', themeId), data);
}

export async function deleteTheme(themeId) {
  // Delete subcollection docs first
  const dataDocs = await getDocs(collection(db, 'themes', themeId, 'data'));
  const batch = writeBatch(db);
  dataDocs.docs.forEach(d => batch.delete(d.ref));
  batch.delete(doc(db, 'themes', themeId));
  await batch.commit();
}

// ============================================================
// Specs (per theme)
// ============================================================

export async function getSpecs(themeId = 'dak_default') {
  const snap = await getDoc(doc(db, 'themes', themeId, 'data', 'specs'));
  return snap.exists() ? snap.data() : {};
}

export async function saveSpecs(themeId, specs) {
  await setDoc(doc(db, 'themes', themeId, 'data', 'specs'), specs);
}

// ============================================================
// Chart Colors (per theme)
// ============================================================

export async function getChartColors(themeId = 'dak_default') {
  const snap = await getDoc(doc(db, 'themes', themeId, 'data', 'chartColors'));
  return snap.exists() ? snap.data() : {};
}

export async function saveChartColors(themeId, colors) {
  await setDoc(doc(db, 'themes', themeId, 'data', 'chartColors'), colors);
}

// ============================================================
// Config (active theme, UI theme preference)
// ============================================================

export async function getActiveThemeId() {
  const snap = await getDoc(doc(db, 'config', 'activeTheme'));
  return snap.exists() ? snap.data().activeThemeId || 'dak_default' : 'dak_default';
}

export async function saveActiveThemeId(activeThemeId) {
  await setDoc(doc(db, 'config', 'activeTheme'), { activeThemeId });
}

export async function getUiTheme() {
  const snap = await getDoc(doc(db, 'config', 'uiTheme'));
  return snap.exists() ? snap.data().theme || 'light' : 'light';
}

export async function saveUiTheme(theme) {
  await setDoc(doc(db, 'config', 'uiTheme'), { theme });
}

// ============================================================
// Apps (generated app metadata)
// ============================================================

export async function getApps() {
  const snapshot = await getDocs(collection(db, 'apps'));
  const apps = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  return apps.sort((a, b) => (b.id > a.id ? 1 : -1));
}

export async function saveApp(appId, metadata) {
  await setDoc(doc(db, 'apps', appId), metadata);
}

export async function deleteApp(appId) {
  await deleteDoc(doc(db, 'apps', appId));
}

// ============================================================
// Skills (skill file content)
// ============================================================

// Skills are stored with their path as the document ID (slashes replaced with __)
function skillDocId(path) {
  return path.replace(/\//g, '__');
}

export async function getSkillContent(path) {
  const snap = await getDoc(doc(db, 'skills', skillDocId(path)));
  return snap.exists() ? snap.data().content || '' : '';
}

export async function saveSkillContent(path, content) {
  await setDoc(doc(db, 'skills', skillDocId(path)), { path, content });
}

export async function getAllSkills() {
  const snapshot = await getDocs(collection(db, 'skills'));
  return snapshot.docs.map(d => d.data());
}
