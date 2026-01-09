import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, XCircle, AlertTriangle, User, Calendar, ExternalLink } from 'lucide-react';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'; // Commented out for now, using placeholder
import AdminLayout from './AdminLayout';

const IncidentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Pending');

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto pb-20">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Incident {id} <span className="text-sm font-normal text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">Pending Verification</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">Reported on Oct 24, 2026 • 10:42 AM</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Evidence */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                                Evidence Photo
                                <button className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline"><ExternalLink size={12} /> View Full Res</button>
                            </div>
                            <div className="rounded-xl overflow-hidden h-[400px] w-full bg-slate-100 dark:bg-slate-900 relative">
                                <img
                                    src="https://images.unsplash.com/photo-1542361345-89e58247f2d1?q=80&w=2670&auto=format&fit=crop"
                                    className="w-full h-full object-cover"
                                    alt="Incident Evidence"
                                />
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono">
                                    Lat: 28.6139, Lng: 77.2090
                                </div>
                            </div>
                        </div>

                        {/* Map Location */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                                Exact Location
                                <span className="text-slate-400 text-xs font-normal flex items-center gap-1"><MapPin size={12} /> Sector 4, Main Road</span>
                            </div>
                            <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-xl w-full relative overflow-hidden">
                                {/* Placeholder for Google Map Embed */}
                                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover opacity-30 grayscale invert-0 dark:invert"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                                        <MapPin className="text-red-600 drop-shadow-md" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-colors">
                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-lg">
                                RK
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white">Rahul Kumar</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">+91 98765 43210 • 150 Karma Points</div>
                            </div>
                            <div className="ml-auto text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
                                Trusted User
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Action */}
                    <div className="space-y-6">

                        {/* AI Analysis Box */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-indigo-950/30 dark:to-purple-900/10 border border-purple-100 dark:border-purple-500/20 p-6 rounded-2xl relative overflow-hidden transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <CheckCircle size={100} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-100 mb-4">
                                    <span className="text-lg">✨</span> Gemini AI Analysis
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm border-b border-purple-200/50 dark:border-purple-500/20 pb-2">
                                        <span className="text-purple-700 dark:text-purple-300">Detected Issue:</span>
                                        <span className="font-bold text-purple-900 dark:text-purple-100">Deep Pothole</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-purple-200/50 dark:border-purple-500/20 pb-2">
                                        <span className="text-purple-700 dark:text-purple-300">Confidence Score:</span>
                                        <span className="font-bold text-purple-900 dark:text-purple-100">98% Match</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pb-1">
                                        <span className="text-purple-700 dark:text-purple-300">Estimated Severity:</span>
                                        <span className="font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded text-xs border border-red-100 dark:border-red-500/20">HIGH PRIORITY</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Verification & Action</h3>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Admin Notes</label>
                                <textarea placeholder="Add any specific instructions for the team..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 h-24 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"></textarea>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                                    <CheckCircle size={20} /> Verify & Broadcast Alert
                                    <span className="text-[10px] font-normal opacity-80 bg-green-700 px-1.5 py-0.5 rounded">Triggers WhatsApp</span>
                                </button>

                                <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95">
                                    <User size={20} /> Assign into Task Force
                                </button>

                                <button className="w-full py-4 bg-white dark:bg-slate-700 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center gap-2 transition-all">
                                    <XCircle size={20} /> Reject Report
                                </button>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Activity Log</h3>
                            <div className="space-y-6 relative pl-2 border-l border-slate-100 dark:border-slate-700 ml-2">
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-white">Issue Reported</div>
                                    <div className="text-xs text-slate-400">by Rahul Kumar • 10:42 AM</div>
                                </div>
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400"></div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-white">AI Analysis Completed</div>
                                    <div className="text-xs text-slate-400">98% Confidence • 10:42 AM</div>
                                </div>
                                <div className="relative pl-6 opacity-40">
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Pending Verification</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default IncidentDetail;
