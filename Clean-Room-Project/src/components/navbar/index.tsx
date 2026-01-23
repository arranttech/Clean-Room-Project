import navbarDesign from "./navbarDesign"
import { Link } from "react-router-dom"
import text from "../../json/constants.json"

export default function Navbar() {
  const { navbar } = text

  return (
    <header className={navbarDesign.header}>
      <div className={navbarDesign.container}>
        <div className={navbarDesign.row}>
          {/* LEFT */}
          <div className={navbarDesign.left}>
            <div className={navbarDesign.logoWrap}>
              <img
                src="/Arrant.jpeg"
                alt="Arrant Logo"
                className={navbarDesign.logoImg}
              />
            </div>

            <div className={navbarDesign.brandBlock}>
              <span className={navbarDesign.brandText}>
                {navbar.brand.line1}
              </span>
              <span className={navbarDesign.brandText}>
                {navbar.brand.line2}
              </span>
            </div>

            <span className={navbarDesign.title}>{navbar.title}</span>
          </div>

          {/* CENTER */}
          <nav className={navbarDesign.center}>
            {navbar.links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={navbarDesign.navLink}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* RIGHT */}
          <div className={navbarDesign.right}>
            <Link
              to="/dashboard"
              className={navbarDesign.signIn}
            >
              {navbar.signIn.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
