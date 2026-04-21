import { useState, useEffect, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCustomer } from "../../redux/slices/customerSlice";
import {
  setUser,
  setActiveCustomerId,
  setAvailableCustomers,
} from "../../redux/slices/userSlice";
import { getCustomerById } from "../../backend/controller/customerController";
import { getUserById } from "../../backend/controller/userController";
import {
  getProjectCounts,
  getInProgressProjects,
  getProjectDetails,
  deleteProject,
} from "../../backend/controller/projectController";
import {
  FaFolderOpen,
  FaPlus,
  FaBuilding,
  FaLayerGroup,
  FaCalculator,
  FaCheck,
  FaArrowRight,
  FaExclamationCircle,
  FaChevronDown,
  FaTrash,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import { FaTimes } from "react-icons/fa";
import s from "./styles";
import text from "../../json/dashboard.json";
import Header from "../../components/header";
import {
  resetProjectInfo,
  updateMultipleFields,
} from "../../redux/slices/projectInfoSlice";
import {
  setProjectCounts,
  setInProgressProjects,
} from "../../redux/slices/dashboardSlice";
import {
  updateMultipleStandardsFields,
  resetStandards,
} from "../../redux/slices/standardSlice";
import { setSavedRooms, resetRoom } from "../../redux/slices/roomSlice";

function tmpl(str: string, vars: Record<string, string | number>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

export default function Dashboard() {
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [firstName, setFirstName] = useState("User");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [continuingId, setContinuingId] = useState<number | null>(null);
  const [pendingCustomerSwitch, setPendingCustomerSwitch] = useState<{ id: any; name: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const counts = useAppSelector((state: any) => state.dashboard);
  const inProgressProjects = useAppSelector(
    (state: any) => state.dashboard.inProgressProjects ?? []
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loggedInUser = useAppSelector((state: any) => state.user);
  const customerId = useAppSelector((state: any) => state.customer.customerId);
  const customerName = useAppSelector(
    (state: any) => state.customer.customerName
  );
  const availableCustomers: { customerId: any; customerName: string }[] =
    useAppSelector((state: any) => state.user.availableCustomers ?? []);

  const currentProjectId = useAppSelector(
    (state: any) => state.projectInfo.projectId
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setCustomerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user + build availableCustomers list
  useEffect(() => {
    if (!loggedInUser?.user_login_id) return;
    const fetchUser = async () => {
      try {
        const res = await getUserById(loggedInUser.user_login_id);
        const u = res?.user ?? res;
        if (!u) return;

        const allCustomerIds: any[] = Array.isArray(u.customer_ids)
          ? u.customer_ids
          : u.customer_ids
          ? [u.customer_ids]
          : [];

        const activeCustomerId =
          loggedInUser.customer_id ?? allCustomerIds[0] ?? null;

        dispatch(
          setUser({
            user_login_id: loggedInUser.user_login_id,
            user_id: u.user_id || loggedInUser.user_id,
            customer_id: activeCustomerId,
            customer_ids: allCustomerIds,
            name:
              `${u.user_first_name || ""} ${u.user_last_name || ""}`.trim() ||
              loggedInUser.name,
          })
        );
        setFirstName(u.user_first_name?.trim() || "User");

        if (allCustomerIds.length >= 1) {
          const customerList = await Promise.all(
            allCustomerIds.map(async (id: any) => {
              try {
                const cRes = await getCustomerById(id);
                const c = cRes?.customer ?? cRes;
                return {
                  customerId: id,
                  customerName: c?.customer_name || `Customer ${id}`,
                  customerAddress: c?.customer_address || "",
                };
              } catch {
                return { customerId: id, customerName: `Customer ${id}`, customerAddress: "" };
              }
            })
          );
          dispatch(setAvailableCustomers(customerList));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, [loggedInUser?.user_login_id]);

  // Load active customer into customerSlice
  useEffect(() => {
    const activeId = loggedInUser?.customer_id;
    if (!activeId) return;
    const loadCustomer = async () => {
      setIsLoadingCustomer(true);
      try {
        const customerRes = await getCustomerById(activeId);
        const c = customerRes?.customer ?? customerRes;
        if (!c) return;
        dispatch(
          setCustomer({
            customerId: activeId,
            customerName: c.customer_name || "",
            phoneNumber: c.customer_phone || "",
            customerAddress: c.customer_address || "",
            emailAddress: c.customer_email_id || "",
            additionalNotes:
              c.customers_additional_notes || c.customers_addional_notes || "",
          })
        );
      } catch (error: any) {
        console.error("Failed to load customer info:", error.message);
      } finally {
        setIsLoadingCustomer(false);
      }
    };
    loadCustomer();
  }, [loggedInUser?.customer_id]);

  // Switch customer
  const handleCustomerSwitch = (newCustomerId: any, newCustomerName: string) => {
    setCustomerDropdownOpen(false);
    if (newCustomerId === loggedInUser?.customer_id) return;
    setPendingCustomerSwitch({ id: newCustomerId, name: newCustomerName });
  };

  const confirmCustomerSwitch = () => {
    if (pendingCustomerSwitch) {
      dispatch(setActiveCustomerId(pendingCustomerSwitch.id));
      setPendingCustomerSwitch(null);
    }
  };

  // Project counts
  useEffect(() => {
    if (!loggedInUser?.user_login_id) return;
    const fetchCounts = async () => {
      try {
        const data = await getProjectCounts(loggedInUser.user_login_id, loggedInUser.customer_id);
        dispatch(
          setProjectCounts({
            total: data.total ?? 0,
            inProgress: data.inProgress ?? 0,
            completed: data.completed ?? 0,
          })
        );
      } catch (e) {
        console.error("Failed to fetch project counts:", e);
      }
    };
    fetchCounts();
  }, [loggedInUser?.user_login_id, loggedInUser?.customer_id]);

  // In-progress projects
  useEffect(() => {
    if (!loggedInUser?.user_login_id) return;
    const fetchInProgress = async () => {
      try {
        const res = await getInProgressProjects(loggedInUser.user_login_id, loggedInUser.customer_id);
        dispatch(setInProgressProjects(res.projects ?? []));
      } catch (e) {
        console.error("Failed to fetch in-progress projects:", e);
      }
    };
    fetchInProgress();
  }, [loggedInUser?.user_login_id, loggedInUser?.customer_id]);

  // Continue in-progress project
  const handleContinue = async (proj: any, continueRoute: string) => {
    if (currentProjectId === proj.project_id) {
      navigate(continueRoute);
      return;
    }
    setContinuingId(proj.project_id);
    try {
      const data = await getProjectDetails(proj.project_id);
      const p = data.project;
      dispatch(resetStandards());
      dispatch(resetRoom());
      dispatch(
        updateMultipleFields({
          projectId: p.project_id,
          projectName: p.project_name ?? "",
          unitBranch: p.project_unit_branch ?? "",
          industry: (() => {
            try {
              const parsed = JSON.parse(p.project_Industry || "[]");
              return Array.isArray(parsed) ? parsed[0] ?? "" : "";
            } catch {
              return "";
            }
          })(),
          subIndustry: p.project_SubIndustry ?? "",
          handling: (() => {
            try {
              return JSON.parse(p.project_Handling || "[]");
            } catch {
              return [];
            }
          })(),
          uniqueId: p.project_unique_id ?? "",
          selectedLocation: p.project_Location ?? null,
          locationQuery: p.project_Location ?? "",
          minTemp: p.project_min_temp ?? "",
          maxTemp: p.project_max_temp ?? "",
          relativeHumidityMin: p.project_relative_min_humid ?? "",
          relativeHumidityMax: p.project_relative_max_humid ?? "",
          isNewProject: false,
        })
      );
      if (data.standards?.length > 0) {
        const std = data.standards[0];
        const zone = data.zones?.[0];
        dispatch(
          updateMultipleStandardsFields({
            projectStandardId: std.project_standard_id,
            zoneId: zone?.zone_id ?? null,
            standard: std.project_standard ?? null,
            classification: std.project_classification_name ?? null,
            acph: std.project_ACPH ?? null,
            system: std.project_system ?? null,
            systemType: std.project_system_type ?? null,
            heatingMethod: std.project_heating_method ?? "",
            coolingMethod: std.project_cooling_method ?? "",
            tempUnit: std.project_temp_unit ?? "C",
            reqInsideTempC: std.project_required_inside_temp ?? null,
            reqInsideHum: std.project_required_inside_humid ?? "",
            flowVelocity: std.flow_velocity ?? 1.5,
            heatingFlowVelocity: std.heating_flow_velocity ?? 1.5,
            coolingFlowVelocity: std.cooling_flow_velocity ?? 1.5,
            staticPressureSupply: std.static_Pressure_Supply ?? 0,
            staticPressureExhaust: std.static_Pressure_Exhaust ?? 0,
            totalFiltrationStagesSupply: std.number_of_Filtrations_Supply ?? 0,
            totalFiltrationStagesExhaust: std.number_of_Filtrations_Exhaust ?? 0,
            pipeConfiguration: std.pipe_configuration ?? "",
          })
        );
      }
      if (data.rooms?.length > 0) {
        const std = data.standards?.[0];
        const savedRooms = data.rooms.map((r: any) => ({
          id: `${r.project_RoomId}`,
          backendRoomId: r.project_RoomId,
          zoneId: r.zone_id,
          projectStandardId: r.project_standard_id,
          roomName: r.project_RoomName ?? "",
          length: r.room_Length ?? "",
          width: r.room_Width ?? "",
          height: r.room_Height ?? "",
          occupancy: r.room_Occupancy ?? "",
          equipmentLoad: r.room_Equipment_Load ?? "",
          lightingLoad: r.room_Lighting ?? "",
          infiltrationsPerHour: r.room_Infiltrations ?? "",
          freshAirPercent: r.room_FreshAir ?? "",
          exhaustAir: r.room_ExhaustAir ?? "",
          exhaustAirCfm: r.room_ExhaustAirCfm ?? "",
          acph: r.project_ACPH ?? "",
          zoneStandard: std?.project_standard ?? "",
          zoneClassification: std?.project_classification_name ?? "",
          zoneSystem: std?.project_system ?? "",
          zoneSystemType: std?.project_system_type ?? "",
          zoneCoolingMethod: std?.project_cooling_method ?? "",
          zoneHeatingMethod: std?.project_heating_method ?? "",
          zoneReqInsideTempC: std?.project_required_inside_temp ?? null,
          zoneReqInsideHum: std?.project_required_inside_humid ?? "",
        }));
        dispatch(setSavedRooms(savedRooms));
      }
      navigate(continueRoute);
    } catch (e) {
      console.error("Failed to load project details:", e);
    } finally {
      setContinuingId(null);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    try {
      await deleteProject(projectId);
      if (loggedInUser?.user_login_id) {
        // Refresh counts and lists
        const data = await getProjectCounts(loggedInUser.user_login_id, loggedInUser.customer_id);
        dispatch(
          setProjectCounts({
            total: data.total ?? 0,
            inProgress: data.inProgress ?? 0,
            completed: data.completed ?? 0,
          })
        );
        const res = await getInProgressProjects(loggedInUser.user_login_id, loggedInUser.customer_id);
        dispatch(setInProgressProjects(res.projects ?? []));
      }
    } catch (e) {
      console.error("Failed to delete project:", e);
      alert("Failed to delete project. Please try again.");
    }
  };

  const features = text.dashboard.features;

  return (
    <div className={s.page}>
      <Header />

      <div className={s.contentWrap}>
        <div className={s.container}>
          {/* ── Welcome row — stacks on mobile, side by side on sm+ ── */}
          <div className={s.welcomeRow}>
            <div className={s.welcomeLeft}>
              <div className={s.title2}>
                {tmpl(text.dashboard.welcomeTitle, { name: firstName })}
              </div>
              <div className={s.subtitle2}>
                {text.dashboard.welcomeSubtitle}
              </div>
            </div>

            {/* Customer dropdown */}
            <div ref={dropdownRef} className="relative self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCustomerDropdownOpen((p) => !p)}
                className={s.customerDropdownBtn}
              >
                <div className={s.customerDropdownIconWrap}>
                  <MdApartment className="text-blue-700 text-lg" />
                </div>
                <div className="text-left">
                  <div className={s.customerDropdownSubLabel}>
                    Current Customer
                  </div>
                  <div className={s.customerDropdownName}>
                    {isLoadingCustomer
                      ? "Loading..."
                      : customerName || "Select Customer"}
                  </div>
                </div>
                <FaChevronDown
                  className={`${s.customerDropdownChevron} ${
                    customerDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {customerDropdownOpen && (
                <div className={s.customerDropdownList}>
                  {availableCustomers.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-400">
                      No customers found
                    </div>
                  ) : (
                    <>
                      <div className={s.customerDropdownHeader}>
                        <div className={s.customerDropdownHeaderTitle}>
                          Switch Customer
                        </div>
                        <div className={s.customerDropdownHeaderSubtitle}>
                          {availableCustomers.length} customer{availableCustomers.length !== 1 ? "s" : ""} available
                        </div>
                      </div>
                      <div className={s.customerDropdownScrollArea}>
                        {availableCustomers.map((c: any) => {
                          const isSelected = c.customerId === loggedInUser?.customer_id;
                          return (
                            <button
                              key={c.customerId}
                              type="button"
                              onClick={() => handleCustomerSwitch(c.customerId, c.customerName)}
                              className={`${s.customerDropdownItem} ${
                                isSelected
                                  ? s.customerDropdownItemActive
                                  : s.customerDropdownItemInactive
                              }`}
                            >
                              <div className={s.customerDropdownItemContent}>
                                <div className={s.customerDropdownRadioWrap}>
                                  <input
                                    type="radio"
                                    checked={isSelected}
                                    readOnly
                                    className={`${s.customerDropdownRadioBase} ${
                                      isSelected
                                        ? s.customerDropdownRadioSelected
                                        : s.customerDropdownRadioUnselected
                                    }`}
                                  />
                                  {isSelected && (
                                    <FaCheck className={s.customerDropdownCheckIcon} />
                                  )}
                                </div>
                                <div className={s.customerDropdownTextWrap}>
                                  <span className={`${s.customerDropdownItemNameBase} ${isSelected ? s.customerDropdownItemNameSelected : s.customerDropdownItemNameUnselected}`}>
                                    {c.customerName}
                                  </span>
                                  {c.customerAddress && (
                                    <span className={s.customerDropdownItemAddress}>
                                      {c.customerAddress}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Metrics ── */}
          <div className={s.metricsRow}>
            <div className={s.metricCard}>
              <div className={`${s.metricIconWrap} bg-orange-100`}>
                <FaFolderOpen className="text-orange-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <div className={`${s.metricNumber} text-orange-500`}>
                  {counts.total}
                </div>
                <div className={s.metricLabel}>Total Projects</div>
              </div>
            </div>
            <div className={s.metricCard}>
              <div className={`${s.metricIconWrap} bg-blue-100`}>
                <FaLayerGroup className="text-blue-700 text-xl sm:text-2xl" />
              </div>
              <div>
                <div className={`${s.metricNumber} text-blue-700`}>
                  {counts.inProgress}
                </div>
                <div className={s.metricLabel}>In Progress</div>
              </div>
            </div>
            <div className={s.metricCard}>
              <div className={`${s.metricIconWrap} bg-green-100`}>
                <FaCheck className="text-green-600 text-xl sm:text-2xl" />
              </div>
              <div>
                <div className={`${s.metricNumber} text-green-600`}>
                  {counts.completed}
                </div>
                <div className={s.metricLabel}>Completed</div>
              </div>
            </div>
            <div className={s.metricCard}>
              <div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">
                  Last Activity
                </div>
                <div className="text-base sm:text-lg font-bold text-slate-900">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── In-progress projects ── */}
          <div className={s.sectionCard}>
            <div className={s.cardHeader}>
              <div className={s.sectionTitle}>
                {text.dashboard.projectsTitle}
              </div>
              <div className={s.pendingProjects}>
                {inProgressProjects.length} Incomplete Project
                {inProgressProjects.length !== 1 ? "s" : ""}
              </div>
            </div>
            {inProgressProjects.length === 0 ? (
              <div className="text-slate-400 text-sm py-4 text-center">
                No projects in progress.
              </div>
            ) : (
              inProgressProjects.map((proj: any) => {
                const step = proj.has_rooms ? 3 : proj.has_standard ? 2 : 1;
                const stepName = !proj.has_standard
                  ? "Classification"
                  : "Rooms";
                const continueRoute = !proj.has_standard
                  ? "/standards"
                  : "/room";
                const formattedDate = proj.last_modified
                  ? new Date(proj.last_modified).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—";
                return (
                  <div key={proj.project_id} className={s.cardWrap}>
                    <div className="flex-1">
                      <div className={s.projectTitle}>{proj.project_name}</div>
                      <div className={s.projectCustomer}>
                        <span>Customer: </span>
                        {proj.customer_name}
                      </div>
                      <div className={s.cardStyle}>
                        <div className={s.projectPendingStage}>
                          Step {step} of 3
                        </div>
                        <div className={s.projectPendingPage}>
                          <span>On:</span> {stepName}
                        </div>
                        <div className={s.projectModifiedDate}>
                          <span>Last Modified:</span> {formattedDate}
                        </div>
                      </div>
                    </div>
                    <div className={`${s.buttonStyle} flex gap-2 items-center`}>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(proj.project_id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Project"
                      >
                        <FaTrash />
                      </button>
                      <button
                        type="button"
                        disabled={continuingId === proj.project_id}
                        className={s.viewAllButton}
                        onClick={() => handleContinue(proj, continueRoute)}
                      >
                        {continuingId === proj.project_id ? (
                          "Loading..."
                        ) : (
                          <>
                            {text.dashboard.progress.buttonText}{" "}
                            <FaArrowRight />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Quick actions ── */}
          <div className={s.sectionCard}>
            <div className={s.sectionTitle}>
              {text.dashboard.quickActionsTitle}
            </div>
            <div className={s.quickGrid}>
              <button
                type="button"
                onClick={() => {
                  if (!customerId) setShowProfileAlert(true);
                  else {
                    dispatch(resetProjectInfo());
                    navigate("/project-info");
                  }
                }}
                className={`${s.actionCardBase} ${s.actionCardHover} text-left`}
              >
                <div className={`${s.actionIconWrap} bg-blue-700`}>
                  <FaPlus className="text-white text-xl sm:text-2xl" />
                </div>
                <div>
                  <div className={s.actionTitle}>
                    {text.dashboard.actions.createTitle}
                  </div>
                  <div className={s.actionDesc}>
                    {text.dashboard.actions.createDesc}
                  </div>
                  <div className={s.actionHint}>
                    {text.dashboard.actions.createHint}
                  </div>
                </div>
              </button>

              <Link
                to="/projects"
                className={`${s.actionCardBase} ${s.actionCardHover}`}
              >
                <div className={`${s.actionIconWrap} bg-blue-100`}>
                  <FaFolderOpen className="text-blue-700 text-xl sm:text-2xl" />
                </div>
                <div>
                  <div className={s.actionTitle}>
                    {text.dashboard.actions.viewTitle}
                  </div>
                  <div className={s.actionDesc}>
                    {text.dashboard.actions.viewDesc}
                  </div>
                  <div className={s.actionHint}>
                    {text.dashboard.actions.viewHint}
                  </div>
                </div>
              </Link>

              <Link
                to="/customer-info"
                className={`${s.actionCardBase} ${s.actionCardHover}`}
              >
                <div className={`${s.actionIconWrap} bg-slate-100`}>
                  <MdApartment className="text-blue-700 text-xl sm:text-2xl" />
                </div>
                <div>
                  <div className={s.actionTitle}>
                    {text.dashboard.actions.customerTitle}
                  </div>
                  <div className={s.actionDesc}>
                    {text.dashboard.actions.customerDesc}
                  </div>
                  <div className={s.actionHint}>
                    {customerId
                      ? "✓ Profile saved"
                      : text.dashboard.actions.customerHint}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* ── Features ── */}
          <div className={s.featuresCard}>
            <div className={s.featuresTitle}>
              {text.dashboard.featuresTitle}
            </div>
            <div className={s.featuresGrid}>
              {[FaBuilding, FaLayerGroup, FaCalculator].map((Icon, i) => (
                <div key={i} className={s.featureItem}>
                  <div className={s.featureIconWrap}>
                    <Icon className="text-blue-700 text-xl sm:text-2xl" />
                  </div>
                  <div className={s.featureTitle}>{features[i].title}</div>
                  <div className={s.featureDesc}>{features[i].desc}</div>
                  <div className={s.featureList}>
                    {features[i].bullets.map((b: string, j: number) => (
                      <div key={j} className={s.featureBullet}>
                        <FaCheck className="mt-1 text-blue-600" />
                        <div>{b}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile alert modal ── */}
      {showProfileAlert && (
        <div className={s.popupOverlay}>
          <div
            className={s.popupBackdrop}
            onClick={() => setShowProfileAlert(false)}
          />
          <div className={s.popupCard}>
            <div className={s.popupHeader}>
              <div className={s.popupIconWrap}>
                <FaExclamationCircle className={s.popupIcon} />
              </div>
              <h2 className={s.popupTitle}>Customer Profile Required</h2>
            </div>
            <p className={s.popupDesc}>
              Before creating a project, you need to set up your customer
              profile first. This is a one-time setup that will be used for all
              your projects.
            </p>
            <div className={s.popupInfoBox}>
              <p className={s.popupInfoTitle}>Required Information:</p>
              <ul className={s.popupInfoList}>
                <li className={s.popupInfoItem}>* Customer Name</li>
                <li className={s.popupInfoItem}>* Customer Address</li>
                <li className={s.popupInfoItem}>
                  * Contact Details (Optional)
                </li>
              </ul>
            </div>
            <div className={s.popupFooter}>
              <button
                type="button"
                onClick={() => setShowProfileAlert(false)}
                className={s.popupCancelBtn}
              >
                Back to Dashboard
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowProfileAlert(false);
                  navigate("/customer-info", {
                    state: { from: "create-project" },
                  });
                }}
                className={s.popupConfirmBtn}
              >
                Setup Customer Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Switch Customer Modal ── */}
      {pendingCustomerSwitch && (
        <div className={s.popupOverlay}>
          <div
            className={s.popupBackdrop}
            onClick={() => setPendingCustomerSwitch(null)}
          />
          <div className={s.popupCard}>
            <div className={s.popupHeader}>
              <div className={s.switchHeaderRow}>
                <div className={s.switchIconWrap}>
                  <MdApartment className={s.switchIcon} />
                </div>
                <h2 className={s.popupTitle}>Switch Customer?</h2>
              </div>
              <button
                type="button"
                onClick={() => setPendingCustomerSwitch(null)}
                className={s.switchCloseBtn}
              >
                <FaTimes className={s.switchCloseIcon} />
              </button>
            </div>
            
            <p className={s.switchDesc}>
              You are about to switch to <span className={s.switchDescHighlight}>{pendingCustomerSwitch.name}</span>. All
              displayed data will change accordingly.
            </p>
            
            <div className={s.switchWarningBox}>
              <FaExclamationCircle className={s.switchWarningIcon} />
              <p className={s.switchWarningText}>
                Any unsaved changes will be lost. Please save your work before proceeding.
              </p>
            </div>
            
            <div className={s.switchBtnGroup}>
              <button
                type="button"
                onClick={() => setPendingCustomerSwitch(null)}
                className={s.switchCancelBtn}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmCustomerSwitch}
                className={s.switchConfirmBtn}
              >
                Switch Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
