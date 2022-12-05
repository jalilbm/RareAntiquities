import { Routes, Route } from "react-router-dom";
import Auction from "./page/Auction";
import LikeAnAnimal from "./assets/arts/Like An Animal.png";
import Unnamed from "./assets/arts/Unnamed.png";
import art3 from "./assets/arts/art3.png";

export default function CustomRouter(props) {
	return (
		<div className="main" style={{ minHeight: "100vh" }}>
			<Routes>
				<Route
					exact
					path="/"
					element={
						<Auction
							stakingAddress="0xabf6607B1bd537812167fA006CA561f4F68338cC"
							image={LikeAnAnimal}
							head="FROM THE RARE ANTIQUITIES (LOTS 0001)"
							title="Like An Animal (1957)"
							artist="Pablo Picasso"
							subscribe_art_id={1}
							description=""
							art_video="https://rarefnd-bucket.s3.us-east-2.amazonaws.com/TheRareAntiquities/Like+An+Animal.MOV"
						/>
					}
				/>
				<Route
					exact
					path="/picasso-1"
					element={
						<Auction
							stakingAddress="0xabf6607B1bd537812167fA006CA561f4F68338cC"
							image={LikeAnAnimal}
							head="FROM THE RARE ANTIQUITIES (LOTS 0001)"
							title="Like An Animal (1957)"
							artist="Pablo Picasso"
							subscribe_art_id={1}
							description=""
							art_video="https://rarefnd-bucket.s3.us-east-2.amazonaws.com/TheRareAntiquities/Like+An+Animal.MOV"
						/>
					}
				/>
				<Route
					exact
					path="/picasso-2"
					element={
						<Auction
							stakingAddress=""
							image={Unnamed}
							head="FROM THE RARE ANTIQUITIES (LOTS 0002)"
							title="Unnamed"
							artist="Pablo Picasso"
							subscribe_art_id={2}
							description=""
							art_video="https://rarefnd-bucket.s3.us-east-2.amazonaws.com/TheRareAntiquities/IMG_4251.MOV"
						/>
					}
				/>
				<Route
					exact
					path="/picasso-3"
					element={
						<Auction
							stakingAddress=""
							image={art3}
							head="FROM THE RARE ANTIQUITIES (LOTS 0003)"
							title="The Young Tobias Heals his Blind Father (1600)"
							artist="Pablo Picasso"
							subscribe_art_id={3}
							description=""
							art_video="https://rarefnd-bucket.s3.us-east-2.amazonaws.com/TheRareAntiquities/2022-12-05+13.03.23.mp4"
						/>
					}
				/>
			</Routes>
		</div>
	);
}
