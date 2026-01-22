import heroDesign from "./heroDesign";
import { FaArrowRight, FaPlay, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HeroPage() {
  return (
    <section className={heroDesign.section}>
      <div className={heroDesign.container}>
        <div className={heroDesign.badgeWrapper}>
          <div className={heroDesign.badge}>
            Industry Leading HVAC Matrix Solutions
          </div>
        </div>

        <h1 className={heroDesign.titleBlue}>STERI Clean Air</h1>
        <h2 className={heroDesign.titleDark}>HVAC Matrix Platform</h2>

        <p className={heroDesign.subtitle}>
          Enterprise-grade cleanroom HVAC design and calculation platform
        </p>

        <p className={heroDesign.description}>
          Arrant Dynamics, a division of Arrant Tech IND, Pvt. Ltd. delivers
          precision-engineered solutions for pharmaceutical, semiconductor, and
          biotechnology facilities worldwide.
        </p>

        <div className={heroDesign.buttonRow}>
          {/* Primary Button */}

          <Link to="/dashboard">
          <button className={heroDesign.primaryButton}>
            <span className="text-white">Sign In</span>
            <FaArrowRight className={heroDesign.primaryArrow} />
          </button>
          </Link>

          {/* Secondary Button */}
          <button className={heroDesign.secondaryButton}>
            <FaPlay className={heroDesign.playIcon} />
            Watch Demo
          </button>
        </div>

        <div className={heroDesign.footer}>
          <div className={heroDesign.footerItem}>
            <FaCheck className={heroDesign.checkIcon} />
            No credit card required
          </div>

          <div className={heroDesign.footerItem}>
            <FaCheck className={heroDesign.checkIcon} />
            30-day free trial
          </div>

          <div className={heroDesign.footerItem}>
            <FaCheck className={heroDesign.checkIcon} />
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}
