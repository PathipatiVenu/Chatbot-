import { HiArrowRight, HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { AiFillInstagram, AiFillLinkedin, AiFillGithub } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function Home() {
  const navigate = useNavigate();
  return (

    <><Navbar />

    <div className="bg-[#0f172a] text-slate-200 min-h-screen font-sans">
      
      {/* 🚀 Hero Section */}
      <section className="relative pt-20 pb-16 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 -right-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-[120px]"></div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Master Your Next <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
            Technical Interview
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
          AI-powered mock interviews tailored to your resume and job description. 
          Get real-time feedback and land your dream job in tech.
        </p>
        <div className="flex gap-4">
          <button onClick={() => navigate('/chat')} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            Start Free Interview <HiArrowRight />
          </button>
          <button className="border border-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold transition-all">
            View Jobs
          </button>
        </div>

        {/* Hero Image / Illustration */}
        <div className="mt-16 max-w-5xl w-full rounded-2xl border border-slate-800 shadow-2xl overflow-hidden bg-slate-900/50 backdrop-blur-sm">
          <img 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80" 
            alt="Team working on AI" 
            className="w-full h-[400px] object-cover opacity-80"
          />
        </div>
      </section>

      {/* 📧 Contact & Socials Section */}
      <section className="py-20 px-6 bg-[#1e293b]/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
              <p className="text-slate-400">Have questions about the platform? Our team is here to help you 24/7.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400">
                  <HiMail size={20} />
                </div>
                <span>support@ai-interview.pro</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                  <HiPhone size={20} />
                </div>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400">
                  <HiLocationMarker size={20} />
                </div>
                <span>Chirala, Andhra Pradesh, India</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Follow Us</p>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-pink-600 transition-all text-white">
                  <AiFillInstagram size={24} />
                </a>
                <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-all text-white">
                  <AiFillLinkedin size={24} />
                </a>
                <a href="#" className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-all text-white">
                  <AiFillGithub size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-700 shadow-xl">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Name" className="bg-[#0f172a] border border-slate-600 p-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
                <input type="email" placeholder="Email" className="bg-[#0f172a] border border-slate-600 p-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
              </div>
              <input type="text" placeholder="Subject" className="w-full bg-[#0f172a] border border-slate-600 p-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm" />
              <textarea rows="4" placeholder="How can we help?" className="w-full bg-[#0f172a] border border-slate-600 p-3 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"></textarea>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold transition-all">Send Message</button>
            </form>
          </div>

        </div>
      </section>

      {/* 👣 Footer */}
      <footer className="py-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>© 2026 AI Interview Pro. Built with ❤️ in India.</p>
      </footer>
    </div>
    </>
  );
}