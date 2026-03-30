import 'regenerator-runtime/runtime';
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { HiMicrophone, HiStop, HiRefresh } from "react-icons/hi";

export default function Chat() {
  const [jd, setJd] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selfIntro, setSelfIntro] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [stage, setStage] = useState("setup"); // setup | selfIntro | question | completed
  const [questionCount, setQuestionCount] = useState(5);
  const [askedQuestions, setAskedQuestions] = useState(0);

  // STATUS STATES
  const [isTyping, setIsTyping] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error429, setError429] = useState(false);

  const scrollRef = useRef(null);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // Sync speech transcript to input field
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Timer Logic
  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (isStarted && timeLeft === 0 && !isFinished) {
      handleEndInterview();
    }
  }, [isStarted, timeLeft, isFinished]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleStart = () => {
    if (!jd.trim()) return alert("Please enter Job Description.");
    if (timeLeft <= 0) return alert("Please set a valid duration.");
    if (questionCount <= 0) return alert("Please set a question count ≥ 1.");

    setIsStarted(true);
    setStage("selfIntro");
    setAskedQuestions(0);
    setIsFinished(false);
    setError429(false);
    setMessages([
      { role: "bot", text: "Interview started. First, please introduce yourself briefly and your relevant experience for this role." },
    ]);
  };

  const handleSend = async (retryData = null) => {
    const messageToSend = (retryData || input || transcript || "").trim();
    if (!messageToSend) return;

    if (!isStarted || isFinished || timeLeft <= 0) {
      return setStatusText("Interview is not active. Start or renew time.");
    }

    // add user message except for retry placeholder
    if (!retryData) {
      setMessages((prev) => [...prev, { role: "user", text: messageToSend }]);
    }

    setInput("");
    resetTranscript();
    setError429(false);
    setIsTyping(true);

    const historyText = [...messages, { role: "user", text: messageToSend }]
      .map((m) => `${m.role}: ${m.text}`)
      .join("\n");

    try {
      if (stage === "selfIntro") {
        setSelfIntro(messageToSend);
        setStage("question");
        setStatusText("Generating first question...");
      } else {
        setStatusText(`Evaluating answer and preparing question ${askedQuestions + 1}/${questionCount}...`);
      }

      const res = await axios.post("http://localhost:8000/chat", {
        jd,
        self_intro: stage === "selfIntro" ? messageToSend : selfIntro,
        history: historyText,
      });

      // if we reached the target question count, end interview
      if (stage === "question" && askedQuestions + 1 >= questionCount) {
        setAskedQuestions((prev) => prev + 1);
        setMessages((prev) => [...prev, { role: "bot", text: res.data.question }]);
        await new Promise((resolve) => setTimeout(resolve, 250));
        await handleEndInterview();
      } else {
        setAskedQuestions((prev) => (stage === "selfIntro" ? 1 : prev + 1));
        setMessages((prev) => [...prev, { role: "bot", text: res.data.question }]);
        setStage("question");
      }

      setStatusText("");
    } catch (err) {
      if (err.response?.status === 429) {
        setError429(true);
        setStatusText("Rate limit reached. Please wait and retry.");
      } else {
        setStatusText("Connection error. Check if AI engine is running and valid API key is set.");
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleEndInterview = async () => {
    if (isFinished) return;

    setIsFinished(true);
    setIsTyping(true);
    setStatusText("Generating final report and score...");

    try {
      const res = await axios.post("http://localhost:8000/score", {
        history: messages.map((m) => `${m.role}: ${m.text}`).join("\n"),
        total_asked: askedQuestions,
      });

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `Interview ended. Score report: ${res.data.report}` },
      ]);
      setStatusText("Interview complete.");
      setStage("completed");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Unable to produce full report right now. Please retry or refresh." },
      ]);
      setStatusText("Failed to generate final report.");
    } finally {
      setIsTyping(false);
    }
  };

  const voiceWarning = !browserSupportsSpeechRecognition ? "(Speech recognition not supported in this browser.)" : "";

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <Navbar />
      
      {!isStarted ? (
        <div className="max-w-2xl mx-auto mt-20 p-8 bg-[#1e293b] rounded-2xl border border-slate-700 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Interview Setup</h2>
          {voiceWarning && <p className="text-sm text-amber-300 mb-4">{voiceWarning}</p>}
          <textarea 
            className="w-full h-40 bg-[#0f172a] p-4 rounded-xl border border-slate-600 mb-4 outline-none focus:border-indigo-500"
            placeholder="Paste Job Description..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <input 
            type="number" 
            min="1"
            placeholder="Duration (Minutes)" 
            className="bg-[#0f172a] p-3 rounded-lg border border-slate-600 w-full mb-4"
            onChange={(e) => setTimeLeft(Math.max(0, Number(e.target.value)) * 60)}
          />
          <input
            type="number"
            min="1"
            value={questionCount}
            onChange={(e) => setQuestionCount(Math.max(1, Number(e.target.value) || 1))}
            className="bg-[#0f172a] p-3 rounded-lg border border-slate-600 w-full mb-6"
            placeholder="Number of questions"
          />
          <button onClick={handleStart} className="w-full bg-indigo-600 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all">
            Start Interview
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto mt-10 px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 bg-[#1e293b] p-4 rounded-xl border border-slate-700 shadow-lg">
            <div className="text-red-400 font-mono text-xl flex items-center gap-2">
              <span className="animate-pulse">⌛</span> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-indigo-400 text-xs font-semibold animate-pulse">{statusText}</div>
          </div>

          {/* Chat Window */}
          <div className="h-[55vh] overflow-y-auto space-y-4 mb-4 p-6 bg-[#1e293b]/50 rounded-2xl border border-slate-800 scrollbar-thin">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-4 rounded-xl max-w-[80%] shadow-md ${m.role === "user" ? "bg-indigo-600" : "bg-slate-700"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700 p-4 rounded-xl rounded-tl-none flex gap-1 animate-pulse">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Controls */}
          {!isFinished && (
            <>
              <div className="mb-2 text-xs text-slate-400">
                Question {askedQuestions}/{questionCount} • self-intro stage: {stage === "selfIntro" ? "pending" : "in progress"}
              </div>
              <div className="flex gap-2 bg-[#1e293b] p-2 rounded-2xl border border-slate-700 shadow-xl">
                <input 
                  className="flex-1 bg-transparent p-4 outline-none text-slate-200"
                  placeholder={listening ? "Listening..." : "Type or use voice..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                
                <button 
                  onClick={listening ? SpeechRecognition.stopListening : () => SpeechRecognition.startListening({ continuous: true })}
                  className={`p-4 rounded-xl transition-all ${listening ? "bg-red-500 text-white animate-pulse" : "bg-slate-800 text-slate-400"}`}
                >
                  {listening ? <HiStop size={20} /> : <HiMicrophone size={20} />}
                </button>

                {error429 ? (
                  <button 
                    onClick={() => handleSend(messages[messages.length - 1]?.text)} 
                    className="bg-orange-600 px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-500"
                  >
                    <HiRefresh /> Retry
                  </button>
                ) : (
                  <button onClick={() => handleSend()} className="bg-indigo-600 px-8 rounded-xl font-bold hover:bg-indigo-500 transition-all">
                    Send
                  </button>
                )}
              </div>
              <div className="flex justify-between mt-3 gap-2">
                <button
                  onClick={() => setTimeLeft((prev) => prev + 5 * 60)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl font-semibold"
                  disabled={isFinished}
                >
                  +5 min
                </button>
                <button
                  onClick={handleEndInterview}
                  className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-semibold"
                >
                  End Now
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}