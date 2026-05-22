import { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import {
	updateField,
	updateMultipleFields,
} from "../../redux/slices/projectInfoSlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaXmark } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./styles";
import {
	projectInfo,
	updateProjectInfo,
} from "../../backend/controller/projectController";
import { updateInProgressProject } from "../../redux/slices/dashboardSlice";
import Header from "../../components/header";
import projectData from "../../json/projectData.json";

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
	const user_id = useAppSelector((s: any) =>
		String(s.user.user_id || s.user.user_login_id)
	);
	const user_login_id = useAppSelector((s: any) => s.user.user_login_id);
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
	const [subIndustryOpen, setSubIndustryOpen] = useState(false);
	const [handlingOpen, setHandlingOpen] = useState(false);
	const [dismissedHandlingByContext, setDismissedHandlingByContext] = useState<
		Record<string, string[]>
	>({});
	const industryRef = useRef<HTMLDivElement>(null);
	const subIndustryRef = useRef<HTMLDivElement>(null);
	const handlingRef = useRef<HTMLDivElement>(null);
	const appliedHandlingRuleContextRef = useRef<string>("");
	const dismissedHandlingByContextRef = useRef<Record<string, Set<string>>>({});

	const {
		industries,
		handlingOptions,
		handlingAutoSelectionRules = [],
	} = projectData as any;

	const subIndustry = useAppSelector((s: any) => s.projectInfo.subIndustry);
	const selectedIndustryData = industries.find((i: any) => i.name === industry);
	const subIndustries = selectedIndustryData?.subIndustries || [];

	const handlingRuleContextKey = `${industry || ""}||${subIndustry || ""}`;

	const getCurrentRuleHandling = useCallback(() => {
		const matchedRule = handlingAutoSelectionRules.find(
			(rule: any) =>
				rule.industry === industry && rule.subIndustry === subIndustry
		);
		return Array.isArray(matchedRule?.handling) ? matchedRule.handling : [];
	}, [handlingAutoSelectionRules, industry, subIndustry]);

	const markHandlingDismissed = (item: string) => {
		const ruleHandling = getCurrentRuleHandling();
		if (!ruleHandling.includes(item)) return;

		if (!dismissedHandlingByContextRef.current[handlingRuleContextKey]) {
			dismissedHandlingByContextRef.current[handlingRuleContextKey] = new Set();
		}
		dismissedHandlingByContextRef.current[handlingRuleContextKey].add(item);
		setDismissedHandlingByContext((prev) => {
			const existing = prev[handlingRuleContextKey] || [];
			if (existing.includes(item)) return prev;
			return {
				...prev,
				[handlingRuleContextKey]: [...existing, item],
			};
		});
	};

	const clearHandlingDismissed = (item: string) => {
		dismissedHandlingByContextRef.current[handlingRuleContextKey]?.delete(item);
		setDismissedHandlingByContext((prev) => {
			const existing = prev[handlingRuleContextKey] || [];
			if (!existing.includes(item)) return prev;
			return {
				...prev,
				[handlingRuleContextKey]: existing.filter((v) => v !== item),
			};
		});
	};

	useEffect(() => {
		if (!industry || !subIndustry) {
			appliedHandlingRuleContextRef.current = "";
			return;
		}

		// Apply defaults once per industry/sub-industry context.
		if (appliedHandlingRuleContextRef.current === handlingRuleContextKey)
			return;
		appliedHandlingRuleContextRef.current = handlingRuleContextKey;

		const ruleHandling = getCurrentRuleHandling();
		if (ruleHandling.length === 0) return;

		const dismissedSet =
			dismissedHandlingByContextRef.current[handlingRuleContextKey] ||
			new Set();
		const suggestedHandling = ruleHandling.filter(
			(item: string) => !dismissedSet.has(item)
		);
		if (suggestedHandling.length === 0) return;

		const mergedHandling = Array.from(
			new Set([...(handling || []), ...suggestedHandling])
		);

		const isDifferent =
			mergedHandling.length !== handling.length ||
			mergedHandling.some((item) => !handling.includes(item));

		if (isDifferent) {
			dispatch(updateField({ field: "handling", value: mergedHandling }));
		}
	}, [
		industry,
		subIndustry,
		handling,
		handlingAutoSelectionRules,
		handlingRuleContextKey,
		getCurrentRuleHandling,
		dispatch,
	]);

	const [errors, setErrors] = useState({
		branch: "",
		project: "",
		handling: "",
		industry: "",
		subIndustry: "",
	});

	const isFormValid = (() => {
		if (!unitBranch || errors.branch) return false;
		if (!projectName || errors.project) return false;
		if (!selectedLocation && !locationQuery) return false;
		if (!handling.length) return false;
		if (!industry) return false;
		if (!subIndustry) return false;
		return true;
	})();

	const validateBranch = (branch: string) =>
		/^(?=.*\S).{1,120}$/.test(branch)
			? ""
			: "Branch must be more than 20 characters";

	const validateProject = (project: string) =>
		/^(?=.*\S).{1,120}$/.test(project)
			? ""
			: "Project Name must be more than 20 characters";

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				industryRef.current &&
				!industryRef.current.contains(e.target as Node)
			)
				setIndustryOpen(false);
			if (
				subIndustryRef.current &&
				!subIndustryRef.current.contains(e.target as Node)
			)
				setSubIndustryOpen(false);
			if (
				handlingRef.current &&
				!handlingRef.current.contains(e.target as Node)
			)
				setHandlingOpen(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const generateUniqueId = (name: string, project: string) => {
		if (!name || !project) return "";
		const slug = (text: string) =>
			text
				.toUpperCase()
				.trim()
				.replace(/\s+/g, "-")
				.replace(/[^A-Z0-9-]/g, "")
				.substring(0, 5);
		const now = new Date();
		const today = new Date();
		const day = String(today.getDate()).padStart(2, "0");
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = String(today.getFullYear()).slice(-2);
		const hours = String(now.getHours()).padStart(2, "0");
		const minutes = String(now.getMinutes()).padStart(2, "0");
		const seconds = String(now.getSeconds()).padStart(2, "0");
		return `${slug(name)}-${slug(project)}-${day}${month}${year}-${hours}${minutes}${seconds}`;
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

			// changed from 1940 to last 5 years only
			const startDate = new Date();
			startDate.setFullYear(endDate.getFullYear() - 5);

			const response = await fetch(
				`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${
					startDate.toISOString().split("T")[0]
				}&end_date=${
					endDate.toISOString().split("T")[0]
				}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min&timezone=auto`
			);

			// prevent 429 / bad responses
			if (!response.ok) {
				throw new Error(`API Error: ${response.status}`);
			}

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
		const payload = {
			user_id: user_id,
			user_login_id: user_login_id,
			customer_id: customerId,
			projectName,
			unitBranch,
			handling,
			industry,
			subIndustry,
			uniqueId,
			selectedLocation,
			minTemp,
			maxTemp,
			relativeHumidityMin,
			relativeHumidityMax,
		};

		const navigationState = {
			minimumTemp: minTemp,
			maximumTemp: maxTemp,
			minRelativeHumidity: relativeHumidityMin,
			maxRelativeHumidity: relativeHumidityMax,
		};

		try {
			let finalProjectId = projectIdFromRedux;

			if (projectIdFromRedux) {
				// PUT — update existing row
				await updateProjectInfo(projectIdFromRedux, payload);
				console.log("Project updated:", projectIdFromRedux);
				dispatch(
					updateInProgressProject({
						project_id: projectIdFromRedux,
						project_name: projectName,
						customer_name: customerName,
						last_modified: new Date().toISOString(),
					})
				);

				toast.success("Details updated successfully!", {
					onClose: () =>
						navigate("/standards", {
							state: { ...navigationState, projectId: finalProjectId },
						}),
					autoClose: 1500,
				});
			} else {
				// POST — create new row
				console.log("payload before sending:", payload);
				const data = await projectInfo(payload);
				console.log("Project created:", data);
				finalProjectId = data.projectId;
				dispatch(updateField({ field: "projectId", value: data.projectId }));
				dispatch(
					updateInProgressProject({
						project_id: data.projectId,
						project_name: projectName,
						customer_name: customerName,
						last_modified: new Date().toISOString(),
						has_standard: false,
						has_rooms: false,
					})
				);

				toast.success("Details saved successfully!", {
					onClose: () =>
						navigate("/standards", {
							state: { ...navigationState, projectId: finalProjectId },
						}),
					autoClose: 1500,
				});
			}
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
			console.error((error as Error).message);
		}
	};

	return (
		<>
			<Header />
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
								maxLength={120}
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
										updateField({
											field: "projectName",
											value: e.target.value,
										})
									);
									setErrors((p) => ({
										...p,
										project: validateProject(e.target.value),
									}));
								}}
								placeholder="Enter Project Name"
								maxLength={120}
							/>
							{errors.project && projectName.length !== 0 && (
								<p className="text-red-500 text-xs mt-1">{errors.project}</p>
							)}
						</div>
					</div>

					{/* Industry / Sector */}
					<div className="w-full mb-4">
						<div
							ref={industryRef}
							className={styles.fieldGroup + " w-full relative"}
						>
							<label className={styles.label}>
								Industry / Sector <span className="text-red-600">*</span>
							</label>
							<input
								className={styles.input + " cursor-pointer"}
								type="text"
								value={industry || ""}
								placeholder="Select Industry"
								readOnly
								onClick={() => setIndustryOpen(!industryOpen)}
							/>
							<span
								className={styles.dropdownIcon}
								style={{
									position: "absolute",
									right: 16,
									top: 44,
									pointerEvents: "none",
								}}
							>
								▼
							</span>
							{industryOpen && (
								<div className={styles.industryOpen}>
									<div className={styles.selectIndustry}>Select Industry</div>
									{industries.map((item: any) => (
										<div
											key={item.name}
											onClick={() => {
												dispatch(
													updateField({ field: "industry", value: item.name })
												);
												dispatch(
													updateField({ field: "subIndustry", value: "" })
												);
												dispatch(updateField({ field: "handling", value: [] }));
												setIndustryOpen(false);
											}}
											className={styles.industryOptions}
										>
											{item.name}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Sub Industry */}
					<div className="w-full mb-4">
						<div
							ref={subIndustryRef}
							className={styles.fieldGroup + " w-full relative"}
						>
							<label className={styles.label}>
								Sub Industry <span className="text-red-600">*</span>
							</label>
							<input
								className={styles.input + " cursor-pointer"}
								type="text"
								value={subIndustry || ""}
								placeholder="Select Sub Industry"
								readOnly
								onClick={() => {
									if (industry) setSubIndustryOpen(!subIndustryOpen);
								}}
							/>
							<span
								className={styles.dropdownIcon}
								style={{
									position: "absolute",
									right: 16,
									top: 44,
									pointerEvents: "none",
								}}
							>
								▼
							</span>
							{subIndustryOpen && industry && (
								<div className={styles.industryOpen}>
									<div className={styles.selectIndustry}>
										Select Industry First
									</div>
									{subIndustries.map((sub: string) => (
										<div
											key={sub}
											onClick={() => {
												const nextContextKey = `${industry || ""}||${sub}`;
												// Explicitly reselecting a sub-industry should re-apply defaults for that context.
												appliedHandlingRuleContextRef.current = "";
												delete dismissedHandlingByContextRef.current[
													nextContextKey
												];
												setDismissedHandlingByContext((prev) => {
													if (!prev[nextContextKey]) return prev;
													const next = { ...prev };
													delete next[nextContextKey];
													return next;
												});
												dispatch(
													updateField({ field: "subIndustry", value: sub })
												);
												dispatch(updateField({ field: "handling", value: [] }));
												setSubIndustryOpen(false);
											}}
											className={styles.industryOptions}
										>
											{sub}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Handling */}
					<div className="w-full mb-4">
						<div
							ref={handlingRef}
							className={styles.fieldGroup + " w-full relative"}
						>
							<label className={styles.label}>
								Handling <span className="text-red-600">*</span>
							</label>

							<div
								onClick={() => setHandlingOpen(!handlingOpen)}
								className={`${styles.input} cursor-pointer flex items-center gap-2 flex-wrap`}
							>
								{handling.length > 0 ? (
									<div className="flex flex-wrap gap-2 flex-1">
										{handling.map((item: string) => (
											<span
												key={item}
												className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm whitespace-nowrap flex items-center gap-1"
											>
												{item}
												<FaXmark
													className="cursor-pointer text-xs"
													onClick={(e) => {
														e.stopPropagation();
														markHandlingDismissed(item);
														const updated = handling.filter(
															(i: string) => i !== item
														);
														dispatch(
															updateField({
																field: "handling",
																value: updated,
															})
														);
													}}
												/>
											</span>
										))}
									</div>
								) : (
									<span className="text-gray-400 flex-1">Select Handling</span>
								)}
								<span className="text-gray-400 text-xs">▼</span>
							</div>

							{handlingOpen && (
								<div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl max-h-64 overflow-y-auto">
									<div className="px-4 py-3 font-semibold border-b">
										Select Handling
									</div>
									{handlingOptions.map((item: string) => {
										const groupA = [
											"Contagious",
											"Hazardous",
											"Flammable Vapors",
											"Bio-safety",
										];
										const groupB = ["Non-Contagious", "Non-Hazardous"];
										const isItemInA = groupA.includes(item);
										const isItemInB = groupB.includes(item);

										const isGroupASelected = handling.some((h: string) =>
											groupA.includes(h)
										);
										const isGroupBSelected = handling.some((h: string) =>
											groupB.includes(h)
										);

										const isSelected = handling.includes(item);
										const currentRuleHandling = getCurrentRuleHandling();
										const isDismissedPreselected =
											!isSelected &&
											currentRuleHandling.includes(item) &&
											(
												dismissedHandlingByContext[handlingRuleContextKey] || []
											).includes(item);

										const isDisabled =
											!isSelected &&
											((isItemInA && isGroupBSelected) ||
												(isItemInB && isGroupASelected));
										const showDisabledState =
											isDisabled && !isDismissedPreselected;
										const checkboxStyle = isDismissedPreselected
											? {
													appearance: "none" as const,
													WebkitAppearance: "none" as const,
													MozAppearance: "none" as const,
													width: "18px",
													height: "18px",
													border: "2px solid #22c55e",
													borderRadius: "4px",
													backgroundColor: "#dcfce7",
												}
											: undefined;

										return (
											<label
												key={item}
												className={`flex items-center gap-3 px-4 py-3 ${
													showDisabledState
														? "cursor-not-allowed opacity-50"
														: "cursor-pointer hover:bg-gray-50"
												}`}
											>
												<input
													type="checkbox"
													checked={isSelected}
													style={checkboxStyle}
													disabled={isDisabled}
													onChange={() => {
														if (isDisabled) return;
														const isRemoving = isSelected;
														if (isRemoving) {
															markHandlingDismissed(item);
														} else {
															clearHandlingDismissed(item);
														}
														const updated = isRemoving
															? handling.filter((i: string) => i !== item)
															: [...handling, item];
														dispatch(
															updateField({
																field: "handling",
																value: updated,
															})
														);
													}}
													className={`h-5 w-5 shrink-0 rounded-md border-gray-300 ${
														showDisabledState
															? "text-gray-400"
															: "text-blue-600"
													}`}
												/>
												<span
													className={`text-sm break-words ${
														showDisabledState ? "text-gray-400" : ""
													}`}
												>
													{item}
												</span>
											</label>
										);
									})}
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
										updateField({
											field: "locationQuery",
											value: e.target.value,
										})
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
		</>
	);
}

export default ProjectInfoPage;
