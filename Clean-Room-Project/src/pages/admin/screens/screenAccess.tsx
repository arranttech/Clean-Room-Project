import { useState } from "react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import s from "./screenAccessDesign";
import AddscreenAccess from "./addscreenAccess";

type ScreenAccess = {
    id: string;
    name: string;
    status: string;
};

export default function ScreenAccess() {
    const [screens, setScreens] = useState<ScreenAccess[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [editData, setEditData] = useState<ScreenAccess | null>(null);
    // delete screen access declaration
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this screen?")) {
            setScreens((prev) => prev.filter((s) => s.id !== id));
        }
    };
    // filter screen access based on search declaration
    const filteredData = screens.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // if i go to actions and enter edit button it should open the add screen access form with the data of the screen access
    if (showAdd || editData) {
        return (
            <AddscreenAccess
                initialData={editData}
                onCancel={() => {
                    setShowAdd(false);
                    setEditData(null);
                }}
                onSaved={(newScreen) => {
                    setShowAdd(false);
                    if (editData) {
                        setScreens((prev) =>
                            prev.map((s) => (s.id === editData.id ? { ...newScreen, id: editData.id } : s))
                        );
                        setEditData(null);
                    } else {
                        setScreens((prev) => [{ ...newScreen, id: `SCR-${prev.length + 1}` }, ...prev]);  // new screen id is generated 
                    }
                }}
            />
        );
    }

    return (
        <div>
            {/* Panel Header */}
            <div className={s.panelHeader}>
                <h1 className={s.panelTitle}>Screens</h1>
                <button type="button" onClick={() => setShowAdd(true)} className={s.addBtn}>
                    <FiPlus /> Add Screen
                </button>
            </div>

            {/* Search Bar */}
            <div className={s.searchWrap}>
                <FiSearch className={s.searchIcon} />
                <input
                    type="text"
                    className={s.searchInput}
                    placeholder="Search screens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className={s.tableWrap}>
                <table className={s.table}>
                    <thead className={s.thead}>
                        <tr>
                            <th className={s.th}>Screen ID</th>
                            <th className={s.th}>Screen Name</th>
                            <th className={s.th}>Screen Status</th>
                            <th className={s.thActions}>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={s.tbody}>
                        {filteredData.length > 0 ? (
                            filteredData.map((row) => (
                                <tr key={row.id} className={s.tr}>
                                    <td className={s.tdScreenId}>{row.id}</td>
                                    <td className={s.tdScreenName}>{row.name}</td>
                                    <td className={s.td}>{row.status}</td>
                                    <td className={s.tdActions}>
                                        <button className={s.editBtn} title="Edit screen access" onClick={() => setEditData(row)}>  {/* edit screen access button opens the add screen access form with the data of the screen access */}
                                            <FiEdit2 size={15} />
                                        </button>
                                        <button className={s.deleteBtn} title="Delete screen access" onClick={() => handleDelete(row.id)}> {/* delete screen access button opens the delete screen access popup */}
                                            <FiTrash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className={s.emptyRow}>        {/* if no screens are found, it will display no screens found */}
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
