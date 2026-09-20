/**
 * Live product prices from Google Sheets (gviz CSV).
 */
'use strict';

const https = require('node:https');
const http = require('node:http');

const SHEET_ID = '19ZKi22OLVeULGq6ZYVaxPcKEyW7fnFBZJD2mAcQ4Cr0';
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/' +
  SHEET_ID +
  '/gviz/tq?tqx=out:csv';
const CACHE_MS = 60 * 1000;
const FAIL_MSG =
  'Price temporarily unavailable — call (805) 563-0870';

let cache = {
  at: 0,
  ok: false,
  byId: {},
  rows: [],
  error: null,
};

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(
      url,
      {
        headers: {
          'User-Agent': 'FiestaJ-PriceSync/1.0',
          Accept: 'text/csv,*/*',
        },
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          fetchText(res.headers.location).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error('HTTP ' + res.statusCode));
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          resolve(Buffer.concat(chunks).toString('utf8'));
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy(new Error('timeout'));
    });
  });
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQ = true;
    } else if (ch === ',') {
      row.push(cur);
      cur = '';
    } else if (ch === '\n') {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = '';
    } else if (ch !== '\r') {
      cur += ch;
    }
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
}

function parseMoney(raw) {
  if (raw == null || raw === '') return null;
  const n = Number(String(raw).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
}

function normalizeRows(table) {
  if (!table.length) return [];
  const headers = table[0].map((h) =>
    String(h || '')
      .trim()
      .toLowerCase()
  );
  const idx = (name) => headers.indexOf(name);
  const iId = idx('id');
  const iName = idx('name');
  const iPrice = idx('price_usd');
  const iActive = idx('active');
  const iCat = idx('category');
  const out = [];
  for (let r = 1; r < table.length; r++) {
    const cells = table[r];
    const id = String(cells[iId] || '')
      .trim()
      .toLowerCase();
    if (!id) continue;
    const priceNum = parseMoney(cells[iPrice]);
    const active =
      String(cells[iActive] || 'TRUE').toUpperCase() !== 'FALSE';
    out.push({
      id,
      name: String(cells[iName] || '').trim(),
      category: String(cells[iCat] || '').trim(),
      price_usd: String(cells[iPrice] || '').trim(),
      price: priceNum,
      active,
    });
  }
  return out;
}

async function refresh(force) {
  const now = Date.now();
  if (!force && cache.ok && now - cache.at < CACHE_MS) {
    return cache;
  }
  try {
    const text = await fetchText(CSV_URL);
    const rows = normalizeRows(parseCsv(text));
    const byId = {};
    for (const row of rows) byId[row.id] = row;
    cache = { at: now, ok: true, byId, rows, error: null };
  } catch (err) {
    cache = {
      at: now,
      ok: false,
      byId: cache.byId || {},
      rows: cache.rows || [],
      error: err.message || String(err),
    };
  }
  return cache;
}

function publicPayload(cacheObj) {
  const prices = {};
  for (const [id, row] of Object.entries(cacheObj.byId || {})) {
    if (!row.active) continue;
    prices[id] = {
      name: row.name,
      price: row.price,
      price_label:
        row.price != null ? 'from $' + Math.round(row.price) : null,
      category: row.category,
    };
  }
  return {
    ok: cacheObj.ok,
    updated_at: cacheObj.at
      ? new Date(cacheObj.at).toISOString()
      : null,
    count: Object.keys(prices).length,
    fail_message: FAIL_MSG,
    prices,
    error: cacheObj.ok ? null : cacheObj.error,
  };
}

module.exports = {
  CSV_URL,
  FAIL_MSG,
  refresh,
  publicPayload,
  getCache: () => cache,
};
