import Header from "../../components/header";
import resultsDesign from "./styles";
import { Home } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getResultsSummaryByProjectId } from "../../backend/controller/resultsController";
import resultsText from "../../json/resultsText.json";
import { downloadProjectXLSX } from "../../utils/exportProject";
import {
  getProjectExportData,
} from "../../backend/controller/projectController";
const t = resultsText;

type ResultSummary = {
  project_id: number;
  project_unique_id: string;
  project_name: string;
  total_rooms: number;
  submission_date: string;
  project_classification_name?: string;
};

export default function Results() {
  const s = resultsDesign;
  const navigate = useNavigate();

  const { projectId: projectIdParam } = useParams<{ projectId: string }>();
  const projectId = projectIdParam || null;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ResultSummary | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError("No project ID found in URL.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getResultsSummaryByProjectId(Number(projectId));

        setSummary(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Failed to fetch results:", err);
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <>
        <Header />
        <div className={s.wrap}>
          <div className={s.card} style={{ textAlign: "center", padding: "60px" }}>
            Loading results...
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className={s.wrap}>
          <div className={s.card} style={{ textAlign: "center", padding: "60px" }}>
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className={s.wrap}>
        <div className={s.card}>
          <div className={s.headerSection}>
            <div className={s.successIcon}>✓</div>

            <h1 className={s.title}>{t.title}</h1>
            <p className={s.subtitle}>{t.subtitle}</p>
            <p className={s.description}>{t.description}</p>
          </div>

          <div className={s.detailsBox}>
           <div>
            <div className={s.detailLabel}>Project Name</div>
            <div className={s.detailValue}>{summary?.project_name}</div>
           </div>

           <div>
            <div className={s.detailLabel}>Total Rooms</div>
            <div className={s.detailValue}>{summary?.total_rooms} Rooms</div>
           </div>

          <div>
    <div className={s.detailLabel}>Submission Date</div>
    <div className={s.detailValue}>{summary?.submission_date}</div>
  </div>
</div>

          <div className={s.buttonRow}>
            <button type="button" className={s.primaryBtn} onClick={() =>
              downloadProjectXLSX(Number(projectId),String(summary?.project_unique_id),getProjectExportData)}>
                                      
              Download Report
            </button>

            <button type="button" className={s.secondaryBtn} type="button"
             onClick={() => navigate(`/projectListInfo/${projectId}`)}>
              View Project 
            </button>
          </div>

          <hr />

          <div className={s.reportSection}>
  <div className={s.reportTitle}>
    What's included in the report:
  </div>

  <div className={s.reportList}>
    <div className={s.reportItem}>
      <span className={s.check}>✓</span>
      <span>{t.FooterText.Line1}</span>
    </div>

    <div className={s.reportItem}>
      <span className={s.check}>✓</span>
      <span>{t.FooterText.Line2}</span>
    </div>

    <div className={s.reportItem}>
      <span className={s.check}>✓</span>
      <span>{t.FooterText.Line3}</span>
    </div>

    <div className={s.reportItem}>
      <span className={s.check}>✓</span>
      <span>{t.FooterText.Line4}</span>
    </div>
  </div>
</div>
        </div>
        
      </div>
    <div>
      <div className={s.footer}>
      <div className={s.footerTitle}></div>
        <button className={s.goHomeBtn}
          type="button"
          onClick={() => navigate("/dashboard")}
          //className={s.backDashboard}
        >
          <Home size={16} /> Back to Dashboard
        </button>
    </div>
    </div>
    </>
  );
}