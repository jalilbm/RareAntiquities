import "./index.scss";
import picassoFaceArt from "../../assets/picasso-face-art.jpeg";
import { ConfigProvider, Button, Input, Divider, message } from "antd";
import { useState, useContext, useMemo, useEffect } from "react";
import axios from "axios";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useContract, useSigner } from "wagmi";
import { useProvider } from "wagmi";
import { ethers } from "ethers";
import token_data from "../Web3/data/usdt/token.json";
import contract_data from "../Web3/data/contract/contract.json";
import {
	formatUsd,
	formatUsdInput,
	formatFnd,
	sendTx,
	USDT_DECIMALS,
	popupError,
	popupInfo,
	switchNetwork,
} from "../Web3/utils/helpers";

var regexp = /^\d+(\.\d{1,18})?$/;

function AuctionCard() {
	const [subscriberEmail, setSubscriberEmail] = useState("");
	const [messageApi, contextHolder] = message.useMessage();
	const [stakingOptions, setStakingOptions] = useState();
	const [finishedTokenInfoUpdate, setFinishedTokenInfoUpdate] = useState(true);
	// const { provider, setProvider } = useContext(RainbowKitProvider);
	const [chainId, setChainId] = useState();
	const [walletAddress, setWalletAddress] = useState();
	const [readyToBid, setReadyToBid] = useState();
	const [token, setToken] = useState();
	const [staking, setStaking] = useState();
	const [allowance, setAllowance] = useState(0);
	const [stakingData, setStakingData] = useState();
	const [balance, setBalance] = useState(0);
	const [usdBalance, setUsdBalance] = useState(0);
	const [pending, setPending] = useState(false);
	const [txHash, setTxHash] = useState(null);
	const [signer, setSigner] = useState(null);
	const stakingAddress = "0x14a94D62d24a2b9d29FCdeFfb643a2B209e44fA6";
	const provider = useProvider({
		chainId: contract_data.TARGET_CHAIN,
	});

	const getAllowance = async (token_) => {
		const allowance = await token_.allowance(walletAddress, stakingAddress);
		setAllowance(allowance);
	};

	const getStakingOptions = async (staking) => {
		console.log("aaaaaaa");
		const options = await staking.getOptions();
		console.log("aaaaaaa 22222", options);
		setStakingOptions(options);
		setFinishedTokenInfoUpdate(true);
	};

	async function isReadyToBid() {
		if (provider && signer) {
			setChainId(provider.network.chainId);
			setReadyToBid(true);
		} else {
			setReadyToBid(false);
		}
	}

	const getStakingData = async (staking) => {
		const data = await staking.getUserData();
		setStakingData(data);
	};
	const { data: signer_ } = useSigner();
	useMemo(() => {
		if (signer_ && provider && stakingAddress) {
			setSigner(signer_);
			const signer = signer_;
			console.log("aaaa", signer);
			const token_ = new ethers.Contract(
				token_data.token_address,
				token_data.token_abi,
				signer
			);
			console.log("bbbb", token_);
			const staking = new ethers.Contract(
				stakingAddress,
				contract_data.abi,
				signer
			);
			console.log("ccccc", staking, staking.getOptions());
			setToken(token_);
			setStaking(staking);
			isReadyToBid();

			getAllowance(token_);
			getStakingOptions(staking);
			getStakingData(staking);
		}
	}, [provider, walletAddress, stakingAddress]);

	const getTokenBalance = async () => {
		const data = await token.balanceOf(walletAddress);
		// const usd = await staking.fndToUsd(data);
		setBalance(data);
		setUsdBalance(data);
	};

	async function approve() {
		setPending(true);
		const approveTx = () =>
			token?.approve(stakingAddress, ethers.constants.MaxInt256);
		const status = await sendTx(approveTx, "Approved successfully!");
		setPending(false);
		status.valid && setAllowance(ethers.constants.MaxInt256);
		return status;
	}

	let refreshStakingId = 0;

	useEffect(() => {
		clearInterval(refreshStakingId);
		refreshStakingId = setInterval(() => {
			console.log("hhhhhhhh", staking);
			if (!!staking) {
				getStakingData(staking);
				console.log("hhhhhhhh 111111");
				getStakingOptions(staking);
				console.log("hhhhhhhh 222222");
			}
			if (!!walletAddress) {
				getTokenBalance();
			}
		}, 5000);
	}, [staking]);

	async function bid() {
		isReadyToBid();
		if (chainId !== contract_data.TARGET_CHAIN) {
			messageApi.open({
				type: "error",
				content: "Please connect to BSC Mainnet",
				duration: 5,
			});
			return;
		}
		if (!allowance || allowance.lte(0)) {
			messageApi.open({
				type: "warning",
				content:
					"Please approve 2x transactions in your wallet to complete your bid!",
				duration: 5,
			});
			const approvalStatus = await approve();
			if (!approvalStatus) {
				return;
			}
		}
		let contribution_amount = document.getElementById("bid-amount").value;
		if (!regexp.test(contribution_amount)) {
			messageApi.open({
				type: "error",
				content: "Invalid bid amount",
				duration: 5,
			});
			return;
		} else {
			try {
				setPending(true);
				const tx = () =>
					staking?.stake(
						ethers.utils.parseUnits(
							contribution_amount,
							token_data.USDT_DECIMALS
						)
					);
				const status = await sendTx(tx, "You have successfully Bided!");
				setPending(false);
				if (status.valid) {
					setTxHash(status.hash);
				}
			} catch (e) {
				setPending(false);
			}
		}
	}

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
							<Input
								id="bid-amount"
								prefix="$"
								suffix="USD"
								className="bid-amount"
							/>
						</div>
						<div className="center-div">
							<div className="auction-bid-buttons space-between">
								<Button className="auction-bid-button">Bid by card</Button>
								<Button
									className="auction-bid-button"
									onClick={bid}
									// onClick={() => {
									// 	console.log(
									// 		!stakingOptions,
									// 		!stakingOptions[7],
									// 		pending
									// 	);
									// }}
									disabled={!stakingOptions || !stakingOptions[7] || pending}
								>
									Bid by USDT
								</Button>
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
