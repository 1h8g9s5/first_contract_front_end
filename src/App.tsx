import { useState } from 'react'
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>First Contract Front End</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div>
        <center><TonConnectButton /></center>
      </div>
    </>
  )
}

export default App
