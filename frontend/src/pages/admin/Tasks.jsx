import React from 'react';
import { Users, Truck, Clock, MoreVertical, Plus, CheckCircle, MapPin } from 'lucide-react';
import AdminLayout from './AdminLayout';

const Tasks = () => {
    const teams = [
        { id: 1, name: 'Road Repair - Unit A', status: 'Available', members: 4, location: 'Sector 4' },
        { id: 2, name: 'Clean City - Team 1', status: 'Busy', members: 6, location: 'Old City' },
        { id: 3, name: 'Electric Works - Zone 4', status: 'Available', members: 2, location: 'Sector 9' },
        { id: 4, name: 'Rapid Response - Fire', status: 'Standby', members: 10, location: 'HQ' },
    ];

    const tasks = [
        { id: 'T-101', title: 'Deep Pothole Repair', priority: 'High', area: 'Sector 4', time: '10 mins ago', assignee: 'Road Repair - Unit A' },
        { id: 'T-102', title: 'Garbage Collection', priority: 'Medium', area: 'Market Road', time: '30 mins ago', assignee: null },
        { id: 'T-103', title: 'Traffic Signal Fix', priority: 'Critical', area: 'Main Crossing', time: '1 hour ago', assignee: null },
    ];

    return (
        <AdminLayout>
            <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">

                {/* Sidebar: Workforce List */}
                <div className="w-full lg:w-80 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden transition-colors shrink-0">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h3 className="font-bold text-slate-800 dark:text-white">Active Teams</h3>
                        <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-400"><Plus size={18} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {teams.map(team => (
                            <div key={team.id} className="p-3 border border-slate-100 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-500 transition-colors bg-white dark:bg-slate-900 cursor-pointer group shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold text-sm text-slate-800 dark:text-gray-200">{team.name}</div>
                                    <div className={`w-2 h-2 rounded-full ${team.status === 'Available' ? 'bg-green-500' : team.status === 'Busy' ? 'bg-orange-500' : 'bg-slate-400'}`}></div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                    <div className="flex items-center gap-1"><Users size={12} /> {team.members} ppl</div>
                                    <div className="flex items-center gap-1"><MapPin size={12} /> {team.location}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main: Task Board */}
                <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Task Assignment Board</h1>
                        <div className="flex gap-2 text-sm">
                            <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300">Unassigned: 2</span>
                            <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-300">In Progress: 5</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto pb-10 pr-2 custom-scrollbar">
                        {/* Unassigned Column */}
                        <div className="flex flex-col gap-3">
                            <div className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-400"></div> Unassigned
                            </div>
                            {tasks.filter(t => !t.assignee).map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                            <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
                                Drag new tasks here
                            </div>
                        </div>

                        {/* In Progress Column */}
                        <div className="flex flex-col gap-3">
                            <div className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-400"></div> In Progress
                            </div>
                            {tasks.filter(t => t.assignee).map(task => (
                                <TaskCard key={task.id} task={task} assigned />
                            ))}
                        </div>

                        {/* Completed Column */}
                        <div className="flex flex-col gap-3">
                            <div className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-400"></div> Completed
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl opacity-60">
                                <div className="font-bold text-slate-800 dark:text-slate-300 line-through text-sm">Street Light #302</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fixed yesterday</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </AdminLayout>
    );
};

const TaskCard = ({ task, assigned }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-move group relative">
        <div className="flex justify-between items-start mb-2">
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 font-bold bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-transparent dark:border-slate-700">{task.id}</span>
            <button className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-200"><MoreVertical size={16} /></button>
        </div>
        <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{task.title}</h4>
        <div className="flex items-center gap-2 mb-3">
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${task.priority === 'Critical' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20' :
                task.priority === 'High' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-500/20' :
                    'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20'
                }`}>{task.priority}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock size={10} /> {task.time}
            </span>
        </div>

        {assigned ? (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-[10px] border border-blue-200 dark:border-blue-500/20">A</div>
                    {task.assignee}
                </div>
                <CheckCircle size={14} className="text-green-500" />
            </div>
        ) : (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400 text-center font-medium italic">
                Drag to assign team
            </div>
        )}
    </div>
);

export default Tasks;
