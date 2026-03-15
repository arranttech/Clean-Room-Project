import { useState, useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import s from "./profileDesign";
import { getUsers } from "../../../backend/controller/userController";
import {
	getProfiles,
	assignProfileToUser,
	getAssignedProfiles,
} from "../../../backend/controller/profileController";

type UserItem = {
	id: string;
	name: string;
};

type ProfileItem = {
	id: string;
	name: string;
};

//declaring props for AssignProfile
type AssignProfileProps = {
	onCancel: () => void;
	onSaved: (assignedData: { userName: string; profileName: string }) => void; //assigning Data to the parent component
	editData?: { userId: string; assignments: { id: string; profileId: string }[] };
};

export default function AssignProfile({
	onCancel,
	onSaved,
	editData,
}: AssignProfileProps) {
	const isEditMode = !!editData;
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
	const [userSearchTerm, setUserSearchTerm] = useState("");
	const [profileSearchTerm, setProfileSearchTerm] = useState("");
	const [saving, setSaving] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [usersList, setUsersList] = useState<UserItem[]>([]);
	const [profilesList, setProfilesList] = useState<ProfileItem[]>([]);
	const [showEditConfirm, setShowEditConfirm] = useState(false);
	const [originalProfileIds, setOriginalProfileIds] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersData, profilesData, assignedProfilesData] = await Promise.all([
					getUsers(),
					getProfiles(),
					getAssignedProfiles(),
				]);

				const assignedProfiles = assignedProfilesData.assignedProfiles ?? assignedProfilesData ?? [];
				const assignedUserIds = new Set(assignedProfiles.map((ap: any) => ap.userId?.toString()));

				// 1. Process Users
				const listUsers = usersData.users ?? usersData ?? [];
				const mappedUsers = listUsers
					.map((u: any) => ({
						id: (u.user_id || u.id)?.toString(),
						name: `${u.user_first_name} ${u.user_last_name}`.trim(),
					}))
					.filter((u: any) => isEditMode ? true : !assignedUserIds.has(u.id));

				mappedUsers.sort((a: UserItem, b: UserItem) => a.name.localeCompare(b.name));
				setUsersList(mappedUsers);

				// 2. Process Profiles
				const listProfiles = profilesData.profiles ?? profilesData ?? [];
				const mappedProfiles = listProfiles
					.filter((p: any) => p.status === "Active")
					.map((p: any) => ({
						id: (p.id || p.profile_id)?.toString(),
						name: p.name || p.profile_name,
					}));
				mappedProfiles.sort((a: ProfileItem, b: ProfileItem) => a.name.localeCompare(b.name));
				setProfilesList(mappedProfiles);

				if (isEditMode && editData) {
					setSelectedUserIds([editData.userId]);

					// Use all profiles from the assignments
					const initialProfiles = editData.assignments.map(a => a.profileId);
					setSelectedProfileIds(initialProfiles);
					setOriginalProfileIds(initialProfiles);
				}
			} catch (error) {
				console.error("Failed to fetch assign profile data:", error);
			}
		};
		fetchData();
	}, []);

	let filteredUsers = usersList.filter((user) =>
		user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
	);

	if (isEditMode) {
		filteredUsers = filteredUsers.filter(user => selectedUserIds.includes(user.id));
	}

	const filteredProfiles = profilesList.filter((profile) =>
		profile.name.toLowerCase().includes(profileSearchTerm.toLowerCase())
	);

	const handleUserSelect = (id: string) => {
		setSelectedUserIds((prev) =>
			prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
		);
	};

	const handleProfileSelect = (id: string) => {
		setSelectedProfileIds((prev) =>
			prev.includes(id)
				? prev.filter((profileId) => profileId !== id)
				: [...prev, id]
		);
	};

	//handle assign function
	const handleAssign = async () => {
		if (isEditMode) {
			setShowEditConfirm(true);
			return;
		}

		await executeAssign();
	};

	const executeAssign = async () => {
		setSaving(true);
		setShowEditConfirm(false);
		try {
			// If in edit mode, MUST delete ALL old assignment rows FIRST 
			// to avoid UNIQUE constraint errors if they re-assign the same profile
			if (isEditMode && editData) {
				const { deleteAssignedProfile } = await import("../../../backend/controller/profileController");
				for (const assignment of editData.assignments) {
					await deleteAssignedProfile(Number(assignment.id));
				}
			}

			// Create all combinations of selected users and selected profiles
			const assignPromises: Promise<any>[] = [];

			selectedUserIds.forEach((userId) => {
				selectedProfileIds.forEach((profileId) => {
					assignPromises.push(
						assignProfileToUser({
							userId: userId,
							systemProfileId: Number(profileId),
						})
					);
				});
			});

			await Promise.all(assignPromises);

			setShowPopup(true);
			setTimeout(() => {
				setShowPopup(false);

				// For backwards compatibility and the alert prompt
				const firstUser = usersList.find((u) => u.id === selectedUserIds[0]);
				const firstProfile = profilesList.find((p) => p.id === selectedProfileIds[0]);

				onSaved({
					userName:
						selectedUserIds.length > 1
							? `${selectedUserIds.length} Users`
							: firstUser?.name || "Unknown User",
					profileName:
						selectedProfileIds.length > 1
							? `${selectedProfileIds.length} Profiles`
							: firstProfile?.name || "Unknown Profile",
				});
			}, 2000);
		} catch (error) {
			console.error("Failed to assign profile", (error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const getProfileNames = (ids: string[]) => {
		return ids
			.map(id => profilesList.find(p => p.id === id)?.name)
			.filter(Boolean)
			.join(" and ");
	};

	return (
		<div>
			{/* Panel Header */}
			<div className={s.panelHeader}>
				<div className={s.panelTitleWrap}>
					<h1 className={s.panelTitle}>
						{isEditMode ? "Edit Assigned Profile" : "Assign Profile"}
					</h1>
				</div>
			</div>

			<div className={s.assignCard}>
				<div className={s.assignGrid}>
					{/* Left Column: Users */}
					<div className={s.assignColWrap}>
						<h2 className={s.assignColTitle}>
							Select User <span className={s.formRequired}>*</span>
						</h2>
						<div className={s.assignCol}>
							<div className={s.assignHeader}>Available Users</div>

							{/* User Search Bar */}
							<div className="px-3 py-2 border-b border-slate-100 bg-slate-50 relative">
								<input
									type="text"
									placeholder="Search users..."
									className="w-full text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
									value={userSearchTerm}
									onChange={(e) => {
										if (!isEditMode) setUserSearchTerm(e.target.value);
									}}
									disabled={isEditMode}
								/>
								{userSearchTerm && !isEditMode && (
									<button
										className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
										onClick={() => setUserSearchTerm("")}
									>
										×
									</button>
								)}
							</div>

							<div className={s.assignList}>
								{filteredUsers.length === 0 ? (
									<div className="px-5 py-4 text-sm text-slate-500 italic">
										No users found
									</div>
								) : (
									filteredUsers.map((user) => (
										<label key={user.id} className={s.assignListItem}>
											<input
												type="checkbox"
												name={`user-${user.id}`}
												className={`${s.assignRadio} rounded-sm disabled:opacity-50 disabled:cursor-not-allowed`}
												checked={selectedUserIds.includes(user.id)}
												onChange={() => {
													if (!isEditMode) handleUserSelect(user.id);
												}}
												disabled={isEditMode}
											/>
											<span
												className={
													selectedUserIds.includes(user.id)
														? s.assignLabelActive
														: s.assignLabel
												}
											>
												{user.name}
											</span>
										</label>
									))
								)}
							</div>
						</div>
					</div>

					{/* Right Column: Profiles */}
					<div className={s.assignColWrap}>
						<h2 className={s.assignColTitle}>
							Select Profile <span className={s.formRequired}>*</span>
						</h2>
						<div className={s.assignCol}>
							<div className={s.assignHeader}>Available Profiles</div>

							{/* Profile Search Bar */}
							<div className="px-3 py-2 border-b border-slate-100 bg-slate-50 relative">
								<input
									type="text"
									placeholder="Search profiles..."
									className="w-full text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
									value={profileSearchTerm}
									onChange={(e) => setProfileSearchTerm(e.target.value)}
								/>
								{profileSearchTerm && (
									<button
										className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
										onClick={() => setProfileSearchTerm("")}
									>
										×
									</button>
								)}
							</div>

							<div className={s.assignList}>
								{filteredProfiles.length === 0 ? (
									<div className="px-5 py-4 text-sm text-slate-500 italic">
										No profiles available
									</div>
								) : (
									filteredProfiles.map((profile) => (
										<label key={profile.id} className={s.assignListItem}>
											<input
												type="checkbox"
												name={`profile-${profile.id}`}
												className={`${s.assignRadio} rounded-sm`}
												checked={selectedProfileIds.includes(profile.id)}
												onChange={() => handleProfileSelect(profile.id)}
											/>
											<span
												className={
													selectedProfileIds.includes(profile.id)
														? s.assignLabelActive
														: s.assignLabel
												}
											>
												{profile.name}
											</span>
										</label>
									))
								)}
							</div>
						</div>
					</div>
				</div>

				<div className={s.assignFooterWrap}>
					<button
						type="button"
						className={s.formCancelBtn}
						onClick={onCancel}
						disabled={saving}
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleAssign}
						className={`${s.formSubmitBtn} ${selectedUserIds.length === 0 || selectedProfileIds.length === 0
							? "opacity-50 cursor-not-allowed"
							: ""
							}`}
						disabled={
							saving || selectedUserIds.length === 0 || selectedProfileIds.length === 0
						}
					>
						{saving
							? (isEditMode ? "Editing..." : "Assigning...")
							: (isEditMode ? "Edit Assigned Profile" : "Assign Profile")
						}
					</button>
				</div>
			</div>

			{/* Edit Confirmation Popup */}
			{showEditConfirm && isEditMode && (
				<div className={s.popupOverlay}>
					<div className={s.popupBackdrop} onClick={() => setShowEditConfirm(false)} />
					<div className={`${s.popupCard} max-w-md`}>
						<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
							<span className="text-blue-600 text-xl font-bold">i</span>
						</div>
						<h3 className={s.popupTitle}>Confirm the assigned profile Change</h3>
						<div className="text-sm text-slate-600 text-left mb-6 mt-2 space-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
							<p>
								<span className="font-semibold text-slate-900">
									{usersList.find(u => u.id === selectedUserIds[0])?.name || "This user"}
								</span>{" "}
								was previously assigned to:
								<br />
								<span className="font-medium text-blue-600">
									{getProfileNames(originalProfileIds) || "None"}
								</span>
							</p>
							<div className="h-px bg-slate-200 w-full"></div>
							<p>
								Now assigning to:
								<br />
								<span className="font-medium text-emerald-600">
									{getProfileNames(selectedProfileIds) || "None"}
								</span>
							</p>
						</div>
						<div className="flex w-full gap-3">
							<button
								type="button"
								className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
								onClick={() => setShowEditConfirm(false)}
							>
								Cancel
							</button>
							<button
								type="button"
								className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm"
								onClick={executeAssign}
							>
								Confirm Change
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Success Popup */}
			{showPopup && (
				<div className={s.popupOverlay}>
					<div className={s.popupBackdrop} />
					<div className={s.popupCard}>
						<FaCircleCheck className={s.popupIcon} />
						<h3 className={s.popupTitle}>Success!</h3>
						<p className={s.popupMessage}>
							{isEditMode
								? "Edited successfully."
								: "Profile has been assigned successfully."}
						</p>
						<div className={s.popupProgressWrap}>
							<div className={s.popupProgressBar} />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
