import { useState, useEffect } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import s from "./profileDesign";
import AssignProfile from "./assignProfile";
import { getAssignedProfiles } from "../../../backend/controller/controller";

type AssignedProfileToken = {
	id: string;
	userName: string;
	profileName: string;
};

export default function AssignProfileDetails() {
	const [assignedProfiles, setAssignedProfiles] = useState<AssignedProfileToken[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAssignForm, setShowAssignForm] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const fetchAssignments = async () => {
		setIsLoading(true);
		try {
			const res = await getAssignedProfiles();
			if (res.assignedProfiles) {
				setAssignedProfiles(res.assignedProfiles);
			}
		} catch (error) {
			console.error("Failed to fetch assigned profiles", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchAssignments();
	}, []);

	const filteredData = assignedProfiles.filter(
		(item) =>
			item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.profileName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (showAssignForm) {
		return (
			<AssignProfile
				onCancel={() => setShowAssignForm(false)}
				onSaved={() => {
					setShowAssignForm(false);
					fetchAssignments(); // Refetch the table from the db
				}}
			/>
		);
	}

	return (
		<div>
			{/* Panel Header */}
			<div className={s.panelHeader}>
				<div className={s.panelTitleWrap}>
					<h1 className={s.panelTitle}>Assigned Profiles Overview</h1>
					<p className={s.panelSubtitle}>Manage user profile assignments</p>
				</div>
				<button
					type="button"
					onClick={() => setShowAssignForm(true)}
					className={s.addBtn}
				>
					<FiPlus /> Assign Profile
				</button>
			</div>

			{/* Search Bar */}
			<div className={s.searchWrap}>
				<FiSearch className={s.searchIcon} />
				<input
					type="text"
					className={s.searchInput}
					placeholder="Search assigned profiles..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className={s.tableWrap}>
				<table className={s.table}>
					<thead className={s.thead}>
						<tr>
							<th className={s.th}>User</th>
							<th className={s.th}>Assigned Profile</th>
						</tr>
					</thead>
					<tbody className={s.tbody}>
						{isLoading ? (
							<tr>
								<td colSpan={2} className={s.emptyRow}>
									Loading assignments...
								</td>
							</tr>
						) : filteredData.length > 0 ? (
							filteredData.map((row) => (
								<tr key={row.id} className={s.tr}>
									<td className={s.tdProfileName}>{row.userName}</td>
									<td className={s.td}>{row.profileName}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={2} className={s.emptyRow}>
									No assigned profiles found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
