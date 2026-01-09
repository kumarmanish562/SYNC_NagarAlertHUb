import React, { useState } from 'react';
import { MapPin, Filter, Layers, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';

const LiveMap = () => {
    const [selectedPin, setSelectedPin] = useState(null);
    const [filter, setFilter] = useState('All');

    // Mock Map Markers
    const markers = [
        { id: '1001', type: 'Pothole', lat: '40%', lng: '30%', status: 'Pending', severity: 'High' },
        { id: '1002', type: 'Garbage', lat: '60%', lng: '55%', status: 'Verified', severity: 'Medium' },
        { id: '1003', type: 'Fire', lat: '25%', lng: '65%', status: 'Pending', severity: 'Critical' },
        { id: '1004', type: 'Water', lat: '50%', lng: '20%', status: 'Resolved', severity: 'Low' },
        { id: '1005', type: 'Light', lat: '75%', lng: '80%', status: 'Pending', severity: 'Low' },
    ];

    const filteredMarkers = filter === 'All' ? markers : markers.filter(m => m.severity === filter);

    return (
        <AdminLayout noPadding={true}>
            <div className="h-full flex flex-col relative overflow-hidden bg-slate-100 dark:bg-slate-900">

                {/* Map Controls */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-colors">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Filter Severity</h3>
                        <div className="flex flex-col gap-1">
                            {['All', 'Critical', 'High', 'Medium', 'Low'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-md text-left transition-colors ${filter === f ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" title="Layers">
                        <Layers size={20} />
                    </button>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative bg-[#e5e7eb] dark:bg-slate-900 overflow-hidden" onClick={() => setSelectedPin(null)}>
                    {/* Fake Map Background */}
                    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover opacity-20 grayscale hover:grayscale-0 transition-all duration-1000 invert-0 dark:invert"></div>
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '100px 100px', opacity: 0.1 }}></div>

                    {/* Markers */}
                    {filteredMarkers.map((marker) => (
                        <div
                            key={marker.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                            style={{ top: marker.lat, left: marker.lng }}
                            onClick={(e) => { e.stopPropagation(); setSelectedPin(marker); }}
                        >
                            {/* Pulse Effect for Critical/High */}
                            {(marker.severity === 'Critical' || marker.severity === 'High') && (
                                <div className={`absolute -inset-4 rounded-full opacity-50 animate-ping ${marker.severity === 'Critical' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                            )}

                            <div className={`
                    w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110
                    ${marker.status === 'Resolved' ? 'bg-green-500' : (
                                    marker.severity === 'Critical' ? 'bg-red-600' :
                                        marker.severity === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                                )
                                }`}>
                                {getMarkerIcon(marker.type)}
                            </div>

                            {/* Tooltip on Hover */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg">
                                {marker.type}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Overlay (Mocked as Bottom Card for now due to layout constraints) */}
                <div className="absolute top-4 right-4 z-10 w-64 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 max-h-[80%] overflow-y-auto hidden md:block transition-colors">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Active High Severity</h3>
                    <div className="space-y-3">
                        {markers.filter(m => m.severity === 'Critical' || m.severity === 'High').map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors" onClick={() => setSelectedPin(m)}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${m.severity === 'Critical' ? 'bg-red-500' : 'bg-orange-500'}`}>
                                    {getMarkerIcon(m.type)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-800 dark:text-white text-sm">{m.type}</div>
                                    <div className="text-[10px] text-slate-400">ID #{m.id}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Incident Pop-up Card */}
                <AnimatePresence>
                    {selectedPin && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-30 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                    {selectedPin.type}
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-300 font-normal">#{selectedPin.id}</span>
                                </h3>
                                <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <Badge label={selectedPin.severity} color={selectedPin.severity === 'Critical' ? 'red' : 'orange'} />
                                <Badge label={selectedPin.status} color={selectedPin.status === 'Resolved' ? 'green' : 'blue'} />
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                Location coordinates: {selectedPin.lat}, {selectedPin.lng}.
                                Verified by AI system 2 hours ago.
                            </p>

                            <Link
                                to={`/admin/incident/RPT-${selectedPin.id}`}
                                className="block w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                View Full Details
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </AdminLayout>
    );
};

const getMarkerIcon = (type) => {
    switch (type) {
        case 'Pothole': return '🚧';
        case 'Fire': return '🔥';
        case 'Water': return '💧';
        case 'Light': return '💡';
        default: return '⚠️';
    }
}

const Badge = ({ label, color }) => {
    const colors = {
        red: 'bg-red-50 text-red-600',
        orange: 'bg-orange-50 text-orange-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
    }
    return (
        <span className={`text-xs font-bold px-2 py-1 rounded ${colors[color] || colors.blue}`}>
            {label}
        </span>
    )
}

export default LiveMap;
