import { useState, useEffect } from "react";
import { FiSearch, FiPlus, FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import s from "./profileDesign";
import AddProfile from "./addProfile";
import { getProfiles } from "../../../backend/controller/profileController";

type ProfileToken = {
	id: string;
	name: string;
	description: string;
	status: "Active" | "Inactive";
};

const initialProfiles: ProfileToken[] = [];

export default function CreateEditProfile() {
	const [profiles, setProfiles] = useState<ProfileToken[]>(initialProfiles);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<"ALL" | "Active" | "Inactive">("ALL");
	const [showAdd, setShowAdd] = useState(false);
	const [editData, setEditData] = useState<ProfileToken | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 10;

	const fetchProfiles = async () => {
		try {
			const response = await getProfiles();
			if (response.profiles) {
				setProfiles(response.profiles);
			}
		} catch (err) {
			console.error("Failed to fetch profiles:", err);
		}
	};

	useEffect(() => {
		fetchProfiles();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, statusFilter]);

	const filteredData = profiles.filter((item) => {
		const matchesSearch =
			item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "ALL" ? true : item.status === statusFilter;
		return matchesSearch && matchesStatus;
	}).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

	const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	if (showAdd || editData) {
		return (
			<AddProfile
				initialData={editData}
				onCancel={() => {
					setShowAdd(false);
					setEditData(null);
				}}
				onSaved={async () => {
					setShowAdd(false);
					setEditData(null);
					await fetchProfiles();
				}}
			/>
		);
	}

	return (
		<div>
			{/* Panel Header */}
			<div className={s.panelHeader}>
				<div className={s.panelTitleWrap}>
					<h1 className={s.panelTitle}>Create/Edit Profile</h1>
					<p className={s.panelSubtitle}>
						Create new profiles or edit existing ones
					</p>
				</div>
				<button
					type="button"
					onClick={() => setShowAdd(true)}
					className={s.addBtn}
				>
					<FiPlus /> Add Profile
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
					placeholder="Search profiles..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>

			{/* Table */}
			<div className={s.tableWrap}>
				<table className={s.table}>
					<thead className={s.thead}>
						<tr>
							<th className={s.th}>Profile Name</th>
							<th className={s.th}>Description</th>
							<th className={s.th}>Status</th>
							<th className={s.thActions}>Actions</th>
						</tr>
					</thead>
					<tbody className={s.tbody}>
						{paginatedData.length > 0 ? (
							paginatedData.map((row) => (
								<tr key={row.id} className={s.tr}>
									<td className={s.tdProfileName}>{row.name}</td>
									<td className={s.td}>{row.description}</td>
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
											title="Edit profile"
											onClick={() => setEditData(row)}
										>
											<FiEdit2 size={16} />
										</button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} className={s.emptyRow}>
									No profiles found.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className={s.paginationWrap}>
					<div className={s.paginationInfo}>
						Showing <span className="text-slate-900">{startIndex + 1}</span> to{" "}
						<span className="text-slate-900">
							{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}
						</span>{" "}
						of <span className="text-slate-900">{filteredData.length}</span> entries
					</div>

					<div className={s.paginationControls}>
						<button
							type="button"
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
							className={s.paginationNavBtn(currentPage === 1)}
						>
							<FiChevronLeft className="text-lg" /> Previous
						</button>

						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<button
								key={page}
								type="button"
								onClick={() => setCurrentPage(page)}
								className={s.paginationBtn(currentPage === page, false)}
							>
								{page}
							</button>
						))}

						<button
							type="button"
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
							className={s.paginationNavBtn(currentPage === totalPages)}
						>
							Next <FiChevronRight className="text-lg" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
