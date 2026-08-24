"use client";

export const SAVED_ITEMS_KEY = "zhuo:saved-items:v1";
export const SAVED_ITEMS_EVENT = "zhuo-saved-items-change";
export const SAVED_ITEMS_SERVER_SNAPSHOT = Object.freeze({ status: "server" });
export const SAVED_ITEMS_UNAVAILABLE_SNAPSHOT = Object.freeze({ status: "unavailable" });

const EMPTY_SNAPSHOT = JSON.stringify({ version: 1, items: [] });
const MAX_ITEMS = 100;
const VALID_KINDS = new Set(["article", "project"]);
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidItem(item) {
  return Boolean(
    item &&
    VALID_KINDS.has(item.kind) &&
    typeof item.slug === "string" &&
    item.slug.length <= 120 &&
    VALID_SLUG.test(item.slug) &&
    typeof item.savedAt === "string" &&
    Number.isFinite(Date.parse(item.savedAt)),
  );
}

function normalizeItems(items) {
  const unique = new Map();
  let invalidCount = 0;
  for (const item of Array.isArray(items) ? items : []) {
    if (!isValidItem(item)) {
      invalidCount += 1;
      continue;
    }
    const key = `${item.kind}:${item.slug}`;
    if (!unique.has(key)) unique.set(key, { kind: item.kind, slug: item.slug, savedAt: item.savedAt });
  }
  return {
    items: [...unique.values()].sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt)).slice(0, MAX_ITEMS),
    invalidCount,
  };
}

export function decodeSavedItems(snapshot) {
  if (snapshot === SAVED_ITEMS_SERVER_SNAPSHOT) return { status: "loading", items: [], invalidCount: 0 };
  if (snapshot === SAVED_ITEMS_UNAVAILABLE_SNAPSHOT) return { status: "unavailable", items: [], invalidCount: 0 };
  try {
    const parsed = JSON.parse(snapshot || EMPTY_SNAPSHOT);
    if (parsed?.version !== 1 || !Array.isArray(parsed.items)) return { status: "invalid", items: [], invalidCount: 0 };
    const normalized = normalizeItems(parsed.items);
    return { status: "ready", ...normalized };
  } catch {
    return { status: "invalid", items: [], invalidCount: 0 };
  }
}

export function getSavedItemsSnapshot() {
  if (typeof window === "undefined") return SAVED_ITEMS_SERVER_SNAPSHOT;
  try {
    return window.localStorage.getItem(SAVED_ITEMS_KEY) || EMPTY_SNAPSHOT;
  } catch {
    return SAVED_ITEMS_UNAVAILABLE_SNAPSHOT;
  }
}

export function getSavedItemsServerSnapshot() {
  return SAVED_ITEMS_SERVER_SNAPSHOT;
}

export function subscribeToSavedItems(listener) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (event) => {
    if (event.key === SAVED_ITEMS_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(SAVED_ITEMS_EVENT, listener);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SAVED_ITEMS_EVENT, listener);
  };
}

function writeItems(items) {
  try {
    window.localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify({ version: 1, items: normalizeItems(items).items }));
    window.dispatchEvent(new Event(SAVED_ITEMS_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function savedItemKey(item) {
  return `${item.kind}:${item.slug}`;
}

export function toggleSavedItem(kind, slug) {
  const current = decodeSavedItems(getSavedItemsSnapshot());
  if (current.status === "unavailable") return { ok: false, saved: false };
  const candidate = { kind, slug, savedAt: new Date().toISOString() };
  if (!isValidItem(candidate)) return { ok: false, saved: false };
  const key = `${kind}:${slug}`;
  const exists = current.items.some((item) => savedItemKey(item) === key);
  const items = exists
    ? current.items.filter((item) => savedItemKey(item) !== key)
    : [candidate, ...current.items];
  return { ok: writeItems(items), saved: !exists };
}

export function removeSavedItem(kind, slug) {
  const current = decodeSavedItems(getSavedItemsSnapshot());
  if (current.status !== "ready") return false;
  return writeItems(current.items.filter((item) => item.kind !== kind || item.slug !== slug));
}

export function clearSavedItems() {
  try {
    window.localStorage.removeItem(SAVED_ITEMS_KEY);
    window.dispatchEvent(new Event(SAVED_ITEMS_EVENT));
    return true;
  } catch {
    return false;
  }
}
