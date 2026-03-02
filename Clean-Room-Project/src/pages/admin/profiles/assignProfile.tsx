import { useState, useEffect } from "react";
import s from "./profileDesign";
import { getUsers } from "../../../backend/controller/userController";
import {
	getProfiles,
	assignProfileToUser,
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
};

export default function AssignProfile({
	onCancel,
	onSaved,
}: AssignProfileProps) {
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [selectedProfileId, setSelectedProfileId] = useState<string>("");
	const [userSearchTerm, setUserSearchTerm] = useState("");
	const [saving, setSaving] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [usersList, setUsersList] = useState<UserItem[]>([]);
	const [profilesList, setProfilesList] = useState<ProfileItem[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersData, profilesData] = await Promise.all([
					getUsers(),
					getProfiles(),
				]);

				const listUsers = usersData.users ?? usersData ?? [];
				const mappedUsers = listUsers.map((u: any) => ({
					id: u.user_id, // Use varchar user_id for the tUserProfiles table
					name: `${u.user_first_name} ${u.user_last_name}`.trim(),
				}));

				// Sort alphabetically by name
				mappedUsers.sort((a: UserItem, b: UserItem) =>
					a.name.localeCompare(b.name)
				);

				setUsersList(mappedUsers);

				const listProfiles = profilesData.profiles ?? profilesData ?? [];
				const mappedProfiles = listProfiles.map((p: any) => ({
					id: p.id?.toString(),
					name: p.name,
				}));
				setProfilesList(mappedProfiles);
			} catch (error) {
				console.error("Failed to fetch assign profile data:", error);
			}
		};
		fetchData();
	}, []);

	const filteredUsers = usersList.filter((user) =>
		user.name.toLowerCase().includes(userSearchTerm.toLowerCase())
	);

	const handleUserSelect = (id: string) => {
		setSelectedUserIds((prev) =>
			prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
		);
	};

	//handle assign function
	const handleAssign = async () => {
		setSaving(true);
		try {
			const profile = profilesList.find((p) => p.id === selectedProfileId);

			// Map over selectedUserIds to assign the profile to multiple users concurrently
			const assignPromises = selectedUserIds.map((userId) =>
				assignProfileToUser({
					userId: userId,
					systemProfileId: Number(selectedProfileId),
				})
			);

			await Promise.all(assignPromises);

			setShowPopup(true);
			setTimeout(() => {
				setShowPopup(false);

				// For backwards compatibility and the alert prompt
				const firstUser = usersList.find((u) => u.id === selectedUserIds[0]);
				onSaved({
					userName:
						selectedUserIds.length > 1
							? `${selectedUserIds.length} Users`
							: firstUser?.name || "Unknown User",
					profileName: profile?.name || "Unknown Profile",
				});
			}, 2000);
		} catch (error) {
			console.error("Failed to assign profile", (error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			{/* Panel Header */}
			<div className={s.panelHeader}>
				<div className={s.panelTitleWrap}>
					<h1 className={s.panelTitle}>Assign Profile</h1>
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
									className="w-full text-sm border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
									value={userSearchTerm}
									onChange={(e) => setUserSearchTerm(e.target.value)}
								/>
								{userSearchTerm && (
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
												className={`${s.assignRadio} rounded-sm`}
												checked={selectedUserIds.includes(user.id)}
												onChange={() => handleUserSelect(user.id)}
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
							<div className={s.assignList}>
								{profilesList.length === 0 ? (
									<div className="px-5 py-4 text-sm text-slate-500 italic">
										No profiles available
									</div>
								) : (
									profilesList.map((profile) => (
										<label key={profile.id} className={s.assignListItem}>
											<input
												type="radio"
												name="profile"
												className={s.assignRadio}
												checked={selectedProfileId === profile.id}
												onChange={() => setSelectedProfileId(profile.id)}
											/>
											<span
												className={
													selectedProfileId === profile.id
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
						className={`${s.formSubmitBtn} ${
							selectedUserIds.length === 0 || !selectedProfileId
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
						disabled={
							saving || selectedUserIds.length === 0 || !selectedProfileId
						}
					>
						{saving ? "Assigning..." : "Assign Profile"}
					</button>
				</div>
			</div>

			{/* Success Popup */}
			{showPopup && (
				<div className={s.popupOverlay}>
					<div className={s.popupBackdrop} />
					<div className={s.popupCard}>
						<div className={s.popupIcon}>✓</div>
						<h3 className={s.popupTitle}>Success!</h3>
						<p className={s.popupMessage}>
							Profile has been assigned successfully.
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
