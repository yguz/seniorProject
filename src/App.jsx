import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Navbar from './Navbar'
import Search from './Search'

import './App.css'


function App() {

  return (
    <>
      <div>
        <Navbar />
        <Search />
      </div>
    </>
  )
}

export default App
