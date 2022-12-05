import "./index.scss";
import logo from "../../assets/logos/logo.png";
import { ConnectWallet } from "../Web3/ConnectWallet";

export default function ArtistBanner() {
	return (
		<div className="artist-banner">
			<div className="artist-data">
				<div className="logo-container">
					<a href="https://therareantiquities.com/home-new/">
						<img className="logo" src={logo} />
					</a>
				</div>
				{/* <div className="artist-image-container">
					<img className="artist-image" src={peopleOnMuseum} />
				</div> */}

				<div className="connect-wallet-btn-container">
					<ConnectWallet />
				</div>
			</div>
		</div>
	);
}
