import powerfulDesign from "./powerfulDesign";
import { PiBatteryChargingFill } from "react-icons/pi";
import { BiSolidBookmarkStar } from "react-icons/bi";
import { SiGoogleanalytics, SiWebcomponentsdotorg } from "react-icons/si";
import { MdArchitecture } from "react-icons/md";
import { FaCloud } from "react-icons/fa6";
import text from "../../json/constants.json";

const FEATURES = [
	{
		title: "Real-Time Calculations",
		desc: "Instant HVAC load calculations with advanced algorithms for precise cleanroom design.",
		icon: <PiBatteryChargingFill className="w-7 h-7" />,
	},
	{
		title: "Compliance Ready",
		desc: "Built-in compliance checks for ISO, FDA, and global regulatory standards.",
		icon: <BiSolidBookmarkStar className="w-7 h-7" />,
	},
	{
		title: "Advanced Analytics",
		desc: "Comprehensive data visualization and reporting tools for informed decision-making.",
		icon: <SiGoogleanalytics className="w-7 h-7" />,
	},
	{
		title: "Modular Design",
		desc: "Flexible Architecture that scales with your facility requirements.",
		icon: <MdArchitecture className="w-7 h-7" />,
	},
	{
		title: "Cloud - Based",
		desc: "Access your projects anywhere with secure cloud storage and collaboration.",
		icon: <FaCloud className="w-7 h-7" />,
	},
	{
		title: "Enterprise Security",
		desc: "Bank-level encryption and security protocols to protect your sensitive data.",
		icon: <SiWebcomponentsdotorg className="w-7 h-7" />,
	},
];

export default function Powerful() {
	const { powerful } = text;
	return (
		<section id="features" className={powerfulDesign.section}>
			<div className={powerfulDesign.container}>
				<div className={powerfulDesign.headerWrapper}>
					<h2 className={powerfulDesign.title}>{powerful.title}</h2>
					<p className={powerfulDesign.subtitle}>{powerful.subtitle}</p>
				</div>

				<div className={powerfulDesign.grid}>
					{FEATURES.map((feature, index) => (
						<div key={index} className={powerfulDesign.card}>
							<div className={powerfulDesign.iconWrapper}>{feature.icon}</div>
							<h3 className={powerfulDesign.cardTitle}>{feature.title}</h3>
							<p className={powerfulDesign.cardDesc}>{feature.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
