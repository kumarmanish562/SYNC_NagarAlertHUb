import React, { useState } from 'react';
import { Search, Filter, Eye, Trash2, UserPlus, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const AdminIncidents = () => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const incidents = [
        { id: 'RPT-1001', type: 'Pothole', location: 'Sector 4, Main Road', confidence: 95, severity: 'High', status: 'Pending', date: '2026-01-08' },
        { id: 'RPT-1002', type: 'Garbage', location: 'Civil Lines', confidence: 88, severity: 'Medium', status: 'Verified', date: '2026-01-07' },
        { id: 'RPT-1003', type: 'Fire', location: 'Industrial Area', confidence: 99, severity: 'Critical', status: 'In Progress', date: '2026-01-08' },
        { id: 'RPT-1004', type: 'Water Log', location: 'Market Place', confidence: 75, severity: 'Low', status: 'Resolved', date: '2026-01-06' },
        { id: 'RPT-1005', type: 'Street Light', location: 'Sector 9', confidence: 92, severity: 'Medium', status: 'Pending', date: '2026-01-05' },
    ];

    const filteredIncidents = incidents.filter(inc => {
        const matchesFilter = filter === 'All' || inc.status === filter;
        const matchesSearch = inc.id.toLowerCase().includes(search.toLowerCase()) ||
            inc.location.toLowerCase().includes(search.toLowerCase()) ||
            inc.type.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Incident Management</h1>
                        <p className="text-slate-500 dark:text-slate-400">View and manage reported issues across the city.</p>
                    </div>
                    <button className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-lg">
                        <Filter size={16} /> Export Data
                    </button>
                </div>

                {/* Toolbar */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between gap-4 transition-colors">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by ID, Area or Type..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 dark:text-white transition-all placeholder-slate-400"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {['All', 'Pending', 'Verified', 'In Progress', 'Resolved'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === f ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">AI Confidence</th>
                                    <th className="px-6 py-4">Severity</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredIncidents.map((incident) => (
                                    <tr key={incident.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-400">{incident.id}</td>
                                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                            {getIcon(incident.type)} {incident.type}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{incident.location}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${incident.confidence}%` }}></div>
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">{incident.confidence}% Match</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <SeverityBadge level={incident.severity} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={incident.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/incident/${incident.id}`} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="View Details">
                                                    <Eye size={18} />
                                                </Link>
                                                <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors" title="Assign">
                                                    <UserPlus size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredIncidents.length === 0 && (
                            <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                                No incidents found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

const getIcon = (type) => {
    if (type.includes('Pothole')) return '🚗';
    if (type.includes('Garbage')) return '🗑️';
    if (type.includes('Fire')) return '🔥';
    if (type.includes('Light')) return '💡';
    return '⚠️';
};

const SeverityBadge = ({ level }) => {
    const colors = {
        'Critical': 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20',
        'High': 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20',
        'Medium': 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20',
        'Low': 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[level] || colors['Low']}`}>
            {level}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        'Pending': 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700',
        'Verified': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
        'In Progress': 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10',
        'Resolved': 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10',
    };
    return (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${styles[status]}`}>
            {status}
        </span>
    );
};

export default AdminIncidents;
