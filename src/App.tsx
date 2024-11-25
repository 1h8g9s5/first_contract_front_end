import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useMainContract } from './hooks/useMainContract'

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
  } = useMainContract();

  return (
    <>
      <h1>First Contract Front End</h1>
      
      <div>
        <center><TonConnectButton /></center>
      </div>

      <div>

        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{contract_balance}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        <div className='Card'>
          <b>Recent Sender</b>
          <div className='Hint'>{recent_sender?.toString()}</div>
          <b>Owner</b>
          <div className='Hint'>{owner_address?.toString()}</div>
        </div>

      </div>
    </>
  )
}

export default App
