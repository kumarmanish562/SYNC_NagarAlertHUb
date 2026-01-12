import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, XCircle, AlertTriangle, User, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getDatabase, ref, onValue, update } from 'firebase/database';

const IncidentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    // Extract actual Firebase ID if prefixed with RPT-
    const cleanId = id.startsWith('RPT-') ? id.replace('RPT-', '') : id;

    useEffect(() => {
        const db = getDatabase();
        if (!cleanId) return;

        const reportRef = ref(db, `reports/${cleanId}`);
        const unsubscribe = onValue(reportRef, (snapshot) => {
            if (snapshot.exists()) {
                setReport(snapshot.val());
            } else {
                setReport(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [cleanId]);

    const handleAction = async (newStatus) => {
        const db = getDatabase();
        try {
            await update(ref(db, `reports/${cleanId}`), {
                status: newStatus
            });
            // Status will auto-update via the listener
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        </AdminLayout>
    );

    if (!report) return (
        <AdminLayout>
            <div className="text-center mt-20 text-slate-500">
                <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
                <p>The incident ID #{cleanId} does not exist.</p>
                <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">Go Back</button>
            </div>
        </AdminLayout>
    );

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
                            Incident #{cleanId.slice(-6)}
                            <span className={`text-sm font-normal px-2 py-0.5 rounded-full border ${report.status === 'Resolved' || report.status === 'Accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                                report.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                                    'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                {report.status || 'Open'}
                            </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Reported on {new Date(report.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Column: Evidence */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                                Evidence Photo
                                <a href={report.imageUrl} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 hover:underline"><ExternalLink size={12} /> View Full Res</a>
                            </div>
                            <div className="rounded-xl overflow-hidden h-[400px] w-full bg-slate-100 dark:bg-slate-900 relative">
                                <img
                                    src={report.imageUrl || "https://via.placeholder.com/400"}
                                    className="w-full h-full object-cover"
                                    alt="Incident Evidence"
                                />
                                {report.location && (
                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono">
                                        Lat: {report.location.lat?.toFixed(4)}, Lng: {report.location.lng?.toFixed(4)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map Location */}
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <div className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                                Exact Location
                                <span className="text-slate-400 text-xs font-normal flex items-center gap-1"><MapPin size={12} /> {report.location?.address || "Address unavailable"}</span>
                            </div>
                            <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-xl w-full relative overflow-hidden">
                                {/* Placeholder Map for now */}
                                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover opacity-30 grayscale invert-0 dark:invert"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                                        <MapPin className="text-red-600 drop-shadow-md" size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Details (If available) */}
                        {report.user ? ( // Simple check, ideally fetch user profile
                            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-colors">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 text-lg">
                                    <User size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">Citizen Report</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">Via Mobile App</div>
                                </div>
                            </div>
                        ) : null}
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
                                        <span className="font-bold text-purple-900 dark:text-purple-100">{report.category || "Unknown"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-purple-200/50 dark:border-purple-500/20 pb-2">
                                        <span className="text-purple-700 dark:text-purple-300">Confidence Score:</span>
                                        <span className="font-bold text-purple-900 dark:text-purple-100">{report.aiConfidence || "N/A"}% Match</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm pb-1">
                                        <span className="text-purple-700 dark:text-purple-300">Description:</span>
                                        <span className="font-bold text-purple-900 dark:text-purple-100 text-right truncate w-1/2">{report.description}</span>
                                    </div>
                                    {report.aiAnalysis && (
                                        <div className="mt-2 text-xs text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/30 p-2 rounded border border-purple-200 dark:border-purple-700">
                                            {report.aiAnalysis}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Admin Actions */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Verification & Action</h3>

                            {report.status === 'Pending' || report.status === 'Open' ? (
                                <>
                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Admin Notes</label>
                                        <textarea placeholder="Add any specific instructions for the team..." className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 h-24 text-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"></textarea>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <button
                                            onClick={() => handleAction('Accepted')}
                                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                                        >
                                            <CheckCircle size={20} /> Verify & Accept
                                        </button>

                                        <button
                                            onClick={() => handleAction('Rejected')}
                                            className="w-full py-4 bg-white dark:bg-slate-700 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center gap-2 transition-all"
                                        >
                                            <XCircle size={20} /> Reject Report
                                        </button>
                                    </div>
                                </>
                            ) : report.status === 'Accepted' || report.status === 'Verified' || report.status === 'In Progress' || report.status === 'Resolved' ? (
                                <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-500/20 rounded-xl text-center">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-300">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h4 className="font-bold text-green-800 dark:text-green-300 text-lg mb-1">Report Verified</h4>
                                    <p className="text-sm text-green-600 dark:text-green-400">This incident has been accepted and is being processed.</p>
                                </div>
                            ) : (
                                <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 rounded-xl text-center">
                                    <div className="w-16 h-16 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-300">
                                        <XCircle size={32} />
                                    </div>
                                    <h4 className="font-bold text-red-800 dark:text-red-300 text-lg mb-1">Report Rejected</h4>
                                    <p className="text-sm text-red-600 dark:text-red-400">This report was marked as invalid or duplicate.</p>
                                </div>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                            <h3 className="font-bold text-slate-800 dark:text-white mb-4">Activity Log</h3>
                            <div className="space-y-6 relative pl-2 border-l border-slate-100 dark:border-slate-700 ml-2">
                                <div className="relative pl-6">
                                    <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-white">Issue Reported</div>
                                    <div className="text-xs text-slate-400">{new Date(report.createdAt).toLocaleTimeString()}</div>
                                </div>
                                {report.aiVerified && (
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-purple-400"></div>
                                        <div className="text-sm font-bold text-slate-800 dark:text-white">AI Analysis Completed</div>
                                        <div className="text-xs text-slate-400">Automated System</div>
                                    </div>
                                )}
                                <div className="relative pl-6">
                                    <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${report.status === 'Resolved' || report.status === 'Accepted' ? 'bg-green-500' :
                                        report.status === 'Rejected' ? 'bg-red-500' : 'bg-slate-200'
                                        }`}></div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-white">Current Status: {report.status}</div>
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
