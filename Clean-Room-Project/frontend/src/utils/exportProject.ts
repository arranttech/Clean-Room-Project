import * as XLSX from "xlsx";

function parseJson(val: string): string {
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr.join(", ") : val;
  } catch {
    return val ?? "—";
  }
}

function label(val: any): any {
  if (val === null || val === undefined || val === "") return "—";
  return val;
}

export async function downloadProjectXLSX(
  projectId: number,
  projectUniqueId: string,
  fetchFn: (id: number) => Promise<any>
) {
  const data = await fetchFn(projectId);
  const { project, standards, rooms, results } = data;
  const wb = XLSX.utils.book_new();

  // Sheet 1: Project Info 
  const projectRows = [
    ["PROJECT INFORMATION", ""],
    ["Field", "Value"],
    ["Project ID", label(project.project_unique_id)],
    ["Project Name", label(project.project_name)],
    ["Status", label(project.project_status)],
    ["Unit / Branch", label(project.project_unit_branch)],
    ["Location", label(project.project_Location)],
    ["Industry", parseJson(project.project_Industry)],
    ["Handling", parseJson(project.project_Handling)],
    ["Max Outdoor Temp (°C)", label(project.project_max_temp)],
    ["Min Outdoor Temp (°C)", label(project.project_min_temp)],
    ["Min Relative Humidity (%)", label(project.project_relative_min_humid)],
    ["Max Relative Humidity (%)", label(project.project_relative_max_humid)],
    ["Created At", label(project.created_at)],
    ["", ""],
    ["CUSTOMER INFORMATION", ""],
    ["Field", "Value"],
    ["Customer Name", label(project.customer_name)],
    ["Customer Address", label(project.customer_address)],
    ["Customer Phone", label(project.customer_phone)],
    ["Customer Email", label(project.customer_email_id)],
    ["Additional Notes", label(project.customers_additional_notes)],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(projectRows), "Project Info");

  //Sheet 2: Standards
  if (standards?.length) {
    const standardHeaders = [
      "Standard ID", "System", "System Type", "Heating Method", "Cooling Method",
      "Standard", "Classification", "ACPH", "Temp Unit",
      "Required Inside Temp", "Required Inside Humidity",
      "Max Temp (°C)", "Min Temp (°C)", "Min Humidity (%)", "Max Humidity (%)",
      "Flow Velocity", "Heating Flow Velocity", "Cooling Flow Velocity",
      "Pipe Configuration", "Static Pressure", "Total Filtration Stages",
    ];
    const standardRows = standards.map((s: any) => [
      s.project_standard_id, s.project_system, s.project_system_type,
      label(s.project_heating_method), label(s.project_cooling_method),
      s.project_standard, s.project_classification_name, s.project_ACPH,
      s.project_temp_Unit, label(s.project_required_inside_temp),
      label(s.project_required_inside_humid),
      label(s.project_max_temp), label(s.project_min_temp),
      label(s.project_relative_min_humid), label(s.project_relative_max_humid),
      label(s.flow_velocity), label(s.heating_flow_velocity),
      label(s.cooling_flow_velocity), label(s.pipe_configuration),
      label(s.static_Pressure), label(s.total_Filtration_Stages),
    ]);
    const ws2 = XLSX.utils.aoa_to_sheet([standardHeaders, ...standardRows]);
    XLSX.utils.book_append_sheet(wb, ws2, "Standards");
  }

  // Sheet 3: Rooms 
  if (rooms?.length) {
    const roomHeaders = [
        "Zone Name", "Room Name", "Length (m)", "Width (m)", "Height (m)",
        "Occupancy", "Equipment Load (kW)", "Lighting (W/m²)",
        "Infiltrations", "Fresh Air (%)", "Exhaust Air (m³/s)", "ACPH",
      ];
      
      const roomRows = rooms.map((r: any) => [
        r.zone_name, r.project_RoomName, label(r.room_Length), label(r.room_Width),
        label(r.room_Height), label(r.room_Occupancy), label(r.room_Equipment_Load),
        label(r.room_Lighting), label(r.room_Infiltrations), label(r.room_FreshAir),
        label(r.room_ExhaustAir), label(r.project_ACPH),
      ]);
    const ws3 = XLSX.utils.aoa_to_sheet([roomHeaders, ...roomRows]);
    XLSX.utils.book_append_sheet(wb, ws3, "Rooms");
  }

  // Sheet 4: Results
  if (results?.length) {
    const resultHeaders = [
      "Room Name", "Area (m²)", "Volume (m³)", "Room CFM",
      "Fresh Air (CFM)", "Exhaust Air (CFM)",
      "Dehumid CFM", "Rem. Water Vapour", "Result CFM (Cooling)",
      "Terminal Supply Modules (Cooling)", "Room AC Load (TR)",
      "CFM AC Load (TR)", "Res. Cooling Load (TR)",
      "Add. Water Vapour", "Humid CFM", "Result CFM (Heating)",
      "Terminal Supply Modules (Heating)", "Room Heating Load (TR)",
      "CFM Heating Load (TR)", "Result Heating Load (TR)",
    ];
    const resultRows = results.map((r: any) => [
      r.project_RoomName, r.project_Area, r.project_Volume,
      r.project_RoomCfm, r.project_FreshAir, r.project_ExhaustAir,
      r.project_DehumidCfm, r.project_Rem_Water_Vapour, r.project_ResultCfm,
      r.project_Room_Termi_Supply_Mod, r.project_Room_AC_Load_TR,
      r.project_Cfm_AC_Load_TR, r.project_Res_Cooling_Load_TR,
      r.project_add_Water_Vapour, r.project_HumidCfm,
      r.project_ResultCfm_Hot, r.project_Room_Term_Supply_Mod,
      r.project_Room_Heating_Load_TR, r.project_Cfm_Heating_Load_TR,
      r.project_Result_Heating_Load_TR,
    ]);
    const ws4 = XLSX.utils.aoa_to_sheet([resultHeaders, ...resultRows]);
    XLSX.utils.book_append_sheet(wb, ws4, "Results");
  }

  XLSX.writeFile(wb, `${projectUniqueId}_export.xlsx`);
}