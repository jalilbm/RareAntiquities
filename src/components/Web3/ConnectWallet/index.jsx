import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWallet = () => {
	return (
		<ConnectButton
			chainStatus
			accountStatus="address"
			showBalance={{
				smallScreen: false,
				largeScreen: false,
			}}
		/>
	);
};
