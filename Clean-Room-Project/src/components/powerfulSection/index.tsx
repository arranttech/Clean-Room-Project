import { PiBatteryChargingFill } from "react-icons/pi";
import { BiSolidBookmarkStar } from "react-icons/bi";
import { SiGoogleanalytics, SiWebcomponentsdotorg } from "react-icons/si";
import { MdArchitecture } from "react-icons/md";
import { FaCloud } from "react-icons/fa6";

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
	return (
		<section className="w-full px-6">
			<div className="mx-auto max-w-[1200px]">
				<div className="text-center mb-16">
					<h2 className="text-[40px] font-extrabold tracking-tight text-[#111827] sm:text-[48px]">
						Powerful Features
					</h2>
					<p className="mt-4 text-[18px] leading-relaxed text-[#4B5563] md:text-[20px] max-w-[800px] mx-auto">
						Everything you need to design, calculate, and optimize cleanroom
						HVAC systems
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{FEATURES.map((feature, index) => (
						<div
							key={index}
							className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md"
						>
							<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563EB] text-white">
								{feature.icon}
							</div>
							<h3 className="text-[20px] font-bold text-[#111827]">
								{feature.title}
							</h3>
							<p className="mt-3 text-[16px] leading-relaxed text-[#4B5563]">
								{feature.desc}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
