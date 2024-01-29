import { useState, useEffect } from "react"
import './Balance.css'

const Balance = () => {
    const backend_url = "http://localhost:5000"

	const [responseData, setResponseData] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	const getBalance = async () => {
		setLoading(true)
		try {
			const response = await fetch(backend_url + "/getWalletBalance", {
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
			console.error('Error fetching data', error);
		}
	}

	return (
		<div>
			<button onClick={getBalance} className="balance-button">Get your LND wallet balance infos</button>

			{loading && <p className="loading-message">Loading...</p>}

			{error && <p className="error-message">Error: {error.message}</p>}

			{responseData && (
				<table>
					<tbody>
						{Object.entries(responseData).map(([key, value]) => (
							<tr key={key}>
								<td><strong>{key}</strong></td>
								<td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default Balance