import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, MapPin, AlertTriangle, CheckCircle, Sparkles, Plus, Search, Maximize2, X, Send, ThumbsDown, CheckSquare } from 'lucide-react';
import AdminLayout from './AdminLayout';

const AdminDashboard = () => {
    const navigate = useNavigate();
    return (
        <AdminLayout>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    label="Open Incidents"
                    value="42"
                    sub="+5% vs yesterday"
                    subColor="text-red-500"
                    icon={<AlertTriangle size={20} className="text-orange-500" />}
                />
                <StatCard
                    label="High Severity"
                    value="8"
                    sub="-2% decrease"
                    subColor="text-green-500"
                    icon={<div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">!</div>}
                />
                <StatCard
                    label="AI Flagged"
                    value="15"
                    sub="Needs Verification"
                    subColor="text-blue-500"
                    icon={<Sparkles size={20} className="text-blue-500" />}
                />
                <StatCard
                    label="Resolved Today"
                    value="12"
                    sub="+8% efficiency"
                    subColor="text-green-500"
                    icon={<CheckCircle size={20} className="text-green-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Live Incident Map */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-None border border-slate-200 dark:border-slate-700/50 p-1 transition-colors">
                        <div className="px-4 py-3 flex justify-between items-center border-b border-slate-100 dark:border-slate-700/50">
                            <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-white"><MapPin size={18} /> Live Incident Map</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Critical</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400"></span> In Progress</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Resolved</span>
                            </div>
                        </div>
                        <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden rounded-b-lg">
                            {/* Map Placeholder */}
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover opacity-20 dark:opacity-10 grayscale"></div>

                            {/* Mock Map Elements */}
                            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-red-500 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-lg flex items-center justify-center animate-bounce">
                                <span className="text-xs font-bold">!</span>
                            </div>
                            <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-orange-400 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
                                <span className="text-xs font-bold">🛠️</span>
                            </div>
                            <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-green-500 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-lg flex items-center justify-center">
                                <span className="text-xs font-bold">✓</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports Table */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-colors">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800 dark:text-white">Recent Reports</h3>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"><Search size={18} /></button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Details</th>
                                        <th className="px-6 py-3">Gemini AI Insight</th>
                                        <th className="px-6 py-3">Severity</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                    <TableRow
                                        id="#4025"
                                        address="123 Main St, Downtown"
                                        img="https://images.unsplash.com/photo-1542361345-89e58247f2d1?q=80&w=100&auto=format&fit=crop"
                                        insight="Pothole Detected"
                                        confidence={98}
                                        severity="Critical"
                                        status="Open"
                                    />
                                    <TableRow
                                        id="#4024"
                                        address="45 Elm Ave, Northside"
                                        img="https://images.unsplash.com/photo-1517429188033-04bd2177307e?q=80&w=100&auto=format&fit=crop"
                                        insight="Electrical Issue"
                                        confidence={85}
                                        severity="Medium"
                                        status="In Progress"
                                    />
                                    <TableRow
                                        id="#4023"
                                        address="78 Oak Ln, Park"
                                        img="https://images.unsplash.com/photo-1605606622329-a35928d11b33?q=80&w=100&auto=format&fit=crop"
                                        insight="Sanitation"
                                        confidence={92}
                                        severity="Low"
                                        status="Resolved"
                                    />
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column (1/3 width) - Verification Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700/50 p-6 flex flex-col h-full transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Panel</div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Incident #4025</h2>
                        </div>
                        <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> High Priority
                        </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative rounded-xl overflow-hidden mb-6 group cursor-pointer bg-slate-100 dark:bg-slate-900">
                        <img
                            src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop"
                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                            alt="Incident Evidence"
                        />
                        <button className="absolute bottom-2 right-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-800 dark:text-white">
                            <Maximize2 size={12} /> Enlarge
                        </button>
                    </div>

                    {/* AI Analysis Box */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-500/20 mb-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                            <span className="font-bold text-blue-900 dark:text-blue-100 text-sm">Gemini AI Analysis</span>
                            <div className="ml-auto text-blue-600 dark:text-blue-400 font-bold text-xs">98% Confidence</div>
                        </div>
                        <div className="w-full bg-blue-200 dark:bg-blue-900/40 h-1.5 rounded-full mb-3 overflow-hidden">
                            <div className="bg-blue-600 dark:bg-blue-400 h-full rounded-full" style={{ width: '98%' }}></div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            Detected severe road fissure approx 40cm wide. Potential tire hazard. Recommend immediate asphalt patch.
                        </p>
                    </div>

                    {/* User Description */}
                    <div className="mb-6">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">User Description</div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700/50">
                            "Huge hole in the road, almost wrecked my tire. It's right in the middle of the lane!"
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto space-y-3">
                        <button
                            onClick={() => navigate('/admin/broadcast')}
                            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Send size={18} /> Broadcast Alert
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                                <X size={18} className="text-slate-400 dark:text-slate-300" /> Reject
                            </button>
                            <button className="py-3 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg">
                                <CheckSquare size={18} /> Resolve
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
};

const StatCard = ({ label, value, sub, subColor, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-none flex flex-col justify-between h-28 transition-colors">
        <div className="flex justify-between items-start">
            <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{label}</span>
            {icon}
        </div>
        <div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</div>
            <div className={`text-xs font-bold mt-1 ${subColor}`}>{sub}</div>
        </div>
    </div>
);

const TableRow = ({ id, address, img, insight, confidence, severity, status }) => {
    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer border-b border-transparent">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <img src={img} className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-700" alt="" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">{id}</div>
                        <div className="text-xs text-slate-400">{address}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="w-40">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <Sparkles size={12} className="text-blue-500" /> {insight}
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${confidence}%` }}></div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${severity === 'Critical' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' :
                    severity === 'Medium' ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400' : 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                    }`}>
                    {severity}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded border text-xs font-bold ${status === 'Open' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20' :
                    status === 'In Progress' ? 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20' : 'bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-slate-600'
                    }`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors">
                    <MoreVertical size={16} />
                </button>
            </td>
        </tr>
    );
}

export default AdminDashboard;
