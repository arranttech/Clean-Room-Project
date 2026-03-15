import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2 } from "react-icons/fi";
import s from "./screensDesign";
import AddScreen from "./addScreen";
import { getScreens } from "../../../backend/controller/screenController";

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
	const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
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
	const filteredData = screens.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.id.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "ALL" ? true : item.status === statusFilter;
		return matchesSearch && matchesStatus;
	});
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

			{/* Status Filter Tabs */}
			<div className="flex items-center gap-2 mb-4">
				{(["ALL", "Active", "Inactive"] as const).map((f) => (
					<button
						key={f}
						type="button"
						onClick={() => setStatusFilter(f)}
						className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === f
							? f === "Inactive"
								? "bg-red-500 text-white border-red-500"
								: f === "Active"
									? "bg-green-500 text-white border-green-500"
									: "bg-slate-800 text-white border-slate-800"
							: "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
							}`}
					>
						{f === "ALL" ? "All" : f}
					</button>
				))}
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
									<td className={s.td}>
										{row.status === "Inactive" ? (
											<span className={s.statusInactive}>Inactive</span>
										) : (
											<span className={s.statusActive}>Active</span>
										)}
									</td>
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
