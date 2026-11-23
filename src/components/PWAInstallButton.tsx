import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        title="تثبيت العرض للعمل بدون إنترنت"
        className="flex items-center gap-1.5 rounded-lg border border-[#182230]/12 bg-white px-3 py-1.5 text-xs font-semibold text-[#182230] hover:bg-[#D7F7EC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5" />
        <span>حفظ للعرض دون نت</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[#182230]/12 bg-white px-3 py-1.5 text-xs font-semibold text-[#182230] hover:bg-[#D7F7EC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>تثبيت</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#FAF9F5] p-6 shadow-xl border border-[#182230]/10 text-right">
              <h3 className="text-lg font-bold text-[#182230]">حفظ العرض على جهازك</h3>
              <p className="mt-2 text-sm text-[#526071] leading-relaxed">
                1. اضغط على زر <strong>مشاركة (Share)</strong> في المتصفح.
                <br />
                2. اختر <strong>إضافة إلى الشاشة الرئيسية (Add to Home Screen)</strong>.
              </p>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#182230] py-2.5 text-sm font-semibold text-white hover:bg-[#273548] transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
