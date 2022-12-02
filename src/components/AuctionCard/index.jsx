import "./index.scss";
import picassoFaceArt from "../../assets/picasso-face-art.jpeg";
import { ConfigProvider, Button, Input, Space } from "antd";

function AuctionCard() {
	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: "#564c2e",
				},
			}}
		>
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
					<br />
					<Space direction="vertical">
						<Input prefix="$" suffix="USD" className="bid-amount" />
						<Button className="auction-bid-button">Bid using card</Button>
					</Space>
				</div>
			</div>
		</ConfigProvider>
	);
}

export default AuctionCard;
