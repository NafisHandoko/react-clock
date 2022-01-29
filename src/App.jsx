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
  const timerLabel = useRef(null)
  const audioRef = useRef(null)
  const [session_isStarted, setSessionIsStarted] = useState(0)
  const [break_isStarted, setBreakIsStarted] = useState(0)
  const [isInSession, setIsInSession] = useState(0)
  const [isInBreak, setIsInBreak] = useState(0)

  // const startStopSessionTimer = () => {
  //   if(session_isStarted==0){
  //     session_timer.start({
  //       startValues: {minutes: session}
  //     })
  //     setSessionIsStarted(1)
  //     setBreakIsStarted(0)
  //   }else{
  //     session_timer.pause()
  //     setSessionIsStarted(0)
  //     setBreakIsStarted(1)
  //   }
  // }

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

  // const startStopBreakTimer = () => {
  //   if(break_isStarted==0){
  //     break_timer.start({
  //       startValues: {minutes: _break}
  //     })
  //     setBreakIsStarted(1)
  //     setSessionIsStarted(0)
  //   }else{
  //     break_timer.pause()
  //     setBreakIsStarted(0)
  //     setSessionIsStarted(1)
  //   }
  // }

  const sessionTimerEnd = () => {
    setSessionIsStarted(0)
    setBreakIsStarted(1)
    setIsInSession(0)
    audioRef.current.play()
    break_timer.start({
      startValues: {minutes: _break}
    })
  }

  const breakTimerEnd = () => {
    setSessionIsStarted(1)
    setBreakIsStarted(0)
    setIsInBreak(0)
    audioRef.current.play()
    session_timer.start({
      startValues: {minutes: session}
    })
  }

  const resetTimer = () => {
    // session_timer.reset()
    session_timer.stop()
    // break_timer.reset()
    break_timer.stop()
    timerLabel.current.innerHTML = 'Session'
    setSessionIsStarted(0)
    setBreakIsStarted(0)
    setBreak(5)
    setSession(25)
    setIsInBreak(0)
    setIsInSession(0)
    timerRef.current.innerHTML = `${session}:00`
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  useEffect(() => {
    session_timer.addEventListener('secondsUpdated', () => {
      timerRef.current.innerHTML = session_timer.getTimeValues().toString(['minutes', 'seconds'])
    })
    session_timer.addEventListener('started', () => {
      timerLabel.current.innerHTML = 'Session'
      setIsInSession(1)
    })
  },[])

  useEffect(() => {
    break_timer.addEventListener('secondsUpdated', () => {
      timerRef.current.innerHTML = break_timer.getTimeValues().toString(['minutes', 'seconds'])
    })
    break_timer.addEventListener('started', () => {
      timerLabel.current.innerHTML = 'Break'
      setIsInBreak(1)
    })
  },[])

  useEffect(() => {
    session_timer.addEventListener('targetAchieved', sessionTimerEnd)
    return () => {
      session_timer.removeEventListener('targetAchieved', sessionTimerEnd)
    }
  },[_break])

  useEffect(() => {
    break_timer.addEventListener('targetAchieved', breakTimerEnd)
    return () => {
      break_timer.removeEventListener('targetAchieved', breakTimerEnd)
    }
  },[session])

  const plusSession = () => {
    if(session+1<=60){
      setSession(session+1)
    }
  }

  const minSession = () => {
    if(session-1>=1){
      setSession(session-1)
    }
  }

  const plusBreak = () => {
    if(_break+1<=60){
      setBreak(_break+1)
    }
  }

  const minBreak = () => {
    if(_break-1>=1){
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
          <div id="timer-label" ref={timerLabel}>Session</div>
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
