import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, CheckCircle, AlertTriangle, Trash2, Lightbulb, Droplets, X, Loader2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CivicLayout from './CivicLayout';

const ReportIssue = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [category, setCategory] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                simulateAIAnalysis();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateAIAnalysis = () => {
        setAnalyzing(true);
        setAiResult(null);
        setTimeout(() => {
            setAnalyzing(false);
            setAiResult({
                detected: 'Deep Pothole',
                confidence: '98%',
                severity: 'High',
                recommendation: 'Immediate Repair'
            });
            setCategory('pothole');
        }, 2500);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/civic/reports');
    };

    return (
        <CivicLayout>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Form Info */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Report an Incident</h1>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            Help us keep the city clean and safe. Upload a photo, and our AI will automatically categorize the issue for you.
                        </p>

                        {/* Location Preview Card */}
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                                    <MapPin size={20} className="text-blue-500" /> Detected Location
                                </div>
                                <button className="text-sm font-bold text-blue-600 hover:underline">Edit</button>
                            </div>
                            <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl relative overflow-hidden">
                                <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/2275px-Google_Maps_Logo_2020.svg.png')] bg-cover bg-center grayscale"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full ring-4 ring-blue-500/30 animate-pulse"></div>
                                </div>
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-600 border border-slate-200 shadow-sm">
                                    22.5726, 88.3639
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Category Grid */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Incident Category</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <CategoryCard id="pothole" icon={<AlertTriangle />} label="Pothole" selected={category === 'pothole'} onClick={() => setCategory('pothole')} />
                                    <CategoryCard id="garbage" icon={<Trash2 />} label="Garbage" selected={category === 'garbage'} onClick={() => setCategory('garbage')} />
                                    <CategoryCard id="light" icon={<Lightbulb />} label="Light" selected={category === 'light'} onClick={() => setCategory('light')} />
                                    <CategoryCard id="water" icon={<Droplets />} label="Water" selected={category === 'water'} onClick={() => setCategory('water')} />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Description (Optional)</label>
                                <textarea
                                    placeholder="Add any extra details here..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 text-slate-700 dark:text-slate-300"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={!selectedImage || analyzing}
                                className="w-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-300 disabled:cursor-not-allowed text-white dark:text-slate-900 font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                Submit Report <CheckCircle size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Upload Area */}
                <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Upload Evidence</h2>

                        <div className="flex-1 min-h-[400px]">
                            {!selectedImage ? (
                                <div className="relative group h-full">
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                    <div className="w-full h-full border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 group-hover:border-blue-400 dark:group-hover:border-blue-500/50 transition-all">
                                        <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                            <Upload size={32} />
                                        </div>
                                        <p className="font-bold text-lg text-slate-700 dark:text-slate-300">Drag & Drop or Click to Upload</p>
                                        <p className="text-slate-400 mt-2">Supports JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md group">
                                    <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedImage(null); setAiResult(null); }}
                                            className="bg-white/20 hover:bg-white/40 backdrop-blur rounded-full p-4 text-white transition"
                                        >
                                            <X size={32} />
                                        </button>
                                    </div>

                                    {/* AI Result Card Overlay */}
                                    <AnimatePresence>
                                        {(analyzing || aiResult) && (
                                            <motion.div
                                                initial={{ y: 100, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="absolute bottom-6 inset-x-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800"
                                            >
                                                {analyzing ? (
                                                    <div className="flex items-center gap-4">
                                                        <Loader2 size={24} className="animate-spin text-blue-600" />
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white">Gemini AI Analysis</div>
                                                            <div className="text-xs text-slate-500">Scanning image for hazards...</div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
                                                            <Lightbulb size={24} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="font-bold text-slate-900 dark:text-white border-l-4 border-purple-500 pl-3">{aiResult.detected}</h4>
                                                                <span className="bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 text-xs font-bold px-2 py-1 rounded uppercase">{aiResult.severity}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{aiResult.recommendation}</p>
                                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                                <div className="bg-purple-500 h-full w-[98%]"></div>
                                                            </div>
                                                            <div className="text-[10px] text-slate-400 text-right mt-1">AI Confidence: 98%</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CivicLayout>
    );
};

const CategoryCard = ({ id, icon, label, selected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 h-28 ${selected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-md transform scale-105' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-200 dark:hover:border-slate-600'}`}
    >
        <div className={`mb-2 ${selected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
            {React.cloneElement(icon, { size: 28 })}
        </div>
        <span className="text-sm font-bold">{label}</span>
    </button>
);

export default ReportIssue;
