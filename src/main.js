import './style.css'

const API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'
const app = document.querySelector('#app')

app.innerHTML = `
  <main class="page-shell">
    <header class="hero">
      <div class="topline">
        <span class="orbit-dot" aria-hidden="true"></span>
        <span>EVENT HORIZON / NASA APOD</span>
        <span id="clock" class="clock"></span>
      </div>
      <p class="eyebrow">YOUR DAILY WINDOW INTO THE UNIVERSE</p>
      <h1>Cosmic<br><em>Daily</em></h1>
      <p class="intro">A custom new-tab dashboard for curious minds.</p>
      <div class="controls">
        <label for="date-picker">Explore a date</label>
        <div class="date-row">
          <input id="date-picker" type="date" aria-label="Choose an astronomy picture date" />
          <button id="today-button" type="button">Today</button>
        </div>
      </div>
    </header>
    <section id="result" aria-live="polite">
      <p class="status">Loading a message from space…</p>
    </section>
    <footer>
      <span>Built with NASA APOD API</span>
      <span>Keep looking up ↗</span>
    </footer>
  </main>
`

const datePicker = document.querySelector('#date-picker')
const todayButton = document.querySelector('#today-button')
const result = document.querySelector('#result')
const clock = document.querySelector('#clock')
const today = new Date().toISOString().split('T')[0]

datePicker.max = today
datePicker.value = today

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date())
}

async function loadApod(date = today) {
  result.innerHTML = '<p class="status">Loading a message from space…</p>'

  try {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`,
    )
    if (!response.ok) throw new Error(`NASA API returned ${response.status}`)
    const data = await response.json()

    const media = data.media_type === 'image'
      ? `<img class="apod-media" src="${data.url}" alt="${data.title}" />`
      : `<iframe class="apod-media" src="${data.url}" title="${data.title}" allowfullscreen></iframe>`

    result.innerHTML = `
      <article class="apod-card">
        <div class="media-wrap">${media}</div>
        <div class="apod-copy">
          <div class="meta-line">
            <span class="date">${data.date}</span>
            <span class="media-type">${data.media_type}</span>
          </div>
          <h2>${data.title}</h2>
          <p class="explanation">${data.explanation}</p>
          <a class="media-link" href="${data.hdurl || data.url}" target="_blank" rel="noreferrer">
            Open full-resolution media <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    `
  } catch (error) {
    result.innerHTML = `
      <div class="error-box">
        <strong>Signal lost.</strong>
        <p>Could not load NASA’s picture. Check your API key and internet connection.</p>
      </div>
    `
    console.error(error)
  }
}

datePicker.addEventListener('change', () => loadApod(datePicker.value))
todayButton.addEventListener('click', () => {
  datePicker.value = today
  loadApod(today)
})

document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 't' && document.activeElement.tagName !== 'INPUT') {
    datePicker.value = today
    loadApod(today)
  }
})

updateClock()
setInterval(updateClock, 30_000)
loadApod()
