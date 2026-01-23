import {
	MdLocalPharmacy,
	MdOutlineBiotech,
	MdOutlineHealthAndSafety,
	MdOutlineFoodBank,
} from "react-icons/md";
import { SiNordicsemiconductor } from "react-icons/si";
import { GiChemicalDrop } from "react-icons/gi";

const INDUSTRIES = [
	{
		title: "Pharmaceutical",
		desc: "GMP-compliant cleanroom solutions for drug manufacturing facilities.",
		icon: <MdLocalPharmacy className="w-7 h-7" />,
		bgColor: "bg-[#2563EB]", // Blue
	},
	{
		title: "Semiconductor",
		desc: "Ultra-clean environments for chip fabrication and electronics production.",
		icon: <SiNordicsemiconductor className="w-7 h-7" />,
		bgColor: "bg-[#A855F7]", // Purple
	},
	{
		title: "Biotechnology",
		desc: "Controlled environments for life sciences and research laboratories.",
		icon: <MdOutlineBiotech className="w-7 h-7" />,
		bgColor: "bg-[#84CC16]", // Lime
	},
	{
		title: "Chemical",
		desc: "Safe and efficient HVAC systems for chemical processing facilities.",
		icon: <GiChemicalDrop className="w-7 h-7" />,
		bgColor: "bg-[#FF6B00]", // Orange
	},
	{
		title: "Healthcare",
		desc: "Hospital-grade air quality systems for medical facilities and operating rooms.",
		icon: <MdOutlineHealthAndSafety className="w-7 h-7" />,
		bgColor: "bg-[#EF4444]", // Red
	},
	{
		title: "Food and Beverages",
		desc: "Hygienic air systems for food processing and packaging facilities.",
		icon: <MdOutlineFoodBank className="w-7 h-7" />,
		bgColor: "bg-[#EAB308]", // Yellow/Gold
	},
];

export default function IndustrySec() {
	return (
		<section className="w-full py-20 px-6">
			<div className="mx-auto max-w-[1200px]">
				<div className="text-center mb-16">
					<h2 className="text-[40px] font-extrabold tracking-tight text-[#111827] sm:text-[42px]">
						Industries We Serve
					</h2>
					<p className="mt-4 text-[18px] leading-relaxed text-[#4B5563] md:text-[20px] max-w-[800px] mx-auto">
						Tailored solutions for critical environments across multiple
						sectors.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{INDUSTRIES.map((item, index) => (
						<div
							key={index}
							className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
						>
							<div
								className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.bgColor}`}
							>
								{item.icon}
							</div>
							<h3 className="text-[20px] font-bold text-[#111827]">
								{item.title}
							</h3>
							<p className="mt-3 text-[16px] leading-relaxed text-[#4B5563]">
								{item.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
