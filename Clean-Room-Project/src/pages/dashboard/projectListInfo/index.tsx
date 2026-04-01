import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import s from "./style";
import { FaArrowLeft, FaLayerGroup, FaCalculator } from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import Header from "../../../components/header";
import { useAppSelector } from "../../../redux/hooks";
import { getCompletedProjects } from "../../../backend/controller/projectController";

type Room = {
  project_RoomName: string;
  room_Length: number;
  room_Width: number;
  room_Height: number;
  room_Occupancy: number;
  room_Equipment_Load: number;
  room_Lighting: number;
  room_FreshAir: number;
  room_ExhaustAir: number;
};

type Standard = {
  project_standard_id: number;
  project_standard: string;
  project_classification_name: string;
  project_ACPH: number;
  rooms: Room[];
};

type Project = {
  project_id: number;
  project_unique_id: string;
  project_name: string;
  project_unit_branch: string;
  created_at: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  customer_email_id: string;
  project_Industry: string;
  project_Location: string;
  project_Handling: string;
  created_by?: string;
  updated_by?: string;
  standards: Standard[];
};

const InfoItem = ({ label, value }: any) => (
  <div className={s.roomCardInfo}>
    <p className={s.cardInfoTitle}>{label}</p>
    <p className={s.cardInfoValue}>{value ?? "—"}</p>
  </div>
);

const RoomSection = ({ room, index }: { room: Room; index: number }) => (


  <div className="bg-gray-100 border rounded-xl p-6 mb-6 shadow-sm">
    <div className="flex justify-between mb-4">
      <h3 className="text-lg font-semibold">{room.project_RoomName}</h3>
      <span className="text-sm text-gray-500">Room #{index + 1}</span>
    </div>

    <div className={s.roomCardValue + " grid grid-cols-2 md:grid-cols-4 gap-4"}>
      <InfoItem label="Length" value={room.room_Length} />
      <InfoItem label="Width" value={room.room_Width} />
      <InfoItem label="Height" value={room.room_Height} />
      <InfoItem label="Occupancy" value={room.room_Occupancy} />
      <InfoItem label="Equipment Load" value={room.room_Equipment_Load} />
      <InfoItem label="Lighting" value={room.room_Lighting} />
      <InfoItem label="Fresh Air" value={room.room_FreshAir} />
      <InfoItem label="Exhaust Air" value={room.room_ExhaustAir} />
    </div>
  </div>
);

