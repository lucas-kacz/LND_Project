import React, { useState } from "react"
import './ListChannels.css'

const ListChannels = () => {

    const backend_url = "http://localhost:5000"

    const [responseData, setResponseData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

    const listchannels = async () => {
		setLoading(true)
        try {
			const response = await fetch(backend_url + "/listChannels", {
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
        <div className="Listchannels">
            <button onClick={listchannels} className="channels-button">List all Channels</button>

			{loading && <p className="loading-message">Loading...</p>}

			{error && <p className="error-message">Error: {error.message}</p>}

			{responseData && responseData.channels && responseData.channels.length > 0 ? (
                responseData.channels.map((channel, index) => (
				<>
					<h2>Channels {index +1}</h2>
					<table>
						<tr>
							<td><strong>Remote PubKey</strong></td>
							<td>{channel.remotePubkey}</td>
						</tr>
						<tr>
							<td><strong>Channel Point</strong></td>
							<td>{channel.channelPoint}</td>
						</tr>
						<tr>
							<td><strong>Channel Id</strong></td>
							<td>{channel.chanId}</td>
						</tr>
						<tr>
							<td><strong>Capacity</strong></td>
							<td>{channel.capacity}</td>
						</tr>
						<tr>
							<td><strong>Local Balance</strong></td>
							<td>{channel.localBalance}</td>
						</tr>
                        <tr>
							<td><strong>Lifetime</strong></td>
							<td>{channel.lifetime}</td>
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

export default ListChannels;