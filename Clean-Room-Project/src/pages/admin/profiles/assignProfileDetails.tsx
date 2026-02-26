import { useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import s from "./profileDesign";
import AssignProfile from "./assignProfile";

type AssignedProfileToken = {
	id: string;
	userName: string;
	profileName: string;
	createdAt: string;
};

const initialAssignedProfiles: AssignedProfileToken[] = [];

export default function AssignProfileDetails() {
	const [assignedProfiles, setAssignedProfiles] = useState<
		AssignedProfileToken[]
	>(initialAssignedProfiles);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAssignForm, setShowAssignForm] = useState(false);

	const filteredData = assignedProfiles.filter(
		(item) =>
			item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.profileName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (showAssignForm) {
		return (
			<AssignProfile
				onCancel={() => setShowAssignForm(false)}
				onSaved={(assignedData) => {
					setShowAssignForm(false);
					const newAssignment: AssignedProfileToken = {
						id: Math.random().toString(36).substr(2, 9),
						userName: assignedData.userName,
						profileName: assignedData.profileName,
						createdAt: new Date().toISOString().split("T")[0],
					};
					setAssignedProfiles((prev) => [...prev, newAssignment]);
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
							<th className={s.th}>User Name</th>
							<th className={s.th}>Assigned Profile</th>
							<th className={s.th}>Created At</th>
						</tr>
					</thead>
					<tbody className={s.tbody}>
						{filteredData.length > 0 ? (
							filteredData.map((row) => (
								<tr key={row.id} className={s.tr}>
									<td className={s.tdProfileName}>{row.userName}</td>
									<td className={s.td}>{row.profileName}</td>
									<td className={s.td}>{row.createdAt}</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={3} className={s.emptyRow}>
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
