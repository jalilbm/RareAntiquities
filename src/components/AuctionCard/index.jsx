import "./index.scss";
import picassoFaceArt from "../../assets/picasso-face-art.jpeg";
import { ConfigProvider, Button, Input, Space, Divider } from "antd";

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
					<div className="justify-left">
						<div>
							<p className="bold-p">Total bids amount</p>
							<p>
								<span>$</span>120,000
							</p>
						</div>
						<Divider type="vertical" />
						<div>
							<p className="bold-p">All bidders</p>
							<p>1,235</p>
						</div>
						<Divider type="vertical" />
						<div>
							<p className="bold-p">Bids range</p>
							<p>
								<span>$</span>2 <span>-</span> <span>$</span>2,500
							</p>
						</div>
					</div>
					<br />
					<div className="align-self-end">
						<div className="center-div">
							<Input prefix="$" suffix="USD" className="bid-amount" />
						</div>
						<div className="center-div">
							<div className="auction-bid-buttons space-between">
								<Button className="auction-bid-button">Bid using card</Button>
								<Button className="auction-bid-button">Bid using usdt</Button>
							</div>
						</div>
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
			</div>
		</ConfigProvider>
	);
}

export default AuctionCard;
