import { useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import useTimer from 'easytimer-react-hook'

function App() {
  const [_break, setBreak] = useState(5)
  const [session, setSession] = useState(25)
  const [session_timer, isSessionTargetAchieved] = useTimer({
    precision: 'seconds',
    countdown: true,
    target: { seconds: 0 }
  })
  const [break_timer, isBreakTargetAchieved] = useTimer({
    precision: 'seconds',
    countdown: true,
    target: { seconds: 0 }
  })
  const timerRef = useRef(null)
  const [session_isStarted, setSessionIsStarted] = useState(0)
  const [break_isStarted, setBreakIsStarted] = useState(0)

  const startStopSessionTimer = () => {
    if(session_isStarted==0){
      session_timer.start({
        startValues: {minutes: session}
      })
      setSessionIsStarted(1)
    }else{
      session_timer.stop()
      setSessionIsStarted(0)
    }
  }

  const resetSessionTimer = () => {
    session_timer.reset()
    session_timer.stop()
    break_timer.reset()
    break_timer.stop()
    setSessionIsStarted(0)
    setBreakIsStarted(0)
    setBreak(5)
    setSession(25)
  }

  const startBreakTimer = () => {
    break_timer.start({
      startValues: {minutes: _break}
    })
  }

  useEffect(() => {
    session_timer.addEventListener('secondsUpdated', () => {
      timerRef.current.innerHTML = session_timer.getTimeValues().toString(['minutes', 'seconds'])
    })
  },[])

  useEffect(() => {
    break_timer.addEventListener('secondsUpdated', () => {
      timerRef.current.innerHTML = break_timer.getTimeValues().toString(['minutes', 'seconds'])
    })
  },[])

  useEffect(() => {
    session_timer.addEventListener('targetAchieved', startBreakTimer)
    return () => {
      session_timer.removeEventListener('targetAchieved', startBreakTimer)
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
            <button id="start_stop" onClick={startStopSessionTimer}>
              <i className="bi bi-play-fill"></i>
            </button>
            <button id="reset" onClick={resetSessionTimer}>
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
