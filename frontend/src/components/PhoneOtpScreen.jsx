import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PhoneOtpScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 382-9102');
  const [otp, setOtp] = useState(['4', '8', '2', '', '']);
  const [timeLeft, setTimeLeft] = useState(240);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 4) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleResend = (e) => {
    e.preventDefault();
    setTimeLeft(240);
    showToast('✓ New 5-digit verification code sent!');
  };

  const handleNext = () => {
    const code = otp.join('');
    if (!phoneNumber.trim()) {
      showToast('⚠️ Please enter phone number');
      return;
    }
    if (code.length < 5) {
      showToast('⚠️ Please enter complete 5-digit code');
      return;
    }
    showToast('🎉 Login Verified! Welcome.');
  };

  return (
    <div className="w-full flex justify-center items-center py-4">
      {/* Mobile Card Container (1:1 with Login-signup.jpg) */}
      <div className="w-full max-w-[390px] bg-white rounded-[36px] shadow-2xl overflow-hidden border border-slate-200 p-7 flex flex-col justify-between relative transition-all duration-300">
        
        {/* Top Right: Sign Up Link */}
        <div className="w-full flex justify-end items-center pt-1 pb-1">
          <button 
            onClick={() => showToast('Opening registration...')}
            className="group flex items-center gap-1 text-[15px] font-semibold text-slate-900 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <span>Sign Up</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>
        </div>

        {/* Exact Hero Door Illustration Asset */}
        <div className="w-full flex justify-center items-center py-2">
          <img 
            src="/Ui-refer/door-illustration.png" 
            alt="Door Unlock Illustration" 
            className="w-56 h-auto object-contain pointer-events-none select-none"
          />
        </div>

        {/* Title Section */}
        <div className="text-center my-2">
          <h1 className="text-[26px] font-extrabold text-slate-950 tracking-wider">LOGIN</h1>
          <p className="text-[14px] font-normal text-slate-700 mt-0.5">
            {isEmailMode ? 'Login via work email.' : 'Login via phone number.'}
          </p>
        </div>

        {/* Phone / Email Input */}
        <div className="w-full my-2">
          <input 
            type={isEmailMode ? 'email' : 'tel'} 
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={isEmailMode ? 'Work email address' : 'Phone number'} 
            className="w-full h-[52px] px-6 text-[15px] text-slate-900 placeholder-slate-400 bg-white border border-slate-700 rounded-full focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 transition-all"
          />
        </div>

        {/* OTP Inputs */}
        <div className="w-full my-2">
          <div className="flex justify-between items-center gap-2">
            {otp.map((digit, idx) => (
              <input 
                key={idx}
                ref={inputRefs[idx]}
                type="text" 
                maxLength="1" 
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-bold text-slate-900 border border-slate-700 rounded-[20px] bg-white focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:border-slate-950 transition-all" 
              />
            ))}
          </div>
          
          {/* Countdown & Resend */}
          <div className="flex justify-between items-center px-1 mt-2 text-[13px] text-slate-600 font-medium">
            <span>{timeLeft}s</span>
            <button 
              onClick={handleResend}
              className="text-slate-600 hover:text-slate-950 transition-colors font-semibold cursor-pointer"
            >
              Resend
            </button>
          </div>
        </div>

        {/* Pine-Teal Charcoal Next Button (#2E4247) */}
        <div className="w-full flex justify-center my-3">
          <button 
            onClick={handleNext}
            className="w-[140px] h-[46px] bg-[#2E4247] hover:bg-[#233539] active:scale-95 text-white font-semibold text-[15px] rounded-2xl shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer"
          >
            Next
          </button>
        </div>

        {/* Social Auth Circles */}
        <div className="w-full flex justify-center items-center gap-5 my-2">
          <button 
            onClick={() => showToast('Google authentication')}
            className="w-[46px] h-[46px] rounded-full border border-slate-900 flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#000000" d="M12.24 10.285V13.4h6.887C18.2 16.14 15.645 18.2 12.24 18.2c-3.417 0-6.188-2.771-6.188-6.2 0-3.429 2.771-6.2 6.188-6.2 1.543 0 2.943.567 4.029 1.5l2.426-2.426C17.215 3.514 14.88 2.6 12.24 2.6 7.046 2.6 2.84 6.806 2.84 12c0 5.194 4.206 9.4 9.4 9.4 4.966 0 8.8-3.497 8.8-8.943 0-.617-.057-1.183-.16-1.772H12.24z"/>
            </svg>
          </button>

          <button 
            onClick={() => showToast('Apple ID authentication')}
            className="w-[46px] h-[46px] rounded-full border border-slate-900 flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.94 2.73 1 .08 2.02-.48 2.64-1.23z"/>
            </svg>
          </button>
        </div>

        {/* Email Mode Toggle */}
        <div className="text-center pt-2 pb-1">
          <button 
            onClick={() => {
              setIsEmailMode(!isEmailMode);
              setPhoneNumber(isEmailMode ? '+1 (555) 382-9102' : 'alex@dealflow360.com');
              showToast(isEmailMode ? 'Switched to Phone Login' : 'Switched to Work Email');
            }}
            className="text-[14px] font-semibold text-slate-900 hover:text-slate-700 hover:underline transition-all cursor-pointer"
          >
            {isEmailMode ? 'Continue with Phone number.' : 'Continue with Email.'}
          </button>
        </div>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}