import heroDesign from "./heroDesign"
import { FaArrowRight, FaPlay, FaCheck } from "react-icons/fa"
import { Link } from "react-router-dom"
import text from "../../json/constants.json"

export default function HeroPage() {
  const { hero } = text

  return (
    <section className={heroDesign.section}>
      <div className={heroDesign.container}>
        <div className={heroDesign.badgeWrapper}>
          <div className={heroDesign.badge}>{hero.badge}</div>
        </div>

        <h1 className={heroDesign.titleBlue}>{hero.titleBlue}</h1>
        <h2 className={heroDesign.titleDark}>{hero.titleDark}</h2>

        <p className={heroDesign.subtitle}>{hero.subtitle}</p>

        <p className={heroDesign.description}>{hero.description}</p>

        <div className={heroDesign.buttonRow}>
          {/* Primary Button */}
          <Link to="/dashboard">
            <button className={heroDesign.primaryButton}>
              <span className="text-white">
                {hero.buttons.primary.label}
              </span>
              <FaArrowRight className={heroDesign.primaryArrow} />
            </button>
          </Link>

          {/* Secondary Button */}
          <button className={heroDesign.secondaryButton}>
            <FaPlay className={heroDesign.playIcon} />
            {hero.buttons.secondary.label}
          </button>
        </div>

        <div className={heroDesign.footer}>
          {hero.footerPoints.map((item) => (
            <div key={item} className={heroDesign.footerItem}>
              <FaCheck className={heroDesign.checkIcon} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
