/* ============================================================
   LinguaFlow — app.js
   Translation via MyMemory API (free, no API key needed)
   + Text-to-Speech via Web Speech API
   + Translation History (localStorage)
   + Particle Background
   ============================================================ */

'use strict';

// ── DOM References ──────────────────────────────────────────
const sourceLangSel   = document.getElementById('sourceLang');
const targetLangSel   = document.getElementById('targetLang');
const swapBtn         = document.getElementById('swapBtn');
const sourceTextArea  = document.getElementById('sourceText');
const outputArea      = document.getElementById('outputArea');
const translateBtn    = document.getElementById('translateBtn');
const clearBtn        = document.getElementById('clearBtn');
const charCount       = document.getElementById('charCount');
const headerCharCount = document.getElementById('headerCharCount');
const detectedLang    = document.getElementById('detectedLang');
const wordCount       = document.getElementById('wordCount');
const sourceTtsBtn    = document.getElementById('sourceTtsBtn');
const targetTtsBtn    = document.getElementById('targetTtsBtn');
const sourceCopyBtn   = document.getElementById('sourceCopyBtn');
const targetCopyBtn   = document.getElementById('targetCopyBtn');
const toast           = document.getElementById('toast');
const historySection  = document.getElementById('historySection');
const historyList     = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const pills           = document.querySelectorAll('.pill');
const translatingInd  = document.getElementById('translatingIndicator');

// ── Language List ───────────────────────────────────────────
const LANGUAGES = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jv', name: 'Javanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar (Burmese)' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ny', name: 'Nyanja (Chichewa)' },
  { code: 'or', name: 'Odia (Oriya)' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'sr', name: 'Serbian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala (Sinhalese)' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'es', name: 'Spanish' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tl', name: 'Tagalog (Filipino)' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'zu', name: 'Zulu' },
];

// ── State ───────────────────────────────────────────────────
let currentTranslation = '';
let isSpeaking = false;
let history = JSON.parse(localStorage.getItem('lf_history') || '[]');
let translateDebounceTimer = null;

// ── Init ────────────────────────────────────────────────────
function init() {
  populateLanguageSelects();
  sourceLangSel.value = 'auto';
  targetLangSel.value = 'es';
  renderHistory();
  setupEventListeners();
  initParticles();
  updateActivePill();
}

// ── Populate Language Dropdowns ─────────────────────────────
function populateLanguageSelects() {
  // Source: keep "auto" option first
  LANGUAGES.forEach(lang => {
    const opt = new Option(lang.name, lang.code);
    sourceLangSel.add(opt);
  });

  // Target: no auto
  LANGUAGES.forEach(lang => {
    const opt = new Option(lang.name, lang.code);
    targetLangSel.add(opt);
  });
}

// ── Event Listeners ─────────────────────────────────────────
function setupEventListeners() {
  translateBtn.addEventListener('click', doTranslate);

  sourceTextArea.addEventListener('input', () => {
    updateCharCount();
    // Auto-translate after 800ms pause
    clearTimeout(translateDebounceTimer);
    if (sourceTextArea.value.trim().length > 2) {
      translateDebounceTimer = setTimeout(doTranslate, 800);
    } else {
      resetOutput();
    }
  });

  swapBtn.addEventListener('click', swapLanguages);
  clearBtn.addEventListener('click', clearSource);

  sourceCopyBtn.addEventListener('click', () => copyText(sourceTextArea.value, sourceCopyBtn));
  targetCopyBtn.addEventListener('click', () => copyText(currentTranslation, targetCopyBtn));

  sourceTtsBtn.addEventListener('click', () => speak(sourceTextArea.value, sourceLangSel.value === 'auto' ? 'en' : sourceLangSel.value, sourceTtsBtn));
  targetTtsBtn.addEventListener('click', () => speak(currentTranslation, targetLangSel.value, targetTtsBtn));

  clearHistoryBtn.addEventListener('click', clearHistory);

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const lang = pill.dataset.lang;
      targetLangSel.value = lang;
      updateActivePill();
      if (sourceTextArea.value.trim()) doTranslate();
    });
  });

  targetLangSel.addEventListener('change', () => {
    updateActivePill();
    if (sourceTextArea.value.trim()) doTranslate();
  });

  sourceLangSel.addEventListener('change', () => {
    if (sourceTextArea.value.trim()) doTranslate();
  });
}

