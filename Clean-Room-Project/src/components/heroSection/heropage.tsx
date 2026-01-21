
import heroDesign from "./heroDesign"
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
          <button className={heroDesign.primaryButton}>
            <span className="text-white">Sign In</span>
            <span className={heroDesign.primaryArrow}>→</span>
          </button>

          <button className={heroDesign.secondaryButton}>
            <span className={heroDesign.playIcon}>▶</span>
            Watch Demo
          </button>
        </div>

        <div className={heroDesign.footer}>
          <div className={heroDesign.footerItem}>
            <span className={heroDesign.checkIcon}>✓</span>
            No credit card required
          </div>

          <div className={heroDesign.footerItem}>
            <span className={heroDesign.checkIcon}>✓</span>
            30-day free trial
          </div>

          <div className={heroDesign.footerItem}>
            <span className={heroDesign.checkIcon}>✓</span>
            Cancel anytime
          </div>
        </div>
      </div>
    </section>
  )
}
