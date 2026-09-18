import './style.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const today = new Date().toISOString().split('T')[0]
const app = document.querySelector('#app')

app.innerHTML = `
  <main class="browser-window">
    <div class="window-dots" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="tab-strip">
      <div class="active-tab"><span class="tab-mark">✦</span> Cosmic Daily <button class="tab-close" aria-label="Close tab">×</button></div>
      <button class="new-tab" aria-label="New tab">+</button>
      <div class="window-actions" aria-hidden="true"><span>—</span><span>□</span><span>×</span></div>
    </div>
    <div class="toolbar">
      <button class="nav-button" aria-label="Back">←</button>
      <button class="nav-button" aria-label="Forward">→</button>
      <button class="nav-button" aria-label="Reload" id="reload-button">↻</button>
      <div class="address-bar"><span>⌕</span><span>cosmic-daily.local / universe / today</span><b>✦</b></div>
      <button class="toolbar-button" aria-label="Customize">☷</button>
      <button class="profile" aria-label="Profile">C</button>
      <button class="toolbar-button" aria-label="More">⋮</button>
    </div>

    <section class="tab-page">
      <header class="masthead">
        <div class="brand-block"><span class="tiny-label">NEW TAB / 001</span><h1>COSMIC<br><span>DAILY</span></h1></div>
        <div class="date-block"><span class="tiny-label">LOCAL ORBITAL TIME</span><strong id="clock">--:--</strong><span id="day-label">TODAY / EARTH</span></div>
        <div class="sticker">LOOK<br>UP<br>↑</div>
      </header>

      <div class="dashboard">
        <aside class="side-rail">
          <div class="rail-title">NASA<br>APOD</div>
          <div class="number">01</div>
          <div class="vertical-note">ASTRONOMY PICTURE OF THE DAY</div>
          <div class="rail-star">✹</div>
        </aside>

        <section class="content-stage" id="content-stage">
          <div class="stage-topline"><span id="signal-status">SIGNAL / CONNECTING</span><span>SCROLL INSIDE TO EXPLORE ↓</span></div>
          <div id="result"><p class="status">Receiving a transmission from space…</p></div>
        </section>

        <aside class="control-panel">
          <div class="panel-heading">CONTROL<br>ROOM <span>◎</span></div>
          <label for="date-picker">SELECT DATE</label>
          <input id="date-picker" type="date" aria-label="Choose an astronomy picture date" />
          <button id="today-button" class="action-button" type="button">JUMP TO TODAY <span>↗</span></button>
          <div class="rule"></div>
          <p class="fact-label">QUICK FACT</p>
          <p class="fact">Every day, NASA publishes a different view of our universe.</p>
          <div class="keycap"><kbd>T</kbd><span>today shortcut</span></div>
          <div class="panel-stamp">NO AI<br>JUST DATA<br>+ DESIGN</div>
        </aside>
      </div>

      <footer class="footer-bar"><span>NASA / APOD API</span><span>MADE FOR CURIOUS HUMANS</span><span>IMAGE CREDIT BELOW ↘</span></footer>
    </section>
  </main>
`

const datePicker = document.querySelector('#date-picker')
const todayButton = document.querySelector('#today-button')
const reloadButton = document.querySelector('#reload-button')
const result = document.querySelector('#result')
const clock = document.querySelector('#clock')
const signal = document.querySelector('#signal-status')
datePicker.max = today
datePicker.value = today

function updateClock() {
  const now = new Date()
  clock.textContent = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now)
  document.querySelector('#day-label').textContent = `${new Intl.DateTimeFormat(undefined, { weekday: 'long' }).format(now).toUpperCase()} / EARTH`
}

async function loadApod(date = today) {
  result.innerHTML = '<p class="status">Receiving a transmission from space…</p>'
  signal.textContent = 'SIGNAL / SEARCHING'
  signal.classList.remove('online')
  try {
    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
    if (!response.ok) throw new Error(`NASA API returned ${response.status}`)
    const data = await response.json()
    const media = data.media_type === 'image'
      ? `<img class="apod-media" src="${data.url}" alt="${data.title}" />`
      : `<iframe class="apod-media" src="${data.url}" title="${data.title}" allowfullscreen></iframe>`
    result.innerHTML = `
      <article class="apod-card">
        <div class="image-frame"><span class="frame-label">FIG. ${date.replaceAll('-', '.')}</span>${media}<span class="corner-mark">↘</span></div>
        <div class="caption-row"><span>NASA / ASTRONOMY PICTURE OF THE DAY</span><span>${data.media_type.toUpperCase()}</span></div>
        <h2>${data.title}</h2>
        <p class="explanation">${data.explanation}</p>
        <a class="media-link" href="${data.hdurl || data.url}" target="_blank" rel="noreferrer">OPEN ORIGINAL IMAGE <span>↗</span></a>
      </article>`
    signal.textContent = 'SIGNAL / ONLINE'
    signal.classList.add('online')
  } catch (error) {
    signal.textContent = 'SIGNAL / OFFLINE'
    result.innerHTML = '<div class="error-box"><strong>TRANSMISSION ERROR</strong><p>NASA did not answer. Check your API key or connection, then press reload.</p></div>'
    console.error(error)
  }
}

datePicker.addEventListener('change', () => loadApod(datePicker.value))
todayButton.addEventListener('click', () => { datePicker.value = today; loadApod(today) })
reloadButton.addEventListener('click', () => loadApod(datePicker.value))
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 't' && document.activeElement.tagName !== 'INPUT') {
    datePicker.value = today
    loadApod(today)
  }
})
updateClock()
setInterval(updateClock, 1000)
loadApod()
