import { useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import useTimer from 'easytimer-react-hook'

function App() {
  const [timeOutput, setTimeOutput] = useState('25:00')
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
  const audioRef = useRef(null)
  const [session_isStarted, setSessionIsStarted] = useState(0)
  const [break_isStarted, setBreakIsStarted] = useState(0)
  const [isInSession, setIsInSession] = useState(0)
  const [isInBreak, setIsInBreak] = useState(0)
  const [isResetting, setIsResetting] = useState(0)
  const [timerLabel, setTimerLabel] = useState('Session')

  const startStopTimer = () => {
    if(isInSession==0 && isInBreak==0){
      session_timer.start({
        startValues: {minutes: session}
      })
      setSessionIsStarted(1)
      setIsInSession(1)
    }else if(isInSession==1 && isInBreak==0){
      if(session_isStarted==1){
        session_timer.pause()
        setSessionIsStarted(0)
      }else if(session_isStarted==0){
        session_timer.start({
          startValues: {minutes: session}
        })
        setSessionIsStarted(1)
      }
    }else if(isInSession==0 && isInBreak==1){
      if(break_isStarted==1){
        break_timer.pause()
        setBreakIsStarted(0)
      }else if(break_isStarted==0){
        break_timer.start({
          startValues: {minutes: _break}
        })
        setBreakIsStarted(1)
      }
    }
  }

  const sessionTimerEnd = () => {
    setSessionIsStarted(0)
    setBreakIsStarted(1)
    setIsInSession(0)
    audioRef.current.play()
    break_timer.start({
      startValues: {minutes: _break, seconds: 1}
    })
  }

  const breakTimerEnd = () => {
    setSessionIsStarted(1)
    setBreakIsStarted(0)
    setIsInBreak(0)
    audioRef.current.play()
    session_timer.start({
      startValues: {minutes: session, seconds: 1}
    })
  }

  const resetTimer = () => {
    setIsResetting(1)
    session_timer.stop()
    break_timer.stop()
    setTimerLabel('Session')
    setSessionIsStarted(0)
    setBreakIsStarted(0)
    setIsInBreak(0)
    setIsInSession(0)
    setSession(25)
    setBreak(5)
    setTimeOutput('25:00')
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setIsResetting(0)
  }

  useEffect(() => {
    session_timer.addEventListener('secondsUpdated', () => {
      setTimeOutput(session_timer.getTimeValues().toString(['minutes', 'seconds']))
    })
    session_timer.addEventListener('started', () => {
      setTimerLabel('Session')
      setIsInSession(1)
    })
  },[])

  useEffect(() => {
    break_timer.addEventListener('secondsUpdated', () => {
      setTimeOutput(break_timer.getTimeValues().toString(['minutes', 'seconds']))
    })
    break_timer.addEventListener('started', () => {
      setTimerLabel('Break')
      setIsInBreak(1)
    })
  },[])

  useEffect(() => {
    if(isResetting==0 && isInBreak==1){
      setTimeOutput(`${_break}:00`)
    }
    session_timer.addEventListener('targetAchieved', sessionTimerEnd)
    return () => {
      session_timer.removeEventListener('targetAchieved', sessionTimerEnd)
    }
  },[_break])

  useEffect(() => {
    if(isResetting==0 && isInBreak==0){
      setTimeOutput(`${session}:00`)
    }
    break_timer.addEventListener('targetAchieved', breakTimerEnd)
    return () => {
      break_timer.removeEventListener('targetAchieved', breakTimerEnd)
    }
  },[session])

  const plusSession = () => {
    if(session+1<=60 && session_isStarted==0){
      if(isInSession==1){
        session_timer.stop()
      }
      setSession(session+1)
    }
  }

  const minSession = () => {
    if(session-1>=1 && session_isStarted==0){
      if(isInSession==1){
        session_timer.stop()
      }
      setSession(session-1)
    }
  }

  const plusBreak = () => {
    if(_break+1<=60 && break_isStarted==0){
      if(isInBreak==1){
        break_timer.stop()
      }
      setBreak(_break+1)
    }
  }

  const minBreak = () => {
    if(_break-1>=1 && break_isStarted==0){
      if(isInBreak==1){
        break_timer.stop()
      }
      setBreak(_break-1)
    }
  }

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
              <button id="break-decrement" onClick={minBreak}>-</button>
              <span id="break-length">{_break}</span>
              <button id="break-increment" onClick={plusBreak}>+</button>
            </div>
          </div>
          <div className="session">
          <div id="session-label">Session Length</div>
            <div className="session-control">
              <button id="session-decrement" onClick={minSession}>-</button>
              <span id="session-length">{session}</span>
              <button id="session-increment" onClick={plusSession}>+</button>
            </div>
          </div>
        </div>
        <div className='clock'>
          <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{timeOutput}</div>
          <div className="time-control">
            <button id="start_stop" onClick={startStopTimer}>
              <i className="bi bi-play-fill"></i>
            </button>
            <button id="reset" onClick={resetTimer}>
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
        <audio ref={audioRef} id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
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