// ── Char Count ──────────────────────────────────────────────
function updateCharCount() {
  const len = sourceTextArea.value.length;
  const max = 5000;
  const text = `${len} / ${max}`;
  charCount.textContent = text;
  headerCharCount.textContent = text;

  charCount.classList.remove('warn', 'danger');
  if (len > 4500) charCount.classList.add('danger');
  else if (len > 4000) charCount.classList.add('warn');
}

// ── Swap Languages ──────────────────────────────────────────
function swapLanguages() {
  if (sourceLangSel.value === 'auto') {
    showToast('Select a source language first to swap.', 'error');
    return;
  }
  const srcVal = sourceLangSel.value;
  const tgtVal = targetLangSel.value;

  sourceLangSel.value = tgtVal;
  targetLangSel.value = srcVal;

  // Swap text content
  const srcText = sourceTextArea.value;
  const tgtText = currentTranslation;
  sourceTextArea.value = tgtText;
  outputArea.innerHTML = srcText || '<span class="placeholder-text">Your translation will appear here...</span>';
  currentTranslation = srcText;

  updateCharCount();
  updateActivePill();

  if (sourceTextArea.value.trim()) {
    clearTimeout(translateDebounceTimer);
    translateDebounceTimer = setTimeout(doTranslate, 600);
  }
}

// ── Clear Source ────────────────────────────────────────────
function clearSource() {
  sourceTextArea.value = '';
  updateCharCount();
  resetOutput();
  sourceTextArea.focus();
}

function resetOutput() {
  currentTranslation = '';
  outputArea.innerHTML = '<span class="placeholder-text">Your translation will appear here...</span>';
  detectedLang.innerHTML = '';
  wordCount.textContent = '';
}

// ── Active Pill ─────────────────────────────────────────────
function updateActivePill() {
  pills.forEach(p => {
    p.classList.toggle('active', p.dataset.lang === targetLangSel.value);
  });
}

