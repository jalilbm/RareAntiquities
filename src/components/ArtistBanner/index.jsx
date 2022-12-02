import "./index.scss";
import PicassoSignature from "../../assets/artists/PicassoSignature.png";
import peopleOnMuseum from "../../assets/artists/people-on-museum.jpeg";

export default function ArtistBanner() {
	return (
		<div className="artist-banner">
			<div className="artist-data">
				<div className="logo-container">
					<img className="artist-logo" src={PicassoSignature} />
				</div>
				<img className="artist-image" src={peopleOnMuseum} />
				<div className="artist-name">
					<h2>Pablo Picasso</h2>
				</div>
			</div>
		</div>
	);
}
