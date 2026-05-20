import Navbar from "../../components/navbar";
import HeroPage from "../../components/heroSection";
import Powerful from "../../components/powerfulSection";
import IndustrySec from "../../components/IndustrySection";
import Footer from "../../components/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-[72px]">
        <HeroPage />
        <Powerful />
        <IndustrySec />
        <Footer />
      </div>
    </div>
  );
}