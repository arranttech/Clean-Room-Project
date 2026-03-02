import { useState } from "react";
import s from "./profileDesign";

//declaring mock data for users

const MOCK_USERS: { id: string; name: string }[] = [
	{ id: "1", name: "Joe" },
	{ id: "2", name: "Rozie" },
	{ id: "3", name: "Kelsey" },
	{ id: "4", name: "Elie" },
];

//declaring mock data for profiles
const MOCK_PROFILES: { id: string; name: string }[] = [
	{ id: "1", name: "Quality Lab Profile" },
	{ id: "2", name: "Advanced Lab Profile" },
];

//declaring props for AssignProfile
type AssignProfileProps = {
	onCancel: () => void;
	onSaved: (assignedData: { userName: string; profileName: string }) => void; //assigning Data to the parent component
};

export default function AssignProfile({
	onCancel,
	onSaved,
}: AssignProfileProps) {
	const [selectedUserId, setSelectedUserId] = useState<string>("");
	const [selectedProfileId, setSelectedProfileId] = useState<string>("");
	const [saving, setSaving] = useState(false);
	const [showPopup, setShowPopup] = useState(false);

	//handle assign function
	const handleAssign = () => {
		setSaving(true);
		try {
			const user = MOCK_USERS.find((u) => u.id === selectedUserId);
			const profile = MOCK_PROFILES.find((p) => p.id === selectedProfileId);
			const assignedData = {
				userName: user?.name || "Unknown User",
				profileName: profile?.name || "Unknown Profile",
			};

			// Mock API call
			setTimeout(() => {
				setShowPopup(true);
				setTimeout(() => {
					setShowPopup(false);
					onSaved(assignedData);
				}, 2000);
			}, 600);
		} catch (error) {
			console.error((error as Error).message);
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
							<div className={s.assignList}>
								{MOCK_USERS.map((user) => (
									<label key={user.id} className={s.assignListItem}>
										<input
											type="radio"
											name="user"
											className={s.assignRadio}
											checked={selectedUserId === user.id}
											onChange={() => setSelectedUserId(user.id)}
										/>
										<span
											className={
												selectedUserId === user.id
													? s.assignLabelActive
													: s.assignLabel
											}
										>
											{user.name}
										</span>
									</label>
								))}
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
								{MOCK_PROFILES.map((profile) => (
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
								))}
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
							!selectedUserId || !selectedProfileId
								? "opacity-50 cursor-not-allowed"
								: ""
						}`}
						disabled={saving || !selectedUserId || !selectedProfileId}
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
