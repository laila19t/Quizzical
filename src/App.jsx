import {React,useEffect, useState } from 'react'
import StartPage from './Pages/StartPage'
import Quiz from './Pages/Quiz'


export default function App() {
  const [started, setStarted] = useState(false)
 
function startQuiz(){
  setStarted(prevStart => !prevStart)
}
  return (
    <>
    {started ? <Quiz/>
     : <StartPage startQuiz={startQuiz}/> }
    </>
  )
}


