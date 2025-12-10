import React, { useState, useRef } from 'react';
import { Upload, Play, Loader2, BookOpen } from 'lucide-react';
import Header from './components/Header';
import { FileUpload } from './components/ui/file-upload';
import { MultiStepLoader as Loader } from './components/ui/multi-step-loader';
import { HoverBorderGradient } from "./components/ui/hover-border-gradient";
import { loadingStates } from './lib/utils';
function App() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFilesSelected = (files: File[]) => {
    const selectedFile = files[0];
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
        <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
        <Header />

        {/* Upload Section */}
        <div className="mb-8 animate-in slide-in-from-top-2 fade-in duration-500">
            <FileUpload onChange={handleFilesSelected} />
          <div className="relative z-10 mt-6">
            {file && (
              <div className="animate-in slide-in-from-top-2 fade-in duration-300 flex justify-center items-center">
                <HoverBorderGradient
                    containerClassName='rounded-full'
                    as="button"
                    onClick={handleUpload}
                    className=" bg-white text-black flex items-center justify-center space-x-2"
                >
                  <Upload className="w-5 h-5" />
                  Start Analysis
                </HoverBorderGradient>
              </div>
            )}
          </div>
        </div>

        {/* Audio Player */}
        {audioUrl && (
          <div className="sticky top-4 z-20 bg-slate-900/90 backdrop-blur-xl p-5 rounded-2xl shadow-2xl border border-slate-700 ring-1 ring-white/5 animate-in slide-in-from-top-4 fade-in duration-500 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preview</h2>
            </div>
            <audio
              ref={audioRef}
              controls
              className="w-full h-11 accent-blue-600 rounded-lg custom-audio-player"
              src={audioUrl}
            />
          </div>
        )}

        {feedback.length > 0 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between border-b border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-xl border border-slate-700">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-slate-100">Key Insights</h2>
              </div>
              <span className="bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold px-4 py-2 rounded-full">
                {feedback.length} moments
              </span>
            </div>

            <div className="grid gap-5">
              {feedback.map((item: any, index: number) => (
                <div
                  key={index}
                  className="group bg-slate-800/50 backdrop-blur-sm p-6 sm:p-7 rounded-2xl shadow-lg border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4">
                    <h3 className="font-bold text-lg sm:text-xl text-slate-100 group-hover:text-blue-400 transition-colors leading-tight">
                      {item.principle}
                    </h3>

                    <button
                      onClick={() => handleSeek(item.timestamp)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-300 bg-blue-900/30 px-4 py-2.5 rounded-full hover:bg-blue-600 hover:text-white transition-all border border-blue-500/30 hover:border-blue-400 whitespace-nowrap self-start sm:self-auto"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span className="tabular-nums font-mono">{item.timestamp}</span>
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-1 h-full min-h-[32px] bg-slate-700 rounded-full group-hover:bg-blue-500 transition-all duration-300"></div>
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
