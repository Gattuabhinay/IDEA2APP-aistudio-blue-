import React, { useState, useEffect, useRef } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  IndianRupee, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Smartphone, 
  Globe, 
  Monitor, 
  Trophy, 
  Award, 
  ExternalLink,
  Phone,
  Mail,
  Info,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./lib/utils";

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://dklzqwcgboolzisqngei.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbHpxd2NnYm9vbHppc3FuZ2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNDcxNzEsImV4cCI6MjA4MzcyMzE3MX0.TEqgRDBCHGJJJsOoLdUfXlKXmnR6m_J5woumAjOtw9E'
)

// --- Types ---
interface FormData {
  college: string;
  otherCollege: string;
  teamName: string;
  leaderName: string;
  leaderRoll: string;
  member2Name: string;
  member2Roll: string;
  member3Name: string;
  member3Roll: string;
  department: string;
  year: string;
  mobile: string;
  email: string;
  transactionId: string;
}

interface FormErrors {
  [key: string]: string;
}

// --- Constants ---
const PRIMARY_BLUE = "#2563EB";
const DARK_CARD_BG = "#0D1B2A";
const LIGHT_GRAY_BG = "#F5F5F5";

const COLLEGES = [
  "NNRG - Nalla Narasimha Reddy Education Society's Group of Institutions",
  "GCTC - Geethanjali College of Engineering and Technology",
  "KPRIT - Kommuri Pratap Reddy Institute of Technology",
  "SITS - Siddhartha Institute of Technology & Sciences",
  "ANURAG - Anurag University, Hyderabad",
  "NMREC - Nalla Malla Reddy Engineering College",
  "Other"
];

const DEPARTMENTS = ["CSE", "CSE (AI&ML)", "CSE (DS)", "ECE", "CIVIL", "IT"];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const CODE_SNIPPETS = [
  "int appMain() {",
  "buildApp(idea);",
  "deploy(platform);",
  "return success;",
  "while(coding) {}"
];

// --- Components ---

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[36px] font-[900] tracking-[3px] text-[#2563EB] text-center uppercase mb-12">
    {children}
  </h2>
);

