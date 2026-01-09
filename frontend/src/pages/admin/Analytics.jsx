import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Download } from 'lucide-react';
import AdminLayout from './AdminLayout';

const Analytics = () => {
    const lineData = [
        { name: 'Jan 1', reports: 12 }, { name: 'Jan 2', reports: 19 }, { name: 'Jan 3', reports: 15 },
        { name: 'Jan 4', reports: 25 }, { name: 'Jan 5', reports: 32 }, { name: 'Jan 6', reports: 28 }, { name: 'Jan 7', reports: 40 },
    ];

    const pieData = [
        { name: 'Potholes', value: 400, color: '#f59e0b' },
        { name: 'Garbage', value: 300, color: '#3b82f6' },
        { name: 'Street Lights', value: 200, color: '#10b981' },
        { name: 'Other', value: 100, color: '#6366f1' },
    ];

    const barData = [
        { name: 'Sector 4', time: 12 },
        { name: 'Sector 9', time: 18 },
        { name: 'Old City', time: 45 },
        { name: 'Civil Lines', time: 8 },
    ];

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Report</h1>
                        <p className="text-slate-500 dark:text-slate-400">Performance metrics and city health data.</p>
                    </div>
                    <button className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Download size={18} /> Export PDF
                    </button>
                </div>

                {/* Top Row: Line and Pie */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Reports Trend */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Total Reports (Last 7 Days)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={lineData}>
                                    <defs>
                                        <linearGradient id="colorRpt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRpt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Category Split */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center">
                        <h3 className="font-bold text-slate-800 dark:text-white w-full mb-4">Issue Categories</h3>
                        <div className="w-full h-56 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Centered Stat */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">1000</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Total</div>
                            </div>
                        </div>
                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-3 w-full mt-4">
                            {pieData.map(item => (
                                <div key={item.name} className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Row: Bar and Heatmap Visual */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Resolution Time Bar Chart */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Avg Resolution Time (Hours)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="time" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Heatmap Visual (Placeholder) */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-6 relative z-10">Peak Incident Times</h3>

                        <div className="grid grid-cols-7 grid-rows-5 gap-1 h-64 relative z-10">
                            {Array.from({ length: 35 }).map((_, i) => {
                                // Randomize heat for visual effect
                                const heat = Math.random();
                                const color = heat > 0.8 ? 'bg-red-500' : heat > 0.5 ? 'bg-orange-400' : heat > 0.2 ? 'bg-blue-300' : 'bg-slate-100 dark:bg-slate-700';
                                return (
                                    <div key={i} className={`${color} rounded-sm opacity-80 hover:opacity-100 hover:scale-110 transition-all cursor-pointer`} title="Heatmap block"></div>
                                )
                            })}
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 font-bold mt-2 font-mono uppercase">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
};

export default Analytics;
