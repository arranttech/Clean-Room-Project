import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header";
import {
  FaArrowLeft, FaEye, FaDownload,
  FaBuilding, FaMapMarkerAlt, FaLayerGroup, FaDoorOpen,
  FaFolderOpen,
} from "react-icons/fa";
import { useAppSelector } from "../../redux/hooks";
import { getCompletedProjects } from "../../backend/controller/projectController";
import s from "./styles";
import text from "../../json/dashboard.json";

type Project = {
  project_id: number;
  project_unique_id: string;
  project_name: string;
  project_unit_branch: string;
  project_Industry: string;
  project_Handling: string;
  project_Location: string;
  project_status: string;
  created_at: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  customer_email_id: string;
};

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

export default function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const userId = useAppSelector((state: any) => state.user?.user_login_id);

  // useEffect(() => {
  //   if (!userId) return;
  //   (async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const res = await getCompletedProjects(userId);
  //       setProjects(res?.projects ?? []);
  //     } catch (err) {
  //       console.error("Failed to load completed projects:", err);
  //       setError("Failed to load projects. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, [userId]);

  useEffect(() => {
    if (!userId) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        // FETCH RAW ROWS FROM BACKEND
        const res = await getCompletedProjects(userId);
         const projectsRaw = res.projects || [];

        // GROUP BY PROJECT_ID TO REMOVE DUPLICATES
        const projectMap: Record<number, Project> = {};
        projectsRaw.forEach((row: any) => {
          if (!projectMap[row.project_id]) {
            projectMap[row.project_id] = {
              project_id: row.project_id,
              project_unique_id: row.project_unique_id,
              project_name: row.project_name,
              project_unit_branch: row.project_unit_branch,
              project_Industry: row.project_Industry,
              project_Handling: row.project_Handling,
              project_Location: row.project_Location,
              project_status: row.project_status,
              created_at: row.created_at,
              customer_name: row.customer_name,
              customer_address: row.customer_address,
              customer_phone: row.customer_phone,
              customer_email_id: row.customer_email_id,
            };
          }
        });

        const uniqueProjects = Object.values(projectMap);
        setProjects(uniqueProjects);

      } catch (err) {
        console.error("Failed to load completed projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return (
    <div className={s.page}>
      <Header />
      <div className={s.contentWrap}>
        <div className={s.container1}>

          {/* Title row */}
          <div className={s.titleRow}>
            <h1 className={s.listTitle}>{text.projects.title}</h1>
            {!loading && projects.length > 0 && (
              <span className={s.countBadge}>
                {projects.length} Completed
              </span>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className={s.stateWrap}>
              <svg className="animate-spin h-9 w-9 text-blue-600"
                fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm text-slate-400">
                Loading your projects…
              </span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <p className={s.errorText}>{error}</p>
          )}

          {/* Empty */}
          {!loading && !error && projects.length === 0 && (
            <div className={s.stateWrap}>
              <div className={s.emptyIconWrap}>
                <FaFolderOpen className="text-slate-400 text-2xl" />
              </div>
              <p className={s.stateTitle}>No completed projects yet</p>
              <p className={s.stateDesc}>
                Completed projects will appear here once they are
                marked as complete.
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && projects.length > 0 && (
            <div className={s.cardsList}>
              {projects.map((p) => (
                <div key={p.project_id} className={s.projectCard}>

                  {/* Header */}
                  <div className={s.projectHeaderRow}>
                    <div className={s.cardLeft}>
                      <div className={s.nameBadgeRow}>
                        <span className={s.projectName}>{p.project_name}</span>
                        <span className={s.badgeCompleted}>Completed</span>
                      </div>
                      <span className={s.metaId}>
                        Project ID: {p.project_unique_id}
                      </span>
                      <span className={s.metaDate}>
                        Created: {formatDate(p.created_at)}
                      </span>
                    </div>

                    <div className={s.btnGroup}>
                      <button
                        type="button"
                        className={s.secondaryBtn}
                        onClick={() => alert(`Download: ${p.project_unique_id}`)}
                      >
                        <FaDownload /> Download
                      </button>
                      {/* <button
                        type="button"
                        className={s.primaryBtn}
                        onClick={() => alert(`View: ${p.project_unique_id}`)}
                      >
                        <FaEye /> View Details
                      </button> */}

                      <Link to={`/projectListInfo/${p.project_id}`} className={s.primaryBtn}>
                        <FaEye /> View Details
                      </Link>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className={s.divider} />

                  {/* Info grid */}
                  <div className={s.infoGrid}>
                    <div className={s.kvWrap}>
                      <FaBuilding className={s.kvIcon} />
                      <div className={s.kvBody}>
                        <span className={s.kvLabel}>Customer</span>
                        <span className={s.kvValue}>
                          {p.customer_name || "—"}
                        </span>
                      </div>
                    </div>

                    <div className={s.kvWrap}>
                      <FaMapMarkerAlt className={s.kvIcon} />
                      <div className={s.kvBody}>
                        <span className={s.kvLabel}>Location</span>
                        <span className={s.kvValue}>
                          {p.project_Location || "—"}
                        </span>
                      </div>
                    </div>

                    <div className={s.kvWrap}>
                      <FaLayerGroup className={s.kvIcon} />
                      <div className={s.kvBody}>
                        <span className={s.kvLabel}>Industry</span>
                        <span className={s.kvValue}>
                          {parseJsonArray(p.project_Industry) || "—"}
                        </span>
                      </div>
                    </div>

                    <div className={s.kvWrap}>
                      <FaDoorOpen className={s.kvIcon} />
                      <div className={s.kvBody}>
                        <span className={s.kvLabel}>Handling</span>
                        <span className={s.kvValue}>
                          {parseJsonArray(p.project_Handling) || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

        {/* Back button — centered */}
        <div className="flex justify-center mt-10">
          <Link to="/dashboard">
            <button type="button" className={s.backBtn1}>
              <FaArrowLeft /> {text.projects.backToDashboard}
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
