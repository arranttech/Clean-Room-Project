import footerDesign from "./styles";
import text from "../../json/constants.json";
import { FiCheckCircle } from "react-icons/fi"; // Using Feather icons for the checkmarks

export default function Footer() {
	const { footer } = text;

	return (
		<footer id="contact" className={footerDesign.section}>
			<div className={footerDesign.container}>
				<div className={footerDesign.headerWrapper}>
					<h2 className={footerDesign.title}>{footer.titleWhite}</h2>
					<p className={footerDesign.subtitle}>{footer.title}</p>
				</div>

				<div className={footerDesign.grid}>
					{footer.footerPoints.map((point, index) => (
						<div key={index} className={footerDesign.card}>
							<div className={footerDesign.iconWrapper}>
								<FiCheckCircle size={20} />
							</div>
							<span className={footerDesign.cardTitle}>{point}</span>
						</div>
					))}
				</div>
				<div className={footerDesign.contactText}>
					{footer.contacttext}
					<a
						href={`mailto:${footer.contactlink}`}
						className={footerDesign.contactLink}
					>
						{footer.contactlink}
					</a>
				</div>
			</div>
		</footer>
	);
}
