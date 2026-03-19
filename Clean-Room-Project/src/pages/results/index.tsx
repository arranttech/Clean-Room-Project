import resultsDesign from "./styles";
import resultsText from "../../json/resultsText.json";
import { useEffect, useMemo, useState } from "react";
import { Home } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../components/header";
import { CleanProjectDetails } from "../../utils/logout";
import { updateProjectStatus } from "../../backend/controller/projectController";
import { getResultsByZone } from "../../backend/controller/resultsController";

// ─── Types
type ResultRow = {
  // Zone info (from tProjectZones)
  zone_id?: number;
  zone_name?: string;
  // Standard info (from tRoomStandards)
  project_system?: string;
  project_standard?: string;
  project_classification_name?: string;
  // Room info (from tZoneRooms)
  project_RoomName: string;
  // Results (from tProjectResults)
  project_Area: number | null;
  project_Volume: number | null;
  project_RoomCfm: number | null;
  project_FreshAir: number | null;
  project_ExhaustAir: number | null;
  project_DehumidCfm: number | null;
  project_Rem_Water_Vapour: number | null;
  project_ResultCfm: number | null;
  project_Room_Termi_Supply_Mod: number | null;
  project_Room_AC_Load_TR: number | null;
  project_Cfm_AC_Load_TR: number | null;
  project_Res_Cooling_Load_TR: number | null;
  project_add_Water_Vapour: number | null;
  project_HumidCfm: number | null;
  project_ResultCfm_Hot: number | null;
  project_Room_Term_Supply_Mod: number | null;
  project_Room_Heating_Load_TR: number | null;
  project_Cfm_Heating_Load_TR: number | null;
  project_Result_Heating_Load_TR: number | null;
};

// ─── System flags using resultsText.json (same source as airflowService) ─────
const t = resultsText;

function getSystemFlags(system: string) {
  const name = String(system || "")
    .toUpperCase()
    .trim();
  const showCooling =
    t.fields.SystemCond.cooling.some((s: string) => s.toUpperCase() === name) ||
    t.fields.SystemCond.heatandcold.some(
      (s: string) => s.toUpperCase() === name
    );
  const showHeating =
    t.fields.SystemCond.heating.some((s: string) => s.toUpperCase() === name) ||
    t.fields.SystemCond.heatandcold.some(
      (s: string) => s.toUpperCase() === name
    );
  return { showCooling, showHeating, isBoth: showCooling && showHeating };
}

