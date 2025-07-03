import { useEffect, useState } from "react";
import { BillRound, BillStatus, PolicyType } from "@/models/billRound";

// ตัวอย่างบริษัทประกัน
const companyOptions = [
  { value: "52", label: "ไทยวิวัฒน์" },
  { value: "01", label: "วิริยะ" },
  { value: "03", label: "สินมั่นคง" },
];

// mock กรมธรรม์ AP
const apMockData = [
  {
    policyNumber: "POL001",
    customer: "สมชาย ใจดี",
    status: "แจ้งงานแล้ว",
    effectiveDate: "2024-07-01",
    premium: 3500,
  },
  {
    policyNumber: "POL002",
    customer: "สมหญิง รุ่งเรือง",
    status: "ได้รับกรมธรรม์แล้ว",
    effectiveDate: "2024-07-02",
    premium: 4100,
  },
  {
    policyNumber: "POL003",
    customer: "ประยุทธ์ ตั้งใจดี",
    status: "สร้างใบคำขอแล้ว",
    effectiveDate: "2024-07-03",
    premium: 2200,
  },
  {
    policyNumber: "POL004",
    customer: "เจนจิรา รัตนพร",
    status: "แจ้งงานแล้ว",
    effectiveDate: "2024-07-02",
    premium: 3900,
  },
];

