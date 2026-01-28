import React from 'react'
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import registerDesign from "./registerCSS";
import navbarDesign from '../../components/navbar/navbarDesign';

function register() {

    const styles = registerDesign;

    return (
        <div className={styles.wrapper}>


            <div className={styles.gridContainer}>
                {/* Left Card */}
                <div className={styles.card} >
                    <div className={styles.fieldGroup}>
                        <img
                src="/Arrant.jpeg"
                alt="Arrant Logo"
                className={styles.logoImg}
              />

                        <h2 className={styles.cardTitle}> Welcome</h2>
                        <p className={styles.cardInfo}> Sign in to your STERI Clean Air account </p>

                        <label className={styles.label}>Email Address</label>


                        <div className={styles.inputWrapper}>
                            <FaEnvelope className={styles.mailIcon} />
                            <input
                                type="email"
                                placeholder="Enter Email Address"
                                className={styles.input}
                            />
                        </div>

                        <label className={styles.label}> Password </label>

                        <div className={styles.inputWrapper}>
                            <FaLock className={styles.mailIcon} />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                className={styles.input}
                            />
                        </div>



                       <br />

                        <button className={styles.loginButton}> Register </button>

                        <Link to="/login" className={styles.nextLink}>
                            Alread has account <span className='text-blue-600 hover:text-blue-400'> Login Here! </span>

                        </Link>
                    </div>
                </div>




            </div>
        </div>

    )
}
export default register