import React, { useState } from 'react';
import { FileText, MapPin, Calendar, ArrowRight, Filter, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CivicLayout from './CivicLayout';

const MyReports = () => {
    const [filter, setFilter] = useState('All');

    const reports = [
        { id: 'R-2024-001', type: 'Pothole', location: 'Sector 4, Main Road', date: 'Oct 24, 2025', status: 'Pending', severity: 'High' },
        { id: 'R-2024-002', type: 'Street Light', location: 'Sector 4, Park Lane', date: 'Oct 22, 2025', status: 'Resolved', severity: 'Medium' },
        { id: 'R-2024-003', type: 'Garbage Dump', location: 'Sector 5, Market', date: 'Oct 15, 2025', status: 'In Progress', severity: 'Low' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30';
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
        }
    };

    return (
        <CivicLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Reports</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track the status of your submitted issues.</p>
                </div>
                <Link to="/report" className="flex items-center gap-2 px-5 py-3 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded-xl font-bold transition-transform active:scale-95 shadow-lg">
                    <Plus size={20} /> New Report
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['All', 'Pending', 'Resolved', 'In Progress'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${filter === f ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                    />
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid gap-4">
                {reports.map(report => (
                    <div key={report.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors group">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shrink-0">
                                    {report.type === 'Pothole' ? '🚧' : report.type === 'Street Light' ? '💡' : '🗑️'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white">{report.type}</h3>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getStatusColor(report.status)}`}>{report.status}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {report.location}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {report.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0 mt-2 md:mt-0">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs font-bold text-slate-400 uppercase">ID</div>
                                    <div className="text-sm font-mono font-medium text-slate-700 dark:text-slate-300">{report.id}</div>
                                </div>
                                <Link to={`/civic/report/${report.id}`} className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors">
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </CivicLayout>
    );
};

export default MyReports;