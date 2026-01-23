import Navbar from "../../components/navbar";
import HeroPage from "../../components/heroSection/heropage";
import Powerful from "../../components/powerfulSection";
import IndustrySec from "../../components/IndustrySection";

export default function LandingPage() {
	return (
		<div>
			<Navbar />
			<div className="pt-[180px]">
				<HeroPage />
				<Powerful />
				<IndustrySec />
			</div>
		</div>
	);
}
