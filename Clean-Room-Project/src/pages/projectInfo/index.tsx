import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
	updateField,
	updateMultipleFields,
} from "../../redux/slices/projectInfoSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles";
import {
	projectInfo,
	getProjectByCustomerId,
} from "../../backend/controller/controller";

function ProjectInfoPage() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	// customerId from customerSlice
	const customerId = useAppSelector((s: any) => s.customer.customerId);
	const customerName = useAppSelector((s: any) => s.customer.customerName);

	// projectId from Redux
	const projectIdFromRedux = useAppSelector(
		(s: any) => s.projectInfo.projectId
	);

	const projectName = useAppSelector((s: any) => s.projectInfo.projectName);
	const unitBranch = useAppSelector((s: any) => s.projectInfo.unitBranch);
	const handling = useAppSelector((s: any) => s.projectInfo.handling);
	const industry = useAppSelector((s: any) => s.projectInfo.industry);
	const uniqueId = useAppSelector((s: any) => s.projectInfo.uniqueId);
	const locationQuery = useAppSelector((s: any) => s.projectInfo.locationQuery);
	const selectedLocation = useAppSelector(
		(s: any) => s.projectInfo.selectedLocation
	);
	const minTemp = useAppSelector((s: any) => s.projectInfo.minTemp);
	const maxTemp = useAppSelector((s: any) => s.projectInfo.maxTemp);
	const relativeHumidityMin = useAppSelector(
		(s: any) => s.projectInfo.relativeHumidityMin
	);
	const relativeHumidityMax = useAppSelector(
		(s: any) => s.projectInfo.relativeHumidityMax
	);

	const [locationResults, setLocationResults] = useState<any[]>([]);
	const [showResults, setShowResults] = useState(false);
	const [industryOpen, setIndustryOpen] = useState(false);
	const [handlingOpen, setHandlingOpen] = useState(false);
	const industryRef = useRef<HTMLDivElement>(null);
	const handlingRef = useRef<HTMLDivElement>(null);

	const industryOptions = [
		"Pharmaceuticals & Biotechnology",
		"Tissue Culture Laboratory",
		"Chemical & Petrochemical",
	];

	const handlingOptions = [
		"Contagious",
		"Non-Contagious",
		"Hazardous",
		"Non-Hazardous",
		"Flammable Vapors",
	];

	const [errors, setErrors] = useState({
		branch: "",
		project: "",
		handling: "",
		industry: "",
	});

	const isFormValid = (() => {
		if (!unitBranch || errors.branch) return false;
		if (!projectName || errors.project) return false;
		if (!selectedLocation && !locationQuery) return false;
		return true;
	})();

	const validateBranch = (branch: string) =>
		/^[A-Za-z0-9\s]{1,20}$/.test(branch)
			? ""
			: "Branch must be 1–20 characters";
	const validateProject = (project: string) =>
		/^[A-Za-z-_0-9\s]{1,20}$/.test(project)
			? ""
			: "Project Name must be 1–20 characters";

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				industryRef.current &&
				!industryRef.current.contains(e.target as Node)
			)
				setIndustryOpen(false);
			if (
				handlingRef.current &&
				!handlingRef.current.contains(e.target as Node)
			)
				setHandlingOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// GET
	useEffect(() => {
		if (!customerId) return;
		if (projectIdFromRedux) return; // already loaded
		const fetchProject = async () => {
			try {
				const data = await getProjectByCustomerId(customerId);
				const p = data?.project;
				if (p) {
					dispatch(
						updateMultipleFields({
							projectId: p.project_id,
							projectName: p.project_name || "",
							unitBranch: p.project_unit_branch || "",
							industry: p.project_Industry
								? JSON.parse(p.project_Industry)
								: [],
							handling: p.project_Handling
								? JSON.parse(p.project_Handling)
								: [],
							locationQuery: p.project_Location || "",
							selectedLocation: p.project_Location
								? { display_name: p.project_Location }
								: null,
							minTemp: p.project_min_temp ? String(p.project_min_temp) : "",
							maxTemp: p.project_max_temp ? String(p.project_max_temp) : "",
							relativeHumidityMin: p.project_relative_min_humid
								? String(p.project_relative_min_humid)
								: "",
							relativeHumidityMax: p.project_relative_max_humid
								? String(p.project_relative_max_humid)
								: "",
						})
					);
					console.log("Project pre-filled from DB:", p.project_id);
				}
			} catch (error) {
				console.error("Failed to fetch project:", error);
			}
		};
		fetchProject();
	}, [customerId, projectIdFromRedux]);

	const generateUniqueId = (name: string, project: string) => {
		if (!name || !project) return "";
		const slug = (text: string) =>
			text
				.toUpperCase()
				.trim()
				.replace(/\s+/g, "-")
				.replace(/[^A-Z0-9-]/g, "")
				.substring(0, 5);
		const today = new Date();
		const day = String(today.getDate()).padStart(2, "0");
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = String(today.getFullYear()).slice(-2);
		return `${slug(name)}-${slug(project)}-${day}${month}${year}`;
	};

	useEffect(() => {
		const id = generateUniqueId(customerName, projectName);
		dispatch(updateField({ field: "uniqueId", value: id }));
	}, [customerName, projectName, dispatch]);

	const searchLocation = async (query: string) => {
		if (!query.trim()) return;
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					query
				)}&limit=3`
			);
			const data = await res.json();
			setLocationResults(data);
			setShowResults(true);
		} catch (err) {
			console.error("Location search failed", err);
		}
	};

	useEffect(() => {
		if (locationQuery.length < 4) {
			setShowResults(false);
			return;
		}
		const delayDebounce = setTimeout(() => searchLocation(locationQuery), 200);
		return () => clearTimeout(delayDebounce);
	}, [locationQuery]);

	const handleSelectLocation = async (place: any) => {
		const lat = parseFloat(place.lat);
		const lng = parseFloat(place.lon);
		dispatch(
			updateMultipleFields({
				selectedLocation: place,
				locationQuery: place.display_name,
			})
		);
		setShowResults(false);
		try {
			const endDate = new Date();
			const startDate = new Date(1940, 0, 1);
			const response = await fetch(
				`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${
					startDate.toISOString().split("T")[0]
				}&end_date=${
					endDate.toISOString().split("T")[0]
				}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min&timezone=auto`
			);
			const data = await response.json();
			if (data?.daily) {
				const maxTemps = data.daily.temperature_2m_max.filter(
					(t: any) => t !== null && !isNaN(t)
				);
				const minTemps = data.daily.temperature_2m_min.filter(
					(t: any) => t !== null && !isNaN(t)
				);
				const humMax = data.daily.relative_humidity_2m_max?.filter(
					(t: any) => t !== null && !isNaN(t)
				);
				const humMin = data.daily.relative_humidity_2m_min?.filter(
					(t: any) => t !== null && !isNaN(t)
				);
				dispatch(
					updateMultipleFields({
						maxTemp: Math.max(...maxTemps).toFixed(1),
						minTemp: Math.min(...minTemps).toFixed(1),
						relativeHumidityMax: Math.max(...humMax).toFixed(0),
						relativeHumidityMin: Math.min(...humMin).toFixed(0),
					})
				);
			}
		} catch (error) {
			console.error("Failed to fetch temperature data", error);
		}
	};

	const saveProjectInfo = async () => {
		// SKIP POST — project already saved in DB
		// User pressed Back from StandardPage — navigate forward without re-inserting
		if (projectIdFromRedux) {
			console.log(
				"Project already saved, skipping POST. ProjectId:",
				projectIdFromRedux
			);
			navigate("/standards", {
				state: {
					minimumTemp: minTemp,
					maximumTemp: maxTemp,
					minRelativeHumidity: relativeHumidityMin,
					maxRelativeHumidity: relativeHumidityMax,
					projectId: projectIdFromRedux,
				},
			});
			return;
		}

		// POST
		const payload = {
			customer_id: customerId,
			projectName,
			unitBranch,
			handling,
			industry,
			uniqueId,
			selectedLocation,
			minTemp,
			maxTemp,
			relativeHumidityMin,
			relativeHumidityMax,
		};
		try {
			const data = await projectInfo(payload);
			console.log("Project saved:", data);
			if (data) {
				dispatch(updateField({ field: "projectId", value: data.projectId }));
				navigate("/standards", {
					state: {
						minimumTemp: minTemp,
						maximumTemp: maxTemp,
						minRelativeHumidity: relativeHumidityMin,
						maxRelativeHumidity: relativeHumidityMax,
						projectId: data.projectId,
					},
				});
			}
		} catch (error) {
			console.error((error as Error).message);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.top}>
				<h1 className={styles.title}>Project Information</h1>
				<h3 className={styles.headerText}>
					Please provide your project details to continue
				</h3>
			</div>

			<div className={styles.card}>
				<div className={styles.cardTitle}>Project Information</div>
				<hr className={styles.divider} />

				<div className={styles.rowGroup}>
					<div className={styles.fieldGroup + " w-full"}>
						<label className={styles.label}>
							Unit/Branch <span className="text-red-600">*</span>
						</label>
						<input
							className={styles.input}
							value={unitBranch}
							onChange={(e) => {
								dispatch(
									updateField({ field: "unitBranch", value: e.target.value })
								);
								setErrors((p) => ({
									...p,
									branch: validateBranch(e.target.value),
								}));
							}}
							placeholder="Enter Unit or Branch Name"
							maxLength={20}
						/>
						{errors.branch && unitBranch.length !== 0 && (
							<p className="text-red-500 text-xs mt-1">{errors.branch}</p>
						)}
					</div>

					<div className={styles.fieldGroup + " w-full"}>
						<label className={styles.label}>
							Project Name <span className="text-red-600">*</span>
						</label>
						<input
							className={styles.input}
							value={projectName}
							onChange={(e) => {
								dispatch(
									updateField({ field: "projectName", value: e.target.value })
								);
								setErrors((p) => ({
									...p,
									project: validateProject(e.target.value),
								}));
							}}
							placeholder="Enter Project Name"
							maxLength={20}
						/>
						{errors.project && projectName.length !== 0 && (
							<p className="text-red-500 text-xs mt-1">{errors.project}</p>
						)}
					</div>
				</div>

				<div className={styles.rowGroup}>
					<div
						ref={industryRef}
						className={styles.fieldGroup + " w-full relative"}
					>
						<label className={styles.label}>Industry / Sector</label>
						<div
							onClick={() => setIndustryOpen(!industryOpen)}
							className={`${styles.input} cursor-pointer flex items-center gap-2`}
						>
							<span className="flex-1 truncate whitespace-nowrap">
								{industry.length > 0
									? `${industry.length} selected`
									: "Select Industry"}
							</span>
							<span className={styles.dropdownIcon}>▼</span>
						</div>
						{industryOpen && (
							<div className={styles.industryOpen}>
								<div className={styles.selectIndustry}>Select Industry</div>
								{industryOptions.map((item) => (
									<label key={item} className={styles.industryOptions}>
										<input
											type="checkbox"
											checked={industry.includes(item)}
											onChange={() => {
												const updated = industry.includes(item)
													? industry.filter((i: string) => i !== item)
													: [...industry, item];
												dispatch(
													updateField({ field: "industry", value: updated })
												);
											}}
											className={styles.industryCheckbox}
										/>
										<span className="text-sm break-words">{item}</span>
									</label>
								))}
							</div>
						)}
					</div>

					<div
						ref={handlingRef}
						className={styles.fieldGroup + " w-full relative"}
					>
						<label className={styles.label}>Handling</label>
						<div
							onClick={() => setHandlingOpen(!handlingOpen)}
							className={`${styles.input} cursor-pointer flex items-center gap-2`}
						>
							<span className="flex-1 truncate whitespace-nowrap">
								{handling.length > 0
									? `${handling.length} selected`
									: "Select Handling"}
							</span>
							<span className="text-gray-400 text-xs">▼</span>
						</div>
						{handlingOpen && (
							<div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl max-h-64 overflow-y-auto">
								<div className="px-4 py-3 font-semibold border-b">
									Select Handling
								</div>
								{handlingOptions.map((item) => (
									<label
										key={item}
										className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
									>
										<input
											type="checkbox"
											checked={handling.includes(item)}
											onChange={() => {
												const updated = handling.includes(item)
													? handling.filter((i: string) => i !== item)
													: [...handling, item];
												dispatch(
													updateField({ field: "handling", value: updated })
												);
											}}
											className="h-5 w-5 shrink-0 rounded-md border-gray-300 text-blue-600"
										/>
										<span className="text-sm break-words">{item}</span>
									</label>
								))}
							</div>
						)}
					</div>
				</div>

				<div className={styles.fieldGroup}>
					<label className={styles.label}>
						Location Selection <span className="text-red-600">*</span>
					</label>
					<div className={styles.inputWrapper}>
						<FaLocationDot className={styles.clearButton} />
						<input
							type="text"
							className={styles.inputborder}
							placeholder="Search Location"
							value={locationQuery}
							onChange={(e) =>
								dispatch(
									updateField({ field: "locationQuery", value: e.target.value })
								)
							}
						/>
						{locationQuery && (
							<button
								type="button"
								onClick={() =>
									dispatch(updateField({ field: "locationQuery", value: "" }))
								}
								className={styles.locationClear}
							>
								<FaXmark className={styles.locationClearIcon} />
							</button>
						)}
					</div>

					{showResults && (
						<div>
							{locationResults.map((place: any) => (
								<div
									key={place.place_id}
									onClick={() => handleSelectLocation(place)}
								>
									<div className={styles.locationResultText}>
										<span className={styles.locationText}>
											Selected Location:
										</span>
										<br />
										<span className={styles.selectedLocation}>
											{place.display_name}
										</span>
										<br />
										<span className="text-[10px]">
											<span className={styles.coordinates}>Latitude: </span>
											{place.lat}
										</span>
										<span className={styles.coordinatesText}>
											<span className={styles.coordinates}>Longitude:</span>
											{place.lon}
										</span>
									</div>
								</div>
							))}
						</div>
					)}

					<label className={styles.label}>Unique ID (Auto-Generated)</label>
					<input
						className={styles.disabledInput}
						value={uniqueId}
						placeholder="Auto Generated ID"
						disabled
					/>
				</div>

				{minTemp && maxTemp && (
					<div className={styles.rowGroup}>
						<div className={styles.fieldGroup + " w-full"}>
							<label className={styles.label}>Minimum Temperature (°C)</label>
							<input
								className={styles.disabledInput}
								value={`${minTemp} °C`}
								disabled
							/>
						</div>
						<div className={styles.fieldGroup + " w-full"}>
							<label className={styles.label}>Maximum Temperature (°C)</label>
							<input
								className={styles.disabledInput}
								value={`${maxTemp} °C`}
								disabled
							/>
						</div>
						<div className={styles.fieldGroup + " w-full mt-5"}>
							<label className={styles.label}>Relative Humidity Min</label>
							<input
								className={styles.disabledInput}
								value={`${relativeHumidityMin}`}
								disabled
							/>
						</div>
						<div className={styles.fieldGroup + " w-full mt-5"}>
							<label className={styles.label}>Relative Humidity Max</label>
							<input
								className={styles.disabledInput}
								value={`${relativeHumidityMax}`}
								disabled
							/>
						</div>
					</div>
				)}
			</div>

			<div className={styles.footer}>
				<Link to="/dashboard" className={styles.backLink}>
					<FaArrowLeft /> Back
				</Link>
				<button
					className={`${styles.nextLink} ${
						!isFormValid ? styles.disabled : ""
					}`}
					onClick={() => {
						if (!isFormValid) {
							alert(
								"Please fill all required fields correctly before proceeding."
							);
						} else {
							saveProjectInfo();
						}
					}}
				>
					Next Step <FaArrowRight />
				</button>
			</div>
		</div>
	);
}

export default ProjectInfoPage;
