import Navbar from './Components/Navbar/Navbar'
import ConnectNode from './Components/ConnectNode/ConnectNode'
import ListPeers from './Components/ListPeers/ListPeers'
import OpenChannel from './Components/OpenChannel/OpenChannel'
import Balance from './Components/Balance/Balance'
import Tabs from './Components/Tabs/Tabs'
import Tab from './Components/Tabs/Tab/Tab'

function App() {
	return (
		<div>
		<Navbar />

			<div className='Card'>
				<Tabs>
					<Tab label="Balance">
						<Balance />
					</Tab>

					<Tab label="Connect Node">
						<ConnectNode />
					</Tab>

					<Tab label="List Peers">
						<ListPeers />
					</Tab>

					<Tab label="Open Channel">
						<OpenChannel />
					</Tab>
				</Tabs>
			</div>
		</div>
	)
}

export default App;
