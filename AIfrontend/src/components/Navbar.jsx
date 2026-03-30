import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX, HiUserCircle, HiLogout } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setUserName(user.name);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">AI</div>
          <span className="text-xl font-bold text-white">INTERVIEW<span className="text-indigo-500">.PRO</span></span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm text-slate-300 hover:text-indigo-400">Home</Link>
          <Link to="/chat" className="text-sm text-slate-300 hover:text-indigo-400">Chatbot</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">{userName || "Candidate"}</p>
            <button onClick={handleLogout} className="text-[10px] text-indigo-400 uppercase font-bold flex items-center gap-1">
              Logout <HiLogout />
            </button>
          </div>
          <HiUserCircle size={32} className="text-slate-400" />
        </div>
      </div>
    </nav>
  );
}