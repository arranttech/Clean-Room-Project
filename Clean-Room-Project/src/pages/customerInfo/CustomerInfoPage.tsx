import React, { useState, useEffect } from "react"
import { FaArrowLeft, FaArrowRight } from "react-icons/fa"
import { FaLocationDot } from "react-icons/fa6"
import { Link } from "react-router-dom"
import customerInfoDesign from "./customerInfo"

function CustomerInfo() {
  const styles = customerInfoDesign

  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerAddress, setCustomerAddress] = useState("")
  const [emailAddress, setEmailAddress] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [projectName, setProjectName] = useState("");
  const [unitBranch, setUnitBranch] = useState("");
  const [industry, setIndustry] = useState("");
  const [handling, setHandling] = useState("");

  const [uniqueId, setUniqueId] = useState("");

  const [locationQuery, setLocationQuery] = useState("")
  const [locationResults, setLocationResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [minTemp, setMinTemp] = useState("")
  const [maxTemp, setMaxTemp] = useState("")



  const generateUniqueId = (customerName, projectName) => {
    if (!customerName || !projectName) return "";

    const slug = (text) =>
      text
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^A-Z0-9-]/g, "");

    // const random = Math.random().toString(36).substring(2, 7).toUpperCase();

    const today = new Date()
    const day = String(today.getDate()).padStart(2, "0")
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const year = String(today.getFullYear()).slice(-2)

    return `${slug(customerName)}-${slug(projectName)}-${day}${month}${year}`;
  };

  useEffect(() => {
    const id = generateUniqueId(customerName, projectName)
    setUniqueId(id)

    console.group("CUSTOMER INFO")
    console.log("Customer Name:", customerName)
    console.log("Phone Number:", phoneNumber)
    console.log("Customer Address:", customerAddress)
    console.log("Email Address:", emailAddress)
    console.log("Additional Notes:", additionalNotes)
    console.log("Unit/Branch:", unitBranch)
    console.log("Project Name:", projectName)
    console.log("Industry:", industry)
    console.log("Handling:", handling)
    console.log("Unique ID:", id)
    console.log("Location Query:", locationQuery)
    console.log("Min Temp (°C):", minTemp)
    console.log("Max Temp (°C):", maxTemp)
    console.log("Generated At:", new Date().toLocaleString())
    console.groupEnd()
  }, [customerName, phoneNumber, customerAddress, emailAddress, additionalNotes, unitBranch, projectName, industry, handling, locationQuery, minTemp, maxTemp])

  useEffect(() => {
    setUniqueId(generateUniqueId(customerName, projectName));
  }, [customerName, projectName]);




  const searchLocation = async () => {
    if (!locationQuery.trim()) return

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationQuery
        )}&limit=5`
      )
      const data = await res.json()
      setLocationResults(data)
      setShowResults(true)
    } catch (err) {
      console.error("Location search failed", err)
    }
  }

  const handleSelectLocation = async (place) => {
    const lat = parseFloat(place.lat)
    const lng = parseFloat(place.lon)

    setLocationQuery(place.display_name)
    setShowResults(false)

    try {
      const endDate = new Date()
      const startDate = new Date(1940, 0, 1)

      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${startDate
          .toISOString()
          .split("T")[0]}&end_date=${endDate
            .toISOString()
            .split("T")[0]}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      )

      const data = await response.json()

      if (data?.daily) {
        const maxTemps = data.daily.temperature_2m_max.filter(
          (t) => t !== null && !isNaN(t)
        )
        const minTemps = data.daily.temperature_2m_min.filter(
          (t) => t !== null && !isNaN(t)
        )

        setMaxTemp(Math.max(...maxTemps).toFixed(1))
        setMinTemp(Math.min(...minTemps).toFixed(1))
      }
    } catch (error) {
      console.error("Failed to fetch temperature data", error)
    }
  }

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.headerText}>
        Please provide the basic details to get started
      </h3>

      <div className={styles.gridContainer}>
        {/* Left Card */}
        <div className={styles.card}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Customer Name *</label>
            <input className={styles.input} required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Enter Customer Name"/>

            <label className={styles.label}>Phone Number</label>
            <input className={styles.input} onChange={(e) => setPhoneNumber(e.target.value)}  placeholder="Enter Phone Number"/>

            <label className={styles.label}>Customer Address *</label>
            <input className={styles.input} required onChange={(e) => setCustomerAddress(e.target.value)} placeholder="Enter Customer Address"/>

            <label className={styles.label}>Email Address</label>
            <input type="email" className={styles.input} onChange={(e) => setEmailAddress(e.target.value)} placeholder="Enter Email ID"/>

            <label className={styles.label}>Additional Notes</label>
            <input className={styles.input} onChange={(e) => setAdditionalNotes(e.target.value)} placeholder="Enter Additional Notes" />
          </div>
        </div>

        {/* Right Card */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Project Information</div>
          <hr className={styles.divider} />

          <div className={styles.rowGroup}>
            <div className={styles.fieldGroup + " w-full"}>
              <label className={styles.label}>Unit/Branch *</label>
              <input className={styles.input} required onChange={(e) => setUnitBranch(e.target.value)} placeholder="Enter Unit or Branch Name"/>
            </div>

            <div className={styles.fieldGroup + " w-full"}>
              <label className={styles.label}>Project Name *</label>
              <input className={styles.input} required value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter Project Name" />
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.fieldGroup + " w-full"}>
              <label className={styles.label}>Industry/sector</label>
              <input
                type="text"
                placeholder="Select"
                className={styles.input}
                onChange={(e) => setIndustry(e.target.value)}
                
              />
            </div>

            <div className={styles.fieldGroup + " w-full"}>
              <label className={styles.label}>Handling</label>
              <input
                type="text"
                placeholder="Select"
                className={styles.input}
                onChange={(e) => setHandling(e.target.value)}
              />
            </div>
          </div>

          {/* LOCATION */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Location Selection *</label>

            <div className={styles.locationWrapper}>
              <FaLocationDot className={styles.locationIcon} />
              <input
                className={styles.locationInput}
                placeholder="Search Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
              <button
                type="button"
                className={styles.searchButton}
                onClick={searchLocation}
              >
                Search
              </button>
            </div>

            {showResults && (
              <div className={styles.locationResults}>
                {locationResults.map((place) => (
                  <div
                    key={place.place_id}
                    className={styles.locationResultItem}
                    onClick={() => handleSelectLocation(place)}
                  >
                    {place.display_name}
                  </div>
                ))}
              </div>
            )}

            <label className={styles.label}>Unique ID (Auto-Generated)</label>
            <input className={styles.disabledInput} value={uniqueId} placeholder="Auto Generated ID" disabled  />
          </div>

          {/* TEMPERATURE DISPLAY */}
          {minTemp && maxTemp && (
            <div className={styles.rowGroup}>
              <div className={styles.fieldGroup + " w-full"}>
                <label className={styles.label}>Minimum Temperature (°C)</label>
                <input
                  className={styles.disabledInput}
                  value={`${minTemp} °C`}
                  disabled
                 
                />
              </div>

              <div className={styles.fieldGroup + " w-full"}>
                <label className={styles.label}>Maximum Temperature (°C)</label>
                <input
                  className={styles.disabledInput}
                  value={`${maxTemp} °C`}
                  disabled
                 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Link to="/dashboard" className={styles.backLink}>
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <Link to="/next-step" className={styles.nextLink}>
          Next Step <FaArrowRight />
        </Link>
      </div>
    </div>
  )
}

export default CustomerInfo
