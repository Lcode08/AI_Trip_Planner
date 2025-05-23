import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Hero from './components/custom/Hero'
import './App.css'
import Header from './components/custom/Header'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Hero section  */}
      <Hero/>
    
          
    </>
  )
}

export default App
