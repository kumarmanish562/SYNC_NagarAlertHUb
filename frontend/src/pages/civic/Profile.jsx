import React from 'react';
import { User, Mail, Phone, MapPin, Edit2, LogOut, Settings as SettingsIcon, Shield, ChevronRight, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CivicLayout from './CivicLayout';

const Profile = () => {
    const navigate = useNavigate();

    return (
        <CivicLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Profile Card */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center text-center relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute top-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                        <div className="relative w-32 h-32 mb-4">
                            <div className="w-32 h-32 rounded-full border-4 border-white dark:border-slate-900 shadow-lg bg-slate-200 overflow-hidden relative z-10">
                                <img src="https://ui-avatars.com/api/?name=Rahul+Kumar&background=0D8ABC&color=fff&size=128" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-1 right-1 z-20 bg-slate-900 dark:bg-slate-700 text-white p-2 rounded-full border-2 border-white dark:border-slate-900 hover:bg-black dark:hover:bg-slate-600 transition-colors">
                                <Edit2 size={14} />
                            </button>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Rahul Kumar</h1>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-700">
                            Citizen Level 3 • Sector 4
                        </p>

                        <div className="grid grid-cols-3 gap-2 w-full mb-6">
                            <StatBox label="Reports" value="12" />
                            <StatBox label="Points" value="980" highlighted />
                            <StatBox label="Rank" value="#3" />
                        </div>

                        <button className="w-full py-3 bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white rounded-xl font-bold transition-colors">
                            Edit Public Profile
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Account</h3>
                        <div className="space-y-1">
                            <ActionRow icon={<Shield size={18} />} label="Privacy & Security" />
                            <ActionRow icon={<SettingsIcon size={18} />} label="Preferences" />
                            <ActionRow icon={<BarChart size={18} />} label="Data Usage" />
                        </div>
                        <div className="border-t border-slate-50 dark:border-slate-800 my-4"></div>
                        <button className="w-full py-3 text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl flex items-center justify-center gap-2 transition-colors">
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </div>

                {/* Right Col: Details Board */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h2>
                            <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">Update</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCard icon={<Mail className="text-blue-500" />} label="Email Address" value="rahul.k@example.com" verified />
                            <InfoCard icon={<Phone className="text-green-500" />} label="Phone Number" value="+91 98765 43210" verified />
                            <InfoCard icon={<MapPin className="text-indigo-500" />} label="Home Address" value="H.No 123, Sector 4, Main Road, Nagar City, 560001" fullWidth />
                            <div className="col-span-full bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white dark:bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-sm border border-slate-100 dark:border-slate-700">
                                    ID
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-slate-400 uppercase">Government ID Linked</div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Aadhaar •••• 4321</div>
                                </div>
                                <span className="text-green-600 dark:text-green-400 font-bold text-xs bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">Verified</span>
                            </div>
                        </div>
                    </div>

                    {/* Achievements / Badges Mockup */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold mb-1">Your Achievements</h3>
                                <p className="text-slate-400 text-sm">You have earned 4/12 badges this month.</p>
                            </div>
                            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">View All</button>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <BadgeBox icon="🌟" name="First Report" />
                            <BadgeBox icon="🛣️" name="Pothole Pro" />
                            <BadgeBox icon="⚡" name="Quick Snap" />
                            <BadgeBox icon="🔒" name="Verified" />
                        </div>

                        {/* Decor */}
                        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
                    </div>

                </div>

            </div>
        </CivicLayout>
    );
};

const StatBox = ({ label, value, highlighted }) => (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${highlighted ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900' : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>
        <div className="font-bold text-xl leading-none mb-1">{value}</div>
        <div className={`text-[10px] font-bold uppercase tracking-wider ${highlighted ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>{label}</div>
    </div>
);

const InfoCard = ({ icon, label, value, verified, fullWidth }) => (
    <div className={`p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 ${fullWidth ? 'col-span-full md:col-span-2' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors`}>
        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center shrink-0">
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="flex-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                {label} {verified && <CheckCircle size={12} className="text-green-500 fill-current bg-white dark:bg-slate-900 rounded-full" />}
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-sm leading-snug break-words">{value}</div>
        </div>
    </div>
);

const ActionRow = ({ icon, label }) => (
    <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors text-left group">
        <div className="flex items-center gap-3">
            <div className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{icon}</div>
            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{label}</span>
        </div>
        <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
    </button>
);

const BadgeBox = ({ icon, name }) => (
    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-white/10 transition-colors cursor-pointer">
        <div className="text-xl">{icon}</div>
        <div className="text-[9px] font-bold text-slate-300 uppercase tracking-tight">{name}</div>
    </div>
);

// Helper for InfoCard verification check mark
const CheckCircle = ({ size, className }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default Profile;
