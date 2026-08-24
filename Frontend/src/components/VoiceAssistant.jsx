import React, { useState } from 'react';
import { Mic, MicOff, Volume2, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function VoiceAssistant() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMsg, setResponseMsg] = useState('');

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = lang === 'te' ? 'te-IN' : 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceQuery = (textQuery) => {
    const q = textQuery.toLowerCase();
    let reply = '';

    if (q.includes('chilli') || q.includes('మిర్చి')) {
      reply = lang === 'te'
        ? "గుంటూరు మార్కెట్‌లో మిర్చి ప్రస్తుత ధర క్వింటాలుకి ₹18,500. 15 రోజుల్లో ₹20,050 వరకు పెరుగుతుందని AI అంచనా వేస్తోంది."
        : "Current Chilli price in Guntur Mandi is ₹18,500 per quintal. AI forecasts ₹20,050 in 15 days.";
    } else if (q.includes('turmeric') || q.includes('పసుపు')) {
      reply = lang === 'te'
        ? "దుగ్గిరాల మార్కెట్‌లో పసుపు ప్రస్తుత ధర క్వింటాలుకి ₹12,200."
        : "Current Turmeric price in Duggirala market is ₹12,200 per quintal.";
    } else {
      reply = lang === 'te'
        ? "గుంటూరు మార్కెట్‌లో మిర్చి ప్రస్తుత ధర ₹18,500. AI అంచనా ప్రకారం వేచి ఉండటం మంచిది."
        : "Current Chilli price in Guntur is ₹18,500. AI recommendation is to WAIT for higher prices.";
    }

    setResponseMsg(reply);
    speakText(reply);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback for browsers without Web Speech API
      const sample = lang === 'te' ? "గుంటూరు మిర్చి ధర" : "Chilli price in Guntur";
      setTranscript(sample);
      setIsListening(false);
      handleVoiceQuery(sample);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'te' ? 'te-IN' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening... Speak now / మాట్లాడండి...');
      };

      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setTranscript(spokenText);
        setIsListening(false);
        handleVoiceQuery(spokenText);
      };

      recognition.onerror = () => {
        setIsListening(false);
        const fallbackText = lang === 'te' ? "గుంటూరు మిర్చి ధర" : "Chilli price in Guntur";
        setTranscript(fallbackText);
        handleVoiceQuery(fallbackText);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      const fallbackText = "Chilli price in Guntur";
      setTranscript(fallbackText);
      handleVoiceQuery(fallbackText);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white p-3.5 rounded-full shadow-2xl border-2 border-amber-400/50 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Voice Assistant / వాయిస్ అసిస్టెంట్"
        >
          <Mic className="w-6 h-6 text-amber-300 animate-bounce" />
          <span className="font-bold text-sm hidden sm:inline pr-1">🎙️ Voice Assistant</span>
        </button>
      ) : (
        <div className="bg-emerald-950 text-white p-5 rounded-2xl shadow-2xl border border-emerald-500/30 w-80 max-w-[90vw]">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-sm text-emerald-200">
                {lang === 'te' ? 'వాయిస్ అసిస్టెంట్' : 'AgriVoice Assistant'}
              </h4>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mb-4">
            {lang === 'te'
              ? 'నోటితో అడగండి: "గుంటూరులో మిర్చి ధర ఎంత?"'
              : 'Ask by voice: "Chilli price in Guntur"'}
          </p>

          <div className="flex justify-center mb-4">
            <button
              onClick={startListening}
              className={`p-4 rounded-full transition-all cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-ping'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-amber-300 shadow-lg'
              }`}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          {transcript && (
            <div className="bg-emerald-900/60 p-2.5 rounded-lg text-xs text-emerald-200 mb-2 border border-emerald-700">
              <strong>You asked:</strong> "{transcript}"
            </div>
          )}

          {responseMsg && (
            <div className="bg-amber-950/80 p-3 rounded-lg text-xs text-amber-200 border border-amber-600/50 flex items-start gap-2">
              <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Answer:</strong> {responseMsg}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
