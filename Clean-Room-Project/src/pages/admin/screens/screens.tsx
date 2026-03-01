import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2 } from "react-icons/fi";
import s from "./screensDesign";
import AddScreen from "./addScreen";
import { getScreens } from "../../../backend/controller/screenApi";

type Screen = {
	id: string;
	name: string;
	status: string;
};

type ScreensProps = {
	onCountChange?: (count: number) => void;
};

export default function Screens({ onCountChange }: ScreensProps) {
	const [screens, setScreens] = useState<Screen[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [showAdd, setShowAdd] = useState(false);
	const [editData, setEditData] = useState<Screen | null>(null);

	// Fetch screens on load
	useEffect(() => {
		loadScreens();
	}, []);

	const loadScreens = async () => {
		try {
			const res = await getScreens();
			if (res && res.screens) {
				// Map the DB column names (screen_id, screen_name, screen_status) to the frontend Screen type
				const formatted = res.screens.map((r: any) => ({
					id: `SCR-${r.screen_id}`, // Prefix with SCR- just for display
					name: r.screen_name,
					status: r.screen_status,
				}));
				setScreens(formatted);
				if (onCountChange) onCountChange(formatted.length);
			}
		} catch (error) {
			console.error("Failed to load screens:", error);
		}
	};

	// filter screen based on search declaration
	const filteredData = screens.filter(
		(item) =>
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.id.toLowerCase().includes(searchTerm.toLowerCase())
	);
	// if i go to actions and enter edit button it should open the add screen form with the data of the screen
	if (showAdd || editData) {
		return (
			<AddScreen
				initialData={editData}
				onCancel={() => {
					setShowAdd(false);
					setEditData(null);
				}}
				onSaved={() => {
					setShowAdd(false);
					setEditData(null);
					loadScreens(); // Refresh data from database
				}}
			/>
		);
	}

	return (
		<div>
			{/* Panel Header */}
			<div className={s.panelHeader}>
				<h1 className={s.panelTitle}>Screens</h1>
				<button
					type="button"
					onClick={() => setShowAdd(true)}
					className={s.addBtn}
				>
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
										<button
											className={s.editBtn}
											title="Edit screen"
											onClick={() => setEditData(row)}
										>
											{" "}
											{/* edit screen button opens the add screen form with the data of the screen */}
											<FiEdit2 size={15} />
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className={s.emptyRow}>
									{" "}
									{/* if no screens are found, it will display no screens found */}
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
