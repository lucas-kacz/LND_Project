import React, { useState } from "react"
import './ListPeers.css'

const ListPeers = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

    const listPeers = async () => {
		setLoading(true)
        try {
			const response = await fetch(backend_url + "/listPeers", {
				method: 'GET',
			})
		
			if (!response.ok) {
				throw new Error('HTTP error ! Status : ${response.status}')
			}
			setLoading(false)
			const data = await response.json();
			setResponseData(data)
        } catch (error) {
			setError(error)
			setLoading(false)
          	console.error('Error fetching data', error)
        }
    }
    
    return (
        <div className="ListPeers">
            <button onClick={listPeers} className="peers-button">List all Peers</button>

			{loading && <p className="loading-message">Loading...</p>}

			{error && <p className="error-message">Error: {error.message}</p>}

			{responseData && responseData.peers && responseData.peers.length > 0 ? (
                responseData.peers.map((peer, index) => (
				<>
					<h2>Peer {index +1}</h2>
					<table>
						<tr>
							<td><strong>PubKey</strong></td>
							<td>{peer.pubKey}</td>
						</tr>
						<tr>
							<td><strong>Address</strong></td>
							<td>{peer.address}</td>
						</tr>
						<tr>
							<td><strong>Bytes Sent</strong></td>
							<td>{peer.bytesSent}</td>
						</tr>
						<tr>
							<td><strong>Bytes Recv</strong></td>
							<td>{peer.bytesRecv}</td>
						</tr>
						<tr>
							<td><strong>Ping Time</strong></td>
							<td>{peer.pingTime}</td>
						</tr>
						<tr>
							<td><strong>Sync Type</strong></td>
							<td>{peer.syncType}</td>
						</tr>
					</table>
				</>
				))
				) : (
				<p></p>
			)}
        </div>
    )
}

export default ListPeers