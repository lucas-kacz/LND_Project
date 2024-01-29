import React, { useState } from "react"
import './ConnectNode.css'

const ConnectNode = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null)
    const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

    const [nodePubKey, setNodePubKey] = useState("")
	const [nodeAddress, setNodeAddress] = useState("")
    const [nodeHost, setNodeHost] = useState("")

    const handleKeyInputChange = (event) => {
      	setNodePubKey(event.target.value)
    }

	const handleAddressInputChange = (event) => {
		setNodeAddress(event.target.value)
  	}

    const handleHostInputChange = (event) => {
        setNodeHost(event.target.value)
    }

    const connectNode = async () => {
		setLoading(true)
		setNodePubKey(nodePubKey + '@' + nodeAddress)
        try {
			const response = await fetch(`${backend_url}/connectNode/${nodePubKey}/${nodeHost}`, {
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
				<p> @ </p>	
				<input
					type="text"
					value={nodeAddress}
					onChange={handleAddressInputChange}
					placeholder="Enter Node Address"
					className="node-attribute-input"
				/>
				<p> : </p>
				<input
					type="text"
					value={nodeHost}
					onChange={handleHostInputChange}
					placeholder="Enter Node Hostname"
					className="node-attribute-input"
				/>
			</div>
			<div className="others-container">
				<button onClick={connectNode} className="connect-button">Connect to Node</button>

				{loading && <p className="loading-message">Loading...</p>}
				{error && <p className="error-message">Error: {error.message}</p>}
				{responseData && <p>Response: {JSON.stringify(responseData)}</p>}
			</div>
        </>
      )
}

export default ConnectNode;