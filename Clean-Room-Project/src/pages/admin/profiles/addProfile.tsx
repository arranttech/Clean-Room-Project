import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import s from "./profileDesign";
import {
	createProfile,
	updateProfile,
	saveProfileDetails,
} from "../../../backend/controller/profileController";

import { getScreens } from "../../../backend/controller/screenController";

type AddProfileProps = {
	initialData?: any;
	onCancel: () => void;
	onSaved: (newProfile: any) => void;
};

export default function AddProfile({
	initialData,
	onCancel,
	onSaved,
}: AddProfileProps) {
	const [profileName, setProfileName] = useState(initialData?.name || "");
	const [profileDescription, setProfileDescription] = useState(
		initialData?.description || ""
	);
	const [saving, setSaving] = useState(false);
	const [showPopup, setShowPopup] = useState(false);
	const [touched, setTouched] = useState(false);

	// dynamic screens from the database
	const [screensList, setScreensList] = useState<string[]>([]);

	// State to hold permission per screen. Default to "None"
	const [permissions, setPermissions] = useState<Record<string, string>>(() => {
		const initialPerms: Record<string, string> = {};
		if (initialData?.permissions) {
			Object.keys(initialData.permissions).forEach((k) => {
				initialPerms[k] = initialData.permissions[k];
			});
		}
		return initialPerms;
	});

	useEffect(() => {
		const fetchScreens = async () => {
			try {
				const response = await getScreens();
				if (response.screens) {
					const activeScreens = response.screens
						.filter((s: any) => s.screen_status === "Active")
						.map((s: any) => s.screen_name);
					setScreensList(activeScreens);

					// ensure existing permissions state has at least "None" for all active screens
					setPermissions((prev) => {
						const newPerms = { ...prev };
						activeScreens.forEach((scr: string) => {
							if (!newPerms[scr]) newPerms[scr] = "None";
						});
						return newPerms;
					});
				}
			} catch (err) {
				console.error("Failed to fetch screens:", err);
			}
		};
		fetchScreens();
	}, []);

	const handlePermissionChange = (
		screen: string,
		permission: "Full Access" | "Read Only" | "None"
	) => {
		setPermissions((prev) => ({ ...prev, [screen]: permission }));
	};

	const validateProfileName = (v: string) =>
		v.trim().length > 0 ? "" : "Profile Name is required";
	const validateProfileDescription = (v: string) =>
		v.trim().length > 0 ? "" : "Profile Description is required";

	const nameError = touched ? validateProfileName(profileName) : "";
	const descriptionError = touched
		? validateProfileDescription(profileDescription)
		: "";

	const isPermissionsValid =
		!initialData ||
		screensList.every(
			(screen) => permissions[screen] && permissions[screen] !== ""
		);
	const isFormValid =
		profileName.trim().length > 0 &&
		profileDescription.trim().length > 0 &&
		isPermissionsValid;

	const saveProfile = async () => {
		setTouched(true);
		if (!isFormValid) {
			return;
		}

		setSaving(true);
		try {
			const newProfileData: any = {
				name: profileName,
				description: profileDescription,
				status: initialData?.status || "Active",
			};

			let profileIdStr = initialData?.id;

			if (initialData?.id) {
				await updateProfile(Number(initialData.id), newProfileData);
			} else {
				const response = await createProfile(newProfileData);
				profileIdStr = response.profile_id.toString();
			}

			// Always save permissions map
			if (profileIdStr && Object.keys(permissions).length > 0) {
				await saveProfileDetails({
					profile_id: Number(profileIdStr),
					permissions: permissions,
				});
			}

			newProfileData.id = profileIdStr;
			newProfileData.permissions = permissions;

			setShowPopup(true);
			setTimeout(() => {
				setShowPopup(false);
				onSaved(newProfileData);
			}, 2000);
		} catch (error) {
			console.error((error as Error).message);
			alert("Failed to save profile. See console for details.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<div>
			<h1 className={s.formTitle}>
				{initialData ? "Edit Profile" : "Create New Profile"}
			</h1>
			<div className={s.formCard}>
				<h2 className={s.formSectionTitle}>Profile Information</h2>

				<div className={s.formRow}>
					<div className={s.formGroup}>
						<label className={s.formLabel}>
							Profile Name <span className={s.formRequired}>*</span>
						</label>
						<input
							type="text" //while editing the profile name  disabled.
							className={`${s.formInput} ${
								initialData ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
							}`}
							placeholder="Enter profile name"
							value={profileName}
							onChange={(e) => setProfileName(e.target.value)}
							disabled={!!initialData}
						/>
						{nameError && <p className={s.formError}>{nameError}</p>}
					</div>
				</div>

				<div className={s.formRow}>
					<div className={s.formGroup}>
						<label className={s.formLabel}>
							Profile Description <span className={s.formRequired}>*</span>
						</label>
						<textarea
							className={`${s.formInput} ${
								initialData ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
							}`}
							placeholder="Enter profile description"
							value={profileDescription}
							onChange={(e) => setProfileDescription(e.target.value)}
							disabled={!!initialData}
						/>
						{descriptionError && (
							<p className={s.formError}>{descriptionError}</p>
						)}
					</div>
				</div>

				{/* Screen Permissions Section (Shows only on Edit) */}
				{initialData && (
					<>
						<h2 className={s.formSectionTitle}>
							Screen Permissions <span className={s.formRequired}>*</span>
						</h2>
						<div className={s.tableWrap}>
							<table className={s.table}>
								<thead className={s.thead}>
									<tr>
										<th className={s.th}>Screen Name</th>
										<th className="px-5 py-4 text-center text-xs font-bold text-slate-700 tracking-wider">
											Full Access
										</th>
										<th className="px-5 py-4 text-center text-xs font-bold text-slate-700 tracking-wider">
											Read Only
										</th>
										<th className="px-5 py-4 text-center text-xs font-bold text-slate-700 tracking-wider">
											None
										</th>
									</tr>
								</thead>
								<tbody className={s.tbody}>
									{screensList.map((screen) => (
										<tr key={screen} className={s.tr}>
											<td className={s.td}>{screen}</td>
											<td className="px-5 py-4 text-center">
												<input
													type="radio"
													name={`perm-${screen}`}
													className={s.assignRadio}
													checked={permissions[screen] === "Full Access"}
													onChange={() =>
														handlePermissionChange(screen, "Full Access")
													}
												/>
											</td>
											<td className="px-5 py-4 text-center">
												<input
													type="radio"
													name={`perm-${screen}`}
													className={s.assignRadio}
													checked={permissions[screen] === "Read Only"}
													onChange={() =>
														handlePermissionChange(screen, "Read Only")
													}
												/>
											</td>
											<td className="px-5 py-4 text-center">
												<input
													type="radio"
													name={`perm-${screen}`}
													className={s.assignRadio}
													checked={permissions[screen] === "None"}
													onChange={() =>
														handlePermissionChange(screen, "None")
													}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						{!isPermissionsValid && touched && (
							<p className={`${s.formError} mt-2 text-right`}>
								Please select permission for all screens.
							</p>
						)}
					</>
				)}

				<div className={s.formDivider}></div>

				<div className={s.formFooter}>
					<button
						type="button"
						onClick={onCancel}
						className={s.formCancelBtn}
						disabled={saving}
					>
						<FiX /> Cancel
					</button>
					<button
						type="button"
						onClick={saveProfile}
						className={`${s.formSubmitBtn} ${!isFormValid ? "opacity-50" : ""}`}
						disabled={saving}
					>
						<FaFloppyDisk />{" "}
						{saving
							? "Saving..."
							: initialData
							? "Save Changes"
							: "Create Profile"}
					</button>
				</div>
			</div>

			{/* Success Popup */}
			{showPopup && (
				<div className={s.popupOverlay}>
					<div className={s.popupBackdrop} />
					<div className={s.popupCard}>
						<FaCircleCheck className={s.popupIcon} />
						<h3 className={s.popupTitle}>Success!</h3>
						<p className={s.popupMessage}>
							Profile has been {initialData ? "updated" : "created"}{" "}
							successfully.
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
