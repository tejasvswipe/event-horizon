// ==========================================
// COSMIC DAILY - Astro Pic viewer app
// TODO: clean up some of these global variables later...
// ==========================================

import './style.css'
import stickerUrl from './assets/images.png'

// Check if API key is there, otherwise fallback to demo key (sometimes rate limits though 😬)
const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const today = new Date().toISOString().slice(0, 10)
const app = document.querySelector('#app')
const storageKey = 'cosmic-daily-orbit-log-v1' // bumped storage key just in case

// Global app state object (maybe should use a store, but keeping it simple for now)
const state = {
  date: today,
  current: null,
  saved: readSaved(),
  loading: false,
}


app.innerHTML = `
  <div class="site-shell">
    <header class="topbar">
      <img class="top-sticker" src="${stickerUrl}" alt="Hack Club" />
      <a class="wordmark" href="#top" aria-label="Cosmic Daily home"><span class="wordmark-star"></span><span>cosmic<br><em>daily</em></span></a>;
      <div class="topbar-note"><span class="pulse"></span>NASA / APOD FIELD NOTES <span class="topbar-date" id="topbar-date"></span></div>
      <button class="log-toggle" id="log-toggle" type="button"><span>orbit log</span><b id="saved-count">0</b></button>
    </header>

    <main id="top">
      <section class="intro-grid">
        <div class="intro-copy">
          <p class="eyebrow">A DAILY OBSERVATION / VOL. 01</p>
          <h1>Look closer.<br><i>Think farther.</i></h1>
          <p class="lede">A small window into the universe, curated one day at a time by NASA’s Astronomy Picture of the Day.</p>
        </div>
        <div class="orbital-note" aria-label="Current day in the orbital calendar">
          <span class="orbital-label">EARTH / LOCAL ORBIT</span>
          <strong id="clock">--:--:--</strong>
          <span id="day-label">TODAY / EARTH</span>
          <div class="orbit-lines"><i></i><i></i><i></i></div>
        </div>
      </section>

      <section class="workspace">
        <aside class="date-desk">
          <div>
            <p class="eyebrow">THE DATE DESK</p>
            <h2>Choose<br>a day.</h2>
            <p class="desk-copy">Every date holds a different corner of the sky. Go backwards, or let the universe pick.</p>
          </div>
          <div class="date-tools">
            <label for="date-picker">OBSERVATION DATE</label>
            <input id="date-picker" type="date" aria-label="Choose an astronomy picture date" />
            <button class="button button-ink" id="today-button" type="button">Return to today <span>↗</span></button>
            <button class="button button-coral" id="shuffle-button" type="button"><span class="shuffle-icon">⤨</span> Cosmic shuffle</button>
          </div>
          <p class="shortcut"><kbd>T</kbd> return to today <span>·</span> <kbd>S</kbd> shuffle</p>
        </aside>

        <section class="observation" aria-live="polite">
          <div class="observation-head"><span id="signal-status">SIGNAL / CONNECTING</span><span id="observation-index">OBSERVATION 001</span></div>
          <div id="result"><p class="loading-line"><span></span>Receiving a transmission from space…</p></div>
        </section>
      </section>
    </main>

    <footer class="footer"><span>DATA: NASA / APOD</span><span>MADE FOR CURIOUS HUMANS</span><a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noreferrer">VISIT THE SOURCE ↗</a></footer>
  </div>
  <aside class="log-drawer" id="log-drawer" aria-hidden="true">
    <div class="drawer-head"><div><p class="eyebrow">YOUR COLLECTION</p><h2>Orbit log</h2></div><button id="log-close" class="close-button" type="button" aria-label="Close orbit log">×</button></div>
    <p class="drawer-intro">Pin the images you want to find again. They stay here on this device.</p>
    <div id="saved-list" class="saved-list"></div>
  </aside>
  <div class="drawer-scrim" id="drawer-scrim"></div>
`

// Quick selector helper function (borrowed from jQuery style)
const $ = (selector) => document.querySelector(selector)

