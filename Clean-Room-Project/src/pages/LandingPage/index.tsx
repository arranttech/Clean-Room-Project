import Navbar from "../../components/navbar";
import HeroPage from "../../components/heroSection/heropage";

export default function LandingPage() {
	return (
		<div>
			<Navbar />
			<div className="pt-[180px]">
				<HeroPage />
			</div>
		</div>
	);
}
