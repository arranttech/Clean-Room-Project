import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import s from "./profileDesign";
import AddProfile from "./addProfile";
import { getProfiles, deleteProfile } from "../../../backend/controller/controller";

type ProfileToken = {
	id: string;
	name: string;
	description: string;
	status: "Active" | "In Progress";
};

const initialProfiles: ProfileToken[] = [];

export default function CreateEditProfile() {
	const [profiles, setProfiles] = useState<ProfileToken[]>(initialProfiles);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [editData, setEditData] = useState<ProfileToken | null>(null);

	useEffect(() => {
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
		fetchProfiles();
	}, []);

	const filteredData = profiles.filter(
		(item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDelete = async (id: string) => {
		if (window.confirm("Are you sure you want to delete this profile?")) {
			try {
				await deleteProfile(Number(id));
				setProfiles((prev) => prev.filter((p) => p.id !== id));
			} catch (err) {
				console.error(err);
				alert("Failed to delete profile");
			}
		}
	};

	if (showAdd || editData) {
		return (
			<AddProfile
				initialData={editData}
				onCancel={() => {
					setShowAdd(false);
					setEditData(null);
				}}
				onSaved={(newProfile) => {
					setShowAdd(false);
					if (editData) {
						setProfiles((prev) =>
							prev.map((p) =>
								p.id === editData.id
									? ({ ...newProfile, id: editData.id } as ProfileToken)
									: p
							)
						);
						setEditData(null);
					} else {
						setProfiles((prev) => [
							{ ...newProfile, id: Math.random().toString() } as ProfileToken,
							...prev,
						]);
					}
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
													: s.badgeInProgress
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
										<button
											className={s.deleteBtn}
											title="Delete profile"
											onClick={() => handleDelete(row.id)}
										>
											<FiTrash2 size={16} />
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
