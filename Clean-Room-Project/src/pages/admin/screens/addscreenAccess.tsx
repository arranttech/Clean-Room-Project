import { useState } from "react";
import { FiX } from "react-icons/fi";
import { FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import s from "./screenAccessDesign";

type AddscreenAccessProps = {
    initialData?: any;
    onCancel: () => void;
    onSaved: (newScreen: any) => void;
};

export default function AddscreenAccess({ initialData, onCancel, onSaved }: AddscreenAccessProps) {
    const [screenName, setScreenName] = useState(initialData?.name || "");
    const [screenStatus, setScreenStatus] = useState(initialData?.status || "Active");
    const [saving, setSaving] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [touched, setTouched] = useState(false);

    const validateScreenName = (v: string) => v.trim().length > 0 ? "" : "Screen Name is required";
    const nameError = touched ? validateScreenName(screenName) : "";
// save screen access declaration
    const saveScreenAccess = async () => {
        setTouched(true);
        if (validateScreenName(screenName)) {
            return;
        }

        setSaving(true);
        try {
            const newScreenData = {
                name: screenName,
                status: screenStatus,
            };

            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                onSaved(newScreenData);
            }, 2000);
        } catch (error) {
            console.error((error as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = screenName.trim().length > 0;
// edit screen access- only status can be changed, screen name is disabled
    return (
        <div>
            <h1 className={s.formTitle}>{initialData ? "Edit" : "Add New"} Screen</h1>
            <div className={s.formCard}>
                <div className={s.formRow}>
                    <div className={s.formGroup}>
                        <label className={s.formLabel}>
                            Screen Name <span className={s.formRequired}>*</span>
                        </label>
                        <input
                            type="text"
                            className={`${s.formInput} ${initialData ? 'bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200' : ''}`}
                            placeholder="Enter screen name"      // ---disabling screen name in edit mode
                            value={screenName}
                            onChange={(e) => setScreenName(e.target.value)}
                            disabled={!!initialData}
                        />
                        {nameError && <p className={s.formError}>{nameError}</p>}
                    </div>
                </div>

                <div className={s.formRow}>
                    <div className={s.formGroup}>
                        <label className={s.formLabel}>
                            Screen Status <span className={s.formRequired}>*</span>
                        </label>
                        <select
                            className={s.formInput}
                            value={screenStatus}
                            onChange={(e) => setScreenStatus(e.target.value)}  // edit screen access- only status can be changed, screen name is disabled
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className={s.formDivider}>
                    <div className={s.formFooter}>
                        <button type="button" onClick={onCancel} className={s.formCancelBtn}>
                            <FiX /> Cancel
                        </button>
                        <button
                            type="button"
                            onClick={saveScreenAccess}
                            className={`${s.formSubmitBtn} ${!isFormValid ? "opacity-60 cursor-not-allowed" : ""}`}
                            disabled={saving || !isFormValid}
                        >
                            <FaFloppyDisk />
                            {saving ? (initialData ? "Updating..." : "Creating...") : (initialData ? "Update Screen" : "Create Screen")}
                        </button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className={s.popupOverlay}>
                    <div className={s.popupBackdrop} />
                    <div className={s.popupCard}>
                        <FaCircleCheck className={s.popupIcon} />
                        <h2 className={s.popupTitle}>{initialData ? "Screen Updated!" : "Screen Saved!"}</h2>     {/* screen updated or saved popup */}
                        <p className={s.popupMessage}>
                            {initialData ? "Screen has been successfully updated." : "Screen has been successfully saved."}
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