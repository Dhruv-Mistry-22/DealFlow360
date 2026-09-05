import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ChevronLeft, ChevronRight, RotateCw, Share, Plus, CheckCircle2 } from 'lucide-react';

export default function TugaLoginScreen() {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [stitchEffect, setStitchEffect] = useState(false);
  const [activeDot, setActiveDot] = useState(2);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast('⚠️ Please fill in all required fields');
      return;
    }
    showToast(authMode === 'login' ? `🎉 Welcome back, ${username}!` : `🎉 Account created for ${username}!`);
  };

  return (
    <div className="w-full flex flex-col items-center py-4">
      {/* Outer macOS Safari Browser Window Frame */}
      <div className={`w-full max-w-[860px] bg-white rounded-[24px] shadow-2xl overflow-hidden border transition-all duration-300 ${
        stitchEffect ? 'border-dashed border-2 border-slate-400' : 'border-slate-300/90'
      }`}>
        
        {/* Safari Top Window Bar */}
        <div className="h-11 bg-white border-b border-slate-200/90 px-4 flex items-center justify-between select-none">
          {/* Window Control Dots */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] inline-block cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] inline-block cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] inline-block cursor-pointer"></span>
            
            {/* Nav icons */}
            <div className="hidden sm:flex items-center gap-3 ml-3 text-slate-400">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="3" strokeWidth="1.6"/>
                <line x1="9" y1="4" x2="9" y2="20" strokeWidth="1.6"/>
              </svg>
              <ChevronLeft className="w-4 h-4 text-slate-400 hover:text-slate-700 cursor-pointer" />
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Centered URL Address Bar */}
          <div className="flex items-center justify-center bg-white border border-slate-200 rounded-lg px-4 py-1 text-[11px] text-slate-700 gap-1.5 shadow-2xs max-w-[340px] w-full mx-2">
            <Lock className="w-3 h-3 text-slate-700 shrink-0" />
            <span className="truncate font-medium text-slate-800">https://Tugas-task-management.com</span>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 text-slate-400">
            <RotateCw className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer hidden sm:block" />
            <Share className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer hidden sm:block" />
            <Plus className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer" />
            <div className="w-3.5 h-3.5 border border-slate-400 rounded-xs flex items-center justify-center text-[8px] font-bold text-slate-500 hidden sm:flex cursor-pointer">
              1
            </div>
          </div>
        </div>

        {/* 2-Column Content Layout */}
        <div className="p-8 sm:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center bg-white">
          
          {/* LEFT COLUMN: Login / Sign Up Form */}
          <div className="md:col-span-6 flex flex-col justify-center">
            
            {/* Top Switcher: Segmented Pill Switch for Login vs Sign Up */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 max-w-[200px] mb-5">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Headline */}
            <h1 className="text-[34px] sm:text-[38px] font-bold text-[#111827] tracking-tight leading-none">
              {authMode === 'login' ? 'Welcome back!' : 'Get started!'}
            </h1>
            
            {/* Subtitle */}
            <p className="text-[13px] text-[#6B7280] mt-3 leading-relaxed max-w-sm">
              {authMode === 'login' 
                ? "Simplify your workflow and boost your productivity with Tuga's App. Get started for free."
                : "Join thousands of teams organizing their work seamlessly with Tuga's App."}
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-7 space-y-3.5">
              {/* Username Pill Input */}
              <div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username" 
                  className="w-full h-12 px-6 text-sm text-[#111827] placeholder-[#9CA3AF] bg-white border border-[#D1D5DB] rounded-full focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
                />
              </div>

              {/* Email (Shown in Sign Up mode) */}
              {authMode === 'signup' && (
                <div className="animate-in fade-in duration-200">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className="w-full h-12 px-6 text-sm text-[#111827] placeholder-[#9CA3AF] bg-white border border-[#D1D5DB] rounded-full focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
                  />
                </div>
              )}

              {/* Password Pill Input with Eye Slash Toggle */}
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" 
                  className="w-full h-12 px-6 pr-12 text-sm text-[#111827] placeholder-[#9CA3AF] bg-white border border-[#D1D5DB] rounded-full focus:outline-none focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#4B5563] focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>

              {/* Switch Row: iOS-Style 'Remember me' Toggle Switch + Forgot Password */}
              <div className="flex items-center justify-between pt-1 px-1">
                {/* Sleek Toggle Switch */}
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div 
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer ${
                      rememberMe ? 'bg-black' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      rememberMe ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </div>
                  <span className="text-xs text-[#4B5563] font-medium">Remember me</span>
                </label>

                {/* Forgot Password */}
                {authMode === 'login' && (
                  <button 
                    type="button"
                    onClick={() => showToast('🔑 Password reset instructions sent.')}
                    className="text-[12px] text-[#374151] hover:text-black font-normal hover:underline transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>

              {/* Solid Black Pill Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full h-12 bg-black hover:bg-[#1E293B] active:scale-[0.99] text-white text-sm font-semibold rounded-full shadow-xs transition-all duration-150 flex items-center justify-center cursor-pointer"
                >
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E5E7EB]"></div></div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[12px] text-[#9CA3AF] font-normal">or continue with</span>
              </div>
            </div>

            {/* 3 Solid Black Circle Social Buttons */}
            <div className="flex justify-center items-center gap-4">
              <button 
                onClick={() => showToast('Connecting to Google...')}
                className="w-11 h-11 rounded-full bg-black hover:bg-[#27272A] text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887C18.2 16.14 15.645 18.2 12.24 18.2c-3.417 0-6.188-2.771-6.188-6.2 0-3.429 2.771-6.2 6.188-6.2 1.543 0 2.943.567 4.029 1.5l2.426-2.426C17.215 3.514 14.88 2.6 12.24 2.6 7.046 2.6 2.84 6.806 2.84 12c0 5.194 4.206 9.4 9.4 9.4 4.966 0 8.8-3.497 8.8-8.943 0-.617-.057-1.183-.16-1.772H12.24z"/>
                </svg>
              </button>

              <button 
                onClick={() => showToast('Connecting to Apple ID...')}
                className="w-11 h-11 rounded-full bg-black hover:bg-[#27272A] text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.71-.94 2.73 1 .08 2.02-.48 2.64-1.23z"/>
                </svg>
              </button>

              <button 
                onClick={() => showToast('Connecting to Facebook...')}
                className="w-11 h-11 rounded-full bg-black hover:bg-[#27272A] text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>

            {/* Bottom Register / Login Toggle */}
            <div className="text-center mt-7 text-[13px] text-[#4B5563]">
              <span>{authMode === 'login' ? 'Not a member?' : 'Already have an account?'}</span>
              <button 
                type="button" 
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                className="font-semibold text-[#34A853] hover:text-[#2E7D32] hover:underline transition-colors ml-1 cursor-pointer"
              >
                {authMode === 'login' ? 'Register now' : 'Login now'}
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Pastel Mint Illustration Card with Stitched Border Option */}
          <div className={`md:col-span-6 bg-[#EDF8F1] rounded-[28px] p-6 sm:p-8 flex flex-col items-center justify-between min-h-[440px] relative overflow-hidden select-none transition-all ${
            stitchEffect ? 'border-2 border-dashed border-emerald-400' : 'border border-emerald-100/60'
          }`}>
            
            {/* Center Illustration */}
            <div className="w-full flex justify-center items-center py-3">
              <img 
                src="/Ui-refer/meditation-illustration.png" 
                alt="Meditation and Canva Task Illustration" 
                className="w-full max-w-[280px] h-auto object-contain pointer-events-none drop-shadow-xs"
              />
            </div>

            {/* Carousel Dots Indicator: 2 Grey dots + 1 Black pill */}
            <div className="flex items-center justify-center gap-1.5 my-2">
              <button 
                onClick={() => setActiveDot(0)} 
                className={`h-1.5 rounded-full transition-all cursor-pointer ${activeDot === 0 ? 'w-4 bg-black' : 'w-1.5 bg-[#D1D5DB]'}`}
              />
              <button 
                onClick={() => setActiveDot(1)} 
                className={`h-1.5 rounded-full transition-all cursor-pointer ${activeDot === 1 ? 'w-4 bg-black' : 'w-1.5 bg-[#D1D5DB]'}`}
              />
              <button 
                onClick={() => setActiveDot(2)} 
                className={`h-1.5 rounded-full transition-all cursor-pointer ${activeDot === 2 ? 'w-4 bg-black' : 'w-1.5 bg-[#D1D5DB]'}`}
              />
            </div>

            {/* Bottom Headline */}
            <div className="text-center px-4 pt-1 pb-2">
              <h3 className="text-base sm:text-[17px] font-bold text-[#111827] leading-snug">
                Make your work easier and organized<br />
                with <span className="text-[#111827]">Tuga's App</span>
              </h3>
            </div>

          </div>

        </div>

      </div>

      {/* Design Control Floating Pill (Allows toggling Stitched Border Effect on/off) */}
      <div className="mt-4 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 shadow-xs">
        <span className="text-xs text-slate-600 font-medium">Stitched Border Styling:</span>
        <button
          onClick={() => {
            setStitchEffect(!stitchEffect);
            showToast(stitchEffect ? 'Clean border enabled' : 'Stitched dashed border enabled');
          }}
          className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
            stitchEffect 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {stitchEffect ? '✓ Stitched Outline ON' : 'Turn Stitched Outline ON'}
        </button>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-xs font-medium px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}