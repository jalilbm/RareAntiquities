import ArtistBanner from "../../components/ArtistBanner";
import AuctionCard from "../../components/AuctionCard";
import "./index.scss";

function Auction() {
	return (
		<div className="Auction">
			<ArtistBanner />
			<AuctionCard />
		</div>
	);
}

export default Auction;
