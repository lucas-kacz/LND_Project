import React, { useState } from "react"

const DisonnectPeer = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null)
    const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

    const [nodePubKey, setNodePubKey] = useState("")

    const handleKeyInputChange = (event) => {
      	setNodePubKey(event.target.value)
    }

    const disconnectPeer = async () => {
		setLoading(true)
		setNodePubKey(nodePubKey)
        try {
			const response = await fetch(`${backend_url}/disconnectPeer/${nodePubKey}`, {
				method: 'POST',
			})
		
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`)
			}
			setLoading(false)
			console.log(response)
			setResponseData(response)
		} catch (error) {
			setLoading(false)
			console.error('Error connecting to the node', error)
			setError(error.message)
		}
    }
    
    return (
        <>
			<div className="inputs-container">
				<input
					type="text"
					value={nodePubKey}
					onChange={handleKeyInputChange}
					placeholder="Enter Node PubKey"
					className="node-attribute-input"
				/>
			</div>
			<div className="others-container">
				<button onClick={disconnectPeer} className="connect-button">Disconnect From Peer</button>

				{loading && <p className="loading-message">Loading...</p>}
				{error && <p className="error-message">Error: {error.message}</p>}
				{responseData && <p>Response: {JSON.stringify(responseData)}</p>}
			</div>
        </>
      )
}

export default DisonnectPeer;