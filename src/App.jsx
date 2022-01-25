import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <header>
        <h1>25 + 5 Clock</h1>
      </header>
      <section>
        <div className='break-session'>
          <div className="break">
            <div id="break-label">Break Length</div>
            <div className="break-control">
              <button id="break-decrement">-</button>
              <span id="break-length">5</span>
              <button id="break-increment">+</button>
            </div>
          </div>
          <div className="session">
          <div id="session-label">Session Length</div>
            <div className="session-control">
              <button id="session-decrement">-</button>
              <span id="session-length">5</span>
              <button id="session-increment">+</button>
            </div>
          </div>
        </div>
        <div className='clock'>
          <div id="timer-label">Session</div>
          <div id="time-left">25:00</div>
          <div className="time-control">
            <button id="start_stop">
              <i class="bi bi-play-fill"></i>
            </button>
            <button id="reset">
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </section>
      <footer></footer>
    </div>
  )
}

export default App
