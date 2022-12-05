import "./App.scss";
import Auction from "./page/Auction";
import "@rainbow-me/rainbowkit/styles.css";
import {
	RainbowKitProvider,
	getDefaultWallets,
	darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { Buffer } from "buffer";
import contract_data from "./components/Web3/data/contract/contract.json";
import ArtistBanner from "./components/ArtistBanner";
import CustomRouter from "./CustomRouter";

const BscChain = {
	id: contract_data.TARGET_CHAIN,
	name: contract_data.TARGET_CHAIN_NAME,
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
					borderRadius: "large",
					fontStack: "system",
					overlayBlur: "small",
				})}
				modalSize="compact"
			>
				<div className="App">
					<ArtistBanner />
					<CustomRouter />
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	);
}

export default App;
