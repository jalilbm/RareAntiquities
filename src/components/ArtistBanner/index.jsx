import "./index.scss";
import PicassoSignature from "../../assets/artists/PicassoSignature.png";
import peopleOnMuseum from "../../assets/artists/people-on-museum.jpeg";
import { ConnectWallet } from "../Web3/ConnectWallet";

export default function ArtistBanner() {
	return (
		<div className="artist-banner">
			<div className="artist-data">
				<div className="logo-container">
					<img className="artist-logo" src={PicassoSignature} />
				</div>
				<div className="artist-image-container">
					<img className="artist-image" src={peopleOnMuseum} />
				</div>

				<div className="connect-wallet-btn-container">
					<ConnectWallet />
				</div>
			</div>
		</div>
	);
}
