import { useEffect, useState } from "react";
import {
  PolicyAP,
  PolicyStatus,
  PolicyType,
  APStatus,
} from "@/models/policyAP";

// ตัวอย่าง option สถานะ
const statusOptions = [
  { value: "", label: "ทั้งหมด" },
  { value: PolicyStatus.NOTIFIED, label: "แจ้งงานแล้ว" },
  { value: PolicyStatus.RECEIVED_NOTIFIED, label: "รับแจ้งงานแล้ว" },
  { value: PolicyStatus.APPLICATION_CREATED, label: "สร้างใบคำขอแล้ว" },
  { value: PolicyStatus.POLICY_RECEIVED, label: "ได้รับกรมธรรม์แล้ว" },
];
const policyTypeOptions = [
  { value: "", label: "ทุกประเภท" },
  { value: PolicyType.COMPULSORY_MOTOR, label: "พ.ร.บ." },
  { value: PolicyType.VOLUNTARY_MOTOR, label: "สมัครใจ" },
];
const apStatusOptions = [
  { value: "", label: "ทุกสถานะ" },
  { value: APStatus.VALIDATED, label: "ตรวจสอบแล้ว" },
  { value: APStatus.DISPUTED, label: "มีข้อโต้แย้ง" },
];

export default function PolicyAPPage() {
  const [policies, setPolicies] = useState<PolicyAP[]>([]);
  const [filtered, setFiltered] = useState<PolicyAP[]>([]);
  const [modal, setModal] = useState<PolicyAP | null>(null);

  // ฟิลเตอร์
  const [searchNo, setSearchNo] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchAPStatus, setSearchAPStatus] = useState("");

  useEffect(() => {
    fetch("/api/policyAP")
      .then((res) => res.json())
      .then((data) => {
        setPolicies(data);
        setFiltered(data);
      });
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    let f = policies;
    if (searchNo.trim())
      f = f.filter((p) =>
        p.policyNumber.toLowerCase().includes(searchNo.trim().toLowerCase())
      );
    if (searchName.trim())
      f = f.filter((p) =>
        p.customerName.toLowerCase().includes(searchName.trim().toLowerCase())
      );
    if (searchStatus) f = f.filter((p) => p.policyStatus === searchStatus);
    if (searchType) f = f.filter((p) => p.policyType === searchType);
    if (searchAPStatus) f = f.filter((p) => p.apStatus === searchAPStatus);
    setFiltered(f);
  }

  function statusColor(status: string) {
    if (status === PolicyStatus.POLICY_RECEIVED) return "#36b37e";
    if (status === PolicyStatus.APPLICATION_CREATED) return "#3182ce";
    if (status === PolicyStatus.RECEIVED_NOTIFIED) return "#b39f25";
    if (status === PolicyStatus.NOTIFIED) return "#888";
    return "#bbb";
  }
  function apStatusColor(status: string) {
    if (status === APStatus.VALIDATED) return "#2eb872";
    if (status === APStatus.DISPUTED) return "#ef5350";
    return "#aaa";
  }
  function safeDate(date: string | Date | undefined) {
    if (!date) return "-";
    try {
      if (typeof date === "string") {
        const d = new Date(date);
        return !isNaN(d.getTime()) ? d.toLocaleDateString("th-TH") : "-";
      }
      if (date instanceof Date) return date.toLocaleDateString("th-TH");
      return "-";
    } catch {
      return "-";
    }
  }

  function policyTypeLabel(type: PolicyType) {
    if (type === PolicyType.COMPULSORY_MOTOR) return "พ.ร.บ.";
    if (type === PolicyType.VOLUNTARY_MOTOR) return "สมัครใจ";
    return type;
  }

  return (
    <div
      style={{
        padding: "40px 0",
        minHeight: "100vh",
        background: "linear-gradient(120deg,#e0eafc 0%,#cfdef3 100%)",
        fontFamily: "'Kanit', Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 34,
            color: "#1d3557",
            fontWeight: 700,
            marginBottom: 18,
            letterSpacing: 1,
          }}
        >
          รายการกรมธรรม์ (AP)
        </h1>
        {/* Filter */}
        <form
          onSubmit={handleSearch}
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 20,
            marginBottom: 22,
            boxShadow: "0 2px 10px rgba(30,70,120,0.07)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="เลขกรมธรรม์"
            value={searchNo}
            onChange={(e) => setSearchNo(e.target.value)}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="ชื่อลูกค้า"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={inputStyle}
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={inputStyle}
          >
            {policyTypeOptions.map((o) => (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            style={inputStyle}
          >
            {statusOptions.map((o) => (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            value={searchAPStatus}
            onChange={(e) => setSearchAPStatus(e.target.value)}
            style={inputStyle}
          >
            {apStatusOptions.map((o) => (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            style={{ ...buttonStyle, background: "#1c8800" }}
          >
            ค้นหา
          </button>
          <button
            type="button"
            style={{ ...buttonStyle, background: "#bbb", color: "#222" }}
            onClick={() => {
              setSearchNo("");
              setSearchName("");
              setSearchStatus("");
              setSearchType("");
              setSearchAPStatus("");
              setFiltered(policies);
            }}
          >
            ล้างค่า
          </button>
        </form>

        {/* ตาราง */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            boxShadow:
              "0 4px 24px 0 rgba(0,64,128,.10), 0 1.5px 8px 0 rgba(30,60,80,0.06)",
            padding: "26px 10px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              minWidth: 1200,
              maxWidth: 1600,
              margin: "0 auto",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f6fa" }}>
                <th style={{ ...thStyle, minWidth: 90 }}>เลขกรมธรรม์</th>
                <th style={{ ...thStyle, minWidth: 130 }}>ชื่อผู้เอาประกัน</th>
                <th style={{ ...thStyle, minWidth: 105 }}>ทะเบียนรถ</th>
                <th style={{ ...thStyle, minWidth: 90, whiteSpace: "nowrap" }}>
                  วันที่คุ้มครอง
                </th>
                <th style={{ ...thStyle, minWidth: 80 }}>ประเภท</th>
                <th style={{ ...thStyle, minWidth: 105 }}>สถานะ</th>
                <th style={{ ...thStyle, minWidth: 85, textAlign: "right" }}>
                  เบี้ยสุทธิ
                </th>
                <th style={{ ...thStyle, minWidth: 105 }}>AP Status</th>
                <th style={{ ...thStyle, minWidth: 105 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: "center", padding: 32, color: "#888" }}
                  >
                    ไม่พบข้อมูลกรมธรรม์
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr
                    key={p.requestedID}
                    style={{ borderBottom: "1.5px solid #f1f1f1" }}
                  >
                    <td style={{ ...tdStyle, minWidth: 90 }}>
                      {p.policyNumber}
                    </td>
                    <td style={{ ...tdStyle, minWidth: 130 }}>
                      {p.customerName}
                    </td>
                    <td style={{ ...tdStyle, minWidth: 105 }}>
                      {p.licenseNumber}
                    </td>
                    <td
                      style={{ ...tdStyle, minWidth: 90, whiteSpace: "nowrap" }}
                    >
                      {safeDate(p.effectiveDate)}
                    </td>
                    <td style={{ ...tdStyle, minWidth: 80 }}>
                      {policyTypeLabel(p.policyType)}
                    </td>
                    <td style={{ ...tdStyle, minWidth: 150 }}>
                      <span
                        style={{
                          padding: "4px 16px",
                          borderRadius: 8,
                          background: statusColor(p.policyStatus),
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {statusOptions.find((s) => s.value === p.policyStatus)
                          ?.label || p.policyStatus}
                      </span>
                    </td>
                    <td
                      style={{
                        ...tdStyle,
                        minWidth: 85,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.premiumTotal?.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td style={{ ...tdStyle, minWidth: 90 }}>
                      <span
                        style={{
                          padding: "4px 11px",
                          borderRadius: 10,
                          background: apStatusColor(p.apStatus),
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {apStatusOptions.find((a) => a.value === p.apStatus)
                          ?.label || p.apStatus}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, minWidth: 105 }}>
                      <button style={buttonStyle} onClick={() => setModal(p)}>
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal รายละเอียด */}
        {modal && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h2 style={{ marginBottom: 12 }}>รายละเอียดกรมธรรม์</h2>
              <table style={{ fontSize: 17 }}>
                <tbody>
                  <tr>
                    <td style={labelStyle}>เลขกรมธรรม์:</td>
                    <td>{modal.policyNumber}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>ชื่อผู้เอาประกัน:</td>
                    <td>{modal.customerName}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>ทะเบียนรถ:</td>
                    <td>{modal.licenseNumber}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>วันที่คุ้มครอง:</td>
                    <td>{safeDate(modal.effectiveDate)}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>ประเภทประกัน:</td>
                    <td>{policyTypeLabel(modal.policyType)}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>สถานะ:</td>
                    <td>
                      {statusOptions.find((s) => s.value === modal.policyStatus)
                        ?.label || modal.policyStatus}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>เบี้ย:</td>
                    <td>
                      {modal.premium?.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>เบี้ยสุทธิ:</td>
                    <td>
                      {modal.premiumTotal?.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>AP Status:</td>
                    <td>
                      {apStatusOptions.find((a) => a.value === modal.apStatus)
                        ?.label || modal.apStatus}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>วันที่สร้าง:</td>
                    <td>{safeDate(modal.createdDate)}</td>
                  </tr>
                </tbody>
              </table>
              <button
                style={{ ...buttonStyle, marginTop: 28, background: "#a4a8ab" }}
                onClick={() => setModal(null)}
              >
                ปิด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// -------- CSS in JS --------
const thStyle = {
  padding: "12px 8px",
  fontWeight: 700,
  fontSize: 18,
  color: "#13325b",
  textAlign: "left" as const,
  borderBottom: "2px solid #e0e0e0",
  background: "#f3f6fa",
};
const tdStyle = {
  padding: "10px 8px",
  fontSize: 17,
  color: "#213248",
  background: "#fff",
};
const labelStyle = {
  color: "#666",
  fontWeight: 500,
  paddingRight: 16,
  minWidth: 120,
  verticalAlign: "top" as const,
};
const buttonStyle = {
  background: "#0070f3",
  color: "#fff",
  padding: "7px 20px",
  borderRadius: 8,
  border: "none",
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
  margin: "0 0 0 0",
  transition: "background 0.18s",
};
const inputStyle = {
  padding: "8px 12px",
  fontSize: 16,
  borderRadius: 6,
  border: "1px solid #bbb",
  fontFamily: "'Kanit', Arial, sans-serif",
  minWidth: 120,
};
const modalOverlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(60,80,120,0.13)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const modalBox = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 8px 32px rgba(40,60,120,0.13)",
  padding: "34px 38px 26px 30px",
  minWidth: 350,
  maxWidth: "95vw",
  minHeight: 220,
  fontFamily: "'Kanit', Arial, sans-serif",
};
