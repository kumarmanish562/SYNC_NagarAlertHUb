import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Landing Page/Navbar';
import Footer from '../Landing Page/Footer';
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile, updateEmail, updatePassword, sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from '../../firebaseConfig'; // Ensure this exports 'app' too if possible, or we get it from auth.app
import { ShieldCheck, Phone, Loader2, X, CheckCircle } from 'lucide-react';

export default function Signup() {
    const [userType, setUserType] = useState('citizen');

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        officialId: '',
        secretCode: ''
    });

    const [address, setAddress] = useState('');
    const [locationLoading, setLocationLoading] = useState(false);

    // Verification State
    const [showVerification, setShowVerification] = useState(false);
    const [mobileOtp, setMobileOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    // Check Config
    useEffect(() => {
        if (auth?.app?.options?.apiKey === "YOUR_API_KEY") {
            alert("⚠️ CRITICAL ERROR ⚠️\n\nYou MUST update 'src/firebaseConfig.js' with your actual Firebase API Key.");
        }
    }, []);

    // Recaptcha Setup
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible'
                });
            } catch (e) {
                console.error("Recaptcha Init Error:", e);
            }
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile Number is required';
        else if (!/^\d{10}$/.test(formData.mobile.replace(/\s/g, ''))) newErrors.mobile = 'Enter a valid 10-digit mobile number';
        if (!formData.email.trim()) newErrors.email = 'Email Address is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'min 6 chars';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        if (userType === 'admin') {
            if (!formData.department) newErrors.department = 'Required';
            if (!formData.officialId.trim()) newErrors.officialId = 'Required';
            if (!formData.secretCode.trim()) newErrors.secretCode = 'Secret Code Required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- PHASE 1: SUBMIT FORM -> SEND MOBILE OTP ---
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Client-side Admin Security Check (Simple)
        if (userType === 'admin' && formData.secretCode !== 'NAGAR_ADMIN_2025') {
            alert("Security Alert: Invalid Department Secret Code.");
            return;
        }

        setLoading(true);
        try {
            const formattedPhone = `+91${formData.mobile}`;
            const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            setShowVerification(true); // Open Verification Modal
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/billing-not-enabled') {
                alert("Firebase Error: SMS quota exceeded or billing not enabled. Use a TEST NUMBER for development.");
            } else if (err.code === 'auth/api-key-not-valid') {
                alert("Configuration Error: Firebase API Key is invalid.");
            } else {
                alert("Error sending OTP: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- PHASE 2: VERIFY MOBILE OTP -> SAVE DATA (SERVERLESS) ---
    const verifyAndCreateAccount = async () => {
        if (mobileOtp.length !== 6) return;
        setLoading(true);
        try {
            // 1. Verify OTP
            const result = await confirmationResult.confirm(mobileOtp);
            const user = result.user; // Firebase User

            // 2. Update Profile & Credentials
            await updateProfile(user, { displayName: `${formData.firstName} ${formData.lastName}` });

            // Note: updateEmail/Password on Phone Auth user links the credentials
            await updateEmail(user, formData.email);
            await updatePassword(user, formData.password);

            // 3. Save User Data to Realtime Database (Client Side)
            const db = getDatabase(auth.app);
            const userRef = ref(db, `users/${userType}s/${user.uid}`);

            await set(userRef, {
                uid: user.uid,
                firstName: formData.firstName,
                lastName: formData.lastName,
                mobile: formData.mobile,
                email: formData.email,
                role: userType,
                department: userType === 'admin' ? formData.department : null,
                officialId: userType === 'admin' ? formData.officialId : null,
                address: userType === 'citizen' ? address : null,
                emailVerified: false, // Will be true after they click the link
                createdAt: new Date().toISOString()
            });

            // 4. Send Verification Email
            await sendEmailVerification(user);

            alert(`Welcome, ${formData.firstName}! Account created successfully. Please check your email for a verification link.`);

            // 5. Navigate
            navigate(userType === 'citizen' ? '/civic/dashboard' : '/admin/dashboard');

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                alert("Account Created via Phone, but Email is already in use by another account.");
                navigate(userType === 'citizen' ? '/civic/dashboard' : '/admin/dashboard');
            } else {
                alert("Registration Failed: " + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLocation = () => {
        if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                    .then(r => r.json()).then(d => {
                        setAddress(d.display_name);
                        setLocationLoading(false);
                    })
                    .catch(() => setLocationLoading(false));
            },
            () => { alert('Location access denied'); setLocationLoading(false); }
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f172a] transition-colors duration-300">
            <Navbar />

            {/* --- VERIFICATION MODAL --- */}
            {showVerification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
                        <button
                            onClick={() => setShowVerification(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Verify Your Mobile</h3>
                            <p className="text-sm text-slate-500 mt-1">Enter the 6-digit code sent to +91 {formData.mobile}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-center mb-2">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                                    <Phone size={24} />
                                </div>
                            </div>
                            <input
                                type="text"
                                value={mobileOtp}
                                onChange={(e) => setMobileOtp(e.target.value)}
                                placeholder="------"
                                className="w-full text-center text-3xl font-bold tracking-[0.5em] py-3 border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                maxLength={6}
                            />
                            <button
                                onClick={verifyAndCreateAccount}
                                disabled={loading || mobileOtp.length !== 6}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Verify & Create <CheckCircle size={18} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow flex w-full overflow-hidden">
                {/* Visuals Left Side */}
                <div className="hidden lg:flex w-1/2 relative flex-col justify-start pt-32 px-12 pb-12 text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors">
                    <div className="absolute inset-0 z-0">
                        <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2144&auto=format&fit=crop" className="h-full w-full object-cover opacity-20 dark:opacity-40 mix-blend-overlay" alt="city" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 via-white/50 to-slate-200/50 dark:from-[#0f172a] dark:via-[#0f172a]/80 dark:to-slate-900/90"></div>
                    </div>
                    <div className="relative z-10 mb-8">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2"><span>नगर</span><span className="font-sans">Alert Hub</span></h2>
                        <h1 className="text-5xl font-bold leading-tight mb-4 text-slate-900 dark:text-white">Join the Movement<br /><span className="text-blue-600 dark:text-blue-400">For Better Cities.</span></h1>
                        <p className="text-slate-600 dark:text-gray-300 text-lg max-w-md">Sign up today to help your local administration build a cleaner city.</p>
                    </div>
                </div>

                {/* Signup Form Right Side */}
                <div className="w-full lg:w-1/2 flex flex-col relative px-6 py-12 lg:p-24 justify-center bg-white dark:bg-[#0f172a] h-full overflow-y-auto transition-colors">
                    <div className="max-w-[440px] w-full mx-auto mt-10 lg:mt-0">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1 flex justify-center items-center gap-2"><span>नगर</span><span>Alert Hub</span></h2>
                            <p className="text-slate-500 dark:text-gray-400 text-sm">Join as a {userType === 'citizen' ? 'Citizen' : 'Official'}</p>
                        </div>

                        {/* User Type Tabs */}
                        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl mb-8 border border-slate-200 dark:border-slate-700/50">
                            {['citizen', 'admin'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setUserType(type)}
                                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${userType === type ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                    {type === 'citizen' ? 'Citizen Portal' : 'Admin/Official'}
                                </button>
                            ))}
                        </div>

                        {/* Main Form */}
                        <form className="space-y-4" onSubmit={handleSignup}>
                            <div className="flex gap-4">
                                <div className="w-1/2 space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" className={`block w-full px-4 py-3 border ${errors.firstName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white`} />
                                </div>
                                <div className="w-1/2 space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-700 dark:text-white border-r border-slate-200 dark:border-slate-700 pr-3 mr-2">+91</div>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="9876543210" maxLength={10} className={`block w-full pl-16 pr-3 py-3 border ${errors.mobile ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white`} />
                                </div>
                                {errors.mobile && <p className="text-xs text-red-500">{errors.mobile}</p>}
                            </div>

                            {userType === 'citizen' ? (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end"><label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Address</label><button type="button" onClick={handleLocation} disabled={locationLoading} className="text-xs text-blue-600 font-medium">{locationLoading ? "Locating..." : "Use Current Location"}</button></div>
                                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white" />
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-2"><label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Department</label><select name="department" value={formData.department} onChange={handleInputChange} className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white"><option value="">Select</option><option value="traffic">Traffic</option><option value="police">Police</option><option value="municipal">Municipal</option></select></div>
                                    <div className="space-y-2"><label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Official ID</label><input type="text" name="officialId" value={formData.officialId} onChange={handleInputChange} placeholder="ID" className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white" /></div>
                                    <div className="space-y-2"><label className="text-xs font-semibold text-red-500 uppercase tracking-wider">Secret Code</label><div className="relative"><ShieldCheck className="absolute left-3 top-3.5 text-red-400" size={18} /><input type="password" name="secretCode" value={formData.secretCode} onChange={handleInputChange} placeholder="Code" className="block w-full pl-10 pr-3 py-3 border border-red-200 dark:border-red-900 rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-white focus:ring-red-500" /></div>{errors.secretCode && <p className="text-xs text-red-500">{errors.secretCode}</p>}</div>
                                </>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white`} />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2 space-y-2"><label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Password</label><input type="password" name="password" value={formData.password} onChange={handleInputChange} className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white" /></div>
                                <div className="w-1/2 space-y-2"><label className="text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">Confirm</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} className="block w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 dark:text-white" /></div>
                            </div>

                            <div id="recaptcha-container"></div>

                            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-70 transition-all flex justify-center items-center gap-2">{loading ? <Loader2 className="animate-spin" /> : "Verify Mobile & SignUp"}</button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700/50 text-center"><p className="text-slate-500 dark:text-gray-400 text-sm">Already member? <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-500 ml-1">Login</Link></p></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
