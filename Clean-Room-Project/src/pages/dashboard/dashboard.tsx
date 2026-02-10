import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { handleLogout } from "../../utils/logout";
import { FiLogOut } from "react-icons/fi";
import { FaFolderOpen, FaPlus, FaBuilding, FaLayerGroup, FaCalculator, FaCheck, FaArrowRight  } from "react-icons/fa";

import s from "./dashboardDesign";
import text from "../../json/dashboard.json";

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
    totalRooms: 8
  },
  {
    id: "PRJ-1002",
    name: "R and D Lab Retrofit",
    createdAt: "2026-01-22",
    customer: "Nova Biotech",
    location: "Pune, MH, IN",
    classification: "ISO Class 8",
    totalRooms: 5
  },
  {
    id: "PRJ-1003",
    name: "Sterile Suite Expansion",
    createdAt: "2026-01-29",
    customer: "Zenith Med",
    location: "Dublin, IE",
    classification: "ISO Class 7",
    totalRooms: 11
  }
];

function tmpl(str: string, vars: Record<string, string | number>) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

export default function Dashboard() {
  const [projects] = useState<Project[]>(demoProjects);
  const userName = "ARRANT USER";
  const dispatch = useAppDispatch();  // Redux dispatch
  const navigate = useNavigate();     // Router navigate

  const counts = { total: projects.length };
  const features = text.dashboard.features;

  // Redux: clear state + redirect
  const onLogout = () => {
    handleLogout(dispatch);
    navigate("/");
  };

  return (
    <div className={s.page}>
      {/* header */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.left}>
            <div className={s.logoTile}>
              <img src="/Arrant.jpeg" alt="Arrant Dynamics" className={s.logoImg} />
            </div>
            <div className={s.brand}>
              <div>ARRANT</div>
              <div>DYNAMICS</div>
            </div>
          </div>

          <div className={s.center}>
            <div className={s.title1}>STERI Clean Air</div>
            <div className={s.subtitle1}>HVAC Matrix Platform</div>
          </div>

          <div className={s.right}>
            {/* Redux: logout button */}
            <button type="button" className={s.logout} onClick={onLogout}>
              <FiLogOut className="text-[18px]" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className={s.contentWrap}>
        <div className={s.container}>
          {/* welcome */}
          <div className={s.headerWrap}>
            <div className={s.title2}>
              {tmpl(text.dashboard.welcomeTitle, { name: userName })}
            </div>
            <div className={s.subtitle2}>{text.dashboard.welcomeSubtitle}</div>
          </div>

          {/* total projects only */}
          <div className={s.metricsRow}>
            <div className={s.metricCard}>
              <div className={s.metricIconWrap}>
                <FaFolderOpen className="text-blue-700 text-2xl" />
              </div>
              <div>
                <div className={s.metricNumber}>{counts.total}</div>
                <div className={s.metricLabel}>{text.dashboard.metric.totalProjects}</div>
              </div>
            </div>
          </div>

          {/* Projects In Progress */}

          <div className={s.sectionCard}>
            <div className={s.cardHeader}>
               <div className={s.sectionTitle}>{text.dashboard.projectsTitle}</div>
            <div className={s.pendingProjects}>{text.dashboard.pendingProjects}</div>
            </div>
           
            <div className={s.cardWrap}>

              <div className={s.cardContent}>
                <div className={s.projectTitle}>{text.dashboard.progress.projectTitle}</div>
                <div className={s.projectCompany}><span>Company: </span>{text.dashboard.progress.Company}</div>
                <div className={s.cardStyle}>
                  <div className={s.projectPendingStage}>{text.dashboard.progress.pendingStage}</div>
                  <div className={s.projectPendingPage}><span>On:</span> {text.dashboard.progress.pendingPage}</div>
                  <div className={s.projectModifiedDate}><span>Last Modified:</span> {text.dashboard.progress.modifiedDate}</div>

                </div>

              </div>

                 <div className={s.buttonStyle}>
              <Link to="/projects" className={s.viewAllButton}>
                {text.dashboard.progress.buttonText} <FaArrowRight />
              </Link>

            </div>

            </div>



          </div>

          {/* quick actions */}
          <div className={s.sectionCard}>
            <div className={s.sectionTitle}>{text.dashboard.quickActionsTitle}</div>
            <div className={s.quickGrid}>
              <Link to="/customer-info" className={`${s.actionCardBase} ${s.actionCardHover}`}>
                <div className={`${s.actionIconWrap} bg-blue-700`}>
                  <FaPlus className="text-white text-2xl" />
                </div>
                <div>
                  <div className={s.actionTitle}>{text.dashboard.actions.createTitle}</div>
                  <div className={s.actionDesc}>{text.dashboard.actions.createDesc}</div>
                  <div className={s.actionHint}>{text.dashboard.actions.createHint}</div>
                </div>
              </Link>

              <Link to="/projects" className={`${s.actionCardBase} ${s.actionCardHover}`}>
                <div className={`${s.actionIconWrap} bg-blue-100`}>
                  <FaFolderOpen className="text-blue-700 text-2xl" />
                </div>
                <div>
                  <div className={s.actionTitle}>{text.dashboard.actions.viewTitle}</div>
                  <div className={s.actionDesc}>{text.dashboard.actions.viewDesc}</div>
                  <div className={s.actionHint}>{text.dashboard.actions.viewHint}</div>
                </div>
              </Link>
            </div>
          </div>



          {/* platform features */}
          <div className={s.featuresCard}>
            <div className={s.featuresTitle}>{text.dashboard.featuresTitle}</div>
            <div className={s.featuresGrid}>
              <div className={s.featureItem}>
                <div className={s.featureIconWrap}>
                  <FaBuilding className="text-blue-700 text-2xl" />
                </div>
                <div className={s.featureTitle}>{features[0].title}</div>
                <div className={s.featureDesc}>{features[0].desc}</div>
                <div className={s.featureList}>
                  {features[0].bullets.map((b: string, i: number) => (
                    <div key={i} className={s.featureBullet}>
                      <FaCheck className="mt-1 text-black-700" />
                      <div>{b}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.featureItem}>
                <div className={s.featureIconWrap}>
                  <FaLayerGroup className="text-blue-700 text-2xl" />
                </div>
                <div className={s.featureTitle}>{features[1].title}</div>
                <div className={s.featureDesc}>{features[1].desc}</div>
                <div className={s.featureList}>
                  {features[1].bullets.map((b: string, i: number) => (
                    <div key={i} className={s.featureBullet}>
                      <FaCheck className="mt-1 text-black-700" />
                      <div>{b}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={s.featureItem}>
                <div className={s.featureIconWrap}>
                  <FaCalculator className="text-blue-700 text-2xl" />
                </div>
                <div className={s.featureTitle}>{features[2].title}</div>
                <div className={s.featureDesc}>{features[2].desc}</div>
                <div className={s.featureList}>
                  {features[2].bullets.map((b: string, i: number) => (
                    <div key={i} className={s.featureBullet}>
                      <FaCheck className="mt-1 text-black-600" />
                      <div>{b}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}