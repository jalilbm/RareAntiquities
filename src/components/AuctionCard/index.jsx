import "./index.scss";
import { ConfigProvider, Button, Input, Divider, message } from "antd";
import { useState, useContext, useMemo, useEffect } from "react";
import axios from "axios";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useContract, useSigner } from "wagmi";
import { useProvider } from "wagmi";
import { ethers } from "ethers";
import token_data from "../Web3/data/usdt/token.json";
import contract_data from "../Web3/data/contract/contract.json";
import { publicProvider } from "wagmi/providers/public";
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

function AuctionCard(props) {
	const [subscriberEmail, setSubscriberEmail] = useState("");
	const [messageApi, contextHolder] = message.useMessage();
	const [stakingOptions, setStakingOptions] = useState(null);
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
	const [contractBalance, setContractBalance] = useState(null);
	const [readStaking, setReadStaking] = useState(null);
	const stakingAddress = props.stakingAddress;
	const provider = useProvider({
		chainId: contract_data.TARGET_CHAIN,
	});
	const { data: signer } = useSigner();

	const getAllowance = async (token_) => {
		const allowance = await token_.allowance(walletAddress, stakingAddress);
		setAllowance(allowance);
	};

	const getStakingOptions = async (staking) => {
		if (!stakingOptions) {
			const options = await staking.getOptions();
			setStakingOptions(options);
			setFinishedTokenInfoUpdate(true);
		}
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

	const getReadStakingData = async (readStaking) => {
		const options = await readStaking.getOptions();
		setStakingOptions(options);
		setFinishedTokenInfoUpdate(true);
	};

	useMemo(() => {
		if (stakingAddress) {
			const provider_ = new ethers.providers.JsonRpcProvider(
				"https://data-seed-prebsc-1-s1.binance.org:8545	"
			);
			const _staking = new ethers.Contract(
				stakingAddress,
				contract_data.abi,
				provider_
			);
			getReadStakingData(_staking);
		}
		if (signer && provider && stakingAddress) {
			if (!walletAddress) {
				setWalletAddress(signer._address);
			}
			const token_ = new ethers.Contract(
				token_data.token_address,
				token_data.token_abi,
				signer
			);
			const staking = new ethers.Contract(
				stakingAddress,
				contract_data.abi,
				signer
			);

			setToken(token_);
			setStaking(staking);

			isReadyToBid();

			getAllowance(token_);
			getStakingOptions(staking);
			getStakingData(staking);
		}
	}, [provider, walletAddress, stakingAddress, signer]);

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
			if (!!staking) {
				getStakingData(staking);
				getStakingOptions(staking);
			}
			if (!!walletAddress) {
				getTokenBalance();
			}
		}, 5000);
	}, [staking]);

	// useEffect(() => {
	// 	axios
	// 		.get(
	// 			`https://${
	// 				contract_data.TARGET_CHAIN === 97
	// 					? "api-testnet.bscscan.com"
	// 					: "api.bscscan.com"
	// 			}/api?module=account&action=tokenbalance&contractaddress=${
	// 				token_data.token_address
	// 			}&address=${stakingAddress}&tag=latest&apikey=${
	// 				import.meta.env.VITE_BSCSCAN_API_KEY
	// 			}`
	// 		)
	// 		.then((response) => {
	// 			response = response.data;
	// 			console.log(response);
	// 			if (response.status === "1")
	// 				setContractBalance(
	// 					Number(response.result) / 10 ** token_data.USDT_DECIMALS
	// 				);
	// 			else setContractBalance("Try again later");
	// 		});
	// }, []);

	const updateContractBalance = async () => {
		const cb = await readStaking.myBalance();
		setContractBalance(Number(cb) / 10 ** token_data.USDT_DECIMALS);
		// return Number(cb) / 10 ** token_data.USDT_DECIMALS;
	};

	useEffect(() => {
		if (readStaking) {
			updateContractBalance();

			// setContractBalance(cb);
		}
	}, [readStaking]);

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
				artId: props.subscribe_art_id,
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
					<img className="auction-image" src={props.image} />
				</div>
				<div className="auction-info">
					<p className="bold-p">{props.head}</p>
					<h1>{props.title}</h1>
					<p className="bold-p">{props.artist}</p>
					<br />
					{stakingAddress && (
						<div className="justify-left">
							<div>
								<p className="bold-p">Total bid amount</p>
								<span>$</span>
								{(stakingOptions &&
									Number(stakingOptions[9]) / 10 ** token_data.USDT_DECIMALS) ||
									0}
							</div>
							<Divider type="vertical" />
							<div>
								<p className="bold-p">Number of bidders</p>
								<p>{(stakingOptions && Number(stakingOptions[3])) || 0}</p>
							</div>
							<Divider type="vertical" />
							<div>
								<p className="bold-p">Bid range</p>
								<p>
									<span>$</span>
									{(stakingOptions &&
										Number(stakingOptions[11]) /
											10 ** token_data.USDT_DECIMALS) ||
										0}{" "}
									<span>-</span> <span>$</span>
									{(stakingOptions &&
										Number(stakingOptions[10]) /
											10 ** token_data.USDT_DECIMALS <
											1000000000000 &&
										Number(stakingOptions[10]) /
											10 ** token_data.USDT_DECIMALS) ||
										0}
								</p>
							</div>
						</div>
					)}
					<br />
					<div className="align-self-end">
						{stakingAddress && (
							<>
								<div className="center-div">
									<Input
										id="bid-amount"
										prefix="$"
										suffix="USD"
										className="bid-amount"
										placeholder={
											walletAddress &&
											`Balance: ${
												balance && balance / 10 ** token_data.USDT_DECIMALS
											}USDT`
										}
									/>
								</div>
								<div className="center-div">
									<div className="auction-bid-buttons space-between">
										<Button className="auction-bid-button">Bid by card</Button>
										<Button
											className="auction-bid-button"
											onClick={bid}
											disabled={
												!stakingOptions || !stakingOptions[7] || pending
											}
										>
											Bid by USDT
										</Button>
									</div>
								</div>
							</>
						)}

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
