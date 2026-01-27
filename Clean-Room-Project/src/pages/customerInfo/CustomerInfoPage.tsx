import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import customerInfoDesign from "./customerInfo";
import { useRef } from "react";

function CustomerInfo() {
	const styles = customerInfoDesign;

	const [customerName, setCustomerName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [customerAddress, setCustomerAddress] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [additionalNotes, setAdditionalNotes] = useState("");
	const [projectName, setProjectName] = useState("");
	const [unitBranch, setUnitBranch] = useState("");
	const [handling, setHandling] = useState("");
	const [uniqueId, setUniqueId] = useState("");
	const [locationQuery, setLocationQuery] = useState("");
	const [locationResults, setLocationResults] = useState([]);
	const [showResults, setShowResults] = useState(false);
	const [minTemp, setMinTemp] = useState("");
	const [maxTemp, setMaxTemp] = useState("");
	const [relativeHumidityMax, setRelativeHumidityMax] = useState("");
	const [relativeHumidityMin, setRelativeHumidityMin] = useState("");
	const [industry, setIndustry] = useState([]);
	const [industryOpen, setIndustryOpen] = useState(false);
	const industryRef = useRef(null);
	const [handlingOpen, setHandlingOpen] = useState(false);
	const handlingRef = useRef(null);

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

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (industryRef.current && !industryRef.current.contains(e.target)) {
				setIndustryOpen(false);
			}
			if (handlingRef.current && !handlingRef.current.contains(e.target)) {
				setHandlingOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const generateUniqueId = (customerName, projectName) => {
		if (!customerName || !projectName) return "";

		const slug = (text) =>
			text
				.toUpperCase()
				.trim()
				.replace(/\s+/g, "-")
				.replace(/[^A-Z0-9-]/g, "");

		// const random = Math.random().toString(36).substring(2, 7).toUpperCase();

		const today = new Date();
		const day = String(today.getDate()).padStart(2, "0");
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const year = String(today.getFullYear()).slice(-2);

		return `${slug(customerName)}-${slug(projectName)}-${day}${month}${year}`;
	};

	useEffect(() => {
		const id = generateUniqueId(customerName, projectName);
		setUniqueId(id);

		console.log(
			"Customer Name:",
			customerName,
			"Phone Number:",
			phoneNumber,
			"Customer Address:",
			phoneNumber,
			"Customer Address:",
			customerAddress,
			"Email Address:",
			emailAddress,
			"Additional Notes:",
			additionalNotes,
			"Unit/Branch:",
			unitBranch,
			"Project Name:",
			projectName,
			"Industry:",
			industry,
			"Handling:",
			handling,
			"Location Query:",
			locationQuery,
			"Min Temp (°C):",
			minTemp,
			"Max Temp (°C):",
			maxTemp,
			"Generated At:",
			new Date().toLocaleString()
		);
	}, [
		customerName,
		phoneNumber,
		customerAddress,
		emailAddress,
		additionalNotes,
		unitBranch,
		projectName,
		industry,
		handling,
		locationQuery,
		minTemp,
		maxTemp,
	]);

	useEffect(() => {
		setUniqueId(generateUniqueId(customerName, projectName));
	}, [customerName, projectName]);

	const searchLocation = async () => {
		if (!locationQuery.trim()) return;

		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
					locationQuery
				)}&limit=5`
			);
			const data = await res.json();
			setLocationResults(data);
			setShowResults(true);
		} catch (err) {
			console.error("Location search failed", err);
		}
	};

	const handleSelectLocation = async (place) => {
		const lat = parseFloat(place.lat);
		const lng = parseFloat(place.lon);

		setLocationQuery(place.display_name);
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
					(t) => t !== null && !isNaN(t)
				);
				const minTemps = data.daily.temperature_2m_min.filter(
					(t) => t !== null && !isNaN(t)
				);

				const relativehumidity_max =
					data?.daily?.relative_humidity_2m_max.filter(
						(t) => t !== null && !isNaN(t)
					);

				const relativehumidity_min =
					data?.daily?.relative_humidity_2m_min.filter(
						(t) => t !== null && !isNaN(t)
					);

				setMaxTemp(Math.max(...maxTemps).toFixed(1));
				setMinTemp(Math.min(...minTemps).toFixed(1));
				setRelativeHumidityMax(Math.max(...relativehumidity_max).toFixed(0));
				setRelativeHumidityMin(Math.min(...relativehumidity_min).toFixed(0));
			}
		} catch (error) {
			console.error("Failed to fetch temperature data", error);
		}
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.top}>
				<h1 className={styles.title}>Customer Information</h1>
				<h3 className={styles.headerText}>
					Please provide the basic details to get started
				</h3>
			</div>

			<div className={styles.gridContainer}>
				{/* Left Card */}
				<div className={styles.card}>
					<div className={styles.fieldGroup}>
						<label className={styles.label}>Customer Name *</label>
						<input
							className={styles.input}
							required
							value={customerName}
							onChange={(e) => setCustomerName(e.target.value)}
							placeholder="Enter Customer Name"
						/>

						<label className={styles.label}>Phone Number</label>
						<input
							className={styles.input}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder="Enter Phone Number"
						/>

						<label className={styles.label}>Customer Address *</label>
						<input
							className={styles.input}
							required
							onChange={(e) => setCustomerAddress(e.target.value)}
							placeholder="Enter Customer Address"
						/>

						<label className={styles.label}>Email Address</label>
						<input
							type="email"
							className={styles.input}
							onChange={(e) => setEmailAddress(e.target.value)}
							placeholder="Enter Email ID"
						/>

						<label className={styles.label}>Additional Notes</label>
						<input
							className={styles.input}
							onChange={(e) => setAdditionalNotes(e.target.value)}
							placeholder="Enter Additional Notes"
						/>
					</div>
				</div>

				{/* Right Card */}
				<div className={styles.card}>
					<div className={styles.cardTitle}>Project Information</div>
					<hr className={styles.divider} />

					<div className={styles.rowGroup}>
						<div className={styles.fieldGroup + " w-full"}>
							<label className={styles.label}>Unit/Branch *</label>
							<input
								className={styles.input}
								required
								onChange={(e) => setUnitBranch(e.target.value)}
								placeholder="Enter Unit or Branch Name"
							/>
						</div>

						<div className={styles.fieldGroup + " w-full"}>
							<label className={styles.label}>Project Name *</label>
							<input
								className={styles.input}
								required
								value={projectName}
								onChange={(e) => setProjectName(e.target.value)}
								placeholder="Enter Project Name"
							/>
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
												onChange={() =>
													setIndustry((prev) =>
														prev.includes(item)
															? prev.filter((i) => i !== item)
															: [...prev, item]
													)
												}
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
												onChange={() =>
													setHandling((prev) =>
														prev.includes(item)
															? prev.filter((i) => i !== item)
															: [...prev, item]
													)
												}
												className="h-5 w-5 shrink-0 rounded-md border-gray-300 text-blue-600"
											/>
											<span className="text-sm break-words">{item}</span>
										</label>
									))}
								</div>
							)}
						</div>
					</div>

					{/* LOCATION */}
					<div className={styles.fieldGroup}>
						<label className={styles.label}>Location Selection *</label>

						<div className={styles.locationWrapper}>
							<FaLocationDot className={styles.locationIcon} />
							<input
								className={styles.locationInput}
								placeholder="Search Location"
								value={locationQuery}
								onChange={(e) => setLocationQuery(e.target.value)}
							/>
							<button
								type="button"
								className={styles.searchButton}
								onClick={searchLocation}
							>
								Search
							</button>
						</div>

						{showResults && (
							<div className={styles.locationResults}>
								{locationResults.map((place) => (
									<div
										key={place.place_id}
										className={styles.locationResultItem}
										onClick={() => handleSelectLocation(place)}
									>
										{place.display_name}
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

					{/* TEMPERATURE DISPLAY */}
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
							<div className={styles.fieldGroup + " w-full"}>
								<label className={styles.label}>Relative Humidity Min</label>
								<input
									className={styles.disabledInput}
									value={`${relativeHumidityMin}`}
									disabled
								/>
							</div>
							<div className={styles.fieldGroup + " w-full"}>
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
			</div>

			{/* Footer */}
			<div className={styles.footer}>
				<Link to="/dashboard" className={styles.backLink}>
					<FaArrowLeft /> Back to Dashboard
				</Link>

				<Link
					to="/standards"
					state={{
						minimumTemp: minTemp,
						maximumTemp: maxTemp,
						minRelativeHumidity: relativeHumidityMin,
						maxRelativeHumidity: relativeHumidityMax,
					}}
					className={styles.nextLink}
				>
					Next Step <FaArrowRight />
				</Link>
			</div>
		</div>
	);
}

export default CustomerInfo;
