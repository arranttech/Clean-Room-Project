import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import s from "./profileDesign";
import AssignProfile from "./assignProfile";
import { getAssignedProfiles, deleteAssignedProfile } from "../../../backend/controller/profileController";

type AssignedProfileToken = {
	id: string;
	userName: string;
	profileName: string;
	userId?: string;
	profileId?: string;
};

type GroupedProfile = {
	userId: string;
	userName: string;
	profiles: string[];
	assignments: { id: string; profileId: string }[];
};

export default function AssignProfileDetails() {
	const [assignedProfiles, setAssignedProfiles] = useState<
		AssignedProfileToken[]
	>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAssignForm, setShowAssignForm] = useState(false);
	const [editData, setEditData] = useState<GroupedProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [userToDelete, setUserToDelete] = useState<GroupedProfile | null>(null);

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

	// Group profiles by user
	const groupedProfiles = assignedProfiles.reduce((acc, current) => {
		const userId = current.userId;
		if (!userId) return acc;

		if (!acc[userId]) {
			acc[userId] = {
				userId,
				userName: current.userName,
				profiles: [current.profileName],
				assignments: [{ id: current.id, profileId: current.profileId! }]
			};
		} else {
			acc[userId].profiles.push(current.profileName);
			acc[userId].assignments.push({ id: current.id, profileId: current.profileId! });
		}
		return acc;
	}, {} as Record<string, GroupedProfile>);

	const groupedData = Object.values(groupedProfiles);

	const filteredData = groupedData.filter(
		(item) =>
			item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.profiles.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	if (showAssignForm) {
		return (
			<AssignProfile
				editData={editData ? {
					userId: editData.userId,
					assignments: editData.assignments,
				} : undefined}
				onCancel={() => {
					setShowAssignForm(false);
					setEditData(null);
				}}
				onSaved={() => {
					setShowAssignForm(false);
					setEditData(null);
					fetchAssignments(); // Refetch the table from the db
				}}
			/>
		);
	}

	const handleEdit = (row: GroupedProfile) => {
		setEditData(row);
		setShowAssignForm(true);
	};

	const confirmDelete = async () => {
		if (userToDelete) {
			try {
				for (const assignment of userToDelete.assignments) {
					await deleteAssignedProfile(Number(assignment.id));
				}
				fetchAssignments();
			} catch (error) {
				console.error("Failed to delete assigned profile", error);
			} finally {
				setUserToDelete(null);
			}
		}
	};

	const handleDelete = (row: GroupedProfile) => {
		setUserToDelete(row);
	};

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
							<th className={s.thActions}>Actions</th>
						</tr>
					</thead>
					<tbody className={s.tbody}>
						{isLoading ? (
							<tr>
								<td colSpan={3} className={s.emptyRow}>
									Loading assignments...
								</td>
							</tr>
						) : filteredData.length > 0 ? (
							filteredData.map((row) => (
								<tr key={row.userId} className={s.tr}>
									<td className={s.tdProfileName}>{row.userName}</td>
									<td className={s.td}>{row.profiles.join(", ")}</td>
									<td className={s.tdActions}>
										<div className="flex justify-end gap-2">
											<button
												type="button"
												className={s.editBtn}
												onClick={() => handleEdit(row)}
												title="Edit Assignment"
											>
												<FiEdit2 size={16} />
											</button>
											<button
												type="button"
												className={s.deleteBtn}
												onClick={() => handleDelete(row)}
												title="Delete Assignment"
											>
												<FiTrash2 size={16} />
											</button>
										</div>
									</td>
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

			{/* Custom Delete Confirmation Modal */}
			{userToDelete && (
				<div className={s.popupOverlay}>
					<div className={s.popupBackdrop} onClick={() => setUserToDelete(null)} />
					<div className={`${s.popupCard} max-w-sm`}>
						<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
							<FiTrash2 className="text-red-500 text-xl" />
						</div>
						<h3 className={s.popupTitle}>Confirm Deletion</h3>
						<p className="text-sm text-slate-500 text-center mb-6 mt-2">
							Are you sure you want to delete all profile assignments for <span className="font-semibold">{userToDelete.userName}</span>? This action cannot be undone.
						</p>
						<div className="flex w-full gap-3">
							<button
								type="button"
								className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
								onClick={() => setUserToDelete(null)}
							>
								Cancel
							</button>
							<button
								type="button"
								className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-sm"
								onClick={confirmDelete}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
