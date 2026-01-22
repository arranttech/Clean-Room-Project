import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import d from "./customerInfo";

export default function CustomerInfoPage() {
	return (
		<div className={d.wrapper}>
			<h3 className={d.headerText}>
				Please provide the basic details to get started
			</h3>

			<div className={d.gridContainer}>
				{/* Left Card: Customer Details */}
				<div className={d.card}>
					<div className={d.fieldGroup}>
						<label htmlFor="customerName" className={d.label}>
							Customer Name *
						</label>
						<input
							type="text"
							id="customerName"
							required
							placeholder="Enter Customer Name"
							className={d.input}
						/>

						<label htmlFor="phone" className={d.label}>
							Phone Number
						</label>
						<input
							type="text"
							id="phone"
							placeholder="Enter Phone Number"
							className={d.input}
						/>

						<label htmlFor="address" className={d.label}>
							Customer Address *
						</label>
						<input
							type="text"
							id="address"
							required
							placeholder="Enter Customer Address"
							className={d.input}
						/>

						<label htmlFor="email" className={d.label}>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							placeholder="Enter Email Address"
							className={d.input}
						/>

						<label htmlFor="notes" className={d.label}>
							Additional Notes
						</label>
						<input
							type="text"
							id="notes"
							placeholder="Enter Any Additional Information....."
							className={d.input}
						/>
					</div>
				</div>

				{/* Right Card: Project Information */}
				<div className={d.card}>
					<div className={d.cardTitle} role="heading">
						Project Information
					</div>
					<hr className={d.divider} />

					<div className={d.rowGroup}>
						<div className={d.fieldGroup}>
							<label htmlFor="unit" className={d.label}>
								Unit/Branch *
							</label>
							<input
								type="text"
								id="unit"
								required
								placeholder="Unit or branch"
								className={d.input}
							/>
						</div>
						<div className={d.fieldGroup}>
							<label htmlFor="projectName" className={d.label}>
								Project Name *
							</label>
							<input
								type="text"
								id="projectName"
								required
								placeholder="Project Name"
								className={d.input}
							/>
						</div>
					</div>

					<div className={d.rowGroup}>
						<div className={d.fieldGroup}>
							<label htmlFor="industry" className={d.label}>
								Industry/sector
							</label>
							<input
								type="text"
								id="industry"
								placeholder="Select"
								className={d.input}
							/>
						</div>
						<div className={d.fieldGroup}>
							<label htmlFor="handing" className={d.label}>
								Handing
							</label>
							<input
								type="text"
								id="handing"
								placeholder="Select"
								className={d.input}
							/>
						</div>
					</div>

					<div className={d.fieldGroup}>
						<label htmlFor="location" className={d.label}>
							Location Selection *
						</label>
						<div className={d.locationWrapper}>
							<FaLocationDot className={d.locationIcon} />
							<input
								type="text"
								id="location"
								required
								placeholder="Search Location"
								className={d.locationInput}
							/>
							<button className={d.searchButton}>Search</button>
						</div>

						<label htmlFor="uid" className={d.label}>
							Unique ID (Auto-Generated)
						</label>
						<input
							type="text"
							id="uid"
							disabled
							placeholder="Auto Generated ID"
							className={d.input}
						/>
					</div>
				</div>
			</div>

			{/* Navigation Buttons */}
			<div className={d.footer}>
				<Link to="/dashboard" className={d.backLink}>
					<FaArrowLeft className={d.iconLeft} />
					Back to Dashboard
				</Link>

				<Link to="/next-step" className={d.nextLink}>
					Next Step
					<FaArrowRight className={d.iconRight} />
				</Link>
			</div>
		</div>
	);
}
