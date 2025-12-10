import React, { useState, useRef } from 'react';
import axios from 'axios';
import Header from './components/Header';
import { Upload, Play, Loader2, BookOpen, Clock } from 'lucide-react';

function App() {

  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [feedback, setFeedback] = useState([]); // storing the JSON from fastapi
  const [loading, setLoading] = useState(false);

  const audioRef = useRef(null);

  // Handle when user picks a file
  const handleFileChange = (e) => {
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

      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log("Server Response:", response.data);
      // { feedback: [...] }
      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error analyzing audio. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // Convert "01:00" (String) -> 60 (Seconds)
  const parseTimestamp = (timeStr) => {
    const parts = timeStr.split(':');
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return (minutes * 60) + seconds;
  };

  const handleSeek = (timestamp) => {
    if (audioRef.current) {
      const seconds = parseTimestamp(timestamp);
      audioRef.current.currentTime = seconds;
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <div className="max-w-3xl mx-auto space-y-8">

        <Header></Header>

        {/* Upload Card */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
          <input
            type="file"
            accept="audio/*" // Only accept audio files
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer transition-all"
          />

          {file && (
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`mt-6 w-full py-3 px-6 rounded-xl flex items-center justify-center gap-2 font-semibold text-white transition-all transform active:scale-95 ${
                loading
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? 'Analyzing Pedagogy...' : 'Analyze Audio'}
            </button>
          )}
        </div>

        {/* Audio Player (Sticky) */}
        {audioUrl && (
          <div className="sticky top-6 z-10 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-200 ring-1 ring-slate-900/5">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Classroom Recording</h2>
            {/* The standard HTML5 player */}
            <audio
              ref={audioRef}
              controls
              className="w-full h-10 accent-blue-600"
              src={audioUrl}
            />
          </div>
        )}

        {/* Feedback Cards */}
        {feedback.length > 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <h2 className="text-xl font-bold text-slate-800">Key Moments</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">{feedback.length} insights</span>
            </div>

            <div className="grid gap-4">
              {feedback.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.principle}
                    </h3>

                    {/* The "Jump" Button */}
                    <button
                      onClick={() => handleSeek(item.timestamp)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all ring-1 ring-blue-100"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="tabular-nums">{item.timestamp}</span>
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-1 h-full min-h-[24px] bg-slate-200 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">
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
