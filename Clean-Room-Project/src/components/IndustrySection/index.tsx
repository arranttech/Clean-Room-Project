import industryDesign from "./industryDesign";
import {
	MdLocalPharmacy,
	MdOutlineBiotech,
	MdOutlineHealthAndSafety,
	MdOutlineFoodBank,
} from "react-icons/md";
import { SiNordicsemiconductor } from "react-icons/si";
import { GiChemicalDrop } from "react-icons/gi";
import text from "../../json/constants.json";

const INDUSTRIES = [
	{
		title: "Pharmaceutical",
		desc: "GMP-compliant cleanroom solutions for drug manufacturing facilities.",
		icon: <MdLocalPharmacy className="w-7 h-7" />,
		bgColor: "bg-[#2563EB]",
	},
	{
		title: "Semiconductor",
		desc: "Ultra-clean environments for chip fabrication and electronics production.",
		icon: <SiNordicsemiconductor className="w-7 h-7" />,
		bgColor: "bg-[#A855F7]",
	},
	{
		title: "Biotechnology",
		desc: "Controlled environments for life sciences and research laboratories.",
		icon: <MdOutlineBiotech className="w-7 h-7" />,
		bgColor: "bg-[#84CC16]",
	},
	{
		title: "Chemical",
		desc: "Safe and efficient HVAC systems for chemical processing facilities.",
		icon: <GiChemicalDrop className="w-7 h-7" />,
		bgColor: "bg-[#FF6B00]",
	},
	{
		title: "Healthcare",
		desc: "Hospital-grade air quality systems for medical facilities and operating rooms.",
		icon: <MdOutlineHealthAndSafety className="w-7 h-7" />,
		bgColor: "bg-[#EF4444]",
	},
	{
		title: "Food and Beverages",
		desc: "Hygienic air systems for food processing and packaging facilities.",
		icon: <MdOutlineFoodBank className="w-7 h-7" />,
		bgColor: "bg-[#EAB308]",
	},
];

export default function IndustrySec() {
	const { industry } = text;
	return (
		<section id="industries" className={industryDesign.section}>
			<div className={industryDesign.container}>
				<div className={industryDesign.headerWrapper}>
					<h2 className={industryDesign.title}>{industry.title}</h2>
					<p className={industryDesign.subtitle}>{industry.subtitle}</p>
				</div>

				<div className={industryDesign.grid}>
					{INDUSTRIES.map((item, index) => (
						<div key={index} className={industryDesign.card}>
							<div className={`${industryDesign.iconWrapper} ${item.bgColor}`}>
								{item.icon}
							</div>
							<h3 className={industryDesign.cardTitle}>{item.title}</h3>
							<p className={industryDesign.cardDesc}>{item.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
