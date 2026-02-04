import { useState } from "react";
import { Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import {
  FaArrowLeft,
  FaEye,
  FaChevronDown,
  FaBuilding,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaDoorOpen,
} from "react-icons/fa";

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
  status: "Active" | "Inactive";
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
    totalRooms: 8,
    status: "Active" || "Inactive",
  },
  {
    id: "PRJ-1002",
    name: "R and D Lab Retrofit",
    createdAt: "2026-01-22",
    customer: "Nova Biotech",
    location: "Pune, MH, IN",
    classification: "ISO Class 8",
    totalRooms: 5,
    status: "Inactive",
  },
  {
    id: "PRJ-1003",
    name: "Sterile Suite Expansion",
    createdAt: "2026-01-29",
    customer: "Zenith Med",
    location: "Dublin, IE",
    classification: "ISO Class 7",
    totalRooms: 11,
    status: "Inactive",
  },
];

function tmpl(str: string, vars: Record<string, string | number>) {
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? ""));
}

export default function AllProjects() {
  const [projects] = useState<Project[]>(demoProjects);

  const onViewDetails = (p: Project) => alert(`View Details: ${p.id}`);
  const onExpand = (p: Project) => alert(`Expand: ${p.id}`);

  const isThreeOrMore = projects.length >= 3;

  return (
    <div className={s.page}>
      {/* header */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.left}>
            <div className={s.logoTile}>
              <img
                src="/Arrant.jpeg"
                alt="Arrant Dynamics"
                className={s.logoImg}
              />
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
                {/* Header Row */}
                <div className={s.projectHeaderRow}>
                  <div className="flex flex-col gap-2">
                    {/* Title */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className={s.projectName}>{p.name}</div>
                      
                        {p.status === "Active" && (
                       <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-semibold">
                        Active
                        </span>
                        )}

                    </div>

                    {/* Meta line */}
                    <div className={s.meta}>
                      {tmpl(text.projects.meta, { id: p.id, date: p.createdAt })}
                    </div>
                  </div>

                  {isThreeOrMore && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className={s.primaryBtn}
                        onClick={() => onViewDetails(p)}
                      >
                        <FaEye /> {text.projects.buttons.viewDetails}
                      </button>

                      <button
                        type="button"
                        className={s.secondaryBtn}
                        onClick={() => onExpand(p)}
                      >
                        <FaChevronDown /> {text.projects.buttons.expand}
                      </button>
                    </div>
                  )}
                </div>

                {/* Divider line like image */}
                {isThreeOrMore && <div className="mt-4 border-t border-slate-200" />}

                {/* Info grid */}
                <div className={s.infoGrid}>
                  {/* Customer */}
                  <div className={s.kv}>
                    <div className={s.k}>
                      <span className="flex items-center gap-2">
                        <FaBuilding className="text-blue-600" />
                        {text.projects.labels.customer}
                      </span>
                    </div>
                    <div className={s.v}>{p.customer}</div>
                  </div>

                  {/* Location */}
                  <div className={s.kv}>
                    <div className={s.k}>
                      <span className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        {text.projects.labels.location}
                      </span>
                    </div>
                    <div className={s.v}>{p.location}</div>
                  </div>

                  {/* Classification */}
                  <div className={s.kv}>
                    <div className={s.k}>
                      <span className="flex items-center gap-2">
                        <FaLayerGroup className="text-blue-600" />
                        {text.projects.labels.classification}
                      </span>
                    </div>
                    <div className={s.v}>{p.classification}</div>
                  </div>

                  {/* Total Rooms */}
                  <div className={s.kv}>
                    <div className={s.k}>
                      <span className="flex items-center gap-2">
                        <FaDoorOpen className="text-blue-600" />
                        {text.projects.labels.totalRooms}
                      </span>
                    </div>
                    <div className={s.v}>
                      {isThreeOrMore ? `${p.totalRooms} Rooms` : p.totalRooms}
                    </div>
                  </div>
                </div>

  
                {!isThreeOrMore && (
                  <div className={s.cardActions}>
                    <button
                      type="button"
                      className={s.primaryBtn}
                      onClick={() => onViewDetails(p)}
                    >
                      <FaEye /> {text.projects.buttons.viewDetails}
                    </button>

                    <button
                      type="button"
                      className={s.secondaryBtn}
                      onClick={() => onExpand(p)}
                    >
                      <FaChevronDown /> {text.projects.buttons.expand}
                    </button>
                  </div>
                )}
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