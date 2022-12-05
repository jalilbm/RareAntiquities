import "./App.scss";
import Auction from "./page/Auction";
import "@rainbow-me/rainbowkit/styles.css";
import {
	RainbowKitProvider,
	getDefaultWallets,
	darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import Buffer from "buffer";

const BscChain = {
	id: 56,
	name: "Binance Smart Chain",
	network: "Binance Smart Chain",
	iconUrl: "https://bin.bnbstatic.com/static/images/common/favicon.ico",
	iconBackground: "#fff",
	nativeCurrency: {
		decimals: 18,
		name: "Binance Token",
		symbol: "BNB",
	},
	rpcUrls: {
		default: "https://bsc-dataseed.binance.org/",
	},
	blockExplorers: {
		default: { name: "bscscan", url: "https://bscscan.com/" },
	},
	testnet: false,
};

const { chains, provider } = configureChains(
	[BscChain],
	[
		infuraProvider({ infuraId: import.meta.env.VITE_INFURA_ID }),
		publicProvider(),
	]
);

const { connectors } = getDefaultWallets({
	appName: "TheRareAntiquities",
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

window.Buffer = window.Buffer || Buffer;

function App() {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={darkTheme({
					accentColor: "#564c2e",
					accentColorForeground: "white",
					borderRadius: "small",
					fontStack: "system",
					overlayBlur: "small",
				})}
				modalSize="compact"
			>
				<div className="App">
					<Auction />
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;
