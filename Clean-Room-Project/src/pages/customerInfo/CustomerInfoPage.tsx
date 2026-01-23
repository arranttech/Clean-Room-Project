
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import customerInfoDesign from "./customerInfo";

function CustomerInfo() {
	const styles = customerInfoDesign;

	return (
		<div className={styles.wrapper}>
			<h3 className={styles.headerText}>
				Please provide the basic details to get started
			</h3>

			<div className={styles.gridContainer}>
				{/* Left Card */}
				<div className={styles.card}>
					<div className={styles.fieldGroup}>
						<label className={styles.label}>Customer Name *</label>
						<input
							type="text"
							required
							placeholder="Enter Customer Name"
							className={styles.input}
						/>

						<label className={styles.label}>Phone Number</label>
						<input
							type="text"
							placeholder="Enter Phone Number"
							className={styles.input}
						/>

						<label className={styles.label}>Customer Address *</label>
						<input
							type="text"
							required
							placeholder="Enter Customer Address"
							className={styles.input}
						/>

						<label className={styles.label}>Email Address</label>
						<input
							type="email"
							placeholder="Enter Email Address"
							className={styles.input}
						/>

						<label className={styles.label}>Additional Notes</label>
						<input
							type="text"
							placeholder="Enter Any Additional Information....."
							className={styles.input}
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
								type="text"
								required
								placeholder="Unit or branch"
								className={styles.input}
							/>
						</div>

						<div className={styles.fieldGroup + " w-full"}>
							<label className={styles.label}>Project Name *</label>
							<input
								type="text"
								required
								placeholder="Project Name"
								className={styles.input}
							/>
						</div>
					</div>

					<div className={styles.rowGroup}>
						<div className={styles.fieldGroup + " w-full"}>
							<label className={styles.label}>Industry/sector</label>
							<input
								type="text"
								placeholder="Select"
								className={styles.input}
							/>
						</div>

						<div className={styles.fieldGroup + " w-full"}>
							<label className={styles.label}>Handing</label>
							<input
								type="text"
								placeholder="Select"
								className={styles.input}
							/>
						</div>
					</div>

					<div className={styles.fieldGroup}>
						<label className={styles.label}>Location Selection *</label>

						<div className={styles.locationWrapper}>
							<FaLocationDot className={styles.locationIcon} />
							<input
								type="text"
								required
								placeholder="Search Location"
								className={styles.locationInput}
							/>
							<button className={styles.searchButton}>Search</button>
						</div>

						<label className={styles.label}>Unique ID (Auto-Generated)</label>
						<input
							type="text"
							disabled
							placeholder="Auto Generated ID"
							className={styles.disabledInput}
						/>
					</div>
				</div>
			</div>

			{/* Footer Buttons */}
			<div className={styles.footer}>
				<Link to="/dashboard" className={styles.backLink}>
					<FaArrowLeft />
					Back to Dashboard
				</Link>

				<Link to="/standards" className={styles.nextLink}>
					Next Step
					<FaArrowRight />
				</Link>
			</div>
		</div>
	);
}

export default CustomerInfo;
