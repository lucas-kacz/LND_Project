import { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import ConnectNode from './Components/ConnectNode/ConnectNode';
import ListPeers from './Components/ListPeers/ListPeers';

function App() {

  const backend_url = "http://localhost:5000"

  const [responseData, setResponseData] = useState(null)

  const getBalance = async () => {
    try{
      const response = await fetch(backend_url + "/getWalletBalance", {
        method: 'GET',
      })

      if(!response.ok){
        throw new Error('HTTP error ! Status : ${response.status}')
      }

      const data = await response.json();
      setResponseData(data)
    } catch (error) {
      console.error('Error fetching data', error);
    }
  }

  return (
    <div className="App">
      <Navbar/>

      <div className='Card'>
        <button onClick={getBalance}>Get LND Wallet Balance</button>

        {responseData && (
          <div>
            <h2>Data:</h2>
            <pre>{JSON.stringify(responseData, null)}</pre>
          </div>
        )}

        <ConnectNode/>

        <ListPeers/>
      </div>
    </div>
  );
}

export default App;
