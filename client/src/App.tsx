import React, { useState, useRef } from 'react';
import { Upload, Play, Loader2, BookOpen, Clock } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileChange = (e : any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
      setFeedback([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("Server Response:", data);
      setFeedback(data.feedback);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error analyzing audio. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const parseTimestamp = (timeStr : string) => {
    const parts = timeStr.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return (minutes * 60) + seconds;
  };

  const handleSeek = (timestamp : string) => {
    if (audioRef.current) {
      const seconds = parseTimestamp(timestamp);
      audioRef.current.currentTime = seconds;
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-800">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <header className="flex flex-col items-center gap-3 mb-12 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            AI Instructional Coach
          </h1>
          <p className="text-slate-300 text-center max-w-md text-sm sm:text-base px-4">
            Upload a voice recording to receive AI-powered pedagogical insights and actionable feedback.
          </p>
        </header>

        {/* Upload Card */}
        <div className="w-full bg-slate-800/80 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-700/50 text-center relative overflow-hidden group mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-1">Upload Recording</h3>
              <p className="text-sm text-slate-400">Select an audio file from your classroom session</p>
            </div>

            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-blue-600 file:to-blue-700 file:text-white hover:file:from-blue-700 hover:file:to-blue-800 file:shadow-lg hover:file:shadow-xl file:transition-all cursor-pointer"
            />

            {file && (
              <div className="mt-6 space-y-3 animate-in slide-in-from-top-2 fade-in duration-300">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-slate-100 truncate">{file.name}</p>
                      <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-2.5 font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
                    loading
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  {loading ? 'Analyzing Pedagogy...' : 'Analyze Audio'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Audio Player (Sticky) */}
        {audioUrl && (
          <div className="sticky top-4 z-20 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-slate-700/50 ring-1 ring-slate-900/5 animate-in slide-in-from-top-4 fade-in duration-500 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Recording</h2>
            </div>
            <audio
              ref={audioRef}
              controls
              className="w-full h-11 accent-blue-600 rounded-lg"
              src={audioUrl}
            />
          </div>
        )}

        {/* Feedback Cards */}
        {feedback.length > 0 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between border-b-2 border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">Key Insights</h2>
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                {feedback.length} moments
              </span>
            </div>

            <div className="grid gap-5">
              {feedback.map((item : any, index : number) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm p-6 sm:p-7 rounded-2xl shadow-lg border border-slate-700/50 hover:shadow-2xl hover:border-blue-300/50 hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
                    <h3 className="font-bold text-lg sm:text-xl text-slate-100 group-hover:text-blue-700 transition-colors leading-tight">
                      {item.principle}
                    </h3>

                    <button
                      onClick={() => handleSeek(item.timestamp)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2.5 rounded-full hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all ring-2 ring-blue-200 hover:ring-blue-500 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 whitespace-nowrap self-start sm:self-auto"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="tabular-nums font-mono">{item.timestamp}</span>
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-1 h-full min-h-[32px] bg-gradient-to-b from-slate-200 to-slate-100 rounded-full group-hover:from-blue-400 group-hover:to-blue-500 transition-all duration-300 shadow-sm"></div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
