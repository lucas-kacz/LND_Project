import Navbar from './Components/Navbar/Navbar'
import ConnectNode from './Components/ConnectNode/ConnectNode'
import ListPeers from './Components/ListPeers/ListPeers'
import OpenChannel from './Components/OpenChannel/OpenChannel'
import Balance from './Components/Balance/Balance'
import Tabs from './Components/Tabs/Tabs'
import Tab from './Components/Tabs/Tab/Tab'
import ListChannels from './Components/ListChannels/ListChannels'
import CloseChannel from './Components/CloseChannel/CloseChannel'
import DisonnectPeer from './Components/DisconnectPeer/DisconnectPeer'

function App() {
	return (
		<div>
		<Navbar />

			<div className='Card'>
				<Tabs>
					<Tab label="Balance">
						<Balance />
					</Tab>

					<Tab label="Connect to Peer">
						<ConnectNode />
					</Tab>

					<Tab label="Disconnect from Peer">
						<DisonnectPeer />
					</Tab>

					<Tab label="List Peers">
						<ListPeers />
					</Tab>

					<Tab label="List Channels">
						<ListChannels />
					</Tab>

					<Tab label="Open Channel">
						<OpenChannel />
					</Tab>

					<Tab label="Close Channel">
						<CloseChannel />
					</Tab>
				</Tabs>
			</div>
		</div>
	)
}

export default App;
