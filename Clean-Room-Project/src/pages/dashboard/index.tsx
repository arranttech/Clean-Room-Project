import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCustomer } from "../../redux/slices/customerSlice";
import { getCustomerInfo } from "../../backend/controller/customerController";
import { handleLogout } from "../../utils/logout";
import { FiLogOut } from "react-icons/fi";
import {
	FaFolderOpen,
	FaPlus,
	FaBuilding,
	FaLayerGroup,
	FaCalculator,
	FaCheck,
	FaArrowRight,
	FaExclamationCircle,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import s from "./styles";
import text from "../../json/dashboard.json";

type Project = {
	id: string;
	name: string;
	createdAt: string;
	customer: string;
	location: string;
	classification: string;
	totalRooms: number;
};

const demoProjects: Project[] = [
	{
		id: "PRJ-1001",
		name: "Clean Room Facility - Phase 1",
		createdAt: "2026-01-14",
		customer: "Acme Pharma",
		location: "Austin, TX, US",
		classification: "ISO Class 7",
		totalRooms: 8,
	},
	{
		id: "PRJ-1002",
		name: "R and D Lab Retrofit",
		createdAt: "2026-01-22",
		customer: "Nova Biotech",
		location: "Pune, MH, IN",
		classification: "ISO Class 8",
		totalRooms: 5,
	},
	{
		id: "PRJ-1003",
		name: "Sterile Suite Expansion",
		createdAt: "2026-01-29",
		customer: "Zenith Med",
		location: "Dublin, IE",
		classification: "ISO Class 7",
		totalRooms: 11,
	},
];

function tmpl(str: string, vars: Record<string, string | number>) {
	return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

export default function Dashboard() {
	const [projects] = useState<Project[]>(demoProjects);
	const [showProfileAlert, setShowProfileAlert] = useState(false);

	const customerId = useAppSelector((state: any) => state.customer.customerId);
	const customerName = useAppSelector(
		(state: any) => state.customer.customerName
	);

	const userName = useMemo(() => {
		try {
			const raw = localStorage.getItem("user");
			if (!raw) return "User";
			const user = JSON.parse(raw) as { name?: string };
			if (user.name) return user.name.split(" ")[0];
			return "User";
		} catch {
			return "User";
		}
	}, []);

	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const counts = { total: projects.length };

	// useEffect 0 — load customer info by user_login_id from localStorage
	useEffect(() => {
		const loadCustomer = async () => {
			try {
				const raw = localStorage.getItem("user");
				if (!raw) {
					console.log("no user found in localstorage");
					return;
				}
				const user = JSON.parse(raw);
				console.log("user_login_id:", user?.user_login_id);
				const result = await getCustomerInfo(user?.user_login_id);
				console.log("Customer info result:", result);
				if (result.success) {
					const c = result.customer;
					dispatch(
						setCustomer({
							customerId: c.customer_id,
							customerName: c.customer_name || "",
							phoneNumber: c.customer_phone || "",
							customerAddress: c.customer_address || "",
							emailAddress: c.customer_email_id || "",
							additionalNotes: c.customers_addional_notes || "",
						})
					);
				}
			} catch (error) {
				console.error(
					"Failed to load customer info:",
					(error as Error).message
				);
			}
		};
		loadCustomer();
	}, [dispatch]);
	const features = text.dashboard.features;

	const onLogout = () => {
		handleLogout(dispatch);
		navigate("/");
	};

	return (
		<div className={s.page}>
			<header className={s.header}>
				<div className={s.headerInner}>
					<div className={s.left}>
						<div className={s.logoTile}>
							<img
								src="/Arrant.jpeg"
								alt="Arrant Dynamics"
								className={s.logoImg}
							/>
						</div>
						<div className={s.brand}>
							<div>ARRANT</div>
							<div>DYNAMICS</div>
						</div>
					</div>
					<div className={s.center}>
						<div className={s.title1}>STERI Clean Air</div>
						<div className={s.subtitle1}>HVAC Matrix Platform</div>
					</div>
					<div className={s.right}>
						{customerName && (
							<div className="text-sm text-white mr-4 hidden sm:block">
								<span className="opacity-70">Customer: </span>
								<span className="font-semibold">{customerName}</span>
							</div>
						)}
						<button type="button" className={s.logout} onClick={onLogout}>
							<FiLogOut className="text-[18px]" />
							Logout
						</button>
					</div>
				</div>
			</header>

			<div className={s.contentWrap}>
				<div className={s.container}>
					<div className={s.headerWrap}>
						<div className={s.title2}>
							{tmpl(text.dashboard.welcomeTitle, { name: userName })}
						</div>
						<div className={s.subtitle2}>{text.dashboard.welcomeSubtitle}</div>
					</div>

					<div className={s.metricsRow}>
						<div className={s.metricCard}>
							<div className={s.metricIconWrap}>
								<FaFolderOpen className="text-blue-700 text-2xl" />
							</div>
							<div>
								<div className={s.metricNumber}>{counts.total}</div>
								<div className={s.metricLabel}>
									{text.dashboard.metric.totalProjects}
								</div>
							</div>
						</div>
					</div>

					<div className={s.sectionCard}>
						<div className={s.cardHeader}>
							<div className={s.sectionTitle}>
								{text.dashboard.projectsTitle}
							</div>
							<div className={s.pendingProjects}>
								{text.dashboard.pendingProjects}
							</div>
						</div>
						<div className={s.cardWrap}>
							<div>
								<div className={s.projectTitle}>
									{text.dashboard.progress.projectTitle}
								</div>
								<div className={s.projectCustomer}>
									<span>Customer: </span>
									{text.dashboard.progress.Customer}
								</div>
								<div className={s.cardStyle}>
									<div className={s.projectPendingStage}>
										{text.dashboard.progress.pendingStage}
									</div>
									<div className={s.projectPendingPage}>
										<span>On:</span> {text.dashboard.progress.pendingPage}
									</div>
									<div className={s.projectModifiedDate}>
										<span>Last Modified:</span>{" "}
										{text.dashboard.progress.modifiedDate}
									</div>
								</div>
							</div>
							<div className={s.buttonStyle}>
								<Link to="/projects" className={s.viewAllButton}>
									{text.dashboard.progress.buttonText} <FaArrowRight />
								</Link>
							</div>
						</div>
					</div>

					<div className={s.sectionCard}>
						<div className={s.sectionTitle}>
							{text.dashboard.quickActionsTitle}
						</div>
						<div className={s.quickGrid}>
							{/* Create New Project — checks customerId */}
							<button
								type="button"
								onClick={() => {
									if (!customerId) {
										setShowProfileAlert(true);
									} else {
										navigate("/project-info");
									}
								}}
								className={`${s.actionCardBase} ${s.actionCardHover} text-left`}
							>
								<div className={`${s.actionIconWrap} bg-blue-700`}>
									<FaPlus className="text-white text-2xl" />
								</div>
								<div>
									<div className={s.actionTitle}>
										{text.dashboard.actions.createTitle}
									</div>
									<div className={s.actionDesc}>
										{text.dashboard.actions.createDesc}
									</div>
									<div className={s.actionHint}>
										{text.dashboard.actions.createHint}
									</div>
								</div>
							</button>

							<Link
								to="/projects"
								className={`${s.actionCardBase} ${s.actionCardHover}`}
							>
								<div className={`${s.actionIconWrap} bg-blue-100`}>
									<FaFolderOpen className="text-blue-700 text-2xl" />
								</div>
								<div>
									<div className={s.actionTitle}>
										{text.dashboard.actions.viewTitle}
									</div>
									<div className={s.actionDesc}>
										{text.dashboard.actions.viewDesc}
									</div>
									<div className={s.actionHint}>
										{text.dashboard.actions.viewHint}
									</div>
								</div>
							</Link>

							{/* Customer Info — no from flag, save → back to dashboard */}
							<Link
								to="/customer-info"
								className={`${s.actionCardBase} ${s.actionCardHover}`}
							>
								<div className={`${s.actionIconWrap} bg-slate-100`}>
									<MdApartment className="text-blue-700 text-2xl" />
								</div>
								<div>
									<div className={s.actionTitle}>
										{text.dashboard.actions.customerTitle}
									</div>
									<div className={s.actionDesc}>
										{text.dashboard.actions.customerDesc}
									</div>
									<div className={s.actionHint}>
										{customerId
											? "✓ Profile saved"
											: text.dashboard.actions.customerHint}
									</div>
								</div>
							</Link>
						</div>
					</div>

					<div className={s.featuresCard}>
						<div className={s.featuresTitle}>
							{text.dashboard.featuresTitle}
						</div>
						<div className={s.featuresGrid}>
							<div className={s.featureItem}>
								<div className={s.featureIconWrap}>
									<FaBuilding className="text-blue-700 text-2xl" />
								</div>
								<div className={s.featureTitle}>{features[0].title}</div>
								<div className={s.featureDesc}>{features[0].desc}</div>
								<div className={s.featureList}>
									{features[0].bullets.map((b: string, i: number) => (
										<div key={i} className={s.featureBullet}>
											<FaCheck className="mt-1 text-black-700" />
											<div>{b}</div>
										</div>
									))}
								</div>
							</div>
							<div className={s.featureItem}>
								<div className={s.featureIconWrap}>
									<FaLayerGroup className="text-blue-700 text-2xl" />
								</div>
								<div className={s.featureTitle}>{features[1].title}</div>
								<div className={s.featureDesc}>{features[1].desc}</div>
								<div className={s.featureList}>
									{features[1].bullets.map((b: string, i: number) => (
										<div key={i} className={s.featureBullet}>
											<FaCheck className="mt-1 text-black-700" />
											<div>{b}</div>
										</div>
									))}
								</div>
							</div>
							<div className={s.featureItem}>
								<div className={s.featureIconWrap}>
									<FaCalculator className="text-blue-700 text-2xl" />
								</div>
								<div className={s.featureTitle}>{features[2].title}</div>
								<div className={s.featureDesc}>{features[2].desc}</div>
								<div className={s.featureList}>
									{features[2].bullets.map((b: string, i: number) => (
										<div key={i} className={s.featureBullet}>
											<FaCheck className="mt-1 text-black-600" />
											<div>{b}</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/*  Customer Profile Required Popup */}
			{showProfileAlert && (
				<div className={s.popupOverlay}>
					<div
						className={s.popupBackdrop}
						onClick={() => setShowProfileAlert(false)}
					/>
					<div className={s.popupCard}>
						<div className={s.popupHeader}>
							<div className={s.popupIconWrap}>
								<FaExclamationCircle className={s.popupIcon} />
							</div>
							<h2 className={s.popupTitle}>Customer Profile Required</h2>
						</div>
						<p className={s.popupDesc}>
							Before creating a project, you need to set up your customer
							profile first. This is a one-time setup that will be used for all
							your projects.
						</p>
						<div className={s.popupInfoBox}>
							<p className={s.popupInfoTitle}>Required Information:</p>
							<ul className={s.popupInfoList}>
								<li className={s.popupInfoItem}>* Customer Name</li>
								<li className={s.popupInfoItem}>* Customer Address</li>
								<li className={s.popupInfoItem}>
									* Contact Details (Optional)
								</li>
							</ul>
						</div>
						<div className={s.popupFooter}>
							<button
								type="button"
								onClick={() => setShowProfileAlert(false)}
								className={s.popupCancelBtn}
							>
								Back to Dashboard
							</button>
							<button
								type="button"
								onClick={() => {
									setShowProfileAlert(false);
									navigate("/customer-info", {
										state: { from: "create-project" },
									});
								}}
								className={s.popupConfirmBtn}
							>
								Setup Customer Profile
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
