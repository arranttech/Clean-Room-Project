
import React from "react";
import s from "./style";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import Header from "../../components/header";
import { FaMagnifyingGlass } from "react-icons/fa6";


type ErrorScreenProps = {
    message?: string;
    onRetry?: () => void;
};



const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {


    return (
        
    
     
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                textAlign: "center",
                backgroundColor: "#f8f9fa",
                padding: "20px",
            }}
        >
            <div className={s.icon}><FaMagnifyingGlass /></div>
            <div><h1 className={s.statusCode}>404</h1>
            <hr className={s.divider}/>
            </div>
            
            <h1 style={{ fontSize: "2.0rem", marginBottom: "16px", color: "#0a0909", fontWeight: "bold" }}>
                Page Not Found
            </h1>
            <p className={s.title}>
               { "We couldn't find the page you're looking for. The page may have been moved, deleted, or the URL might be incorrect."}
            </p>

            <div className={s.navButtons}>
                <button className={s.homeButton}  onClick={() => (window.location.href = "/admin")}>
                  <FaHome />  Go to Home
                </button>

                <button className={s.retryButton}
                    onClick={onRetry || (() => window.location.reload())}
                >
                    <FaArrowLeft /> Go Back
                </button>
            </div>

            <div className={s.card}>
                <h3 className={s.cardTitle}>Need help?</h3>
                <p>if you believe this is an error or need assistance, here are some helpful links:
                </p>

                <div className={s.links}>
                    <button className={s.navLink}  onClick={() => (window.location.href = "/dashboard")}>
                    Dashboard
                </button>  

                <button className={s.navLink}  onClick={() => (window.location.href = "/projects")}>
                   Projects
                </button>

                <button className={s.navLink}  onClick={() => (window.location.href = "/")}>
                 Admin
                </button>
                </div>
            </div>
        </div>
       
   
      
    );
};

export default ErrorScreen;
