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
					<div className="center-div">
						<Input prefix="$" suffix="USD" className="bid-amount" />
					</div>
					<div className="auction-bid-buttons space-between">
						<Button className="auction-bid-button">Bid using card</Button>
						<Button className="auction-bid-button">Bid using usdt</Button>
					</div>
					<br />
					<Input.Group compact className="subscribe-to-art-span">
						<div className="center-div">
							<Input
								style={{ width: "calc(100% - 100px)" }}
								placeholder="Email"
								className="subscribe-to-art-input"
							/>
							<Button type="primary" className="subscribe-to-art-btn">
								Subscribe
							</Button>
						</div>
						<div className="center-div">
							<p>Subscribe to get latest news about this art</p>
						</div>
					</Input.Group>
				</div>
			</div>
		</ConfigProvider>
	);
}

export default AuctionCard;
