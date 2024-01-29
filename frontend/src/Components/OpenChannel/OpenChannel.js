import React, { useState } from "react"
import './OpenChannel.css'

const OpenChannel = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null)
    const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

    const [nodePubKey, setNodePubKey] = useState("")
    const [localFundingAmount, setlocalFundingAmount] = useState()

    const handleNodePubKeyInputChange = (event) => {
      	setNodePubKey(event.target.value)
    }

    const handleLocalFundingAmountInputChange = (event) => {
      	setlocalFundingAmount(event.target.value)
    }

    const openChannel = async () => {
		setLoading(true)
      	try {
			const response = await fetch(`${backend_url}/openChannel/${nodePubKey}/${localFundingAmount}`, {
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
					onChange={handleNodePubKeyInputChange}
					placeholder="Enter Node PubKey"
					className="channel-input"
				/>
				<input
					type="number"
					value={localFundingAmount}
					onChange={handleLocalFundingAmountInputChange}
					placeholder="Enter Local Funding Amount"
					className="channel-input"
				/>
			</div>
			<div className="others-container">	
				<button onClick={openChannel} className="open-button">OpenChannel</button>
				
				{loading && <p className="loading-message">Loading...</p>}
				{error && <p className="error-message">Error: {error.message}</p>}
				{responseData && <p>Response: {JSON.stringify(responseData)}</p>}
			</div>
		</>
    )
}

export default OpenChannel;