const datePicker = $('#date-picker')
const result = $('#result')
const signal = $('#signal-status')
const savedCount = $('#saved-count')
const savedList = $('#saved-list')
const drawer = $('#log-drawer')

datePicker.max = today
datePicker.value = today

// Local storage handlers
function readSaved() {
  try { 
    const items = localStorage.getItem(storageKey)
    return items ? JSON.parse(items) : [] 
  } catch (err) {
    console.warn("Couldn't read from localStorage:", err)
    return [] 
  }
}

function writeSaved() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state.saved))
  } catch(e) {
    alert("Storage is full or blocked!")
  }
  renderSaved()
}

// Basic XSS prevention, though probably overkill for this project
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, (char) => ({ 
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    "'": '&#039;', 
    '"': '&quot;' 
  })[char])
}

function prettyDate(dateStr) {
  // sometimes dateStr comes weirdly formatted, let's make sure it parses
  const d = new Date(`${dateStr}T12:00:00`)
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
}

function updateClock() {
  const now = new Date()
  const timeEl = $('#clock')
  const dayEl = $('#day-label')
  const topDateEl = $('#topbar-date')
  
  if (timeEl) timeEl.textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now)
  if (dayEl) dayEl.textContent = `${new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(now).toUpperCase()} / EARTH`
  if (topDateEl) topDateEl.textContent = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(now).toUpperCase()
}

function renderSaved() {
  savedCount.textContent = state.saved.length
  
  if (state.saved.length === 0) {
    savedList.innerHTML = '<div class="empty-log"><span>✦</span><p>Your log is quiet.<br>Pin a discovery to begin.</p></div>'
    return
  }
  
  // Mapping out saved items manually
  let htmlString = ''
  for (let i = 0; i < state.saved.length; i++) {
    const item = state.saved[i]
    htmlString += `
      <article class="saved-item">
        <button class="saved-thumb" data-open-date="${item.date}" type="button"><img src="${escapeHTML(item.thumb)}" alt="" loading="lazy" /></button>
        <div><button class="saved-title" data-open-date="${item.date}" type="button">${escapeHTML(item.title)}</button><time>${prettyDate(item.date)}</time></div>
        <button class="unpin" data-remove-date="${item.date}" type="button" aria-label="Remove item">×</button>
      </article>`
  }
  savedList.innerHTML = htmlString
}

function isSaved(date) { 
  return state.saved.some((item) => item.date === date) 
}

function toggleSaved() {
  if (!state.current) return
  
  if (isSaved(state.current.date)) {
    state.saved = state.saved.filter((item) => item.date !== state.current.date)
  } else {
    state.saved.unshift({ 
      date: state.current.date, 
      title: state.current.title, 
      thumb: state.current.url 
    })
  }
  
  writeSaved()
  renderCurrent()
}

function renderCurrent() {
  const data = state.current
  if (!data) return
  
  let media = ''
  if (data.media_type === 'image') {
    media = `<img class="apod-media" src="${escapeHTML(data.url)}" alt="${escapeHTML(data.title)}" />`
  } else {
    media = `<iframe class="apod-media" src="${escapeHTML(data.url)}" title="${escapeHTML(data.title)}" allowfullscreen></iframe>`
  }
  
  const saved = isSaved(data.date)
  
  result.innerHTML = `
    <article class="apod-card">
      <div class="image-frame">
        <div class="image-meta"><span>FIELD IMAGE / ${data.date.replaceAll('-', '.')}</span><span>${data.media_type.toUpperCase()}</span></div>
        ${media}
        <span class="image-corner">✦</span>
      </div>
      <div class="caption-row"><span>NASA / ASTRONOMY PICTURE OF THE DAY</span><time>${prettyDate(data.date)}</time></div>
      <div class="title-row"><h2>${escapeHTML(data.title)}</h2><button class="pin-button ${saved ? 'is-saved' : ''}" id="pin-button" type="button"><span>${saved ? '★' : '☆'}</span>${saved ? 'Pinned' : 'Pin to orbit'}</button></div>
      <p class="explanation">${escapeHTML(data.explanation)}</p>
      <a class="media-link" href="${escapeHTML(data.hdurl || data.url)}" target="_blank" rel="noreferrer">Open the original image <span>↗</span></a>
    </article>`
    
  $('#pin-button').addEventListener('click', toggleSaved)
}

