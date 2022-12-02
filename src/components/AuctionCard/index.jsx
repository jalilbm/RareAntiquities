import "./index.scss";
import picassoFaceArt from "../../assets/picasso-face-art.jpeg";
import { Button } from "antd";
import { Cascader, Input, Select, Space } from "antd";

function AuctionCard() {
	return (
		<div className="auction-card-container">
			<div className="auction-image-container">
				<img className="auction-image" src={picassoFaceArt} />
			</div>
			<div className="auction-info">
				<p className="bold-p">
					FROM A PRIVATE HONG KONG COLLECTION (LOTS 1001-1002)
				</p>
				<h1>Art Name (1997)</h1>
				<p className="bold-p">Farewell My Concubine / Cat on Rock</p>
				<Space direction="vertical">
					<Input prefix="$" suffix="USD" />
					<Button className="auction-bid-button">Bid using card</Button>
				</Space>
			</div>
		</div>
	);
}

export default AuctionCard;
