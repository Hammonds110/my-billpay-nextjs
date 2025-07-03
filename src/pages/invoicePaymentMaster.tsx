import { useEffect, useState } from "react";
import {
  InvoicePaymentMaster,
  PaymentStatus,
  PolicyType,
  InvoicePaymentItem,
} from "@/models/invoicePaymentMaster";

// mock ตัวอย่างบริษัท
const companyOptions = [
  { value: "52", label: "ไทยวิวัฒน์" },
  { value: "01", label: "วิริยะ" },
  { value: "03", label: "สินมั่นคง" },
];

export default function InvoicePaymentMasterPage() {
  const [masters, setMasters] = useState<InvoicePaymentMaster[]>([]);
  const [filtered, setFiltered] = useState<InvoicePaymentMaster[]>([]);
  const [modalMaster, setModalMaster] = useState<InvoicePaymentMaster | null>(
    null
  );

  // ฟิลเตอร์
  const [searchIRCP, setSearchIRCP] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    fetch("/api/invoicePaymentMaster")
      .then((res) => res.json())
      .then((data) => {
        // fix data type สำหรับวันที่ (กรณี mock ผิด)
        const fixed = data.map((d: any) => ({
          ...d,
          invoiceDate:
            typeof d.invoiceDate === "string"
              ? d.invoiceDate
              : new Date(d.invoiceDate).toISOString(),
          importDate:
            typeof d.importDate === "string"
              ? d.importDate
              : new Date(d.importDate).toISOString(),
        }));
        setMasters(fixed);
        setFiltered(fixed);
      });
  }, []);

  // filter
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    let f = masters;
    if (searchIRCP.trim())
      f = f.filter(
        (m) =>
          m.ircpID.toLowerCase().includes(searchIRCP.trim().toLowerCase()) ||
          companyOptions
            .find((opt) => opt.value === m.ircpID)
            ?.label?.toLowerCase()
            .includes(searchIRCP.trim().toLowerCase())
      );
    if (searchDate)
      f = f.filter((m) => m.invoiceDate.slice(0, 10) === searchDate);
    if (searchStatus) f = f.filter((m) => m.paymentStatus === searchStatus);
    setFiltered(f);
  }

  // ฟังก์ชัน helper
  const safeDate = (date: string | Date | undefined) => {
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
  };

  // สถานะสี
  function paymentStatusColor(status: string) {
    if (status === "PAID") return "#36b37e";
    if (status === "UNPAID") return "#f4474b";
    return "#bbb";
  }
  function paymentStatusTH(status: string) {
    if (status === "PAID") return "จ่ายแล้ว";
    if (status === "UNPAID") return "ยังไม่จ่าย";
    return status;
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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 34,
            color: "#1d3557",
            fontWeight: 700,
            marginBottom: 16,
            letterSpacing: 1,
          }}
        >
          ใบแจ้งชำระเงิน (Invoice Payment Master)
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
            placeholder="ค้นหาบริษัท/IRCP ID"
            value={searchIRCP}
            onChange={(e) => setSearchIRCP(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={inputStyle}
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            style={inputStyle}
          >
            <option value="">สถานะจ่าย (ทั้งหมด)</option>
            <option value={PaymentStatus.PAID}>จ่ายแล้ว</option>
            <option value={PaymentStatus.UNPAID}>ยังไม่จ่าย</option>
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
              setSearchIRCP("");
              setSearchDate("");
              setSearchStatus("");
              setFiltered(masters);
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
            padding: "32px 12px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              minWidth: 750,
            }}
          >
            <thead>
              <tr style={{ background: "#f3f6fa" }}>
                <th style={thStyle}>ImportID</th>
                <th style={thStyle}>วันที่ออกบิล</th>
                <th style={thStyle}>บริษัท</th>
                <th style={thStyle}>ประเภทประกัน</th>
                <th style={thStyle}>ผู้นำเข้า</th>
                <th style={thStyle}>ยอดรวม</th>
                <th style={thStyle}>สถานะจ่าย</th>
                <th style={thStyle}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: 32, color: "#888" }}
                  >
                    ไม่พบข้อมูลใบแจ้งชำระเงิน
                  </td>
                </tr>
              ) : (
                filtered.map((im) => (
                  <tr
                    key={im.importID}
                    style={{ borderBottom: "1.5px solid #f1f1f1" }}
                  >
                    <td style={tdStyle}>{im.importID}</td>
                    <td style={tdStyle}>{safeDate(im.invoiceDate)}</td>
                    <td style={tdStyle}>
                      {companyOptions.find((opt) => opt.value === im.ircpID)
                        ?.label || im.ircpID}
                    </td>
                    <td style={tdStyle}>
                      {im.policyType === PolicyType.COMPULSORY_MOTOR
                        ? "พ.ร.บ."
                        : "สมัครใจ"}
                    </td>
                    <td style={tdStyle}>{im.importBy}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                      {im.totalAmount?.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "4px 14px",
                          borderRadius: 12,
                          background: paymentStatusColor(im.paymentStatus),
                          color: "#fff",
                          fontWeight: 500,
                        }}
                      >
                        {paymentStatusTH(im.paymentStatus)}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        style={buttonStyle}
                        onClick={() => setModalMaster(im)}
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal แสดงรายละเอียด Invoice Master */}
        {modalMaster && (
          <div style={modalOverlay}>
            <div style={modalBox}>
              <h2 style={{ marginBottom: 12 }}>รายละเอียดใบแจ้งชำระเงิน</h2>
              <table style={{ fontSize: 17 }}>
                <tbody>
                  <tr>
                    <td style={labelStyle}>ImportID:</td>
                    <td>{modalMaster.importID}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>วันที่ออกบิล:</td>
                    <td>{safeDate(modalMaster.invoiceDate)}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>บริษัท:</td>
                    <td>
                      {companyOptions.find(
                        (opt) => opt.value === modalMaster.ircpID
                      )?.label || modalMaster.ircpID}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>ประเภทประกัน:</td>
                    <td>
                      {modalMaster.policyType === PolicyType.COMPULSORY_MOTOR
                        ? "พ.ร.บ."
                        : "สมัครใจ"}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>ผู้นำเข้า:</td>
                    <td>{modalMaster.importBy}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>วันที่นำเข้า:</td>
                    <td>{safeDate(modalMaster.importDate)}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>ยอดรวม:</td>
                    <td>
                      {modalMaster.totalAmount?.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>สถานะจ่าย:</td>
                    <td>{paymentStatusTH(modalMaster.paymentStatus)}</td>
                  </tr>
                  <tr>
                    <td style={labelStyle}>รายการกรมธรรม์:</td>
                    <td>
                      <div style={{ maxHeight: 160, overflowY: "auto" }}>
                        <table
                          style={{
                            fontSize: 15,
                            background: "#f7fafc",
                            width: "100%",
                            margin: "8px 0",
                          }}
                        >
                          <thead>
                            <tr>
                              <th>เลขกรมธรรม์</th>
                              <th>ผู้เอาประกัน</th>
                              <th>ทะเบียนรถ</th>
                              <th>วันที่คุ้มครอง</th>
                              <th>เบี้ยสุทธิ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {modalMaster.items.map(
                              (item: InvoicePaymentItem) => (
                                <tr key={item.invoiceID}>
                                  <td>{item.invoicePolicyNumber}</td>
                                  <td>{item.assuredName}</td>
                                  <td>{item.licenseNumber}</td>
                                  <td>{safeDate(item.effectiveDate)}</td>
                                  <td>
                                    {item.premiumTotal?.toLocaleString(
                                      "th-TH",
                                      { minimumFractionDigits: 2 }
                                    )}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                style={{ ...buttonStyle, marginTop: 28, background: "#a4a8ab" }}
                onClick={() => setModalMaster(null)}
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
  minWidth: 380,
  maxWidth: "95vw",
  minHeight: 260,
  fontFamily: "'Kanit', Arial, sans-serif",
};
