import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import { Home } from "lucide-react";
import resultsDesign from "./styles";
import resultsText from "../../json/resultsText.json";
import { getResultsByZone } from "../../backend/controller/resultsController";
import { useAppSelector } from "../../redux/hooks";
import { useDispatch } from "react-redux";
import { CleanProjectDetails } from "../../utils/logout";

type RoomResult = {
  roomId: number;
  projectId: number;
  zoneId: number | string;
  roomName: string;
  area: number | string;
  volume: number | string;
  roomCfm: number | string;
  freshAir: number | string;
  exhaustAir: number | string;
  dehumid: number | string;
  removedWaterVapor: number | string;
  resultant: number | string;
  roomACValue: number | string;
  roomTermSupplyValue: number | string;
  cfmACLoadTRValue: number | string;
  resultCoolLoadTRValue: number | string;
  AddWaterVapour: number | string;
  humidcfm: number | string;
  resultantCfmHot: number | string;
  heatroomtermsup: number | string;
  cfmHeatLoadTRValue: number | string;
  roomHeatLoad: number | string;
  resultHeatLoadTR: number | string;
};

export default function Results() {
  const s = resultsDesign;
  const t = resultsText;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [rooms, setRooms] = useState<RoomResult[]>([]);
  const [loading, setLoading] = useState(true);

  const projectId = location.state?.projectId;
  const zoneId = location.state?.zoneIdFromNav;

  const system = useAppSelector((state: any) => state.standards.system);

  console.log("ZONE + SYSTEM:", zoneId, system);

  /* ───── SYSTEM FLAGS ───── */

  const systemName = String(system || "").toUpperCase().trim();

  const isCoolingSystem = t.fields.SystemCond.cooling.some(
    (name: string) => name.toUpperCase() === systemName
  );

  const isHeatingSystem = t.fields.SystemCond.heating.some(
    (name: string) => name.toUpperCase() === systemName
  );

  const isHeatingandCoolingSystem = t.fields.SystemCond.heatandcold.some(
    (name: string) => name.toUpperCase() === systemName
  );

  const showCooling = isCoolingSystem || isHeatingandCoolingSystem;
  const showHeating = isHeatingSystem || isHeatingandCoolingSystem;

  /* ───── FETCH RESULTS ───── */

  useEffect(() => {
    const fetchResults = async () => {
      if (!projectId || !zoneId) {
        console.error("Missing projectId or zoneId");
        setLoading(false);
        return;
      }

      try {
        const result = await getResultsByZone(projectId);

        if (!result || result.length === 0) {
          setRooms([]);
        } else {
          const mappedData: RoomResult[] = result
            .filter((row: any) => String(row.project_ZoneId) === String(zoneId))
            .map((row: any) => ({
              roomId: row.project_RoomId,
              projectId: row.project_id,
              zoneId: row.project_ZoneId,
              roomName: row.project_RoomName,
              area: row.project_Area,
              volume: row.project_Volume,
              roomCfm: row.project_RoomCfm,
              freshAir: row.project_FreshAir,
              exhaustAir: row.project_ExhaustAir,
              dehumid: row.project_DehumidCfm,
              removedWaterVapor: row.project_Rem_Water_Vapour,
              resultant: row.project_ResultCfm,
              roomACValue: row.project_Room_AC_Load_TR,
              roomTermSupplyValue: row.project_Room_Termi_Supply_Mod,
              cfmACLoadTRValue: row.project_Cfm_AC_Load_TR,
              resultCoolLoadTRValue: row.project_Res_Cooling_Load_TR,
              AddWaterVapour: row.project_add_Water_Vapour,
              humidcfm: row.project_HumidCfm,
              resultantCfmHot: row.project_ResultCfm_Hot,
              heatroomtermsup: row.project_Room_Term_Supply_Mod,
              cfmHeatLoadTRValue: row.project_Cfm_Heating_Load_TR,
              roomHeatLoad: row.project_Room_Heating_Load_TR,
              resultHeatLoadTR: row.project_Result_Heating_Load_TR,
            }));

          setRooms(mappedData);
        }
      } catch (err) {
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [projectId, zoneId]);

  /* ───── GO HOME ───── */

  const handleGoHome = () => {
    CleanProjectDetails(dispatch);
    navigate("/dashboard");
  };

  if (loading) return <p>Loading results...</p>;

  return (
    <>
      <Header />

      <div className={s.wrap}>
        <h3 className={s.headerSubTitle}>Project Results</h3>

        <h2 className={s.title}>Zone {zoneId}</h2>

        <div className={s.tableOuter}>
          <div className={s.tableScroll}>
            <table className={s.table}>
              <thead className={s.thead}>
                <tr>
                  <th className={s.thRoom}>Room Name</th>
                  <th className={s.th}>{t.fields.area.label}</th>
                  <th className={s.th}>{t.fields.volume.label}</th>
                  <th className={s.th}>{t.fields.roomCfm.label}</th>
                  <th className={s.th}>{t.fields.freshAir.label}</th>
                  <th className={s.th}>{t.fields.exhaustAir.label}</th>

                  {showCooling && (
                    <>
                      <th className={s.th}>{t.fields.Dehumidification.label}</th>
                      <th className={s.th}>{t.fields.remWaterVapour.label}</th>
                      <th className={s.th}>{t.fields.resultantCfm.label}</th>
                      <th className={s.th}>{t.fields.RoomTerminalSupply.label}</th>
                      <th className={s.th}>{t.fields.RoomACloadTR.label}</th>
                      <th className={s.th}>{t.fields.cfmACLoadTR.label}</th>
                      <th className={s.th}>{t.fields.ResultCoolLoadTR.label}</th>
                    </>
                  )}

                  {showHeating && (
                    <>
                      <th className={s.th}>{t.fields.AddWaterVapour.label}</th>
                      <th className={s.th}>{t.fields.Humidification.label}</th>
                      <th className={s.th}>{t.fields.HeatResultantCfm.label}</th>
                      <th className={s.th}>{t.fields.HeatRoomTerminalSupply.label}</th>
                      <th className={s.th}>{t.fields.CfmHeatingLoadTR.label}</th>
                      <th className={s.th}>{t.fields.RoomHeatingLoadinTR.label}</th>
                      <th className={s.th}>{t.fields.ResHeatingLoadinTR.label}</th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody>
                {rooms.map((room, index) => (
                  <tr key={index} className={s.tr}>
                    <td className={s.tdRoom}>{room.roomName}</td>
                    <td className={s.td}>{room.area}</td>
                    <td className={s.td}>{room.volume}</td>
                    <td className={s.td}>{room.roomCfm}</td>
                    <td className={s.td}>{room.freshAir}</td>
                    <td className={s.td}>{room.exhaustAir}</td>

                    {showCooling && (
                      <>
                        <td className={s.td}>{room.dehumid}</td>
                        <td className={s.td}>{room.removedWaterVapor}</td>
                        <td className={s.td}>{room.resultant}</td>
                        <td className={s.td}>{room.roomTermSupplyValue}</td>
                        <td className={s.td}>{room.roomACValue}</td>
                        <td className={s.td}>{room.cfmACLoadTRValue}</td>
                        <td className={s.td}>{room.resultCoolLoadTRValue}</td>
                      </>
                    )}

                    {showHeating && (
                      <>
                        <td className={s.td}>{room.AddWaterVapour}</td>
                        <td className={s.td}>{room.humidcfm}</td>
                        <td className={s.td}>{room.resultantCfmHot}</td>
                        <td className={s.td}>{room.heatroomtermsup}</td>
                        <td className={s.td}>{room.cfmHeatLoadTRValue}</td>
                        <td className={s.td}>{room.roomHeatLoad}</td>
                        <td className={s.td}>{room.resultHeatLoadTR}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={s.footer}>
          <p className={s.footerTitle}>Want to add another project?</p>
          <button onClick={handleGoHome} className={s.goHomeBtn}>
            <Home size={16} />
            Go Back Home
          </button>
        </div>
      </div>
    </>
  );
}