// Main fetch function from NASA API
async function loadApod(date = today) {
  state.date = date
  state.loading = true
  result.innerHTML = '<p class="loading-line"><span></span>Receiving a transmission from space…</p>'
  signal.textContent = 'SIGNAL / SEARCHING'
  signal.classList.remove('online')
  
  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
    if (!res.ok) {
      throw new Error(`API error code: ${res.status}`)
    }
    
    const json = await res.json()
    state.current = json
    state.current.date = date // make sure date matches what we asked for
    
    $('#observation-index').textContent = `OBSERVATION ${date.slice(-2)} / ${date.slice(5, 7)}`
    signal.textContent = 'SIGNAL / ONLINE'
    signal.classList.add('online')
    
    renderCurrent()
  } catch (err) {
    console.error("Failed fetching APOD:", err)
    signal.textContent = 'SIGNAL / OFFLINE'
    result.innerHTML = `
      <div class="error-box">
        <span class="error-symbol">!</span>
        <div>
          <strong>TRANSMISSION INTERRUPTED</strong>
          <p>NASA did not answer this time. Check your connection and try again later, or pick a different date.</p>
        </div>
      </div>`
  } finally { 
    state.loading = false 
  }
}

function randomDate() {
// APOD started on June 16, 1995! Let's pick randomly between then and today.
  const start = new Date('1995-06-16T12:00:00')
  const end = new Date(`${today}T12:00:00`)
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime())
  const randomD = new Date(randomTime)
  return randomD.toISOString().slice(0, 10)
}

function openLog() { 
  drawer.classList.add('is-open')
  drawer.setAttribute('aria-hidden', 'false') 
  document.body.classList.add('drawer-open') 
}

function closeLog() { 
  drawer.classList.remove('is-open')
  drawer.setAttribute('aria-hidden', 'true') 
  document.body.classList.remove('drawer-open') 
}

// Event listeners wiring up
$('#today-button').addEventListener('click', () => { 
  datePicker.value = today
  loadApod(today) 
})

$('#shuffle-button').addEventListener('click', () => { 
  const rand = randomDate()
  datePicker.value = rand
  loadApod(rand) 
})

$('#log-toggle').addEventListener('click', openLog)
$('#log-close').addEventListener('click', closeLog)
$('#drawer-scrim').addEventListener('click', closeLog)

datePicker.addEventListener('change', (e) => {
  loadApod(e.target.value)
})

savedList.addEventListener('click', (event) => {
  const openButton = event.target.closest('[data-open-date]')
  const removeButton = event.target.closest('[data-remove-date]')
  
  if (openButton) { 
    const date = openButton.dataset.openDate
    datePicker.value = date
    loadApod(date) 
    closeLog() 
  }
  
  if (removeButton) { 
    const targetDate = removeButton.dataset.removeDate
    state.saved = state.saved.filter((item) => item.date !== targetDate)
    writeSaved() 
  }
})

// Keyboard shortcuts handler
document.addEventListener('keydown', (event) => {
  // Don't trigger shortcuts if user is typing inside an input field
  if (event.target.matches('input') || event.target.matches('textarea')) return
  
  const key = event.key.toLowerCase()
  if (key === 't') { 
    datePicker.value = today
    loadApod(today) 
  } else if (key === 's') { 
    const rand = randomDate()
    datePicker.value = rand
    loadApod(rand) 
  } else if (event.key === 'Escape') { 
    closeLog() 
  }
})

// Initial startup calls
renderSaved()
updateClock()
setInterval(updateClock, 1000)

// Kick off with today's image!
loadApod(today)