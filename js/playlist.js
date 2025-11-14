// js/playlist.js
// Sequential audio player for a given pack id (?c=<id>) using a single <audio> element.

import { loadPacks, findPack, fallbackImg } from './app.js';

const $ = (sel) => document.querySelector(sel);

const state = {
  pack: null,
  index: 0,
  audio: null
};

function qparam(name) {
  const sp = new URLSearchParams(window.location.search);
  return sp.get(name);
}

function renderHeader() {
  const head = $('#pack-head');
  if (!head || !state.pack) return;
  head.innerHTML = `
    <div class="head-inner">
      ${fallbackImg(state.pack, 'cover')}
      <div class="meta">
        <span class="badge">${(state.pack.genre||'PACK').toUpperCase()}</span>
        <h2>${state.pack.title}</h2>
        <p>${state.pack.description || ''}</p>
        <p class="muted">${state.pack.samples.length} beats</p>
      </div>
    </div>
  `;
}

function renderList() {
  const list = $('#tracks');
  if (!list) return;
  list.innerHTML = '';
  state.pack.samples.forEach((s, i) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'track';
    row.dataset.i = i;
    row.innerHTML = `
      <span class="num">${String(i+1).padStart(2,'0')}</span>
      <span class="title">${s.title || ('Track ' + (i+1))}</span>
      <span class="sub">${[s.key, s.bpm? s.bpm+' BPM': null].filter(Boolean).join(' • ')}</span>
    `;
    row.addEventListener('click', () => playAt(i, true));
    list.appendChild(row);
  });
}

function ensureAudio() {
  if (!state.audio) {
    state.audio = new Audio();
    state.audio.preload = 'metadata';
    state.audio.addEventListener('ended', onEnded);
    document.body.appendChild(state.audio);
  }
  return state.audio;
}

function highlight(index) {
  document.querySelectorAll('.track').forEach(btn => btn.classList.remove('playing'));
  const btn = document.querySelector(`.track[data-i="${index}"]`);
  if (btn) btn.classList.add('playing');
}

function playAt(i, userTriggered=false) {
  const a = ensureAudio();
  if (!state.pack?.samples?.[i]) return;
  state.index = i;
  const s = state.pack.samples[i];
  a.src = s.src;
  a.currentTime = 0;
  a.play().catch(err => {
    console.warn('Autoplay blocked, waiting for user gesture', err);
    if (!userTriggered) {
      const first = document.querySelector('.track');
      if (first) first.focus();
    }
  });
  highlight(i);
}

function onEnded() {
  const next = state.index + 1;
  if (next < state.pack.samples.length) {
    playAt(next);
  } else {
    // loop back to first
    playAt(0);
  }
}

async function boot() {
  const id = qparam('c');
  const data = await loadPacks();
  const pack = findPack(data, id);
  if (!pack) {
    $('#pack-head').innerHTML = `<p style="padding:16px">Pack introuvable.</p>`;
    return;
  }
  state.pack = pack;
  renderHeader();
  renderList();
  // Start from first track, wait a tick so DOM is ready
  setTimeout(() => playAt(0), 50);
}

document.addEventListener('DOMContentLoaded', boot);