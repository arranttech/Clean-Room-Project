import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setCustomer } from "../../redux/slices/customerSlice";
import { getCustomerById } from "../../backend/controller/customerController";
import { getUserById } from "../../backend/controller/userController";
import {
  FaFolderOpen,
  FaPlus,
  FaBuilding,
  FaLayerGroup,
  FaCalculator,
  FaCheck,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";
import { MdApartment } from "react-icons/md";
import s from "./styles";
import text from "../../json/dashboard.json";
import Header from "../../components/header";

type Project = {
  id: string;
  name: string;
  createdAt: string;
  customer: string;
  location: string;
  classification: string;
  totalRooms: number;
};

const demoProjects: Project[] = [
  {
    id: "PRJ-1001",
    name: "Clean Room Facility - Phase 1",
    createdAt: "2026-01-14",
    customer: "Acme Pharma",
    location: "Austin, TX, US",
    classification: "ISO Class 7",
    totalRooms: 8,
  },
  {
    id: "PRJ-1002",
    name: "R and D Lab Retrofit",
    createdAt: "2026-01-22",
    customer: "Nova Biotech",
    location: "Pune, MH, IN",
    classification: "ISO Class 8",
    totalRooms: 5,
  },
  {
    id: "PRJ-1003",
    name: "Sterile Suite Expansion",
    createdAt: "2026-01-29",
    customer: "Zenith Med",
    location: "Dublin, IE",
    classification: "ISO Class 7",
    totalRooms: 11,
  },
];

function tmpl(str: string, vars: Record<string, string | number>) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

export default function Dashboard() {
  const [projects] = useState<Project[]>(demoProjects);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [firstName, setFirstName] = useState("User");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loggedInUser = useAppSelector((state: any) => state.user);
  const customerId = useAppSelector((state: any) => state.customer.customerId);
  const counts = { total: projects.length };

  useEffect(() => {
    if (!loggedInUser?.user_login_id) return;
    const fetchUser = async () => {
      try {
        const res = await getUserById(loggedInUser.user_login_id);
        const u = res?.user ?? res;
        if (u) setFirstName(u.user_first_name?.trim() || "User");
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, [loggedInUser?.user_login_id]);

  useEffect(() => {
    if (customerId || !loggedInUser?.user_login_id) return;
    const loadCustomer = async () => {
      try {
        const userRes = await getUserById(loggedInUser.user_login_id);
        const customer_id =
          userRes?.user?.customer_id ?? userRes?.customer_id ?? null;
        if (!customer_id) return;
        const customerRes = await getCustomerById(customer_id);
        const c = customerRes?.customer ?? customerRes;
        if (!c) return;
        dispatch(
          setCustomer({
            customerId: customer_id,
            customerName: c.customer_name || "",
            phoneNumber: c.customer_phone || "",
            customerAddress: c.customer_address || "",
            emailAddress: c.customer_email_id || "",
            additionalNotes:
              c.customers_additional_notes || c.customers_addional_notes || "",
          })
        );
      } catch (error) {
        console.error(
          "Failed to load customer info:",
          (error as Error).message
        );
      }
    };
    loadCustomer();
  }, [loggedInUser?.user_login_id]);

  const features = text.dashboard.features;

  return (
    <div className={s.page}>
      <Header />

      <div className={s.contentWrap}>
        <div className={s.container}>
          <div className={s.headerWrap}>
            <div className={s.title2}>
              {tmpl(text.dashboard.welcomeTitle, { name: firstName })}
            </div>
            <div className={s.subtitle2}>{text.dashboard.welcomeSubtitle}</div>
          </div>

          <div className={s.metricsRow}>
            <div className={s.metricCard}>
              <div className={`${s.metricIconWrap} bg-blue-100`}>
                <FaFolderOpen className="text-blue-700 text-2xl" />
              </div>
              <div>
                <div className={`${s.metricNumber} text-blue-700`}>
                  {counts.total}
                </div>
                <div className={s.metricLabel}>Total Projects</div>
              </div>
            </div>
            <div className={s.metricCard}>
              <div className={`${s.metricIconWrap} bg-orange-100`}>
                <FaLayerGroup className="text-orange-500 text-2xl" />
              </div>
              <div>
                <div className={`${s.metricNumber} text-orange-500`}>4</div>
                <div className={s.metricLabel}>In Progress</div>
              </div>
            </div>
            <div className={s.metricCard}>
              <div className={`${s.metricIconWrap} bg-green-100`}>
                <FaCheck className="text-green-600 text-2xl" />
              </div>
              <div>
                <div className={`${s.metricNumber} text-green-600`}>8</div>
                <div className={s.metricLabel}>Completed</div>
              </div>
            </div>
            <div className={s.metricCard}>
              <div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-1">
                  Last Activity
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className={s.sectionCard}>
            <div className={s.cardHeader}>
              <div className={s.sectionTitle}>
                {text.dashboard.projectsTitle}
              </div>
              <div className={s.pendingProjects}>
                {text.dashboard.pendingProjects}
              </div>
            </div>
            <div className={s.cardWrap}>
              <div>
                <div className={s.projectTitle}>
                  {text.dashboard.progress.projectTitle}
                </div>
                <div className={s.projectCustomer}>
                  <span>Customer: </span>
                  {text.dashboard.progress.Customer}
                </div>
                <div className={s.cardStyle}>
                  <div className={s.projectPendingStage}>
                    {text.dashboard.progress.pendingStage}
                  </div>
                  <div className={s.projectPendingPage}>
                    <span>On:</span> {text.dashboard.progress.pendingPage}
                  </div>
                  <div className={s.projectModifiedDate}>
                    <span>Last Modified:</span>{" "}
                    {text.dashboard.progress.modifiedDate}
                  </div>
                </div>
              </div>
              <div className={s.buttonStyle}>
                <Link to="/projects" className={s.viewAllButton}>
                  {text.dashboard.progress.buttonText} <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>

          <div className={s.sectionCard}>
            <div className={s.sectionTitle}>
              {text.dashboard.quickActionsTitle}
            </div>
            <div className={s.quickGrid}>
              <button
                type="button"
                onClick={() => {
                  if (!customerId) setShowProfileAlert(true);
                  else navigate("/project-info");
                }}
                className={`${s.actionCardBase} ${s.actionCardHover} text-left`}
              >
                <div className={`${s.actionIconWrap} bg-blue-700`}>
                  <FaPlus className="text-white text-2xl" />
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
                  <FaFolderOpen className="text-blue-700 text-2xl" />
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
                  <MdApartment className="text-blue-700 text-2xl" />
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

          <div className={s.featuresCard}>
            <div className={s.featuresTitle}>
              {text.dashboard.featuresTitle}
            </div>
            <div className={s.featuresGrid}>
              {[FaBuilding, FaLayerGroup, FaCalculator].map((Icon, i) => (
                <div key={i} className={s.featureItem}>
                  <div className={s.featureIconWrap}>
                    <Icon className="text-blue-700 text-2xl" />
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
    </div>
  );
}
