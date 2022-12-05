import "./index.scss";
import picassoFaceArt from "../../assets/picasso-face-art.jpeg";
import { ConfigProvider, Button, Input, Divider, message } from "antd";
import { useState } from "react";
import axios from "axios";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

function AuctionCard() {
	const [subscriberEmail, setSubscriberEmail] = useState("");
	const [messageApi, contextHolder] = message.useMessage();

	const updateSubscriber = (event) => {
		let { value } = event.target;
		setSubscriberEmail(value);
	};

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(/^\S+@\S+\.\S+$/);
	};

	const handleSubscribe = () => {
		if (!validateEmail(subscriberEmail)) {
			messageApi.open({
				type: "error",
				content: "Invalid email address provided",
			});
			return;
		}
		messageApi.open({
			type: "loading",
			content: "Please wait...",
			duration: 1,
		});
		console.log("aaaaa");
		axios
			.post(import.meta.env.VITE_BASE_URL + `/api/art/subscribe/`, {
				artId: 1,
				email: subscriberEmail,
			})
			.then((response) => {
				if (response.status === 200) {
					messageApi.open({
						type: "success",
						content: "You have subscribed successfully!",
						duration: 5,
					});
				} else {
					messageApi.open({
						type: "error",
						content: "Sorry we could not subscribe you, please try again later",
						duration: 5,
					});
				}
			})
			.catch(() => {
				messageApi.open({
					type: "error",
					content: "Sorry we could not subscribe you, please try again later",
					duration: 5,
				});
			});
		console.log("bbbbbb");
	};

	return (
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: "#564c2e",
				},
			}}
		>
			{contextHolder}
			<div className="auction-card-container">
				<div className="auction-image-container">
					<img className="auction-image" src={picassoFaceArt} />
				</div>
				<div className="auction-info">
					<p className="bold-p">FROM THE RARE ANTIQUITIES (LOTS 0001)</p>
					<h1>Like An Animal (1957)</h1>
					<p className="bold-p">Pablo Picasso</p>
					<br />
					<div className="justify-left">
						<div>
							<p className="bold-p">Total bid amount</p>
							<p>
								<span>$</span>120,000
							</p>
						</div>
						<Divider type="vertical" />
						<div>
							<p className="bold-p">Number of bidders</p>
							<p>1,235</p>
						</div>
						<Divider type="vertical" />
						<div>
							<p className="bold-p">Bid range</p>
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
								<Button className="auction-bid-button">Bid by card</Button>
								<Button className="auction-bid-button">Bid by USDT</Button>
							</div>
						</div>
						<Input.Group compact className="subscribe-to-art-span">
							<div className="center-div">
								<Input
									style={{ width: "calc(100% - 100px)" }}
									placeholder="Email"
									type="email"
									className="subscribe-to-art-input"
									onChange={(event) => updateSubscriber(event)}
									value={subscriberEmail}
								/>
								<Button
									type="primary"
									className="subscribe-to-art-btn"
									onClick={handleSubscribe}
								>
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
