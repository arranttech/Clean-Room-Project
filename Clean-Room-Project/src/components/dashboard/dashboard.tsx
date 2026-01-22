import { Link } from "react-router-dom";
import dashboardDesign from "./dashboardDesign";
import { FiLogOut } from "react-icons/fi";

export default function Dashboard() {
  const userName = "User";

  return (
    <div className={dashboardDesign.page}>
      <header className={dashboardDesign.header}>
        <div className={dashboardDesign.headerInner}>
          <div className={dashboardDesign.left}>
            <div className={dashboardDesign.logoTile}>
              <img
                src="/Arrant.jpeg"
                alt="Arrant Dynamics"
                className={dashboardDesign.logoImg}
              />
            </div>

            <div className={dashboardDesign.brand}>
              <div>ARRANT</div>
              <div>DYNAMICS</div>
            </div>
          </div>
          <div className={dashboardDesign.center}>
            <div className={dashboardDesign.title}>STERI Clean Air</div>
            <div className={dashboardDesign.subtitle}>HVAC Matrix Platform</div>
          </div>


          <div className={dashboardDesign.right}>
          <Link to="/">
            <button type="button" className={dashboardDesign.logout}>
            <FiLogOut className="text-[18px]" />
              {/* <span className="text-xl">⇦</span> */}
              Logout
            </button>
            </Link>
          </div>
          
        </div>
      </header>

      <main className={dashboardDesign.main}>
        <div className={dashboardDesign.mainInner}>
          <div className={dashboardDesign.card}>
            <h1 className={dashboardDesign.welcome}>Welcome, {userName}!</h1>

            <p className={dashboardDesign.welcomeSub}>
              Ready to create your next cleanroom HVAC project?
            </p>

            <div className={dashboardDesign.buttonRow}>
              <Link
                to="/customer"
                className={dashboardDesign.primaryButton}
              >
                <span className={dashboardDesign.plus}>+</span>
                Create New Project
              </Link>
            </div>

            <p className={dashboardDesign.footerNote}>
              Lets build something great together
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
