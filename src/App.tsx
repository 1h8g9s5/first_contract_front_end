import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useMainContract } from './hooks/useMainContract'
import { useTonConnect } from './hooks/useTonConnect'
import { useState } from 'react';

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    incrementValue,
    updateIncrementValue,
    sendIncrement
  } = useMainContract();

  const { connected } = useTonConnect();

  const [selectedValue, setSelectedValue] = useState("1");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    updateIncrementValue(Number(event.target.value));
  };

  return (
    <>
      <h1>First Contract Front End</h1>
      
      <div>
        <center><TonConnectButton /></center>
      </div>

      <div>

        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.toString().slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{contract_balance}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        <div className='Card'>
          <b>Recent Sender</b>
          <div className='Hint'>{recent_sender?.toString().slice(0, 30) + "..."}</div>
          <b>Owner</b>
          <div className='Hint'>{owner_address?.toString().slice(0, 30) + "..."}</div>
        </div>

        { connected && (
          <>
            <>
              <div className='Card'>
                <button
                  onClick={() => { sendIncrement(); } }
                >
                  Increment by {incrementValue}
                </button>
              </div>
            </>
            <>
              <select value={selectedValue} onChange={handleSelectChange}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </>
          </>
        )}
 


      </div>
    </>
  )
}

export default App