// ── TRANSLATE ───────────────────────────────────────────────
async function doTranslate() {
  const text = sourceTextArea.value.trim();
  if (!text) { resetOutput(); return; }

  const src = sourceLangSel.value;
  const tgt = targetLangSel.value;

  if (src !== 'auto' && src === tgt) {
    showOutput(text);
    return;
  }

  setLoading(true);

  try {
    const langPair = `${src === 'auto' ? 'autodetect' : src}|${tgt}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.responseStatus === 200 || data.responseStatus === 403) {
      const translation = data.responseData?.translatedText || text;

      // MyMemory sometimes returns ALL CAPS error messages
      if (translation.includes('QUERY LENGTH LIMIT') || translation.includes('MYMEMORY WARNING')) {
        throw new Error('Query too long. Try a shorter text.');
      }

      currentTranslation = translation;
      showOutput(translation);

      // Detected language
      const detectedCode = data.responseData?.detectedLanguage || (src !== 'auto' ? src : '');
      if (src === 'auto' && detectedCode) {
        const langName = LANGUAGES.find(l => l.code === detectedCode)?.name || detectedCode;
        detectedLang.innerHTML = `Detected: <span>${langName}</span>`;
      } else {
        detectedLang.innerHTML = '';
      }

      // Word count
      const words = translation.trim().split(/\s+/).filter(Boolean).length;
      wordCount.textContent = `${words} word${words !== 1 ? 's' : ''}`;

      // Save to history
      saveHistory(text, translation, src, tgt);

    } else {
      throw new Error(data.responseDetails || 'Translation failed');
    }
  } catch (err) {
    setLoading(false);
    showToast(`⚠️ ${err.message}`, 'error');
    outputArea.innerHTML = `<span style="color: #f87171;">Translation failed. Check your connection and try again.</span>`;
    console.error(err);
    return;
  }

  setLoading(false);
}

function setLoading(on) {
  translateBtn.disabled = on;

  if (on) {
    translatingInd.classList.add('spinning');
    outputArea.innerHTML = `
      <div style="width:100%">
        <div class="shimmer-line"></div>
        <div class="shimmer-line" style="width:80%"></div>
        <div class="shimmer-line" style="width:90%"></div>
        <div class="shimmer-line"></div>
      </div>`;
  } else {
    translatingInd.classList.remove('spinning');
  }
}

function showOutput(text) {
  // Safely render text (no XSS) and handle line breaks
  const div = document.createElement('div');
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordBreak = 'break-word';
  div.textContent = text;
  outputArea.innerHTML = '';
  outputArea.appendChild(div);
}

// ── Copy to Clipboard ───────────────────────────────────────
async function copyText(text, btn) {
  if (!text) { showToast('Nothing to copy!', 'error'); return; }
  try {
    await navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    showToast('✓ Copied to clipboard!', 'success');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.classList.add('copied');
    showToast('✓ Copied to clipboard!', 'success');
    setTimeout(() => btn.classList.remove('copied'), 2000);
  }
}

// ── Text-to-Speech ──────────────────────────────────────────
function speak(text, langCode, btn) {
  if (!text) { showToast('Nothing to speak!', 'error'); return; }

  if (!('speechSynthesis' in window)) {
    showToast('Text-to-speech not supported in this browser.', 'error');
    return;
  }

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    document.querySelectorAll('.action-btn.active').forEach(b => b.classList.remove('active'));
    return;
  }

  // Map lang codes to BCP-47 for SpeechSynthesis
  const bcp47Map = { 'zh': 'zh-CN', 'he': 'iw' };
  const lang = bcp47Map[langCode] || langCode;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.9;
  utter.pitch = 1.05;

  utter.onstart = () => {
    isSpeaking = true;
    btn.classList.add('active');
  };
  utter.onend = utter.onerror = () => {
    isSpeaking = false;
    btn.classList.remove('active');
  };

  window.speechSynthesis.speak(utter);
}

// ── History ─────────────────────────────────────────────────
function saveHistory(src, tgt, srcLang, tgtLang) {
  const item = {
    id: Date.now(),
    src: src.substring(0, 120),
    tgt: tgt.substring(0, 120),
    srcLang,
    tgtLang,
    time: new Date().toISOString()
  };

  // Avoid duplicates
  const isDupe = history[0]?.src === item.src && history[0]?.tgtLang === item.tgtLang;
  if (!isDupe) {
    history.unshift(item);
    if (history.length > 20) history.pop();
    localStorage.setItem('lf_history', JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory() {
  if (history.length === 0) {
    historySection.classList.remove('visible');
    return;
  }

  historySection.classList.add('visible');
  historyList.innerHTML = '';

  history.slice(0, 8).forEach(item => {
    const srcLangName = item.srcLang === 'auto' ? 'Auto' : (LANGUAGES.find(l => l.code === item.srcLang)?.name || item.srcLang);
    const tgtLangName = LANGUAGES.find(l => l.code === item.tgtLang)?.name || item.tgtLang;

    const el = document.createElement('div');
    el.className = 'history-item';
    el.innerHTML = `
      <div class="history-text" title="${escHtml(item.src)}">${escHtml(item.src)}</div>
      <div class="history-arrow">→</div>
      <div class="history-translation" title="${escHtml(item.tgt)}">${escHtml(item.tgt)}</div>
      <div class="history-langs">
        <span class="history-lang-badge">${srcLangName}</span>
        <span class="history-lang-badge">${tgtLangName}</span>
      </div>
    `;
    el.addEventListener('click', () => {
      sourceTextArea.value = item.src;
      sourceLangSel.value = item.srcLang;
      targetLangSel.value = item.tgtLang;
      updateCharCount();
      updateActivePill();
      doTranslate();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    historyList.appendChild(el);
  });
}

function clearHistory() {
  history = [];
  localStorage.removeItem('lf_history');
  renderHistory();
  showToast('History cleared.', 'success');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Toast ────────────────────────────────────────────────────
let toastTimer = null;
function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); }, 2800);
}

// ── Particle Background ──────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let W = window.innerWidth;
  let H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  const NUM = 55;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.6 + 0.4;
      this.speed = Math.random() * 0.4 + 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 220 : 270; // blue or purple
      this.drift = (Math.random() - 0.5) * 0.3;
    }

    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
  });
}

// ── Boot ─────────────────────────────────────────────────────
init();
