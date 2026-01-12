import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, MapPin, AlertTriangle, CheckCircle, Sparkles, Plus, Search, Maximize2, X, Send, ThumbsDown, CheckSquare } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../../mapsConfig';

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const defaultCenter = {
    lat: 22.5726,
    lng: 88.3639
};

const libraries = ['places'];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        open: 0,
        highSeverity: 0,
        aiFlagged: 0,
        resolved: 0
    });
    const [recentReports, setRecentReports] = useState([]);
    const [selectedIncident, setSelectedIncident] = useState(null);
    const [map, setMap] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries
    });

    const onLoad = React.useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Fetch Real-Time Data
    useEffect(() => {
        const db = getDatabase();
        const reportsRef = ref(db, 'reports');

        const unsubscribe = onValue(reportsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const reportsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                })).reverse(); // Newest first

                // Calculate Stats
                let open = 0;
                let high = 0;
                let flagged = 0;
                let resolved = 0;

                reportsArray.forEach(report => {
                    if (report.status === 'Open') open++;
                    if (report.status === 'Resolved') resolved++;
                    if (report.aiVerified && report.status !== 'Resolved') flagged++;
                    // Simple severity logic (or use real field if exists)
                    if (report.category === 'pothole' || report.category === 'fire') high++;
                });

                setStats({
                    open,
                    highSeverity: high,
                    aiFlagged: flagged,
                    resolved
                });

                setRecentReports(reportsArray.slice(0, 5)); // Top 5
                if (reportsArray.length > 0 && !selectedIncident) {
                    setSelectedIncident(reportsArray[0]);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    // Fit Bounds when reports change
    useEffect(() => {
        if (map && recentReports.length > 0 && window.google) {
            const bounds = new window.google.maps.LatLngBounds();
            let hasPoints = false;
            recentReports.forEach(report => {
                if (report.location && report.location.lat && report.location.lng) {
                    bounds.extend({ lat: report.location.lat, lng: report.location.lng });
                    hasPoints = true;
                }
            });
            if (hasPoints) {
                map.fitBounds(bounds);
            }
        }
    }, [map, recentReports]);

    const handleStatusUpdate = async (status) => {
        if (!selectedIncident) return;
        const db = getDatabase();
        const updateRef = ref(db, `reports/${selectedIncident.id}`);
        try {
            await update(updateRef, { status: status });
            // Optimistic update
            setSelectedIncident(prev => ({ ...prev, status: status }));
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <AdminLayout>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    label="Open Incidents"
                    value={stats.open}
                    sub="Real-time"
                    subColor="text-red-500"
                    icon={<AlertTriangle size={20} className="text-orange-500" />}
                />
                <StatCard
                    label="High Severity"
                    value={stats.highSeverity}
                    sub="Critical Issues"
                    subColor="text-red-500"
                    icon={<div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">!</div>}
                />
                <StatCard
                    label="AI Flagged"
                    value={stats.aiFlagged}
                    sub="Needs Verification"
                    subColor="text-blue-500"
                    icon={<Sparkles size={20} className="text-blue-500" />}
                />
                <StatCard
                    label="Total Reports"
                    value={stats.open + stats.resolved}
                    sub="All Time"
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
                        <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden rounded-b-lg">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={defaultCenter}
                                    zoom={12}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                    options={{
                                        disableDefaultUI: false,
                                        zoomControl: true,
                                        styles: [
                                            {
                                                "backgroundColor": "#f5f5f5" // Simple light style
                                            }
                                        ]
                                    }}
                                >
                                    {recentReports.map((report) => (
                                        report.location && report.location.lat && (
                                            <Marker
                                                key={report.id}
                                                position={{ lat: report.location.lat, lng: report.location.lng }}
                                                onClick={() => setSelectedIncident(report)}
                                            />
                                        )
                                    ))}
                                </GoogleMap>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">Loading Map...</div>
                            )}
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
                                        <th className="px-6 py-3">Insight</th>
                                        <th className="px-6 py-3">Severity</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                    {recentReports.map(report => (
                                        <TableRow
                                            key={report.id}
                                            id={`#${report.id.slice(-4)}`}
                                            address={report.address || "Location N/A"}
                                            img={report.imageUrl}
                                            insight={report.category || "General"}
                                            confidence={report.aiConfidence || 0}
                                            severity={report.severity || "Medium"}
                                            status={report.status || "Open"}
                                            onClick={() => setSelectedIncident(report)}
                                        />
                                    ))}
                                    {recentReports.length === 0 && (
                                        <tr><td colSpan="5" className="text-center py-4 text-slate-500">No reports found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Right Column (1/3 width) - Verification Panel */}
                {selectedIncident ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm dark:shadow-none border border-slate-200 dark:border-slate-700/50 p-6 flex flex-col h-full transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Verification Panel</div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">#{selectedIncident.id.slice(-6)}</h2>
                            </div>
                            <span className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> High Priority
                            </span>
                        </div>

                        {/* Image Area */}
                        <div className="relative rounded-xl overflow-hidden mb-6 group cursor-pointer bg-slate-100 dark:bg-slate-900">
                            <img
                                src={selectedIncident.imageUrl || "https://via.placeholder.com/400"}
                                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                                alt="Incident Evidence"
                            />
                        </div>

                        {/* AI Analysis Box */}
                        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-500/20 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                                <span className="font-bold text-blue-900 dark:text-blue-100 text-sm">Gemini AI Analysis</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {selectedIncident.aiAnalysis ||
                                    (selectedIncident.aiVerified ?
                                        `Verified as ${selectedIncident.category || 'High Priority Issue'} with ${selectedIncident.aiConfidence || 'high'}% confidence.` :
                                        "No AI analysis available for this report.")}
                            </p>
                        </div>

                        {/* User Description */}
                        <div className="mb-6">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">User Description</div>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-sm text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700/50">
                                "{selectedIncident.description && selectedIncident.description !== selectedIncident.aiAnalysis ? selectedIncident.description : "No additional user description provided."}"
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-auto space-y-3">
                            {selectedIncident.status === 'Pending' || selectedIncident.status === 'Open' ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleStatusUpdate('Rejected')}
                                        className="py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <X size={18} className="text-slate-400 dark:text-slate-300" /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate('Accepted')}
                                        className="py-3 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                                    >
                                        <CheckSquare size={18} /> Accept
                                    </button>
                                </div>
                            ) : selectedIncident.status === 'Accepted' || selectedIncident.status === 'Verified' || selectedIncident.status === 'In Progress' || selectedIncident.status === 'Resolved' ? (
                                <div className="space-y-3">
                                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-500/20 rounded-xl text-center">
                                        <div className="text-green-600 dark:text-green-400 font-bold flex items-center justify-center gap-2">
                                            <CheckCircle size={20} /> Report Verified
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/admin/broadcast')}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                                    >
                                        <Send size={18} /> Broadcast Alert
                                    </button>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-500/20 rounded-xl text-center">
                                    <div className="text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2">
                                        <X size={20} /> Report Rejected
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center text-slate-500">Select an incident to view details</div>
                )}
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

const TableRow = ({ id, address, img, insight, confidence, severity, status, onClick }) => {
    return (
        <tr onClick={onClick} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer border-b border-transparent">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <img src={img} className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-700" alt="" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">{id}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[150px]">{address}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="w-40">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        <Sparkles size={12} className="text-blue-500" /> {insight}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400">
                    {severity}
                </span>
            </td>
            <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded border text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20">
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 hover:text-slate-600">
                    <MoreVertical size={16} />
                </button>
            </td>
        </tr>
    );
}

export default AdminDashboard;
