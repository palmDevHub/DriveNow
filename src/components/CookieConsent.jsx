import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Cookie, ShieldCheck, Settings, Check, X, Sliders, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsent = () => {
  const { t, isEn, language, showToast } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: true
  });

  // Check stored consent on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem('drivenow_cookie_consent');
    if (!savedConsent) {
      // Delay showing banner slightly for smooth entrance after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences({
          necessary: true,
          analytics: parsed.analytics ?? true,
          marketing: parsed.marketing ?? true
        });
      } catch (e) {}
    }
  }, []);

  // Listen for global open event (e.g. from Footer "Cookie Settings" button)
  useEffect(() => {
    const handleOpenSettings = () => {
      setShowModal(true);
      setIsOpen(false);
    };

    window.addEventListener('open_cookie_settings', handleOpenSettings);
    return () => window.removeEventListener('open_cookie_settings', handleOpenSettings);
  }, []);

  const saveConsent = (prefs) => {
    const consentData = {
      ...prefs,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('drivenow_cookie_consent', JSON.stringify(consentData));
    setPreferences(prefs);
    setIsOpen(false);
    setShowModal(false);

    showToast(
      language === 'en' ? 'Cookie preferences updated' : 'บันทึกการตั้งค่าคุกกี้เรียบร้อยแล้ว',
      'success'
    );
  };

  const handleAcceptAll = () => {
    saveConsent({ necessary: true, analytics: true, marketing: true });
  };

  const handleEssentialOnly = () => {
    saveConsent({ necessary: true, analytics: false, marketing: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  return (
    <>
      {/* 1. Floating Cookie Banner */}
      <AnimatePresence>
        {isOpen && !showModal && (
          <motion.div
            initial={{ y: 70, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 70, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xl z-50 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.7)] rounded-3xl p-5 sm:p-6 text-white"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shrink-0 shadow-lg shadow-amber-500/10">
                <Cookie className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight font-prompt">
                    {t.cookieTitle || 'นโยบายการใช้งานคุกกี้ (Cookie Policy)'}
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                    title={language === 'en' ? 'Close' : 'ปิด'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.cookieDesc || 'DriveNow มีการใช้คุกกี้ที่จำเป็นต่อระบบความปลอดภัย (HttpOnly Cookie) และคุกกี้เพื่อเพิ่มประสิทธิภาพการใช้งานตามมาตรฐาน PDPA คุณสามารถเลือกยอมรับหรือปรับแต่งการตั้งค่าได้'}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-900/40 transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {t.cookieAcceptAll || 'ยอมรับทั้งหมด'}
                  </button>

                  <button
                    type="button"
                    onClick={handleEssentialOnly}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-700 transition"
                  >
                    {t.cookieEssentialOnly || 'เฉพาะที่จำเป็น'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="px-3 py-2 text-slate-400 hover:text-blue-400 text-xs font-medium transition flex items-center gap-1 underline underline-offset-4"
                  >
                    <Sliders className="w-3 h-3" />
                    {t.cookiePreferences || 'ตั้งค่าคุกกี้'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Detailed Cookie Preference Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Cookie className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-prompt">
                      {t.cookiePreferences || 'ตั้งค่าความเป็นส่วนตัวของคุกกี้'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      PDPA & Data Protection Compliance
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto text-xs">
                <p className="text-slate-300 leading-relaxed">
                  {language === 'en'
                    ? 'Manage your cookie settings. Strictly necessary cookies cannot be disabled as they are required for security (JWT HttpOnly token) and basic operation.'
                    : 'คุณสามารถเลือกปรับแต่งการใช้งานคุกกี้แต่ละประเภทได้ตามต้องการ โดยคุกกี้ที่จำเป็นจะไม่สามารถปิดได้เพื่อความปลอดภัยในการเข้าสู่ระบบและการทำงานพื้นฐาน'}
                </p>

                <div className="space-y-3 pt-2">
                  {/* Necessary Cookies */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <h4 className="font-bold text-white text-xs">
                          {t.cookieNecessaryTitle || 'คุกกี้ที่จำเป็น (Strictly Necessary)'}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold text-[10px] rounded-full">
                        {t.cookieAlwaysActive || 'เปิดใช้งานตลอดเวลา'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {t.cookieNecessaryDesc || 'จำเป็นต่อการเข้าสู่ระบบที่ปลอดภัย (HttpOnly Token) และความปลอดภัยของเซสชัน'}
                    </p>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">
                        {t.cookieAnalyticsTitle || 'คุกกี้เพื่อการวิเคราะห์ (Analytics & Performance)'}
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {t.cookieAnalyticsDesc || 'ช่วยให้เราทราบสถิติการใช้งานและปรับปรุงความเร็วของระบบเช่ารถ'}
                    </p>
                  </div>

                  {/* Preferences / Marketing Cookies */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">
                        {t.cookieMarketingTitle || 'คุกกี้จดจำความชื่นชอบ (Preferences)'}
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {t.cookieMarketingDesc || 'จดจำการตั้งค่าธีมและภาษาเพื่อให้คุณใช้งานได้สะดวกสบายยิ่งขึ้น'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition"
                >
                  {language === 'en' ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-900/40 transition"
                >
                  {t.cookieSavePreferences || 'บันทึกการตั้งค่า'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
