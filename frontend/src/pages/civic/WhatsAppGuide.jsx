import React from 'react';
import { Camera, Send, MapPin, Check, MessageCircle, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CivicLayout from './CivicLayout';

const WhatsAppGuide = () => {
    const navigate = useNavigate();

    return (
        <CivicLayout>
            <div className="min-h-[calc(100vh-100px)] flex flex-col justify-center">

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="flex flex-col lg:flex-row min-h-[600px]">

                        {/* Left Side: Call to Action (60%) */}
                        <div className="lg:w-3/5 p-8 lg:p-16 flex flex-col justify-center bg-white dark:bg-slate-900 relative z-10">

                            <div className="inline-flex items-center gap-2 self-start px-4 py-1.5 bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
                                <MessageCircle size={14} /> Official Integration
                            </div>

                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                                No App? No Problem.<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700">Just WhatsApp Us.</span>
                            </h1>

                            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
                                Report potholes, garbage dumps, or accidents directly through our intelligent Chatbot. It's as easy as sending a message to a friend.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <a
                                    href="https://wa.me/919876543210"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
                                >
                                    <MessageCircle size={24} className="fill-current" /> Chat with Bot Now
                                </a>
                                <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
                                    <QrCode size={20} /> <span className="font-mono">+91 98765 43210</span>
                                </div>
                            </div>

                            {/* Quick Steps Horizontal */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-100 dark:border-slate-800">
                                <StepItem icon={<Camera />} label="1. Snap Photo" />
                                <StepItem icon={<Send />} label="2. Send" />
                                <StepItem icon={<MapPin />} label="3. Location" />
                                <StepItem icon={<Check />} label="4. Done!" />
                            </div>

                        </div>

                        {/* Right Side: Visual / QR (40%) */}
                        <div className="hidden lg:flex lg:w-2/5 bg-[#00a884] items-center justify-center relative overflow-hidden">
                            {/* Abstract Circle Pattern */}
                            <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png')] bg-center bg-no-repeat bg-contain transform scale-150 translate-x-1/2"></div>

                            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl text-center relative z-10 max-w-xs mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="w-48 h-48 bg-slate-900 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                                    <QrCode size={100} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Scan to Start</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Point your camera here to open the chat instantly.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </CivicLayout>
    );
};

const StepItem = ({ icon, label }) => (
    <div className="flex flex-col items-center text-center gap-2 group">
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-green-50 dark:group-hover:bg-green-500/20 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
            {React.cloneElement(icon, { size: 18 })}
        </div>
        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{label}</span>
    </div>
);

export default WhatsAppGuide;
