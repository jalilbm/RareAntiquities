import "./index.scss";

export default function AuctionDescription(props) {
	return (
		<div className="auction-description-container">
			<div className="auction-description">
				{props.art_video && (
					<div className="video-container center-div">
						<video
							className="video-player"
							src={props.art_video}
							controls="controls"
							autoPlay={true}
							loop
						/>
					</div>
				)}
				<div>
					<p>{props.description}</p>
				</div>
				<br></br>
				<br></br>
			</div>
		</div>
	);
}
