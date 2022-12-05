import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWallet = () => {
	return (
		<ConnectButton
			chainStatus="none"
			accountStatus="address"
			showBalance={{
				smallScreen: false,
				largeScreen: false,
			}}
		/>
	);
};
