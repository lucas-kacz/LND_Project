import React, { useState } from "react"

const CloseChannel = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null)
    const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

    const [channel_point, setChannel_point] = useState("")
    const [localFundingAmount, setlocalFundingAmount] = useState()

    const handleChannelPointInputChange = (event) => {
        setChannel_point(event.target.value)
    }

    const handleLocalFundingAmountInputChange = (event) => {
        setlocalFundingAmount(event.target.value)
    }

    const closeChannel = async () => {
		setLoading(true)
      	try {
			const response = await fetch(`${backend_url}/closeChannel/${channel_point}/${localFundingAmount}`, {
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
					value={channel_point}
					onChange={handleChannelPointInputChange}
					placeholder="Enter Channel Point"
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
				<button onClick={closeChannel} className="open-button">Close Channel</button>
				
				{loading && <p className="loading-message">Loading...</p>}
				{error && <p className="error-message">Error: {error.message}</p>}
				{responseData && <p>Response: {JSON.stringify(responseData)}</p>}
			</div>
		</>
    )
}

export default CloseChannel;