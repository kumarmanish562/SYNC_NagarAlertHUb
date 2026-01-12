import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Filter, Layers, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { getDatabase, ref, onValue } from 'firebase/database';
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

const LiveMap = () => {
    const [selectedPin, setSelectedPin] = useState(null);
    const [filter, setFilter] = useState('All');
    const [reports, setReports] = useState([]);
    const [map, setMap] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
        libraries
    });

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Fetch Reports
    useEffect(() => {
        const db = getDatabase();
        const reportsRef = ref(db, 'reports');
        onValue(reportsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const reportsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                    // Normalize severity/status for filters if needed
                    severity: data[key].severity || (data[key].category === 'pothole' ? 'High' : 'Medium'),
                    type: data[key].category ? data[key].category.charAt(0).toUpperCase() + data[key].category.slice(1) : 'Incident'
                }));
                setReports(reportsArray);
            }
        });
    }, []);

    // Fit Bounds
    useEffect(() => {
        if (map && reports.length > 0 && window.google) {
            const bounds = new window.google.maps.LatLngBounds();
            let hasPoints = false;
            reports.forEach(report => {
                if (report.location && report.location.lat && report.location.lng) {
                    bounds.extend({ lat: report.location.lat, lng: report.location.lng });
                    hasPoints = true;
                }
            });
            if (hasPoints) {
                map.fitBounds(bounds);
            }
        }
    }, [map, reports]);


    const filteredMarkers = filter === 'All' ? reports : reports.filter(m => m.severity === filter);

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
                </div>

                {/* Map Area */}
                <div className="flex-1 relative bg-[#e5e7eb] dark:bg-slate-900 overflow-hidden" onClick={() => setSelectedPin(null)}>
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
                                        "backgroundColor": "#f5f5f5"
                                    }
                                ]
                            }}
                        >
                            {filteredMarkers.map((marker) => (
                                marker.location && marker.location.lat && (
                                    <Marker
                                        key={marker.id}
                                        position={{ lat: marker.location.lat, lng: marker.location.lng }}
                                        onClick={(e) => {
                                            // e.domEvent.stopPropagation(); // Not needed for Google Marker
                                            setSelectedPin(marker);
                                        }}
                                    />
                                )
                            ))}
                        </GoogleMap>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">Loading Real-Time Map...</div>
                    )}
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
                                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-300 font-normal">#{selectedPin.id.slice(-4)}</span>
                                </h3>
                                <button onClick={() => setSelectedPin(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="flex gap-2 mb-4">
                                <Badge label={selectedPin.severity} color={selectedPin.severity === 'Critical' ? 'red' : 'orange'} />
                                <Badge label={selectedPin.status || 'Open'} color={selectedPin.status === 'Resolved' ? 'green' : 'blue'} />
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                                {selectedPin.location?.address || 'Location coordinates available.'}
                            </p>

                            <Link
                                to={`/admin`}
                                className="block w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-center rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                            >
                                View in Dashboard
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </AdminLayout>
    );
};

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
