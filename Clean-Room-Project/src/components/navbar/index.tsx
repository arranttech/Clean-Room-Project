import navbarDesign from "./navbarDesign";

export default function Navbar() {
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
              <span className={navbarDesign.brandText}>ARRANT</span>
              <span className={navbarDesign.brandText}>DYNAMICS</span>
            </div>

            <span className={navbarDesign.title}>STERI Clean Air</span>
          </div>

          {/* CENTER */}
          <nav className={navbarDesign.center}>
            <a href="#features" className={navbarDesign.navLink}>
              Features
            </a>
            <a href="#industries" className={navbarDesign.navLink}>
              Industries
            </a>
            <a href="#contact" className={navbarDesign.navLink}>
              Contact
            </a>
          </nav>

          {/* RIGHT */}
          <div className={navbarDesign.right}>
            <a href="/signin" className={navbarDesign.signIn}>
              Sign In
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
