import AuctionCard from "../../components/AuctionCard";
import "./index.scss";
import AuctionDescription from "../../components/AuctionDescription";

function Auction(props) {
	return (
		<div className="Auction">
			<AuctionCard
				stakingAddress={props.stakingAddress}
				image={props.image}
				head={props.head}
				title={props.title}
				artist={props.artist}
				subscribe_art_id={props.subscribe_art_id}
			/>
			<AuctionDescription
				description={props.description}
				art_video={props.art_video}
			/>
		</div>
	);
}

export default Auction;
