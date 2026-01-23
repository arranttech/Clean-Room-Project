import React from 'react'
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import loginDesign from "./loginCSS";

function login() {

    const styles = loginDesign;

    return (
        <div className={styles.wrapper}>
            

            <div className={styles.gridContainer}>
                {/* Left Card */}
                <div className={styles.card} >
                    <div className={styles.fieldGroup}>

                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter Email Address"
                            className={styles.input}
                        />

                        <label className={styles.label}> Password </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className={styles.input}
                        />

                        <button className={styles.loginButton}>Login</button>
                    </div>
                </div>




            </div>
        </div>

    )
}

export default login