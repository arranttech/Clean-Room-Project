import { useState, useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks"; // Redux hooks
import {
  updateField,
  updateMultipleFields,
} from "../../redux/slices/customerInfoSlice"; // Redux actions
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaLocationDot, FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import customerInfoDesign from "./customerInfo";

function CustomerInfo() {
  const styles = customerInfoDesign;
  const dispatch = useAppDispatch(); // Redux dispatch

  // --- Redux State (persisted) ---
  const customerName = useAppSelector((s: any) => s.customerInfo.customerName);
  const phoneNumber = useAppSelector((s: any) => s.customerInfo.phoneNumber);
  const customerAddress = useAppSelector((s: any) => s.customerInfo.customerAddress);
  const emailAddress = useAppSelector((s: any) => s.customerInfo.emailAddress);
  const additionalNotes = useAppSelector((s: any) => s.customerInfo.additionalNotes);
  const projectName = useAppSelector((s: any) => s.customerInfo.projectName);
  const unitBranch = useAppSelector((s: any) => s.customerInfo.unitBranch);
  const handling = useAppSelector((s: any) => s.customerInfo.handling);
  const industry = useAppSelector((s: any) => s.customerInfo.industry);
  const uniqueId = useAppSelector((s: any) => s.customerInfo.uniqueId);
  const locationQuery = useAppSelector((s: any) => s.customerInfo.locationQuery);
  const selectedLocation = useAppSelector((s: any) => s.customerInfo.selectedLocation);
  const minTemp = useAppSelector((s: any) => s.customerInfo.minTemp);
  const maxTemp = useAppSelector((s: any) => s.customerInfo.maxTemp);
  const relativeHumidityMin = useAppSelector((s: any) => s.customerInfo.relativeHumidityMin);
  const relativeHumidityMax = useAppSelector((s: any) => s.customerInfo.relativeHumidityMax);

  // --- Local-only UI State (not persisted) ---
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [handlingOpen, setHandlingOpen] = useState(false);
  const industryRef = useRef<HTMLDivElement>(null);
  const handlingRef = useRef<HTMLDivElement>(null);

  const industryOptions = [
    "Pharmaceuticals & Biotechnology",
    "Tissue Culture Laboratory",
    "Chemical & Petrochemical",
  ];

  const handlingOptions = [
    "Contagious",
    "Non-Contagious",
    "Hazardous",
    "Non-Hazardous",
    "Flammable Vapors",
  ];

  const [errors, setErrors] = useState({
    name: "",
    address: "",
    notes: "",
    email: "",
    phone: "",
    branch: "",
    project: "",
    handling: "",
    industry: "",
  });

  // --- Validation---
  const isFormValid = (() => {
    if (!customerName || errors.name) return false;
    if (!customerAddress || errors.address) return false;
    if (!unitBranch || errors.branch) return false;
    if (!projectName || errors.project) return false;
    if (!selectedLocation && !locationQuery) return false;
    if (phoneNumber && errors.phone) return false;
    if (emailAddress && errors.email) return false;
    if (additionalNotes && errors.notes) return false;
    if (handling && errors.handling) return false;
    if (industry && errors.industry) return false;
    return true;
  })();

  const validateCustomerName = (name: string) =>
    /^[A-Za-z\s]{3,30}$/.test(name)
      ? ""
      : "Name must be 3–30 characters and contain only letters and spaces";

  const validateAddress = (address: string) =>
    /^.{1,50}$/.test(address) ? "" : "Address must be 1–50 characters";

  const validateNotes = (notes: string) =>
    /^.{0,200}$/.test(notes) ? "" : "Additional notes cannot exceed 200 characters";

  const validatePhone = (phone: string) => {
    if (!phone) return "";
    return /^\+?[0-9\s\-()]{7,20}$/.test(phone) ? "" : "Invalid phone number";
  };

  const validateEmail = (email: string) => {
    if (!email) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Invalid email address";
  };

  const validateBranch = (branch: string) =>
    /^[A-Za-z0-9\s]{1,20}$/.test(branch)
      ? ""
      : "Branch must be 1–20 characters and contain only letters, numbers, and spaces";

  const validateProject = (project: string) =>
    /^[A-Za-z-_0-9\s]{1,20}$/.test(project)
      ? ""
      : "Project Name must be 1–20 characters and contain only letters, numbers, and spaces";

  // --- Close dropdowns on outside click ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (industryRef.current && !industryRef.current.contains(e.target as Node)) {
        setIndustryOpen(false);
      }
      if (handlingRef.current && !handlingRef.current.contains(e.target as Node)) {
        setHandlingOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Generate Unique ID ---
  const generateUniqueId = (name: string, project: string) => {
    if (!name || !project) return "";
    const slug = (text: string) =>
      text
        .toUpperCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^A-Z0-9-]/g, "")
        .substring(0, 5);
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = String(today.getFullYear()).slice(-2);
    return `${slug(name)}-${slug(project)}-${day}${month}${year}`;
  };

  // --- Auto-generate uniqueId --Redux dispatch ---
  useEffect(() => {
    const id = generateUniqueId(customerName, projectName);
    dispatch(updateField({ field: "uniqueId", value: id })); // Redux update
  }, [customerName, projectName, dispatch]);

  // --- Location search ---
  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3`
      );
      const data = await res.json();
      setLocationResults(data);
      setShowResults(true);
    } catch (err) {
      console.error("Location search failed", err);
    }
  };

  useEffect(() => {
    if (locationQuery.length < 4) {
      setShowResults(false);
      return;
    }
    const delayDebounce = setTimeout(() => searchLocation(locationQuery), 200);
    return () => clearTimeout(delayDebounce);
  }, [locationQuery]);

  // --- Select location + fetch weather--- Redux dispatch ---
  const handleSelectLocation = async (place: any) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);

    // Redux: store location
    dispatch(
      updateMultipleFields({
        selectedLocation: place,
        locationQuery: place.display_name,
      })
    );
    setShowResults(false);

    try {
      const endDate = new Date();
      const startDate = new Date(1940, 0, 1);
      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${startDate.toISOString().split("T")[0]}&end_date=${endDate.toISOString().split("T")[0]}&daily=temperature_2m_max,temperature_2m_min,relative_humidity_2m_max,relative_humidity_2m_min&timezone=auto`
      );
      const data = await response.json();

      if (data?.daily) {
        const maxTemps = data.daily.temperature_2m_max.filter((t: any) => t !== null && !isNaN(t));
        const minTemps = data.daily.temperature_2m_min.filter((t: any) => t !== null && !isNaN(t));
        const humMax = data.daily.relative_humidity_2m_max?.filter((t: any) => t !== null && !isNaN(t));
        const humMin = data.daily.relative_humidity_2m_min?.filter((t: any) => t !== null && !isNaN(t));

        // Redux: store climate data
        dispatch(
          updateMultipleFields({
            maxTemp: Math.max(...maxTemps).toFixed(1),
            minTemp: Math.min(...minTemps).toFixed(1),
            relativeHumidityMax: Math.max(...humMax).toFixed(0),
            relativeHumidityMin: Math.min(...humMin).toFixed(0),
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch temperature data", error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.top}>
        <h1 className={styles.title}>Company Information</h1>
        <h3 className={styles.headerText}>
          Please provide the basic details to get started
        </h3>
      </div>

      <div className={styles.gridContainer}>
        {/* Left Card */}
        <div className={styles.card}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Company Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={customerName} // Redux read
              onChange={(e) => {
                const value = e.target.value;
                dispatch(updateField({ field: "customerName", value })); // Redux update
                setErrors((prev) => ({ ...prev, name: validateCustomerName(value) }));
              }}
              minLength={3}
              maxLength={30}
              placeholder="Enter Company Name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}

            <label className={styles.label}>Phone Number</label>
            <input
              className={styles.input}
              value={phoneNumber} // Redux read
              onChange={(e) => {
                const value = e.target.value;
                dispatch(updateField({ field: "phoneNumber", value })); // Redux update
                setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
              }}
              placeholder="Enter Phone Number"
              minLength={7}
              maxLength={20}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}

            <label className={styles.label}>
              Company Address <span className="text-red-600">*</span>
            </label>
            <input
              className={styles.input}
              value={customerAddress} // Redux read
              onChange={(e) => {
                const value = e.target.value;
                dispatch(updateField({ field: "customerAddress", value })); // Redux update
                setErrors((prev) => ({ ...prev, address: validateAddress(value) }));
              }}
              placeholder="Enter Customer Address"
              maxLength={50}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}

            <label className={styles.label}>Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={emailAddress} // Redux read
              onChange={(e) => {
                const value = e.target.value;
                dispatch(updateField({ field: "emailAddress", value })); // Redux update
                setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
              }}
              placeholder="Enter Email ID"
              maxLength={30}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

            <label className={styles.label}>Additional Notes</label>
            <input
              className={styles.input}
              value={additionalNotes} // Redux read
              onChange={(e) => {
                const value = e.target.value;
                dispatch(updateField({ field: "additionalNotes", value })); // Redux update
                setErrors((prev) => ({ ...prev, notes: validateNotes(value) }));
              }}
              placeholder="Enter Additional Notes"
              maxLength={200}
            />
            {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
          </div>
        </div>

        {/* Right Card */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>Project Information</div>
          <hr className={styles.divider} />

          <div className={styles.rowGroup}>
            <div className={styles.fieldGroup + " w-full"}>
              <label className={styles.label}>
                Unit/Branch <span className="text-red-600">*</span>
              </label>
              <input
                className={styles.input}
                value={unitBranch} // Redux read
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch(updateField({ field: "unitBranch", value })); // Redux update
                  setErrors((prev) => ({ ...prev, branch: validateBranch(value) }));
                }}
                placeholder="Enter Unit or Branch Name"
                maxLength={20}
              />
              {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
            </div>

            <div className={styles.fieldGroup + " w-full"}>
              <label className={styles.label}>
                Project Name <span className="text-red-600">*</span>
              </label>
              <input
                className={styles.input}
                value={projectName} // Redux read
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch(updateField({ field: "projectName", value })); // Redux update
                  setErrors((prev) => ({ ...prev, project: validateProject(value) }));
                }}
                placeholder="Enter Project Name"
                maxLength={20}
              />
              {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project}</p>}
            </div>
          </div>

          <div className={styles.rowGroup}>
            <div ref={industryRef} className={styles.fieldGroup + " w-full relative"}>
              <label className={styles.label}>Industry / Sector</label>
              <div
                onClick={() => setIndustryOpen(!industryOpen)}
                className={`${styles.input} cursor-pointer flex items-center gap-2`}
              >
                <span className="flex-1 truncate whitespace-nowrap">
                  {industry.length > 0 ? `${industry.length} selected` : "Select Industry"}
                </span>
                <span className={styles.dropdownIcon}>▼</span>
              </div>

              {industryOpen && (
                <div className={styles.industryOpen}>
                  <div className={styles.selectIndustry}>Select Industry</div>
                  {industryOptions.map((item) => (
                    <label key={item} className={styles.industryOptions}>
                      <input
                        type="checkbox"
                        checked={industry.includes(item)}
                        onChange={() => {
                          // Redux: toggle industry
                          const updated = industry.includes(item)
                            ? industry.filter((i: string) => i !== item)
                            : [...industry, item];
                          dispatch(updateField({ field: "industry", value: updated }));
                        }}
                        className={styles.industryCheckbox}
                      />
                      <span className="text-sm break-words">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div ref={handlingRef} className={styles.fieldGroup + " w-full relative"}>
              <label className={styles.label}>Handling</label>
              <div
                onClick={() => setHandlingOpen(!handlingOpen)}
                className={`${styles.input} cursor-pointer flex items-center gap-2`}
              >
                <span className="flex-1 truncate whitespace-nowrap">
                  {handling.length > 0 ? `${handling.length} selected` : "Select Handling"}
                </span>
                <span className="text-gray-400 text-xs">▼</span>
              </div>

              {handlingOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 font-semibold border-b">Select Handling</div>
                  {handlingOptions.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={handling.includes(item)}
                        onChange={() => {
                          // Redux: toggle handling
                          const updated = handling.includes(item)
                            ? handling.filter((i: string) => i !== item)
                            : [...handling, item];
                          dispatch(updateField({ field: "handling", value: updated }));
                        }}
                        className="h-5 w-5 shrink-0 rounded-md border-gray-300 text-blue-600"
                      />
                      <span className="text-sm break-words">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* LOCATION */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>
              Location Selection <span className="text-red-600">*</span>
            </label>
            <div className={styles.inputWrapper}>
              <FaLocationDot className={styles.clearButton} />
              <input
                type="text"
                className={styles.inputborder}
                placeholder="Search Location"
                value={locationQuery} // Redux read
                onChange={(e) =>
                  dispatch(updateField({ field: "locationQuery", value: e.target.value })) // Redux update
                }
              />
              {locationQuery && (
                <button
                  type="button"
                  onClick={() =>
                    dispatch(updateField({ field: "locationQuery", value: "" })) // Redux clear
                  }
                  className={styles.locationClear}
                >
                  <FaXmark className={styles.locationClearIcon} />
                </button>
              )}
            </div>

            {showResults && (
              <div 
              // className={styles.locationResults}
              >
                {locationResults.map((place: any) => (
                  <div
                    key={place.place_id}
                    // className={styles.locationResultItem}
                    onClick={() => handleSelectLocation(place)}
                  >
                    <div className={styles.locationResultText}>
                      <span className={styles.locationText}>Selected Location:</span>
                      <br />
                      <span className={styles.selectedLocation}>{place.display_name}</span>
                      <br />
                      <span className="text-[10px]">
                        <span className={styles.coordinates}>Latitude: </span>
                        {place.lat}
                      </span>
                      <span className={styles.coordinatesText}>
                        <span className={styles.coordinates}>Longitude:</span>
                        {place.lon}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <label className={styles.label}>Unique ID (Auto-Generated)</label>
            <input
              className={styles.disabledInput}
              value={uniqueId} // Redux read
              placeholder="Auto Generated ID"
              disabled
            />
          </div>

          {/* TEMPERATURE DISPLAY */}
          {minTemp && maxTemp && (
            <div className={styles.rowGroup}>
              <div className={styles.fieldGroup + " w-full"}>
                <label className={styles.label}>Minimum Temperature (°C)</label>
                <input className={styles.disabledInput} value={`${minTemp} °C`} disabled />
              </div>
              <div className={styles.fieldGroup + " w-full"}>
                <label className={styles.label}>Maximum Temperature (°C)</label>
                <input className={styles.disabledInput} value={`${maxTemp} °C`} disabled />
              </div>
              <div className={styles.fieldGroup + " w-full mt-5"}>
                <label className={styles.label}>Relative Humidity Min</label>
                <input className={styles.disabledInput} value={`${relativeHumidityMin}`} disabled />
              </div>
              <div className={styles.fieldGroup + " w-full mt-5"}>
                <label className={styles.label}>Relative Humidity Max</label>
                <input className={styles.disabledInput} value={`${relativeHumidityMax}`} disabled />
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
        <Link
          to={isFormValid ? "/standards" : "#"}
          state={
            isFormValid
              ? {
                  minimumTemp: minTemp,
                  maximumTemp: maxTemp,
                  minRelativeHumidity: relativeHumidityMin,
                  maxRelativeHumidity: relativeHumidityMax,
                }
              : undefined
          }
          className={`${styles.nextLink} ${!isFormValid ? styles.disabled : ""}`}
          onClick={(e) => {
            if (!isFormValid) {
              e.preventDefault();
              alert("Please fill all required fields correctly before proceeding.");
            }
          }}
        >
          Next Step <FaArrowRight />
        </Link>
      </div>
    </div>
  );
}

export default CustomerInfo;