import { useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaArrowLeft, FaEye, FaChevronDown } from "react-icons/fa";

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

/* sample data */
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

export default function AllProjects() {
  const [projects] = useState<Project[]>(demoProjects);

  const onViewDetails = (p: Project) => alert(`View Details: ${p.id}`);
  const onExpand = (p: Project) => alert(`Expand: ${p.id}`);

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
            <Link to="/">
              <button type="button" className={s.logout}>
                <FiLogOut className="text-[18px]" />
                Logout
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className={s.contentWrap}>
        <div className={s.container}>
          <div className={s.listTopRow}>
         
        <div className={s.listTitleWrap}>
              <div className={s.listTitle}>{text.projects.title}</div>
            </div> 
          </div>
          <div className={s.projectsWrap}>
            {projects.map((p) => (
              <div key={p.id} className={s.projectCard}>
                <div className={s.projectHeaderRow}>
                  <div>
                    <div className={s.projectName}>{p.name}</div>
                    <div className={s.meta}>
                      {tmpl(text.projects.meta, { id: p.id, date: p.createdAt })}
                    </div>
                  </div>
                </div>

                <div className={s.infoGrid}>
                  <div className={s.kv}>
                    <div className={s.k}>{text.projects.labels.customer}</div>
                    <div className={s.v}>{p.customer}</div>
                  </div>

                  <div className={s.kv}>
                    <div className={s.k}>{text.projects.labels.location}</div>
                    <div className={s.v}>{p.location}</div>
                  </div>

                  <div className={s.kv}>
                    <div className={s.k}>{text.projects.labels.classification}</div>
                    <div className={s.v}>{p.classification}</div>
                  </div>

                  <div className={s.kv}>
                    <div className={s.k}>{text.projects.labels.totalRooms}</div>
                    <div className={s.v}>{p.totalRooms}</div>
                  </div>
                </div>

                <div className={s.cardActions}>
                  <button type="button" className={s.primaryBtn} onClick={() => onViewDetails(p)}>
                    <FaEye /> {text.projects.buttons.viewDetails}
                  </button>

                  <button type="button" className={s.secondaryBtn} onClick={() => onExpand(p)}>
                    <FaChevronDown /> {text.projects.buttons.expand}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
        <Link to="/dashboard">
              <button type="button" className={s.backBtn1}>
                <FaArrowLeft /> {text.projects.backToDashboard}
              </button>
            </Link>

      </div>
     
    </div>
  );
}