export default function BillRoundPage() {
  const [billRounds, setBillRounds] = useState<BillRound[]>([]);
  const [filtered, setFiltered] = useState<BillRound[]>([]);
  const [selected, setSelected] = useState<BillRound | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  // filter
  const [searchID, setSearchID] = useState("");
  const [searchIRCP, setSearchIRCP] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // สร้างรอบบิลใหม่
  const [company, setCompany] = useState("");
  const [policyType, setPolicyType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [apList, setApList] = useState<any[]>([]);
  const [apChecked, setApChecked] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetch("/api/billRound")
      .then((res) => res.json())
      .then((data) => {
        setBillRounds(data);
        setFiltered(data);
      });
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    let f = billRounds;
    if (searchID.trim())
      f = f.filter((b) =>
        b.billRoundID.toLowerCase().includes(searchID.trim().toLowerCase())
      );
    if (searchIRCP.trim())
      f = f.filter(
        (b) =>
          b.ircpID.toLowerCase().includes(searchIRCP.trim().toLowerCase()) ||
          companyOptions
            .find((opt) => opt.value === b.ircpID)
            ?.label?.toLowerCase()
            .includes(searchIRCP.trim().toLowerCase())
      );
    if (searchType) f = f.filter((b) => b.policyType === searchType);
    if (searchDate) f = f.filter((b) => b.billDate.slice(0, 10) === searchDate);
    setFiltered(f);
  }

  // Search AP กรมธรรม์ (mock)
  const handleSearchAP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetching(true);
    setTimeout(() => {
      setApList(
        apMockData.filter((x) =>
          [
            "แจ้งงานแล้ว",
            "รับแจ้งงานแล้ว",
            "สร้างใบคำขอแล้ว",
            "ได้รับกรมธรรม์แล้ว",
          ].includes(x.status)
        )
      );
      setIsFetching(false);
    }, 600);
  };

  // สร้างรอบบิลใหม่
  const handleCreateBillRound = () => {
    const billRoundID = "BR" + (Math.random() * 100000).toFixed(0);
    const now = new Date().toISOString();
    const round: BillRound = {
      billRoundID,
      billDate: now,
      billStatus: BillStatus.DRAFT,
      ircpID: company,
      policyType: policyType as PolicyType,
      createdBy: "admin",
      createdDate: now,
      updatedBy: "admin",
      updatedDate: now,
      totalAmount: apList
        .filter((a) => apChecked.includes(a.policyNumber))
        .reduce((sum, a) => sum + a.premium, 0),
      policyInvoices: [],
    };
    setBillRounds((b) => [...b, round]);
    setFiltered((b) => [...b, round]);
    setModalOpen(false);
    setStep(1);
    setCompany("");
    setPolicyType("");
    setDateFrom("");
    setDateTo("");
    setApList([]);
    setApChecked([]);
  };

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-[#e0eafc] to-[#cfdef3] font-kanit">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-7">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1d3557]">
            รอบวางบิล (Bill Round)
          </h1>
          <button
            className="bg-emerald-500 hover:bg-emerald-700 transition text-white px-8 py-2 rounded-lg font-semibold shadow-lg"
            onClick={() => {
              setModalOpen(true);
              setStep(1);
            }}
          >
            + เพิ่มรอบวางบิล
          </button>
        </div>
        {/* Filter */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl shadow p-5 mb-5 flex flex-wrap gap-4 items-end"
        >
          <input
            type="text"
            placeholder="ค้นหา BillRoundID"
            value={searchID}
            onChange={(e) => setSearchID(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[150px] focus:outline-none focus:ring focus:border-blue-400"
          />
          <input
            type="text"
            placeholder="ค้นหาบริษัท/IRCP ID"
            value={searchIRCP}
            onChange={(e) => setSearchIRCP(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[150px] focus:outline-none focus:ring focus:border-blue-400"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[140px]"
          >
            <option value="">ประเภทประกัน (ทั้งหมด)</option>
            <option value={PolicyType.COMPULSORY_MOTOR}>พ.ร.บ.</option>
            <option value={PolicyType.VOLUNTARY_MOTOR}>สมัครใจ</option>
          </select>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 min-w-[150px]"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-800 transition text-white px-6 py-2 rounded-lg font-semibold"
          >
            ค้นหา
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg"
            onClick={() => {
              setSearchID("");
              setSearchIRCP("");
              setSearchType("");
              setSearchDate("");
              setFiltered(billRounds);
            }}
          >
            ล้างค่า
          </button>
        </form>
        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl p-5 overflow-x-auto">
          <table className="w-full min-w-[800px] border-separate border-spacing-y-2">
            <thead>
              <tr className="bg-[#f3f6fa] text-[#13325b]">
                <th className="font-bold p-3 text-base">BillRoundID</th>
                <th className="font-bold p-3 text-base">วันที่ออกบิล</th>
                <th className="font-bold p-3 text-base">บริษัท</th>
                <th className="font-bold p-3 text-base">ประเภท</th>
                <th className="font-bold p-3 text-base">สถานะ</th>
                <th className="font-bold p-3 text-base text-right">ยอดรวม</th>
                <th className="font-bold p-3 text-base"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    ไม่พบข้อมูลรอบวางบิล
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr
                    key={b.billRoundID}
                    className="border-b border-gray-100 hover:bg-[#eaf3fb] transition"
                  >
                    <td className="p-2">{b.billRoundID}</td>
                    <td className="p-2">
                      {b.billDate && !isNaN(Date.parse(b.billDate))
                        ? new Date(b.billDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-2">
                      {companyOptions.find((c) => c.value === b.ircpID)
                        ?.label || b.ircpID}
                    </td>
                    <td className="p-2">
                      {b.policyType === PolicyType.COMPULSORY_MOTOR
                        ? "พ.ร.บ."
                        : "สมัครใจ"}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-medium ${statusColorTailwind(
                          b.billStatus
                        )}`}
                      >
                        {translateStatus(b.billStatus)}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      {b.totalAmount?.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 px-4 py-1.5 rounded-lg text-white font-semibold"
                        onClick={() => setSelected(b)}
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

        {/* Modal รายละเอียด */}
        {selected && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[340px] max-w-[95vw]">
              <h2 className="text-lg font-bold mb-3 text-[#26375d]">
                รายละเอียดรอบวางบิล
              </h2>
              <table className="text-base">
                <tbody>
                  <tr>
                    <td className="pr-2 text-gray-700">BillRoundID:</td>
                    <td>{selected.billRoundID}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-gray-700">วันที่ออกบิล:</td>
                    <td>{new Date(selected.billDate).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-gray-700">บริษัท:</td>
                    <td>
                      {companyOptions.find((c) => c.value === selected.ircpID)
                        ?.label || selected.ircpID}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-gray-700">ประเภท:</td>
                    <td>
                      {selected.policyType === PolicyType.COMPULSORY_MOTOR
                        ? "พ.ร.บ."
                        : "สมัครใจ"}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-gray-700">สถานะ:</td>
                    <td>{translateStatus(selected.billStatus)}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-gray-700">ผู้สร้าง:</td>
                    <td>{selected.createdBy}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-gray-700">วันที่สร้าง:</td>
                    <td>
                      {selected.createdDate
                        ? new Date(selected.createdDate).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-2 text-gray-700">ยอดรวม:</td>
                    <td>
                      {selected.totalAmount.toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                </tbody>
              </table>
              <button
                className="mt-8 bg-gray-400 hover:bg-gray-700 px-5 py-2 rounded-lg text-white font-semibold"
                onClick={() => setSelected(null)}
              >
                ปิด
              </button>
            </div>
          </div>
        )}

        {/* Modal เพิ่มรอบวางบิล */}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[430px] max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 text-[#1c335b]">
                {step === 1 ? "สร้างรอบวางบิลใหม่" : "ยืนยันการสร้างรอบวางบิล"}
              </h2>
              {step === 1 && (
                <form
                  onSubmit={handleSearchAP}
                  className="flex flex-wrap gap-6 mb-2"
                >
                  <div className="flex flex-col min-w-[180px] flex-1">
                    <label className="mb-1 text-gray-700">บริษัทประกัน:</label>
                    <select
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">-- เลือกบริษัท --</option>
                      {companyOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col min-w-[170px] flex-1">
                    <label className="mb-1 text-gray-700">ประเภทประกัน:</label>
                    <select
                      value={policyType}
                      onChange={(e) => setPolicyType(e.target.value)}
                      className="border rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">-- เลือกประเภท --</option>
                      <option value={PolicyType.COMPULSORY_MOTOR}>
                        พ.ร.บ.
                      </option>
                      <option value={PolicyType.VOLUNTARY_MOTOR}>
                        สมัครใจ
                      </option>
                    </select>
                  </div>
                  <div className="flex flex-col min-w-[170px]">
                    <label className="mb-1 text-gray-700">วันที่ตั้งแต่:</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col min-w-[170px]">
                    <label className="mb-1 text-gray-700">ถึงวันที่:</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div className="flex flex-col min-w-[170px]">
                    <label className="mb-1 text-gray-700">สถานะกรมธรรม์:</label>
                    <span className="font-semibold text-blue-700">
                      แจ้งงานแล้ว - ได้รับกรมธรรม์แล้ว
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 transition text-white px-7 py-2 rounded-lg font-semibold h-fit self-end"
                    disabled={isFetching}
                  >
                    {isFetching ? "กำลังค้นหา..." : "ค้นหากรมธรรม์"}
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-white px-5 py-2 rounded-lg font-semibold h-fit self-end"
                    onClick={() => setModalOpen(false)}
                  >
                    ยกเลิก
                  </button>
                </form>
              )}
              {/* เลือกกรมธรรม์ */}
              {step === 1 && apList.length > 0 && (
                <>
                  <h3 className="mb-2 font-bold text-base text-[#1b2c45]">
                    เลือกรายการกรมธรรม์ที่จะนำไปวางบิล
                  </h3>
                  <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50 mb-3">
                    <table className="w-full text-[15px]">
                      <thead>
                        <tr>
                          <th></th>
                          <th>เลขกรมธรรม์</th>
                          <th>ลูกค้า</th>
                          <th>สถานะ</th>
                          <th>วันที่คุ้มครอง</th>
                          <th>เบี้ย</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apList.map((ap) => (
                          <tr key={ap.policyNumber}>
                            <td>
                              <input
                                type="checkbox"
                                checked={apChecked.includes(ap.policyNumber)}
                                onChange={() => {
                                  setApChecked((ck) =>
                                    ck.includes(ap.policyNumber)
                                      ? ck.filter((i) => i !== ap.policyNumber)
                                      : [...ck, ap.policyNumber]
                                  );
                                }}
                              />
                            </td>
                            <td>{ap.policyNumber}</td>
                            <td>{ap.customer}</td>
                            <td>{ap.status}</td>
                            <td>{ap.effectiveDate}</td>
                            <td>{ap.premium?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-800 transition text-white px-7 py-2 rounded-lg font-semibold float-right mt-3"
                    disabled={apChecked.length === 0}
                    onClick={() => setStep(2)}
                  >
                    ถัดไป: บันทึกเป็นรอบวางบิล
                  </button>
                </>
              )}
              {/* ยืนยัน */}
              {step === 2 && (
                <div>
                  <h3 className="mb-3 text-lg font-bold">
                    ยืนยันการสร้างรอบวางบิล
                  </h3>
                  <div className="text-base mb-7">
                    บริษัท:{" "}
                    <b>
                      {companyOptions.find((c) => c.value === company)?.label}
                    </b>
                    <br />
                    ประเภท:{" "}
                    <b>
                      {policyType === PolicyType.COMPULSORY_MOTOR
                        ? "พ.ร.บ."
                        : "สมัครใจ"}
                    </b>
                    <br />
                    วันที่:{" "}
                    <b>
                      {dateFrom} - {dateTo}
                    </b>
                    <br />
                    จำนวนกรมธรรม์: <b>{apChecked.length}</b>
                    <br />
                    ยอดรวม:{" "}
                    <b>
                      {apList
                        .filter((a) => apChecked.includes(a.policyNumber))
                        .reduce((sum, a) => sum + a.premium, 0)
                        .toLocaleString()}
                    </b>
                  </div>
                  <button
                    className="bg-emerald-600 hover:bg-emerald-700 transition text-white px-7 py-2 rounded-lg font-semibold mr-3"
                    onClick={handleCreateBillRound}
                  >
                    ยืนยันและบันทึกรอบวางบิล
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-white px-5 py-2 rounded-lg font-semibold"
                    onClick={() => setModalOpen(false)}
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper ฟังก์ชัน
function statusColorTailwind(status: string) {
  switch (status) {
    case "DRAFT":
      return "bg-gray-400";
    case "IN_PROGRESS":
      return "bg-blue-600";
    case "PENDING_VERIFICATION":
      return "bg-yellow-500";
    case "COMPLETED":
      return "bg-emerald-600";
    case "CANCELLED":
      return "bg-rose-500";
    default:
      return "bg-gray-400";
  }
}
function translateStatus(status: string) {
  switch (status) {
    case "DRAFT":
      return "ร่าง";
    case "IN_PROGRESS":
      return "กำลังดำเนินการ";
    case "PENDING_VERIFICATION":
      return "รอการตรวจสอบ";
    case "COMPLETED":
      return "เสร็จสมบูรณ์";
    case "CANCELLED":
      return "ยกเลิก";
    default:
      return status;
  }
}
