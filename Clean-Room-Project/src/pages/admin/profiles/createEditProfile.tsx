import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2 } from "react-icons/fi";
import s from "./profileDesign";
import AddProfile from "./addProfile";
import { getProfiles } from "../../../backend/controller/profileController";

type ProfileToken = {
	id: string;
	name: string;
	description: string;
	status: "Active" | "Inactive";
};

const initialProfiles: ProfileToken[] = [];

export default function CreateEditProfile() {
	const [profiles, setProfiles] = useState<ProfileToken[]>(initialProfiles);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [editData, setEditData] = useState<ProfileToken | null>(null);

	const fetchProfiles = async () => {
		try {
			const response = await getProfiles();
			if (response.profiles) {
				setProfiles(response.profiles);
			}
		} catch (err) {
			console.error("Failed to fetch profiles:", err);
		}
	};

	useEffect(() => {
		fetchProfiles();
	}, []);

	const filteredData = profiles.filter(
		(item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	if (showAdd || editData) {
		return (
			<AddProfile
				initialData={editData}
				onCancel={() => {
					setShowAdd(false);
					setEditData(null);
				}}
				onSaved={async () => {
					setShowAdd(false);
					setEditData(null);
					await fetchProfiles();
				}}
			/>
		);
	}

	return (
		<div>
			{/* Panel Header */}
			<div className={s.panelHeader}>
				<div className={s.panelTitleWrap}>
					<h1 className={s.panelTitle}>Create/Edit Profile</h1>
					<p className={s.panelSubtitle}>
						Create new profiles or edit existing ones
					</p>
				</div>
				<button
					type="button"
					onClick={() => setShowAdd(true)}
					className={s.addBtn}
				>
					<FiPlus /> Add Profile
				</button>
			</div>

			{/* Search Bar */}
			<div className={s.searchWrap}>
				<FiSearch className={s.searchIcon} />
				<input
					type="text"
					className={s.searchInput}
					placeholder="Search profiles..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className={s.tableWrap}>
				<table className={s.table}>
					<thead className={s.thead}>
						<tr>
							<th className={s.th}>Profile Name</th>
							<th className={s.th}>Description</th>
							<th className={s.th}>Status</th>
							<th className={s.thActions}>Actions</th>
						</tr>
					</thead>
					<tbody className={s.tbody}>
						{filteredData.length > 0 ? (
							filteredData.map((row) => (
								<tr key={row.id} className={s.tr}>
									<td className={s.tdProfileName}>{row.name}</td>
									<td className={s.td}>{row.description}</td>
									<td className={s.td}>
										<span
											className={
												row.status === "Active"
													? s.badgeActive
													: s.badgeInactive
											}
										>
											{row.status}
										</span>
									</td>
									<td className={s.tdActions}>
										<button
											className={s.editBtn}
											title="Edit profile"
											onClick={() => setEditData(row)}
										>
											<FiEdit2 size={16} />
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className={s.emptyRow}>
									No profiles found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
