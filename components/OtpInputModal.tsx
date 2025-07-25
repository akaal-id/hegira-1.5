/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Logo from './Logo';
import { KeyRound, RefreshCcw, Edit, X, Loader2 } from 'lucide-react';

interface OtpInputModalProps {
  isOpen: boolean;
  email: string;
  onVerifySuccess: (email: string) => void; // Visitor OTP success doesn't need name here
  onResendOtp: () => void;
  onChangeEmail: () => void;
  onClose: () => void;
}

const OTP_LENGTH = 6;

const OtpInputModal: React.FC<OtpInputModalProps> = ({
  isOpen,
  email,
  onVerifySuccess,
  onResendOtp,
  onChangeEmail,
  onClose,
}) => {
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
      setOtp(new Array(OTP_LENGTH).fill('')); // Reset OTP on open
      setError(null); // Clear previous errors
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: number;
    if (resendCooldown > 0) {
      timer = window.setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError(null);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); 
    if (pasteData.length === OTP_LENGTH) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[OTP_LENGTH - 1]?.focus();
    } else if (pasteData.length > 0) {
        const currentFocusIndex = inputRefs.current.findIndex(ref => ref === document.activeElement);
        const newOtp = [...otp];
        let pasteIndex = 0;
        for (let i = (currentFocusIndex !== -1 ? currentFocusIndex : 0); i < OTP_LENGTH && pasteIndex < pasteData.length; i++) {
            newOtp[i] = pasteData[pasteIndex++];
        }
        setOtp(newOtp);
        const nextFocus = Math.min(OTP_LENGTH - 1, (currentFocusIndex !== -1 ? currentFocusIndex : 0) + pasteData.length);
        inputRefs.current[nextFocus]?.focus();
    }
  };


  const handleSubmitOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== OTP_LENGTH) {
      setError("Harap masukkan 6 digit kode OTP.");
      return;
    }
    setError(null);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setIsLoading(false);

    if (enteredOtp === "123456") { // Simulate successful OTP
      onVerifySuccess(email);
    } else {
      setError("Kode OTP salah atau tidak valid. Silakan coba lagi.");
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtpClick = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    setIsResending(false);
    onResendOtp();
    setResendCooldown(60);
    alert("Kode OTP baru telah dikirim ulang ke email Anda.");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-hegira-auth-background/80 backdrop-blur-md p-4 animate-fade-in"
      aria-labelledby="otp-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-hegira-white w-full max-w-md rounded-2xl shadow-2xl border border-hegira-navy/10 p-8 sm:p-10 text-center transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegira-turquoise transition-colors z-20"
          aria-label="Tutup modal OTP"
        >
          <X size={24} />
        </button>

        <Logo className="h-10 mb-6 mx-auto" />
        <h1 id="otp-modal-title" className="text-2xl font-bold text-hegira-navy mb-2">Masukkan Kode OTP</h1>
        <p className="text-sm text-gray-600 mb-1">
          Kode OTP 6 digit telah dikirimkan ke email Anda:
        </p>
        <p className="text-sm font-semibold text-hegira-turquoise mb-6 break-all">{email}</p>

        <div className="flex justify-center space-x-2 sm:space-x-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { if (el) inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-medium border rounded-lg shadow-sm transition-colors bg-white
                          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                 : 'border-gray-300 focus:border-hegira-turquoise/50 focus:ring-hegira-turquoise/20'} 
                          focus:ring-2 focus:outline-none`}
              aria-label={`Digit OTP ke-${index + 1}`}
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleSubmitOtp}
          disabled={isLoading || otp.join('').length !== OTP_LENGTH}
          className="w-full btn-primary-auth py-3 mb-4"
        >
          {isLoading ? (
            <Loader2 size={20} className="animate-spin mr-2" />
          ) : (
            <KeyRound size={18} className="mr-2" />
          )}
          {isLoading ? "Memverifikasi..." : "Verifikasi Kode"}
        </button>

        <div className="text-xs text-gray-500 space-y-1.5">
          <p>Tidak menerima kode?</p>
          <button
            onClick={handleResendOtpClick}
            disabled={resendCooldown > 0 || isResending}
            className="font-medium text-hegira-auth-primary hover:text-hegira-auth-primary/80 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            <RefreshCcw size={13} className={`mr-1.5 ${isResending ? 'animate-spin' : ''}`} />
            {isResending ? "Mengirim..." : (resendCooldown > 0 ? `Kirim Ulang (${resendCooldown}s)` : "Kirim Ulang OTP")}
          </button>
          <span className="mx-1">|</span>
          <button
            onClick={onChangeEmail}
            className="font-medium text-hegira-auth-primary hover:text-hegira-auth-primary/80 inline-flex items-center"
          >
            <Edit size={13} className="mr-1.5" /> Ganti Alamat Email
          </button>
        </div>
      </div>
       <style>{`
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
        @keyframes modalAppear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .btn-primary-auth { display: inline-flex; items-center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 1px solid transparent; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.75rem 1.5rem; background-color: var(--hegira-auth-primary, #339999); font-size: 0.875rem; font-weight: 600; color: white; transition: background-color 0.2s; }
        .btn-primary-auth:hover { background-color: rgba(51, 153, 153, 0.9); }
        .btn-primary-auth:disabled { opacity:0.7; cursor:not-allowed; }
      `}</style>
    </div>
  );
};

export default OtpInputModal;
