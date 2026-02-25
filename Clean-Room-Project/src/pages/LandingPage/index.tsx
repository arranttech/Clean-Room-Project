import Navbar from "../../components/navbar";
import HeroPage from "../../components/heroSection";
import Powerful from "../../components/powerfulSection";
import IndustrySec from "../../components/industrySection";
import Footer from "../../components/footer";

export default function LandingPage() {
	return (
		<div>
			<Navbar />
			<div className="pt-[180px]">
				<HeroPage />
				<Powerful />
				<IndustrySec />
				<Footer />
			</div>
		</div>
	);
}