// Component
export default function Results() {
  const s = resultsDesign;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get projectId from URL: /results/:projectId
  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = projectIdParam ? Number(projectIdParam) : null;

  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //useEffect: GET results from DB via stored procedure
  useEffect(() => {
    if (!projectId) {
      setError("No project ID found in URL.");
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getResultsByZone(projectId); // GET /v1/results/zone/:projectId
        setRows(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  //Group rows by zone_id (sorted numerically)
  const zoneGroups = useMemo(() => {
    const map = new Map<string, ResultRow[]>();
    rows.forEach((row) => {
      const zid = String(row.zone_id ?? "1");
      if (!map.has(zid)) map.set(zid, []);
      map.get(zid)!.push(row);
    });
    return Array.from(map.entries()).sort(
      (a, b) => Number(a[0]) - Number(b[0])
    );
  }, [rows]);

  // Go Back Home
  const handleGoHome = async () => {
    try {
      if (projectId) await updateProjectStatus(projectId, "COMPLETED");
    } catch (err) {
      console.error("Failed to update project status:", err);
    }
    CleanProjectDetails(dispatch);
    navigate("/dashboard");
  };

  // Loading
  if (loading)
    return (
      <>
        <Header />
        <div className={s.wrap}>
          <div
            className={s.card}
            style={{ textAlign: "center", padding: "60px" }}
          >
            <div style={{ fontSize: "1.1rem", color: "#555" }}>
              Loading results...
            </div>
          </div>
        </div>
      </>
    );

  // Error
  if (error)
    return (
      <>
        <Header />
        <div className={s.wrap}>
          <div
            className={s.card}
            style={{ textAlign: "center", padding: "60px" }}
          >
            <div style={{ color: "red" }}>{error}</div>
          </div>
        </div>
      </>
    );

  // Main UI
  return (
    <>
      <Header />
      <div className={s.wrap}>
        <div className={s.card}>
          <div className={s.headerSection}>
            <div className={s.title}>{t.title}</div>
            <div className={s.subtitle}>{t.subtitle}</div>
          </div>

          {zoneGroups.length === 0 ? (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#999" }}
            >
              No results found.
            </div>
          ) : (
            zoneGroups.map(([zoneId, zoneRows]) => {
              const first = zoneRows[0];
              const zoneName = first.zone_name || `Zone ${zoneId}`;
              const zoneSystem = first.project_system || "";
              const zoneStd = first.project_standard || "";
              const zoneClass = first.project_classification_name || "";
              const { showCooling, showHeating, isBoth } =
                getSystemFlags(zoneSystem);

              return (
                <div key={zoneId} style={{ marginBottom: "48px" }}>
                  {/* Zone header */}
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      padding: "12px 16px",
                      marginBottom: "12px",
                      background: "#f0f4ff",
                      borderRadius: "8px",
                      color: "#1e3a5f",
                    }}
                  >
                    {zoneName} — {zoneSystem} ({zoneStd} / {zoneClass})
                  </h2>

                  {/* Case 1: Heating AND Cooling , 2 separate tables */}
                  {isBoth ? (
                    <>
                      <h3 className={s.headerSubTitle}>Cooling Results</h3>
                      <div
                        className={s.tableOuter}
                        style={{ marginBottom: "40px" }}
                      >
                        <div className={s.tableScroll}>
                          <table className={s.table}>
                            <thead className={s.thead}>
                              <tr>
                                <th className={s.thRoom}>Room Name</th>
                                <th className={s.th}>{t.fields.area.label}</th>
                                <th className={s.th}>
                                  {t.fields.volume.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.roomCfm.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.freshAir.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.exhaustAir.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.Dehumidification.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.remWaterVapour.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.resultantCfm.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.RoomACloadTR.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.RoomTerminalSupply.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.cfmACLoadTR.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.ResultCoolLoadTR.label}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {zoneRows.map((r, idx) => (
                                <tr key={idx} className={s.tr}>
                                  <td className={s.tdRoom}>
                                    {r.project_RoomName || `Room ${idx + 1}`}
                                  </td>
                                  <td className={s.td}>{r.project_Area}</td>
                                  <td className={s.td}>{r.project_Volume}</td>
                                  <td className={s.td}>{r.project_RoomCfm}</td>
                                  <td className={s.td}>{r.project_FreshAir}</td>
                                  <td className={s.td}>
                                    {r.project_ExhaustAir}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_DehumidCfm}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Rem_Water_Vapour}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_ResultCfm}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Room_AC_Load_TR}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Room_Termi_Supply_Mod}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Cfm_AC_Load_TR}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Res_Cooling_Load_TR}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <h3 className={s.headerSubTitle}>Heating Results</h3>
                      <div className={s.tableOuter}>
                        <div className={s.tableScroll}>
                          <table className={s.table}>
                            <thead className={s.thead}>
                              <tr>
                                <th className={s.thRoom}>Room Name</th>
                                <th className={s.th}>{t.fields.area.label}</th>
                                <th className={s.th}>
                                  {t.fields.volume.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.roomCfm.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.freshAir.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.exhaustAir.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.AddWaterVapour.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.Humidification.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.HeatResultantCfm.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.HeatRoomTerminalSupply.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.CfmHeatingLoadTR.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.RoomHeatingLoadinTR.label}
                                </th>
                                <th className={s.th}>
                                  {t.fields.ResHeatingLoadinTR.label}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {zoneRows.map((r, idx) => (
                                <tr key={idx} className={s.tr}>
                                  <td className={s.tdRoom}>
                                    {r.project_RoomName || `Room ${idx + 1}`}
                                  </td>
                                  <td className={s.td}>{r.project_Area}</td>
                                  <td className={s.td}>{r.project_Volume}</td>
                                  <td className={s.td}>{r.project_RoomCfm}</td>
                                  <td className={s.td}>{r.project_FreshAir}</td>
                                  <td className={s.td}>
                                    {r.project_ExhaustAir}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_add_Water_Vapour}
                                  </td>
                                  <td className={s.td}>{r.project_HumidCfm}</td>
                                  <td className={s.td}>
                                    {r.project_ResultCfm_Hot}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Room_Term_Supply_Mod}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Cfm_Heating_Load_TR}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Room_Heating_Load_TR}
                                  </td>
                                  <td className={s.td}>
                                    {r.project_Result_Heating_Load_TR}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ── Case 2: Single system — show columns conditionally ── */
                    <div className={s.tableOuter}>
                      <div className={s.tableScroll}>
                        <table className={s.table}>
                          <thead className={s.thead}>
                            <tr>
                              <th className={s.thRoom}>Room Name</th>
                              <th className={s.th}>{t.fields.area.label}</th>
                              <th className={s.th}>{t.fields.volume.label}</th>
                              <th className={s.th}>{t.fields.roomCfm.label}</th>
                              <th className={s.th}>
                                {t.fields.freshAir.label}
                              </th>
                              <th className={s.th}>
                                {t.fields.exhaustAir.label}
                              </th>
                              {showCooling && (
                                <>
                                  <th className={s.th}>
                                    {t.fields.Dehumidification.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.remWaterVapour.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.resultantCfm.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.RoomACloadTR.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.RoomTerminalSupply.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.cfmACLoadTR.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.ResultCoolLoadTR.label}
                                  </th>
                                </>
                              )}
                              {showHeating && (
                                <>
                                  <th className={s.th}>
                                    {t.fields.AddWaterVapour.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.Humidification.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.HeatResultantCfm.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.HeatRoomTerminalSupply.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.CfmHeatingLoadTR.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.RoomHeatingLoadinTR.label}
                                  </th>
                                  <th className={s.th}>
                                    {t.fields.ResHeatingLoadinTR.label}
                                  </th>
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {zoneRows.length > 0 ? (
                              zoneRows.map((r, idx) => (
                                <tr key={idx} className={s.tr}>
                                  <td className={s.tdRoom}>
                                    {r.project_RoomName || `Room ${idx + 1}`}
                                  </td>
                                  <td className={s.td}>{r.project_Area}</td>
                                  <td className={s.td}>{r.project_Volume}</td>
                                  <td className={s.td}>{r.project_RoomCfm}</td>
                                  <td className={s.td}>{r.project_FreshAir}</td>
                                  <td className={s.td}>
                                    {r.project_ExhaustAir}
                                  </td>
                                  {showCooling && (
                                    <>
                                      <td className={s.td}>
                                        {r.project_DehumidCfm}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Rem_Water_Vapour}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_ResultCfm}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Room_AC_Load_TR}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Room_Termi_Supply_Mod}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Cfm_AC_Load_TR}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Res_Cooling_Load_TR}
                                      </td>
                                    </>
                                  )}
                                  {showHeating && (
                                    <>
                                      <td className={s.td}>
                                        {r.project_add_Water_Vapour}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_HumidCfm}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_ResultCfm_Hot}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Room_Term_Supply_Mod}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Cfm_Heating_Load_TR}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Room_Heating_Load_TR}
                                      </td>
                                      <td className={s.td}>
                                        {r.project_Result_Heating_Load_TR}
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className={s.emptyRow} colSpan={20}>
                                  No rooms found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* ── Go Back Home ── */}
          <div className={s.footer}>
            <p className={s.footerTitle}>Want to add another project?</p>
            <button onClick={handleGoHome} className={s.goHomeBtn}>
              <Home size={16} /> 
			Go Back Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
