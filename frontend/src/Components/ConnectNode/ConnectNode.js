import React, { useState } from "react";

const ConnectNode = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null);
    const [error, setError] = useState(null);

    const [nodePubKey, setNodePubKey] = useState("");
    const [nodeHost, setNodeHost] = useState("")

    const handleKeyInputChange = (event) => {
      setNodePubKey(event.target.value);
    };

    const handleHostInputChange = (event) => {
        setNodeHost(event.target.value);
    };

    const connectNode = async () => {
        try {
            const response = await fetch(`${backend_url}/connectNode/${nodePubKey}/${nodeHost}`, {
              method: 'POST',
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            console.log(response)
            setResponseData(response);
          } catch (error) {
            console.error('Error connecting to the node', error);
            setError(error.message);
          }
        };
    
    return (
        <div>
            <input
                type="text"
                value={nodePubKey}
                onChange={handleKeyInputChange}
                placeholder="Enter Node PubKey"
            />
            <input
                type="text"
                value={nodeHost}
                onChange={handleHostInputChange}
                placeholder="Enter Node Hostname"
            />
          <button onClick={connectNode}>Connect to Node</button>
          {responseData && <p>Response: {JSON.stringify(responseData)}</p>}
          {error && <p>Error: {error}</p>}
        </div>
      )
}

export default ConnectNode;