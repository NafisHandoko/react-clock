import { useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import useTimer from 'easytimer-react-hook'

function App() {
  const [_break, setBreak] = useState(5)
  const [session, setSession] = useState(25)
  const [timer, isTargetAchieved] = useTimer({
    precision: 'seconds',
    countdown: true,
    target: { seconds: 0 }
  })
  const timerRef = useRef(null)
  const [isStarted, setIsStarted] = useState(0)

  const startStopTimer = () => {
    if(isStarted==0){
      timer.start({
        startValues: {minutes: session}
      })
      setIsStarted(1)
    }else{
      timer.stop()
      setIsStarted(0)
    }
  }

  const resetTimer = () => {
    timer.reset()
    timer.stop()
    setIsStarted(0)
    setBreak(5)
    setSession(25)
  }

  const startBreakTimer = () => {
    timer.start({
      startValues: {minutes: _break}
    })
  }

  useEffect(() => {
    timer.addEventListener('secondsUpdated', () => {
      timerRef.current.innerHTML = timer.getTimeValues().toString(['minutes', 'seconds'])
    })
  },[])

  useEffect(() => {
    timer.addEventListener('targetAchieved', startBreakTimer)
    return () => {
      timer.removeEventListener('targetAchieved', startBreakTimer)
    }
  },[_break])

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
              <button id="break-decrement" onClick={() => setBreak(_break-1)}>-</button>
              <span id="break-length">{_break}</span>
              <button id="break-increment" onClick={() => setBreak(_break+1)}>+</button>
            </div>
          </div>
          <div className="session">
          <div id="session-label">Session Length</div>
            <div className="session-control">
              <button id="session-decrement" onClick={() => setSession(session-1)}>-</button>
              <span id="session-length">{session}</span>
              <button id="session-increment" onClick={() => setSession(session+1)}>+</button>
            </div>
          </div>
        </div>
        <div className='clock'>
          <div id="timer-label">Session</div>
          <div id="time-left" ref={timerRef}>{`${session}:00`}</div>
          <div className="time-control">
            <button id="start_stop" onClick={startStopTimer}>
              <i className="bi bi-play-fill"></i>
            </button>
            <button id="reset" onClick={resetTimer}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </section>
      <footer>
        <a className='repo' href="https://github.com/NafisHandoko/react-clock" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-github"></i>
        </a>
        Made with ❤️ by Nafis Handoko
      </footer>
    </div>
  )
}

export default App
