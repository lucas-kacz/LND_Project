import React, { useState } from "react";

const ListPeers = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null)

    const listPeers = async () => {
        try{
          const response = await fetch(backend_url + "/listPeers", {
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
        <div className="ListPeers">
            <button onClick={listPeers}>List all Peers</button>
            {responseData && responseData.peers.map((peer, index) => (
                <div key={index}>
                <p>Peer {index + 1}:</p>
                <ul>
                    <li><strong>pubKey:</strong> {peer.pubKey}</li>
                    <li><strong>address:</strong> {peer.address}</li>
                    <li><strong>bytesSent:</strong> {peer.bytesSent}</li>
                    <li><strong>bytesRecv:</strong> {peer.bytesRecv}</li>
                    <li><strong>pingTime:</strong> {peer.pingTime}</li>
                    <li><strong>syncType:</strong> {peer.syncType}</li>
                </ul>
            </div>
            ))}
        </div>
      )
}

export default ListPeers;