const RoundCard = ({ 
  number, 
  title, 
  meta, 
  bullets, 
  advanceText, 
  accentColor 
}: { 
  number: number; 
  title: string; 
  meta: string; 
  bullets: string[]; 
  advanceText: string;
  accentColor: string;
}) => (
  <div className="bg-[#0D1B2A] rounded-[16px] p-7 border border-white/5 flex flex-col gap-4">
    <div className="flex items-start gap-4">
      <div 
        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold shrink-0"
        style={{ backgroundColor: accentColor }}
      >
        {number}
      </div>
      <div className="flex-1">
        <h3 className="text-white font-bold text-[20px]">{title}</h3>
        <p className="text-[#6e7681] text-sm mt-1">{meta}</p>
        <ul className="mt-4 space-y-2">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[#8b949e] text-sm">
              <span className="text-[#2563EB] mt-0.5">►</span>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div 
      className="border-l-[3px] p-3 rounded-r-lg"
      style={{ borderColor: accentColor, backgroundColor: `${accentColor}14` }}
    >
      <p className="font-bold text-sm" style={{ color: accentColor }}>
        {advanceText}
      </p>
    </div>
  </div>
);

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    college: COLLEGES[0],
    otherCollege: "",
    teamName: "",
    leaderName: "",
    leaderRoll: "",
    member2Name: "",
    member2Roll: "",
    member3Name: "",
    member3Roll: "",
    department: DEPARTMENTS[0],
    year: YEARS[0],
    mobile: "",
    email: "",
    transactionId: ""
  });

  const [registrationCount, setRegistrationCount] = useState(0);

  const fetchCount = async () => {
    const { count } = await supabase
      .from('ideatoapp')
      .select('*', { count: 'exact', head: true });
    setRegistrationCount(count ?? 0);
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const memberCount = [formData.leaderName, formData.member2Name, formData.member3Name].filter(name => name.trim() !== "").length || 1;
  const totalFee = memberCount * 100;

  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLDivElement>(null);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (formData.college === "Other" && !formData.otherCollege.trim()) newErrors.otherCollege = "College name is required";
    if (!formData.teamName.trim()) newErrors.teamName = "Team name is required";
    if (!formData.leaderName.trim()) newErrors.leaderName = "Leader name is required";
    if (!formData.leaderRoll.trim()) newErrors.leaderRoll = "Roll number is required";
    if (!formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "Valid 10-digit mobile is required";
    if (!formData.transactionId.trim()) newErrors.transactionId = "Transaction ID is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const collegeName = formData.college === "Other" ? formData.otherCollege : formData.college;

      // Save to Supabase
      const { error } = await supabase
        .from('ideatoapp')
        .insert([{
          college: collegeName,
          team_name: formData.teamName,
          name: formData.leaderName,
          roll_number: formData.leaderRoll,
          department: formData.department,
          year: formData.year,
          mobile_no: formData.mobile,
          e_mail: formData.email || null,
          transaction_id: formData.transactionId,
          member2_name: formData.member2Name || null,
          member2_roll: formData.member2Roll || null,
          member3_name: formData.member3Name || null,
          member3_roll: formData.member3Roll || null
        }]);

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Saved successfully!');
        fetchCount();
      }

      const membersList = [
        `Leader: ${formData.leaderName} (${formData.leaderRoll})`,
        formData.member2Name.trim() ? `Member 2: ${formData.member2Name} (${formData.member2Roll || "N/A"})` : null,
        formData.member3Name.trim() ? `Member 3: ${formData.member3Name} (${formData.member3Roll || "N/A"})` : null
      ].filter(Boolean).join("\n");

      const message = `Hello! I have registered for *IDEA2APP* event at NNRG Tech Fest 2027.

*Registration Details:*
━━━━━━━━━━━━━━━━
Team: ${formData.teamName}
College: ${collegeName}
${membersList}
Department: ${formData.department}
Year: ${formData.year}
Mobile: ${formData.mobile}
Email: ${formData.email || "Not provided"}

*Payment Details:*
Amount Paid: ₹${totalFee}
Transaction ID: ${formData.transactionId}
━━━━━━━━━━━━━━━━
Please verify my payment and confirm my registration for Idea2App.
Thank you! 🙏
━━━━━━━━━━━━━━━━━━━━━━━`;

      window.open(`https://wa.me/918309030400?text=${encodeURIComponent(message)}`, "_blank");
    } else {
      const firstError = document.querySelector(".text-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const scrollToRegister = () => {
    document.getElementById("register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen selection:bg-[#2563EB] selection:text-white">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0D1117]">
        {/* Background Layers */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('https://res.cloudinary.com/djz4ulfhh/image/upload/v1773992101/Copilot_20260320_130333_oun92z.png')" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0D1117]/50 via-[#0D1117]/30 to-[#0D1117]/92" />
        
        {/* Floating Code Snippets */}
        {CODE_SNIPPETS.map((snippet, idx) => (
          <div 
            key={idx}
            className="absolute font-mono text-[13px] text-[#2563EB]/10 pointer-events-none select-none"
            style={{ 
              top: `${Math.random() * 80 + 10}%`, 
              left: `${Math.random() * 80 + 10}%`,
              transform: `rotate(${Math.random() * 20 - 10}deg)`
            }}
          >
            {snippet}
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl">
          {/* Live Registration Counter Badge */}
          <div 
            className="inline-flex items-center gap-3 bg-[#2563EB]/12 border border-[#2563EB]/40 rounded-full px-6 py-2.5 backdrop-blur-md shadow-[0_0_30px_rgba(37,99,235,0.2)] mb-5"
          >
            <div className="w-2.5 h-2.5 bg-[#2563EB] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.8)] animate-pulse-dot" />
            <p className="text-white text-[13px] font-bold tracking-[3px] uppercase">
              LIVE  •  <span className="text-[#2563EB] text-[18px] font-[900]">{registrationCount}</span> REGISTERED
            </p>
            <span className="text-[#2563EB]/70 text-[16px]">👥</span>
          </div>

          <p className="font-mono text-[11px] text-white/35 mb-6">
            visitor@nnrg:~$ ./launch idea2app --year=2027
          </p>
          
          <div className="border border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB] text-[10px] tracking-[2px] px-5 py-1.5 rounded-full mb-8 font-bold">
            ⚡ NNRG TECH FEST 2027 | AI & ML DEPARTMENT
          </div>

          <h1 className="text-[56px] md:text-[100px] font-[900] tracking-[-3px] leading-tight mb-4">
            <span className="text-white">IDEA2</span>
            <span className="text-[#2563EB] drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">APP</span>
          </h1>

          <p className="text-white/60 text-[16px] tracking-[3px] uppercase mb-12">
            Transform your ideas into functional applications
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 mb-12 text-[13px] text-white/90">
            <div className="flex items-center gap-2 pr-6 border-r border-white/10 last:border-0">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <span>Feb 26, 2027</span>
            </div>
            <div className="flex items-center gap-2 pr-6 border-r border-white/10 last:border-0">
              <Users className="w-4 h-4 text-[#2563EB]" />
              <span>Max 3 Members</span>
            </div>
            <div className="flex items-center gap-2 pr-6 border-r border-white/10 last:border-0">
              <MapPin className="w-4 h-4 text-[#2563EB]" />
              <span>T06</span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#2563EB]" />
              <span>₹{totalFee}</span>
            </div>
          </div>

          <button 
            onClick={scrollToRegister}
            className="w-full max-w-[500px] bg-[#2563EB] text-white py-[18px] rounded-[12px] font-bold text-[15px] transition-all hover:bg-[#1D4ED8] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] active:scale-[0.98]"
          >
            ↓ Register Now →
          </button>

          <div className="mt-16 text-white/20 text-[10px] tracking-[4px] animate-bounce">
            ↓ SCROLL TO EXPLORE ↓
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <SectionHeading>Event Details</SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { emoji: "📅", label: "DATE", value: "Feb 26, 2027" },
            { emoji: "⏰", label: "TIME", value: "9:30 AM" },
            { emoji: "📍", label: "VENUE", value: "T06" },
            { emoji: "👥", label: "TEAM", value: "Max 3 Members" },
            { emoji: "💰", label: "TOTAL FEE", value: `₹${totalFee}` },
          ].map((item, idx) => (
            <div key={idx} className="bg-[#0D1B2A] rounded-[16px] p-7 text-center border border-white/5 transition-all hover:border-[#2563EB]/40 group">
              <div className="text-3xl mb-4">{item.emoji}</div>
              <div className="text-[#9CA3AF] text-[11px] tracking-[2px] uppercase mb-1">{item.label}</div>
              <div className="text-[#2563EB] font-bold text-[16px]">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Event Rounds Section */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <SectionHeading>Event Rounds</SectionHeading>
        <div className="space-y-4">
          <RoundCard 
            number={1}
            title="Idea Presentation Round"
            meta="⏱ 15 Minutes | Presentation"
            bullets={[
              "Present your app idea with a concept",
              "Explain the problem your app solves",
              "Show wireframes or mockups if available",
              "Top teams advance to Round 2"
            ]}
            advanceText="🏆 Top teams advance to Round 2"
            accentColor="#2563EB"
          />
          <RoundCard 
            number={2}
            title="App Development Round"
            meta="⏱ 60 Minutes | Live Build"
            bullets={[
              "Build a working prototype of your app",
              "Platforms: Android, Web, Desktop, iOS",
              "App must be functional during demo",
              "Internet access allowed this round"
            ]}
            advanceText="🏆 Top teams advance to Finals"
            accentColor="#06B6D4"
          />
          <RoundCard 
            number={3}
            title="Live Demo & Judging"
            meta="⏱ 10 Minutes per team | Demo"
            bullets={[
              "Live demonstration of your final app",
              "5-10 minutes for demo and Q&A",
              "Judged on innovation, design, function",
              "Winners announced after all demos"
            ]}
            advanceText="🏆 Final Round — Winners announced here!"
            accentColor="#8B5CF6"
          />
        </div>
      </section>

      {/* Event Rules Section */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <SectionHeading>Event Rules</SectionHeading>
        <div className="bg-[#0D1B2A] rounded-[16px] p-8 border border-white/5">
          {[
            "Participation is individual or team-based (maximum 3 members)",
            "The app must be focused and aligned with the concept opted",
            "Applications must be original and developed by the participants",
            "Copied or pirated apps will result in immediate disqualification",
            "Supported platforms: Android, Web, Desktop, or iOS",
            "The app must be functional during the presentation",
            "Each team gets 5-10 minutes for presentation and demo",
            "Live demonstration of the app is preferred",
            "Participants must bring their own devices and inform about Internet needs",
            "Judges' decision is final; discipline and professionalism are mandatory"
          ].map((rule, idx) => (
            <div key={idx} className="flex gap-4 py-4 border-b border-white/5 last:border-0 items-start">
              <span className="text-[#2563EB] font-bold text-[18px] shrink-0">{(idx + 1).toString().padStart(2, '0')}</span>
              <p className="text-[#8b949e] text-[13px] leading-relaxed">
                {rule.split("disqualification").map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && <span className="text-[#2563EB] font-bold">disqualification</span>}
                  </React.Fragment>
                ))}
                {rule.includes("final") && rule.split("final").map((part, i, arr) => (
                   i === 0 ? part : <React.Fragment key={i}><span className="text-[#2563EB] font-bold">final</span>{part}</React.Fragment>
                )).slice(1)}
                {/* Special handling for specific bold words */}
                {rule === "Copied or pirated apps will result in immediate disqualification" ? (
                  <>Copied or pirated apps will result in immediate <span className="text-[#2563EB] font-bold">disqualification</span></>
                ) : rule === "Judges' decision is final; discipline and professionalism are mandatory" ? (
                  <>Judges' decision is <span className="text-[#2563EB] font-bold">final</span>; discipline and professionalism are mandatory</>
                ) : rule}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Prizes & Rewards Section */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <SectionHeading>Prizes & Rewards</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1st Place */}
          <div className="bg-[#1A0F00] rounded-[16px] p-7 border border-[#2563EB]/30 text-center flex flex-col items-center">
            <div className="text-[36px] mb-4">🥇</div>
            <div className="text-[#2563EB] text-[11px] tracking-[3px] uppercase mb-1">1ST PLACE</div>
            <div className="text-white font-[900] text-[22px] mb-6">WINNER</div>
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2"><IndianRupee className="w-4 h-4 text-[#2563EB]" /> Cash Prize</div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-[#2563EB]" /> Certificate</div>
              <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-[#2563EB]" /> Trophy</div>
            </div>
          </div>
          {/* 2nd Place */}
          <div className="bg-[#0D1B2A] rounded-[16px] p-7 border border-[#3B82F6]/30 text-center flex flex-col items-center">
            <div className="text-[36px] mb-4">🥈</div>
            <div className="text-[#60A5FA] text-[11px] tracking-[3px] uppercase mb-1">2ND PLACE</div>
            <div className="text-white font-[900] text-[22px] mb-6">RUNNER-UP</div>
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2"><IndianRupee className="w-4 h-4 text-[#60A5FA]" /> Cash Prize</div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-[#60A5FA]" /> Certificate</div>
            </div>
          </div>
          {/* 3rd Place */}
          <div className="bg-[#0D1117] rounded-[16px] p-7 border border-[#9CA3AF]/30 text-center flex flex-col items-center">
            <div className="text-[36px] mb-4">🥉</div>
            <div className="text-[#9CA3AF] text-[11px] tracking-[3px] uppercase mb-1">3RD PLACE</div>
            <div className="text-white font-[900] text-[22px] mb-6">FINALIST</div>
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center gap-2"><IndianRupee className="w-4 h-4 text-[#9CA3AF]" /> Cash Prize</div>
              <div className="flex items-center gap-2"><Award className="w-4 h-4 text-[#9CA3AF]" /> Certificate</div>
            </div>
          </div>
        </div>
        <p className="text-center text-[#6e7681] text-[13px] mt-8">
          🎓 Every participant will receive a participation certificate
        </p>
      </section>

      {/* Previous Year Reference Section */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <SectionHeading>PREVIOUS YEAR REFERENCE</SectionHeading>
        <div className="bg-[#0D1B2A] rounded-[16px] p-8 border border-white/5">
          <div className="w-full bg-[#2563EB]/5 border-l-[3px] border-[#2563EB] p-4 mb-8">
            <p className="text-[#2563EB] text-[13px] font-medium">
              📚 Check out last year's winning presentation to get inspired for Idea2App 2027!
            </p>
          </div>

          <div className="bg-[#0a0f1e] border border-[#2563EB]/20 rounded-[10px] p-8 max-w-[400px] mx-auto text-center">
            <div className="text-[40px] text-[#2563EB] mb-4 flex justify-center">📊</div>
            
            <h3 className="text-white font-bold text-[14px] mt-2 mb-1">
              Idea2App — Previous Year Winning Presentation
            </h3>
            <p className="text-[#8b949e] text-[11px] mb-6 uppercase tracking-wider">
              Reference PPT | Idea2App 2026
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <button 
                onClick={() => window.open('https://docs.google.com/presentation/d/1kHMm64gE8ofrTWSQU3d_Mx5GrqJt58xb/edit?rtpof=true', '_blank')}
                className="bg-transparent border border-[#2563EB]/50 text-[#2563EB] px-5 py-2.5 rounded-[6px] text-[12px] font-bold transition-all hover:bg-[#2563EB]/10"
              >
                👁 View PPT
              </button>
              <button 
                onClick={() => window.open('https://docs.google.com/presentation/d/1kHMm64gE8ofrTWSQU3d_Mx5GrqJt58xb/export/pptx', '_blank')}
                className="bg-[#2563EB] text-white px-5 py-2.5 rounded-[6px] text-[12px] font-bold transition-all hover:bg-[#1D4ED8]"
              >
                ⬇ Download PPT
              </button>
            </div>

            <div className="border-l-[2px] border-[#2563EB]/40 bg-[#2563EB]/[0.03] p-2.5 mt-6 text-left">
              <p className="text-[#2563EB]/60 text-[10px] leading-relaxed">
                💡 Tip: This is for reference only. Your idea must be original and different.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="py-24 px-4 max-w-3xl mx-auto">
        <SectionHeading>Payment Details</SectionHeading>
        <div className="bg-[#0D1B2A] rounded-[16px] p-8 border border-white/5 flex flex-col items-center">
          <div className="w-full bg-[#2563EB]/10 border-l-[3px] border-[#2563EB] p-4 mb-8 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#2563EB] shrink-0" />
            <p className="text-[#2563EB] text-[12px] font-bold">
              ⚠ PAY FIRST, THEN FILL THE FORM | Keep your Transaction ID ready
            </p>
          </div>

          <p className="text-[#6e7681] text-[10px] tracking-[3px] uppercase mb-6">SCAN QR CODE TO PAY</p>
          
          <div className="bg-white p-3 rounded-[10px] mb-8">
            <img 
              src={`https://quickchart.io/qr?text=upi://pay?pa=8309030400-id8e@axl%26pn=GattuAbhinay%26am=${totalFee}%26cu=INR%26tn=NNRG_TechFest_Idea2App&size=300`} 
              alt="Payment QR"
              className="w-[260px] h-[260px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">UPI ID</p>
              <p className="text-[#2563EB] font-mono text-sm">8309030400-id8e@axl</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">PHONE</p>
              <p className="text-[#2563EB] font-mono text-sm">8309030400</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">NAME</p>
              <p className="text-white font-bold">GATTU ABHINAY</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">AMOUNT</p>
              <p className="text-[#22C55E] font-bold text-lg">₹{totalFee}</p>
            </div>
          </div>

          <div className="w-full bg-[#2563EB]/5 border-l-[2px] border-[#2563EB] p-3">
            <p className="text-[#2563EB] text-sm flex items-center gap-2">
              <Info className="w-4 h-4" /> 📋 Note: NNRG TechFest - Idea2App
            </p>
          </div>
        </div>

        {/* Divider Between Cards */}
        <div className="flex items-center gap-4 my-12">
          <div className="flex-1 h-[1px] bg-white/10" />
          <div className="bg-[#1A1A2E] border border-[#2563EB]/30 text-[#2563EB]/80 text-[9px] tracking-[3px] px-3.5 py-1.5 rounded-full uppercase font-bold">
            OR | ALTERNATIVE
          </div>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Alternative Payment Card */}
        <div className="bg-[#0D1B2A] rounded-[16px] p-8 border border-white/5 flex flex-col items-center relative overflow-hidden">
          {/* Alternative Badge */}
          <div className="absolute top-4 right-4 border border-[#2563EB]/50 text-[#2563EB] text-[9px] font-bold tracking-[2px] px-2 py-1 rounded-[4px] uppercase">
            ALTERNATIVE
          </div>

          <div className="w-full bg-[#2563EB]/5 border-l-[3px] border-[#2563EB]/50 p-4 mb-8">
            <p className="text-[#2563EB]/80 text-[11px] leading-relaxed">
              ⚡ Use this UPI ID if the primary payment option has reached its daily transaction limit.
            </p>
          </div>

          <p className="text-[#6e7681] text-[9px] tracking-[3px] uppercase mb-6">SCAN QR CODE TO PAY</p>
          
          <div className="bg-white p-2 rounded-[8px] mb-8">
            <img 
              src="https://quickchart.io/qr?text=upi://pay?pa=6301523538-id6e@axl%26pn=Nithish%26am=100%26cu=INR%26tn=NNRG_TechFest_Idea2App&size=300" 
              alt="Alternative Payment QR"
              className="w-[260px] h-[260px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">UPI ID</p>
              <p className="text-[#2563EB] font-mono text-sm">6301523538-id6e@axl</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">PHONE</p>
              <p className="text-[#2563EB] font-mono text-sm">6301523538</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">NAME</p>
              <p className="text-white font-bold">NITHISH</p>
            </div>
            <div className="space-y-1">
              <p className="text-[#6e7681] text-[10px] uppercase tracking-wider">AMOUNT</p>
              <p className="text-[#22C55E] font-bold text-lg">₹100</p>
            </div>
          </div>

          <div className="w-full bg-[#2563EB]/[0.03] border-l-[2px] border-[#2563EB]/50 p-3">
            <p className="text-[#2563EB]/70 text-sm flex items-center gap-2">
              <Info className="w-4 h-4" /> 📋 Note: NNRG TechFest - Idea2App
            </p>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section id="register" className="py-24 px-4 max-w-3xl mx-auto">
        <SectionHeading>Registration Form</SectionHeading>
        <p className="text-center text-[#6e7681] mb-12 -mt-8">
          Fill in your details below. After submission, you'll be redirected to WhatsApp to confirm your registration.
        </p>

        <div className="bg-[#0D1B2A] rounded-[16px] p-9 border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* College Select */}
            <div className="space-y-2">
              <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">COLLEGE *</label>
              <select 
                className="w-full bg-[#1e293b] border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all appearance-none"
                style={{ backgroundColor: '#1e293b' }}
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              >
                {COLLEGES.map(c => <option key={c} value={c} className="bg-[#1e293b] text-white">{c}</option>)}
              </select>
            </div>

            {formData.college === "Other" && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">OTHER COLLEGE NAME *</label>
                <input 
                  type="text"
                  placeholder="Type your college name"
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all",
                    errors.otherCollege && "border-red-500 animate-shake"
                  )}
                  value={formData.otherCollege}
                  onChange={(e) => setFormData({ ...formData, otherCollege: e.target.value })}
                />
                {errors.otherCollege && <p className="text-red-500 text-[10px]">{errors.otherCollege}</p>}
              </motion.div>
            )}

            {/* Team Name */}
            <div className="space-y-2">
              <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">TEAM NAME *</label>
              <input 
                type="text"
                placeholder="Enter your team name"
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all",
                  errors.teamName && "border-red-500 animate-shake"
                )}
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              />
              {errors.teamName && <p className="text-red-500 text-[10px]">{errors.teamName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">LEADER FULL NAME *</label>
              <input 
                type="text"
                placeholder="Enter leader's full name"
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all",
                  errors.leaderName && "border-red-500 animate-shake"
                )}
                value={formData.leaderName}
                onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
              />
              {errors.leaderName && <p className="text-red-500 text-[10px]">{errors.leaderName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">LEADER ROLL NUMBER *</label>
              <input 
                type="text"
                placeholder="e.g. 22A91A0501"
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all",
                  errors.leaderRoll && "border-red-500 animate-shake"
                )}
                value={formData.leaderRoll}
                onChange={(e) => setFormData({ ...formData, leaderRoll: e.target.value })}
              />
              {errors.leaderRoll && <p className="text-red-500 text-[10px]">{errors.leaderRoll}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">MEMBER 2 NAME (OPTIONAL)</label>
                <input 
                  type="text"
                  placeholder="Enter member 2 name"
                  className="w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all"
                  value={formData.member2Name}
                  onChange={(e) => setFormData({ ...formData, member2Name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">MEMBER 2 ROLL (OPTIONAL)</label>
                <input 
                  type="text"
                  placeholder="Member 2 roll number"
                  className="w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all"
                  value={formData.member2Roll}
                  onChange={(e) => setFormData({ ...formData, member2Roll: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">MEMBER 3 NAME (OPTIONAL)</label>
                <input 
                  type="text"
                  placeholder="Enter member 3 name"
                  className="w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all"
                  value={formData.member3Name}
                  onChange={(e) => setFormData({ ...formData, member3Name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">MEMBER 3 ROLL (OPTIONAL)</label>
                <input 
                  type="text"
                  placeholder="Member 3 roll number"
                  className="w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all"
                  value={formData.member3Roll}
                  onChange={(e) => setFormData({ ...formData, member3Roll: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">DEPARTMENT *</label>
                <select 
                  className="w-full bg-[#1e293b] border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all appearance-none"
                  style={{ backgroundColor: '#1e293b' }}
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#1e293b] text-white">{d}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">YEAR *</label>
                <select 
                  className="w-full bg-[#1e293b] border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all appearance-none"
                  style={{ backgroundColor: '#1e293b' }}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  {YEARS.map(y => <option key={y} value={y} className="bg-[#1e293b] text-white">{y}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">MOBILE *</label>
                <input 
                  type="tel"
                  placeholder="10-digit mobile number"
                  className={cn(
                    "w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all",
                    errors.mobile && "border-red-500 animate-shake"
                  )}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
                {errors.mobile && <p className="text-red-500 text-[10px]">{errors.mobile}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">EMAIL</label>
                <input 
                  type="email"
                  placeholder="your@email.com (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#2563EB] text-[10px] uppercase tracking-[2px] font-bold">TRANSACTION ID *</label>
              <input 
                type="text"
                placeholder="UPI Transaction ID after payment"
                className={cn(
                  "w-full bg-white/5 border border-white/10 rounded-[8px] p-3 text-white text-[13px] focus:border-[#2563EB] outline-none transition-all",
                  errors.transactionId && "border-red-500 animate-shake"
                )}
                value={formData.transactionId}
                onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              />
              {errors.transactionId && <p className="text-red-500 text-[10px]">{errors.transactionId}</p>}
            </div>

            <div className="bg-[#2563EB]/5 border-l-[3px] border-[#2563EB] p-4 space-y-1">
              <p className="text-[#2563EB] text-[12px] flex items-start gap-2">
                <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  💡 Reminder: Pay ₹{totalFee} to UPI ID <span className="font-bold">8309030400-id8e@axl</span> first, then enter your Transaction ID above.
                </span>
              </p>
            </div>

            <div className="bg-[#22C55E]/5 border-l-[3px] border-[#22C55E] p-4">
              <p className="text-[#22C55E] text-[12px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  🟢 On Submit: You'll be redirected to WhatsApp to send your registration details to the coordinator for confirmation.
                </span>
              </p>
            </div>

            <button 
              type="submit"
              className="w-full bg-[#2563EB] text-white py-[18px] rounded-[10px] font-bold text-[15px] transition-all hover:bg-[#1D4ED8] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-[0.98]"
            >
              ⊕ Submit Registration & Open WhatsApp →
            </button>

            <p className="text-center text-[#6e7681] text-[11px] leading-relaxed">
              By submitting, you agree to the event rules and confirm that your payment has been made. All decisions by the organizing committee are final.
            </p>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative bg-black py-20 px-4 overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-[clamp(60px,12vw,160px)] font-[900] text-white/[0.03] tracking-[8px] whitespace-nowrap uppercase select-none">
            TECH FEST 2027
          </span>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h3 className="text-center text-white text-[28px] font-bold mb-12 uppercase tracking-wider">NEED HELP?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Faculty Coordinators */}
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-[3px] font-bold mb-4">FACULTY COORDINATORS</p>
              <div className="space-y-2">
                {[
                  { name: "Dr. V.V. Appaji", phone: "9949062386" },
                  { name: "Mr. M. Eswara Rao", phone: "8143848778" }
                ].map((c, i) => (
                  <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-[6px] p-4 flex justify-between items-center">
                    <span className="text-white font-bold text-[14px]">{c.name}</span>
                    <a href={`tel:${c.phone}`} className="text-[#8b949e] text-[12px] hover:text-[#2563EB] transition-colors">{c.phone}</a>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Coordinators */}
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-[3px] font-bold mb-4">STUDENT COORDINATORS</p>
              <div className="space-y-2">
                {/* Main Student Coordinator */}
                <a 
                  href="https://wa.me/918309030400" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#0a0f1e] border-l-4 border-[#2563EB] rounded-r-[6px] p-4 flex justify-between items-center group transition-all hover:bg-[#0a0f1e]/80"
                >
                  <div>
                    <p className="text-[#2563EB]/60 text-[8px] uppercase font-bold mb-0.5">STUDENT COORDINATOR</p>
                    <p className="text-[#2563EB] font-bold text-[16px]">GATTU ABHINAY</p>
                  </div>
                  <span className="text-[#2563EB] font-bold text-[13px] group-hover:translate-x-1 transition-transform">8309030400 ↗</span>
                </a>

                {[
                  { name: "Nithish", phone: "6301234532" },
                  { name: "Akhil", phone: "7281823454" }
                ].map((c, i) => (
                  <div key={i} className="bg-[#0D1117] border border-[#21262d] rounded-[6px] p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[#8b949e] text-[8px] uppercase font-bold">STUDENT COORDINATOR</p>
                      <p className="text-white font-bold text-[14px]">{c.name}</p>
                    </div>
                    <a href={`tel:${c.phone}`} className="text-[#8b949e] text-[12px] hover:text-[#2563EB] transition-colors">{c.phone}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-6 border-t border-white/[0.07] flex flex-wrap justify-between items-center gap-4 text-white/20 text-[10px]">
            <p>Developed and maintained by Computer Science Department</p>
            <p>© 2027 NNRG Fest. All rights reserved.</p>
            <a 
              href="https://wa.me/918309030400" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#2563EB] hover:underline"
            >
              Designed by GATTU ABHINAY ↗
            </a>
          </div>
        </div>
      </footer>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes pulse-dot {
          0% { transform: scale(1); opacity: 1; box-shadow: 0 0 10px rgba(37,99,235,0.8); }
          50% { transform: scale(1.2); opacity: 0.8; box-shadow: 0 0 20px rgba(37,99,235,1); }
          100% { transform: scale(1); opacity: 1; box-shadow: 0 0 10px rgba(37,99,235,0.8); }
        }
        .animate-shake {
          animation: pulse 0.2s ease-in-out 0s 2;
        }
        .animate-pulse-dot {
          animation: pulse-dot 1.5s infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