export default function ProjectListInfo() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTabs, setActiveTabs] = useState<Record<number, number>>({});
  const userId = useAppSelector((state: any) => state.user?.user_login_id);
  const loggedInUser = useAppSelector((state: any) => state.user);

  function formatDate(raw: string): string {
    try {
      return new Date(raw).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      });
    } catch {
      return raw;
    }
  }

  function parseJsonArray(raw: string): string {
    try {
      const arr = JSON.parse(raw) as string[];
      return Array.isArray(arr) ? arr.join(", ") : raw;
    } catch {
      return raw ?? "—";
    }
  }
  function parseJson(raw: string): string[] {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  const { projectId } = useParams<{ projectId: string }>();
  if (!projectId) {
    return <p>No project selected.</p>;
  }


  // Convert to number
  const projectIdNumber = parseInt(projectId!, 10);
  if (isNaN(projectIdNumber)) {
    return <p>Invalid project ID.</p>;
  }

  useEffect(() => {
    if (!userId) return;

    const loadProjects = async () => {
      try {
       
        const res = await getCompletedProjects(
          loggedInUser.user_login_id,
          loggedInUser.customer_id
        );

      
        const rows = res.projects.filter((p: any) => p.project_id === projectIdNumber);

       
        const projectMap: Record<number, any> = {};

        rows.forEach((row: any, index: number) => {

          console.log(`\n========= PROCESSING ROW ${index} =========`);
          console.log("Project:", row.project_id);
          console.log("Standard:", row.project_standard);
          console.log("Room:", row.project_RoomName);

          // PROJECT
          if (!projectMap[row.project_id]) {

            console.log("Creating PROJECT:", row.project_id);

            projectMap[row.project_id] = {
              project_id: row.project_id,
              project_unique_id: row.project_unique_id,
              project_name: row.project_name,
              created_at: row.created_at,
              created_by: row.created_by,
              updated_by: row.updated_by,
              customer_name: row.customer_name,
              project_unit_branch: row.project_unit_branch,
              customer_address: row.customer_address,
              customer_phone: row.customer_phone,
              customer_email_id: row.customer_email_id,
              project_Location: row.project_Location,
              project_Industry: row.project_Industry,
              project_Handling: row.project_Handling,
              standards: {}
            };
          }

          // STANDARD
          if (!projectMap[row.project_id].standards[row.project_standard_id]) {

            console.log(
              "Creating STANDARD:",
              row.project_standard,
              "(ID:", row.project_standard_id, ")"
            );

            projectMap[row.project_id].standards[row.project_standard_id] = {
              project_standard_id: row.project_standard_id,
              project_standard: row.project_standard,
              project_classification_name: row.project_classification_name,
              project_ACPH: row.project_ACPH,
              rooms: []
            };
          }

          const standard =
            projectMap[row.project_id].standards[row.project_standard_id];

          console.log(
            "Rooms BEFORE insert:",
            standard.rooms.map((r: Room) => r.project_RoomName)
          );

          const exists = standard.rooms.some(
            (r: Room) => r.project_RoomName === row.project_RoomName
          );

          if (!exists) {

            console.log(
              `Adding ROOM '${row.project_RoomName}' to STANDARD '${row.project_standard}'`
            );

            standard.rooms.push({
              project_RoomName: row.project_RoomName,
              room_Length: row.room_Length,
              room_Width: row.room_Width,
              room_Height: row.room_Height,
              room_Occupancy: row.room_Occupancy,
              room_Equipment_Load: row.room_Equipment_Load,
              room_Lighting: row.room_Lighting,
              room_FreshAir: row.room_FreshAir,
              room_ExhaustAir: row.room_ExhaustAir
            });

          } else {

            console.log("Room already exists, skipping:", row.project_RoomName);

          }

          console.log(
            "Rooms AFTER insert:",
            standard.rooms.map((r: Room) => r.project_RoomName)
          );
        });

        const finalProjects: Project[] = Object.values(projectMap).map(
          (p: any) => ({
            ...p,
            standards: Object.values(p.standards)
          })
        );

        console.log("\n========= FINAL GROUPED STRUCTURE =========");
        console.log(JSON.stringify(finalProjects, null, 2));

        setProjects(finalProjects);

        const tabs: Record<number, number> = {};
        finalProjects.forEach((p) => {
          tabs[p.project_id] = p.standards[0]?.project_standard_id;
        });

        setActiveTabs(tabs);

      } catch (err) {
        console.error("Project load error:", err);
      }
    };

    loadProjects();
  }, [loggedInUser?.user_login_id, loggedInUser?.customer_id]);

  const handleTabClick = (projectId: number, standardId: number) => {

    console.log(
      "Switching TAB → Project:",
      projectId,
      "Standard:",
      standardId
    );

    setActiveTabs((prev) => ({
      ...prev,
      [projectId]: standardId
    }));
  };
  if (!projects.length) {
    return (
      <>
        <Header />
        <div className="p-10 text-center text-gray-500">
          No project data found.
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      {projects.map((p) => {

        console.log("\nRendering PROJECT:", p.project_name);
        console.log("Standards:", p.standards);

        const activeStandard =
          p.standards.find(
            (s) => s.project_standard_id === activeTabs[p.project_id]
          ) || p.standards[0];

        console.log(
          "Active STANDARD:",
          activeStandard?.project_standard,
          "Rooms:",
          activeStandard?.rooms.map(r => r.project_RoomName)
        );

        return (
          <div key={p.project_id} className="bg-gray-100 min-h-screen p-10">

            <Link to="/projects" className={s.backButton}>
              <FaArrowLeft /> Back to Projects
            </Link>

            <div className={s.projectInfoCard}>
              <div className={s.sectionHeader}>
                <h1 className={s.projectTitle}>{p.project_name}</h1>
                <span className={s.projectProgress}>
                  Completed
                </span>
              </div>


              <p className={s.projectID}><span className={s.projectLabel}>Project ID:</span> {p.project_unique_id}</p>
              <p className={s.createdDate}>
                <span className={s.projectLabel}>Created:</span> {formatDate(p.created_at)}
              </p>
              <p className={s.createdDate}>
                <span className={s.projectLabel}>Created By:</span> {p.created_by || "—"}
              </p>

            </div>

            <div className={s.customerInfoCard}>
              <h2 className={s.cardTitle}>
                <MdApartment className="text-blue-700 text-3xl" /> Customer Information
              </h2>

              <div className={s.infoGrid}>

                <div>
                  <p className={s.projectLabel}>Customer Name</p>
                  <p className={s.projectValues}>{p.customer_name || "—"}</p>
                </div>

                <div>
                  <p className={s.projectLabel}>Unit/Branch Name</p>
                  <p className={s.projectValues}>{parseJsonArray(p.project_unit_branch) || "—"}</p>
                </div>

                <div>
                  <p className={s.projectLabel}>Address</p>
                  <p className={s.projectValues}>{p.customer_address || "—"}</p>
                </div>

                <div>
                  <p className={s.projectLabel}>Location</p>
                  <p className={s.projectValues}>{p.project_Location || "—"}</p>
                </div>

                <div>
                  <p className={s.projectLabel}>Phone</p>
                  <p className={s.projectValues}>{p.customer_phone || "—"}</p>
                </div>

                <div>
                  <p className={s.projectLabel}>Email</p>
                  <p className={s.projectValues + " text-blue-600"}>{p.customer_email_id || "—"}</p>
                </div>

                <div>
                  <p className={s.projectLabel}>Industry Sectors</p>
                  {/* <div className="flex gap-2 mt-1">
                    <span className={s.projectValues + " bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs"}>
                      {parseJsonArray(p.project_Industry) || "—"}
                    </span>

                  </div> */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {parseJson(p.project_Industry).length > 0 ? (
                      parseJson(p.project_Industry).map((item, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className={s.projectValues}>—</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className={s.projectLabel}>Handling Types</p>
                  {/* <div className="flex gap-2 mt-1">
                    <span className={s.projectValues + " bg-gray-200 px-3 py-1 rounded-md text-xs"}>
                      {parseJsonArray(p.project_Handling) || "—"}
                    </span>

                  </div> */}

                  <div className="flex flex-wrap gap-2 mt-1">
                    {parseJson(p.project_Handling).length > 0 ? (
                      parseJson(p.project_Handling).map((item, i) => (
                        <span
                          key={i}
                          className="bg-gray-200 px-3 py-1 rounded-md text-xs"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className={s.projectValues}>—</span>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* STANDARD TABS */}

            <div className="flex gap-3 mb-6">
              {p.standards.map((std, index) => (
                <button
                  key={std.project_standard_id}
                  onClick={() =>
                    handleTabClick(p.project_id, std.project_standard_id)
                  }
                  className={`px-4 py-2 rounded ${activeTabs[p.project_id] === std.project_standard_id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                    }`}
                >

                  {/* {std.project_standard} */}
                  Zone {index + 1}

                </button>

              ))}

            </div>

            {activeStandard && (<div className={s.customerInfoCard}>
              <h2 className={s.cardTitle}>
                <FaLayerGroup className="text-blue-700 text-2xl" /> Classification Details
              </h2>

              <div className={s.projectDetails}>
                <div>
                  <p className={s.projectLabel}>Standard</p>
                  <p className={s.projectValues}>{activeStandard.project_standard || "—"}</p>
                </div>

                <div>
                  <p className={s.projectLabel}>Class</p>
                  <p className={s.projectValues}>{activeStandard.project_classification_name || "—"}</p>
                </div>

                {/* <div>
              <p className={s.projectLabel}>ACPH Range</p>
              <p className={s.projectValues}>30 - 60</p>
            </div> */}

                <div>
                  <p className={s.projectLabel}>Selected ACPH</p>
                  <p className={s.projectValues}>{activeStandard.project_ACPH ? activeStandard.project_ACPH.toString() : "__"}</p>
                </div>
              </div>
            </div>)}

            {/* ROOMS */}

            {activeStandard && (
              <div className={s.customerInfoCard}>
                <h2 className={s.cardTitle}>
                  <FaCalculator className="text-blue-700 text-2xl" /> Rooms ({activeStandard.rooms.length})
                </h2>
                <div className={s.roomCardInfo}>
                  <div className={s.roomCardValue}>
                    {activeStandard.rooms.map((room, i) => (
                      <RoomSection key={i} room={room} index={i} />
                    ))}
                  </div>


                </div>

              </div>
            )}
          </div>
        );
      })}
    </>
  );
}