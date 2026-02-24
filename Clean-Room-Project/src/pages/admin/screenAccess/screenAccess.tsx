import { useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import s from "./screenAccessDesign";
import AddscreenAccess from "./addscreenAccess";
import { Tooltip } from "../../../components/Tooltip";
import constants from "../../../json/constants.json";


//table data type
type ScreenAccess = {
    id: string;
    name: string;
    roles: string;
    permissions?: Record<string, string>;
};


export default function ScreenAccess() {
    const [screens, setScreens] = useState<ScreenAccess[]>([]); //manages all saved screens
    const [searchTerm, setSearchTerm] = useState(""); //manages search input
    const [showAdd, setShowAdd] = useState(false); //controls visibility of add/edit form
    const [editData, setEditData] = useState<ScreenAccess | null>(null); //stores data of the screen being edited, null when adding new screen
    // Triggers a built-in browser confirmation popup.
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this screen access?")) {
            setScreens((prev) => prev.filter((s) => s.id !== id));
        }
    };
    // Filters screens based on search term matching name, id, or roles (case-insensitive)
    const filteredData = screens.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.roles.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Added Edit data to the screen access ---
    if (showAdd || editData) {
        return (
            <AddscreenAccess
                initialData={editData}
                onCancel={() => {   //if user cancels the add/edit operation, close the form and reset editData to null
                    setShowAdd(false);
                    setEditData(null);
                }}
                onSaved={(newScreen) => { //when user saves the new or edited screen access, update the screens state accordingly. If editData is not null, it means we are editing an existing screen, so we map through the screens and replace the old data with the new data. If editData is null, it means we are adding a new screen, so we add it to the beginning of the screens array.
                    setShowAdd(false);
                    if (editData) {
                        setScreens((prev) =>
                            prev.map((s) => (s.id === editData.id ? { ...newScreen, id: editData.id } : s))
                        );
                        setEditData(null);
                    } else {
                        // Generating a simple incremental ID based on the current length of the screens array.
                        setScreens((prev) => [{ ...newScreen, id: prev.length + 1 }, ...prev]);
                    }
                }}
            />
        );
    }
    // tooltip content - screen permissions 
    const tooltipContent = (
        <div className={s.tooltipWrap}>
            <style>{`
                #screenPermissions {
                    background-color: white !important;
                    color: #1e293b !important;
                    border: 1px solid #e2e8f0 !important;
                }
                #screenPermissions .react-tooltip-arrow {
                    border-top-color: white !important;
                    border-bottom-color: white !important;
                }
                #screenPermissions::after, #screenPermissions::before {
                    border-color: white transparent transparent transparent !important;
                }
            `}</style>
            {constants.Tooltip.screenPermissionsTooltip.map((item, idx) => (
                <div key={idx} className={s.tooltipItem}>
                    <span className={s[`tooltipDot${item.color}` as keyof typeof s]}></span>
                    <span className={s.tooltipText}>{item.label}</span>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            {/* Panel Header */}
            <div className={s.panelHeader}>
                <h1 className={s.panelTitle}>Screen Access</h1>
                <button type="button" onClick={() => setShowAdd(true)} className={s.addBtn}>
                    <FiPlus /> Add Screen Access
                </button>
            </div>

            {/* Search Bar */}
            <div className={s.searchWrap}>
                <FiSearch className={s.searchIcon} />
                <input
                    type="text"
                    className={s.searchInput}
                    placeholder="Search screen access..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className={s.tableWrap}>
                <table className={s.table}>
                    <thead className={s.thead}>
                        <tr>
                            <th className={s.th}>Role Access</th>
                            <th className={s.th}>Screen Permissions{" "}<Tooltip id="screenPermissions" content={tooltipContent} /></th>
                            <th className={s.thActions}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={s.tbody}>
                        {filteredData.length > 0 ? (
                            filteredData.map((row) => (
                                <tr key={row.id} className={s.tr}>
                                    <td className={s.tdScreenId}>{row.roles}</td>
                                    {/* ---Displaying screen permissions as badges with different colors, based on access levels--- */}
                                    <td className={s.td}>
                                        <div className="flex flex-wrap gap-2">
                                            {row.permissions ? (
                                                Object.entries(row.permissions).map(([screenName, level]) => {
                                                    let badgeClass = "";
                                                    if (level === "Full Access") badgeClass = "bg-green-100 text-green-700";
                                                    else if (level === "Read Only") badgeClass = "bg-slate-100 text-slate-700";
                                                    else if (level === "No Access") badgeClass = "bg-red-100 text-red-700";

                                                    return (
                                                        <span key={screenName} className={`px-2.5 py-1 text-[10px] rounded-md ${badgeClass}`}>
                                                            {screenName}
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                row.name && row.name.split(', ').map((screenName, idx) => (
                                                    <span key={idx} className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-slate-100 text-slate-700">
                                                        {screenName}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>
                                    {/* ---Action buttons for edit and delete--- */}
                                    <td className={s.tdActions}>
                                        <button className={s.editBtn} title="Edit screen access" onClick={() => setEditData(row)}>
                                            <FiEdit2 size={15} />
                                        </button>
                                        <button className={s.deleteBtn} title="Delete screen access" onClick={() => handleDelete(row.id)}>
                                            <FiTrash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className={s.emptyRow}>
                                    No screens found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
