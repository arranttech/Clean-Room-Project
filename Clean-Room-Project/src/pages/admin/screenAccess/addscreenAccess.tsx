import { useState } from "react";
import { FiX } from "react-icons/fi";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import s from "./screenAccessDesign";

type AddscreenAccessProps = {
    initialData?: any;
    onCancel: () => void;
    onSaved: (newScreen: any) => void;
};

type PermissionLevel = "Full Access" | "Read Only" | "No Access";

export default function AddscreenAccess({ initialData, onCancel, onSaved }: AddscreenAccessProps) {
    const AVAILABLE_SCREENS = [
        "Dashboard",
        "Project Creation",
        "Room Details",
        "Classification",
        "Company Profile",
        "Admin Management",
        "User Management",
        "Reports"
    ];

    const getInitialPermissions = () => {
        const perms: Record<string, PermissionLevel> = {};
        AVAILABLE_SCREENS.forEach(screen => {
            perms[screen] = "No Access";
        });
        if (initialData?.name) {
            const arr = initialData.name.split(', ');
            arr.forEach((screen: string) => {
                if (perms[screen] !== undefined) perms[screen] = "Read Only";
            });
        }
        return perms;
    };

    const [permissions, setPermissions] = useState<Record<string, PermissionLevel>>(getInitialPermissions());
    const [roleAccess, setRoleAccess] = useState(initialData?.roles || "");
    const [saving, setSaving] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [touched, setTouched] = useState(false);

    //automatically enables save button after choosing role access.
    const validateRoleAccess = (v: string) => v.length > 0 ? "" : "Role Access is required";

    // if user tries to save without selecting role access, shows error messages under each field
    const roleError = touched ? validateRoleAccess(roleAccess) : "";

    // it handles permission changes for each screen and updates the permissions state accordingly
    const handlePermissionChange = (screen: string, level: PermissionLevel) => {
        setPermissions(prev => ({ ...prev, [screen]: level }));
    };
    // when the user clicks the save button, it validates the form and if valid, it constructs a new screen data object and simulates a save operation with a popup confirmation
    const saveScreenAccess = async () => {
        setTouched(true);
        if (validateRoleAccess(roleAccess)) {
            return;
        }

        setSaving(true);
        try {
            const activeScreens = Object.entries(permissions)
                .filter(([_, level]) => level !== "No Access")
                .map(([name]) => name);

            const newScreenData = {
                name: activeScreens.join(', '),
                roles: roleAccess,
                status: initialData?.status || "Active",
                createdDate: initialData?.createdDate || new Date().toISOString().split("T")[0],
                permissions: permissions
            };
            // shows a success popup for 2 seconds after saving the screen access, 
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                //calls the onSaved callback with the new screen data
                onSaved(newScreenData);
            }, 2000);
        } catch (error) {
            console.error((error as Error).message);
        } finally {
            setSaving(false);
        }
    };
    // if role access is empty, disable the save button
    const isFormValid = roleAccess.length > 0;

    return (
        // --- Main Form Layout --- //
        <div>
            <h1 className={s.formTitle}>{initialData ? "Edit" : "Add New"} Screen Access</h1>.     {/* ---edit screen access if initialData is provided, otherwise add new screen access--- */}
            <div className={s.formCard}>

                {/* ---Role Access Dropdown --- */}

                <div className={s.formRow}>
                    <div className={s.formGroup}>
                        <label className={s.formLabel}>
                            Role Access <span className={s.formRequired}>*</span>
                        </label>
                        <select
                            className={s.formInput}
                            value={roleAccess}
                            onChange={(e) => setRoleAccess(e.target.value)}
                        >
                            <option value="">Select Role Access</option>
                            <option value="Admin">Admin</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Quality Assurance Engineer">Quality Assurance Engineer</option>
                        </select>
                        {roleError && <p className={s.formError}>{roleError}</p>}
                    </div>
                </div>

                <div className={s.formRow}>
                    <div className={s.formGroup}>
                        <label className={s.formLabel}>
                            Screen Permissions <span className={s.formRequired}>*</span>
                        </label>
                        <div className={s.permissionTableWrap}>
                            <table className={s.permissionTable}>
                                <thead className={s.permissionThead}>
                                    <tr>
                                        <th className={s.permissionTh}>Screen Name</th>
                                        <th className={s.permissionTh}>Full Access</th>
                                        <th className={s.permissionTh}>Read Only</th>
                                        <th className={s.permissionTh}>No Access</th>
                                    </tr>
                                </thead>

                                {/* ---Dynamically render rows for each available screen with radio buttons for permission levels--- */}

                                <tbody className={s.permissionTbody}>
                                    {AVAILABLE_SCREENS.map(screen => (
                                        <tr key={screen} className={s.permissionTr}>
                                            <td className={s.permissionTd}>{screen}</td>
                                            <td className={s.permissionTd}>
                                                <label className={s.permissionRadioWrapper}>
                                                    <input
                                                        type="radio"
                                                        name={`perm_${screen}`}
                                                        className={s.permissionRadio}
                                                        checked={permissions[screen] === "Full Access"}
                                                        onChange={() => handlePermissionChange(screen, "Full Access")}
                                                    />
                                                </label>
                                            </td>
                                            <td className={s.permissionTd}>
                                                <label className={s.permissionRadioWrapper}>
                                                    <input
                                                        type="radio"
                                                        name={`perm_${screen}`}
                                                        className={s.permissionRadio}
                                                        checked={permissions[screen] === "Read Only"}
                                                        onChange={() => handlePermissionChange(screen, "Read Only")}
                                                    />
                                                </label>
                                            </td>
                                            <td className={s.permissionTd}>
                                                <label className={s.permissionRadioWrapper}>
                                                    <input
                                                        type="radio"
                                                        name={`perm_${screen}`}
                                                        className={s.permissionRadio}
                                                        checked={permissions[screen] === "No Access"}
                                                        onChange={() => handlePermissionChange(screen, "No Access")}
                                                    />
                                                </label>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className={s.formDivider}>
                    <div className={s.formFooter}>
                        <button type="button" onClick={onCancel} className={s.formCancelBtn}>
                            <FiX /> Cancel
                        </button>


                        {/* ---disabling save button if form is not valid--- */}
                        <button
                            type="button"
                            onClick={saveScreenAccess}
                            className={`${s.formSubmitBtn} ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
                            disabled={saving || !isFormValid}
                        >
                            <FaFloppyDisk />
                            {saving ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Screen Access" : "Create Screen Access")}
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className={s.popupOverlay}>

                    {/* --- Success Popup --- */}
                    <div className={s.popupBackdrop} />
                    <div className={s.popupCard}>
                        <FaCircleCheck className={s.popupIcon} />
                        <h2 className={s.popupTitle}>{initialData ? "Screen Updated!" : "Screen Saved!"}</h2>
                        <p className={s.popupMessage}>
                            {initialData ? "Screen access has been successfully updated." : "Screen has been successfully saved."}
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