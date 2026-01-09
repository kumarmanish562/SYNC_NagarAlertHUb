import React, { useState } from 'react';
import { Save, User, Key, Server, Plus, Trash2, CheckCircle, RotateCw } from 'lucide-react';
import AdminLayout from './AdminLayout';

const Settings = () => {
    const [success, setSuccess] = useState('');

    const handleSave = () => {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-8 pb-20">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400">Manage configuration, API keys and zone definitions.</p>
                    </div>
                    {success && (
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 animate-bounce border border-green-200 dark:border-green-800">
                            <CheckCircle size={16} /> {success}
                        </div>
                    )}
                </div>

                {/* Profile Section */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <User size={20} className="text-blue-500" /> Admin Profile
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
                            <input type="text" defaultValue="Admin User" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Official Email</label>
                            <input type="email" defaultValue="admin@nagar.gov.in" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900 dark:text-gray-400" disabled />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">Change Password</button>
                    </div>
                </div>

                {/* API Configuration */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <Key size={20} className="text-yellow-500" /> API Connections
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Green-API Instance ID (WhatsApp)</label>
                            <input type="text" placeholder="1101XXXXX" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-yellow-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Green-API Access Token</label>
                            <input type="password" placeholder="••••••••••••••••" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-yellow-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-700"></div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Google Gemini AI Key</label>
                            <input type="password" placeholder="AIwaSy...................." className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-yellow-500 outline-none text-slate-900 dark:text-white" />
                        </div>
                        <div className="flex justify-end pt-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-sm transition-colors">
                                <RotateCw size={14} /> Test Connections
                            </button>
                        </div>
                    </div>
                </div>

                {/* Zone Management */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                        <MapSettingsIcon /> Zone Management
                    </h2>
                    <div className="space-y-3">
                        {['Sector 4', 'Civil Lines', 'Old City', 'Industrial Area'].map((zone, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{zone}</span>
                                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 dark:text-slate-500 font-bold hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all flex items-center justify-center gap-2">
                            <Plus size={18} /> Add New Zone
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="fixed bottom-6 right-6 md:static md:flex md:justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-full md:rounded-xl shadow-xl hover:bg-slate-800 dark:hover:bg-blue-500 font-bold flex items-center gap-2 transform active:scale-95 transition-all outline-none focus:ring-4 focus:ring-blue-500/30"
                    >
                        <Save size={20} /> Save Changes
                    </button>
                </div>

            </div>
        </AdminLayout>
    );
};

const MapSettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
);

export default Settings;
