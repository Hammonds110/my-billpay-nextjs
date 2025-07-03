import Link from "next/link";
import { useEffect, useState } from "react";
import { FiFileText, FiShield, FiCreditCard } from "react-icons/fi";
import { BillRound } from "@/models/billRound";
import { PolicyAP } from "@/models/policyAP";
import { InvoicePaymentMaster } from "@/models/invoicePaymentMaster";

export default function Home() {
  const [billRoundCount, setBillRoundCount] = useState(0);
  const [policyAPCount, setPolicyAPCount] = useState(0);
  const [invoiceMasterCount, setInvoiceMasterCount] = useState(0);

  useEffect(() => {
    fetch("/api/billRound")
      .then((res) => res.json())
      .then((data: BillRound[]) => setBillRoundCount(data.length));
    fetch("/api/policyAP")
      .then((res) => res.json())
      .then((data: PolicyAP[]) => setPolicyAPCount(data.length));
    fetch("/api/invoicePaymentMaster")
      .then((res) => res.json())
      .then((data: InvoicePaymentMaster[]) =>
        setInvoiceMasterCount(data.length)
      );
  }, []);

  return (
    <div className="text-3xl text-pink-600 bg-yellow-200 p-8 rounded-xl font-kanit">
      ทดสอบ Tailwind + Kanit!
    </div>
    // <main className="min-h-screen bg-gradient-to-tr from-[#d1f2fa] via-[#e1e7fa] to-[#f6d0e9] font-kanit py-12">
    //   <div className="max-w-5xl mx-auto px-4">
    //     <header className="text-center mb-10">
    //       <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-900 via-sky-500 to-pink-500 drop-shadow-lg">
    //         Insurance Billing System
    //       </h1>
    //       <p className="text-lg md:text-xl mt-2 text-gray-700 font-medium">
    //         ระบบบริหารจัดการวางบิลและชำระเบี้ยประกันภัย{" "}
    //         <span className="text-blue-800 font-bold">ครบวงจร</span>
    //       </p>
    //     </header>

    //     {/* Cards */}
    //     <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-9 mt-12">
    //       <Card
    //         title="รอบวางบิล"
    //         count={billRoundCount}
    //         icon={
    //           <FiFileText className="text-5xl text-sky-400 drop-shadow-sm" />
    //         }
    //         bg="from-sky-100/80 to-sky-300/40"
    //         hover="hover:ring-sky-400"
    //         href="/billRound"
    //         chipColor="bg-sky-400/90 text-white"
    //       />
    //       <Card
    //         title="กรมธรรม์ AP"
    //         count={policyAPCount}
    //         icon={
    //           <FiShield className="text-5xl text-emerald-400 drop-shadow-sm" />
    //         }
    //         bg="from-emerald-100/80 to-emerald-200/50"
    //         hover="hover:ring-emerald-400"
    //         href="/policyAP"
    //         chipColor="bg-emerald-400/90 text-white"
    //       />
    //       <Card
    //         title="ใบแจ้งชำระเงิน"
    //         count={invoiceMasterCount}
    //         icon={
    //           <FiCreditCard className="text-5xl text-pink-400 drop-shadow-sm" />
    //         }
    //         bg="from-pink-100/80 to-pink-200/60"
    //         hover="hover:ring-pink-400"
    //         href="/invoicePaymentMaster"
    //         chipColor="bg-pink-400/90 text-white"
    //       />
    //     </section>

    //     <div className="mt-16 text-center text-gray-400 text-sm">
    //       © {new Date().getFullYear()} Insurance Billing System
    //       <br />
    //       <span className="text-xs">
    //         Powered by{" "}
    //         <span className="font-semibold text-sky-600">
    //           Next.js + Tailwind CSS
    //         </span>
    //       </span>
    //     </div>
    //   </div>
    // </main>
  );
}

type CardProps = {
  title: string;
  count: number;
  icon: React.ReactNode;
  bg: string;
  hover: string;
  href: string;
  chipColor: string;
};

function Card({ title, count, icon, bg, hover, href, chipColor }: CardProps) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a
        className={`
        group relative rounded-2xl bg-gradient-to-tr ${bg}
        shadow-xl backdrop-blur-xl ring-2 ring-white/40 transition-all
        hover:scale-[1.04] ${hover}
        flex flex-col items-center p-9 pt-7 overflow-hidden min-h-[210px]
      `}
        style={{ border: "1.5px solid rgba(180,200,230,0.12)" }}
      >
        <div className="absolute right-1 top-1 opacity-20 text-8xl pointer-events-none select-none z-0">
          {icon}
        </div>
        <div className="z-10 mb-4">{icon}</div>
        <div className="z-10 text-xl font-bold text-slate-700 mb-2 tracking-wide drop-shadow-sm">
          {title}
        </div>
        <div className="z-10 text-5xl font-extrabold text-slate-900 drop-shadow-md mb-2">
          {count}
        </div>
        <span
          className={`z-10 mt-3 inline-block px-4 py-1 rounded-full font-semibold shadow-sm text-base ${chipColor} group-hover:scale-110 transition`}
        >
          ดูรายละเอียด →
        </span>
      </a>
    </Link>
  );
}
