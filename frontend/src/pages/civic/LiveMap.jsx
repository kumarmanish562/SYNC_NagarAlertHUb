import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CivicLayout from './CivicLayout';

const LiveMap = () => {
    const [selectedPin, setSelectedPin] = useState(null);
    const navigate = useNavigate();

    const pins = [
        { id: 1, lat: 40, lng: 50, type: 'Pothole', status: 'Pending', severity: 'High' },
        { id: 2, lat: 60, lng: 70, type: 'Garbage', status: 'Resolved', severity: 'Low' },
    ];

    return (
        <CivicLayout noPadding>
            <div className="relative h-full w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover opacity-60 grayscale"></div>

                {/* Map Controls */}
                <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-10">
                    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-2xl shadow-sm pointer-events-auto border border-white/20">
                        <h2 className="font-bold text-slate-900 dark:text-white">Sector 4</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">2 Issues Active</p>
                    </div>
                </div>

                {/* Pins */}
                {pins.map(pin => (
                    <button key={pin.id} onClick={() => setSelectedPin(pin)} className="absolute w-8 h-8 -ml-4 -mt-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white z-10 hover:scale-110 transition-transform" style={{ top: `${pin.lat}%`, left: `${pin.lng}%` }}>
                        <MapPin size={16} />
                    </button>
                ))}

                {/* Bottom Sheet */}
                {selectedPin && (
                    <div className="absolute bottom-6 left-6 right-6 bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-2xl z-20 animate-in slide-in-from-bottom flex gap-4 items-center border border-slate-100 dark:border-slate-800">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-2xl">🚧</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-slate-900 dark:text-white">{selectedPin.type}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Status: {selectedPin.status}</p>
                        </div>
                        <button onClick={() => navigate(`/civic/report/${selectedPin.id}`)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">Details</button>
                        <button onClick={() => setSelectedPin(null)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"><X size={16} /></button>
                    </div>
                )}
            </div>
        </CivicLayout>
    );
};

export default LiveMap;