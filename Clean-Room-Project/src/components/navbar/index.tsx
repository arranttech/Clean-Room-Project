import { useState } from "react";
import { Link } from "react-router-dom";
import S from "./styles";
import text from "../../json/constants.json";

export default function Navbar() {
	const { navbar } = text;
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className={S.header}>
			<div className={S.container}>
				<div className={S.row}>
					<div className={S.left}>
						<div className={S.logoWrap}>
							<img src="/Arrant.jpeg" alt="Arrant Logo" className={S.logoImg} />
						</div>

						<div className={S.brandBlock}>
							<span className={S.brandText}>{navbar.brand.line1}</span>
							<span className={S.brandText}>{navbar.brand.line2}</span>
						</div>
						<span className={S.leftDivider} />
						<span className={S.title}>{navbar.title}</span>
					</div>
					<nav className={S.center}>
						{navbar.links.map((item) => (
							<a key={item.label} href={item.href} className={S.navLink}>
								{item.label}
							</a>
						))}
					</nav>
					<div className={S.right}>
						{/* <Link to="/admin" className={S.admin}>Admin</Link> */}
						{/* <span className={S.divider}>|</span> */}
						<Link to="/login" className={S.admin}>
							{navbar.signIn.label}
						</Link>

						{/* Hamburger — mobile only */}
						<button
							className={S.hamburger}
							onClick={() => setMenuOpen((o) => !o)}
							aria-label="Toggle menu"
						>
							<span
								className={S.hamburgerBar}
								style={
									menuOpen ? { transform: "translateY(7px) rotate(45deg)" } : {}
								}
							/>
							<span
								className={S.hamburgerBar}
								style={menuOpen ? { opacity: 0 } : {}}
							/>
							<span
								className={S.hamburgerBar}
								style={
									menuOpen
										? { transform: "translateY(-7px) rotate(-45deg)" }
										: {}
								}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* ── MOBILE DRAWER ── */}
			{menuOpen && (
				<div className={S.mobileMenu}>
					{navbar.links.map((item) => (
						<a
							key={item.label}
							href={item.href}
							className={S.mobileLink}
							onClick={() => setMenuOpen(false)}
						>
							{item.label}
						</a>
					))}
					<Link
						to="/login"
						className={S.mobileSignIn}
						onClick={() => setMenuOpen(false)}
					>
						{navbar.signIn.label}
					</Link>
				</div>
			)}
		</header>
	);
}
