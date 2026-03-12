import React from 'react'
import { Link } from 'react-router-dom';
import s from './style';
import { FaArrowLeft} from "react-icons/fa";
import Header from '../../../components/Header';

type InfoItemProps = {
  label: string;
  value: string;
  variant?: "standard" | "room";
};

const InfoItem: React.FC<InfoItemProps> = ({ label, value, variant="standard" }) => (
  <div className={variant === "room" ? s.roomCardInfo :s.standardsInfo}>
    <p className={variant === "room" ? s.roomCardTitle :s.cardInfoTitle}>{label}</p>
    <p className={variant === "room" ? s.roomCardValue :s.cardInfoValue}>{value}</p>
  </div>
);

type RoomProps = {
  title: string;
  roomNo: string;
  values: { label: string; value: string }[];
};

const RoomSection: React.FC<RoomProps> = ({ title, roomNo, values }) => (
  <div className="bg-gray-100 border rounded-xl p-6 mb-6 shadow-sm">
    <div className="flex justify-between mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <span className="text-sm text-gray-500">{roomNo}</span>
    </div>
    <hr className="my-4 border-gray-300" />

    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
     
      {values.map((item, i) => (
        <InfoItem key={i} label={item.label} value={item.value} variant="room" />
      ))}
    </div>
  </div>
);


function projectListInfo() {
  return (
    <>
     <Header />
      <div className="bg-gray-100 min-h-screen p-10">

      {/* Back Button */}
      <Link to="/projects" className={s.backButton}>
        
          <FaArrowLeft /> Back to Projects List
        
      </Link>
      

      {/* Header Card */}
      <div className={s.projectInfoCard}>
        <div className={s.sectionHeader}>
          <h1 className={s.projectTitle}>
            Tissue Culture Laboratory Setup
          </h1>
          <span className={s.projectProgress}>
            Completed
          </span>
        </div>

        <p className={s.projectID}>
           <span className={s.projectLabel}>Project ID:</span> BIOLAB_RESEARCH_CENTER_009012
        </p>
        <p className={s.createdDate}>
           <span className={s.projectLabel}>Created:</span> Jan 25, 2026
        </p>
        <hr />

        {/* Stats */}
        <div className={s.projectDetails}>
           <InfoItem label="Total Rooms" value="3" />
        
          
          <InfoItem label="Classification" value="Grade C" />
          <InfoItem label="ACPH" value="55" />
          <InfoItem label="Total Volume" value="417.90 m³" />
        </div>
      </div>

      {/* Customer Information */}
      <div className={s.customerInfoCard}>
        <h2 className={s.cardTitle}>
          Customer Information
        </h2>

        <div className={s.infoGrid}>

          <div>
            <p className={s.projectLabel}>Customer Name</p>
            <p className={s.projectValues}>BioLab Research Institute</p>
          </div>

          <div>
            <p className={s.projectLabel}>Unit/Branch Name</p>
            <p className={s.projectValues}>Central Research Wing</p>
          </div>

          <div>
            <p className={s.projectLabel}>Address</p>
            <p className={s.projectValues}>789 Science Drive, Austin, TX 78701</p>
          </div>

          <div>
            <p className={s.projectLabel}>Location</p>
            <p className={s.projectValues}>Austin, Texas, United States</p>
          </div>

          <div>
            <p className={s.projectLabel}>Phone</p>
            <p className={s.projectValues}>+1 512-555-0300</p>
          </div>

          <div>
            <p className={s.projectLabel}>Email</p>
            <p className={s.projectValues + " text-blue-600"}>admin@biolabresearch.org</p>
          </div>

          <div>
            <p className={s.projectLabel}>Industry Sectors</p>
            <div className="flex gap-2 mt-1">
              <span className= {s.projectValues + " bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs"}>
                Tissue Culture Laboratory
              </span>
              <span className={s.projectValues + " bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs"}>
                Research & Laboratories
              </span>
            </div>
          </div>

          <div>
            <p className={s.projectLabel}>Handling Types</p>
            <div className="flex gap-2 mt-1">
              <span className={s.projectValues + " bg-gray-200 px-3 py-1 rounded-md text-xs"}>
                Contagious
              </span>
              <span className={s.projectValues + " bg-gray-200 px-3 py-1 rounded-md text-xs"}>
                Bio-safety
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Classification */}
      <div className={s.customerInfoCard}>
        <h2 className={s.cardTitle}>
          Classification Details
        </h2>

        <div className={s.projectDetails}>
          <div>
            <p className={s.projectLabel}>Standard</p>
            <p className={s.projectValues}>EU GMP Annex 1:2022</p>
          </div>

          <div>
            <p className={s.projectLabel}>Class</p>
            <p className={s.projectValues}>Grade C</p>
          </div>

          <div>
            <p className={s.projectLabel}>ACPH Range</p>
            <p className={s.projectValues}>30 - 60</p>
          </div>

          <div>
            <p className={s.projectLabel}>Selected ACPH</p>
            <p className={s.projectValues}>55</p>
          </div>
        </div>
      </div>

      {/* Room Details */}
      <div className={s.customerInfoCard}>
        <h2 className={s.cardTitle}>
          Room Details (3 Rooms)
        </h2>

        <RoomSection
          title="Culture Room 1"
          roomNo="Room #1"
        
          values={[
            { label: "Length", value: "9.0 m" },
            { label: "Width", value: "7.5 m" },
            { label: "Height", value: "3.2 m" },
            { label: "Volume", value: "216.00 m³" },
            { label: "Occupancy", value: "3" },
            { label: "Equipment Load", value: "6.5 kW" },
            { label: "Lighting Load", value: "11.0 W/m²" },
            { label: "ACPH", value: "55" },
            { label: "Fresh Air", value: "18%" },
            { label: "Exhaust Air", value: "300 m³/s" },
          ]}
        />

        <RoomSection
          title="Incubation Zone"
          roomNo="Room #2"
          values={[
            { label: "Length", value: "7.0 m" },
            { label: "Width", value: "6.0 m" },
            { label: "Height", value: "3.2 m" },
            { label: "Volume", value: "134.40 m³" },
            { label: "Occupancy", value: "2" },
            { label: "Equipment Load", value: "5.0 kW" },
            { label: "Lighting Load", value: "10.0 W/m²" },
            { label: "ACPH", value: "50" },
            { label: "Fresh Air", value: "15%" },
            { label: "Exhaust Air", value: "250 m³/s" },
          ]}
        />

        <RoomSection
          title="Sterilization Room"
          roomNo="Room #3"
          values={[
            { label: "Length", value: "5.0 m" },
            { label: "Width", value: "4.5 m" },
            { label: "Height", value: "3.0 m" },
            { label: "Volume", value: "67.50 m³" },
            { label: "Occupancy", value: "1" },
            { label: "Equipment Load", value: "3.5 kW" },
            { label: "Lighting Load", value: "9.0 W/m²" },
            { label: "ACPH", value: "45" },
            { label: "Fresh Air", value: "12%" },
            { label: "Exhaust Air", value: "180 m³/s" },
          ]}
        />
      </div>
    </div>
    </>
  )
}

export default projectListInfo