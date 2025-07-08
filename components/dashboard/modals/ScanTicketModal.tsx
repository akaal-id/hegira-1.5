
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect, useRef } from 'react';
import { X, RefreshCw, CheckCircle, XCircle, Loader2, ScanLine as ScanIcon, User, Ticket, CalendarDays, AlertTriangle } from 'lucide-react';
import { AttendeeData, ScanStatus } from '../../../pages/dashboard/PengunjungDB'; // Import AttendeeData and ScanStatus

interface ScanTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessScan: (scannedId: string) => void;
  availableAttendeesForDemo: AttendeeData[]; // For realistic demo ID picking
  scannedAttendeeInfo: AttendeeData | null;
  scanStatus: ScanStatus;
}

const ScanTicketModal: React.FC<ScanTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  onProcessScan,
  availableAttendeesForDemo,
  scannedAttendeeInfo,
  scanStatus
}) => {
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const scanTimeoutRef = useRef<number | null>(null);
  const [cameraAccess, setCameraAccess] = useState<'IDLE' | 'REQUESTING' | 'GRANTED' | 'DENIED' | 'ERROR'>('IDLE');
  const streamRef = useRef<MediaStream | null>(null);


  useEffect(() => {
    if (isOpen) {
      // Reset states for a new scan session
      setLastScanStatusParent('IDLE'); // Reset parent's status display
      setLastScannedAttendeeInfoParent(null);
      setCameraAccess('REQUESTING');
      setIsSimulatingScan(false);

      const requestCameraAndStartScan = async () => {
        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraAccess('GRANTED');
          
          // --- Start scan simulation ---
          setIsSimulatingScan(true); // Local state for "scanning animation"

          let idToScan = `DEMO-TKT-${Date.now().toString().slice(-4)}`;
          if (availableAttendeesForDemo && availableAttendeesForDemo.length > 0) {
              const rand = Math.random();
              if (rand < 0.65) {
                  const belumHadir = availableAttendeesForDemo.filter(a => a.status === 'Belum Hadir');
                  if (Math.random() < 0.85 && belumHadir.length > 0) {
                       idToScan = belumHadir[Math.floor(Math.random() * belumHadir.length)].ticketId;
                  } else {
                       const randomIndex = Math.floor(Math.random() * availableAttendeesForDemo.length);
                       idToScan = availableAttendeesForDemo[randomIndex].ticketId;
                  }
              } else if (rand < 0.85) {
                  const sudahHadir = availableAttendeesForDemo.filter(a => a.status === 'Sudah Hadir');
                  if (sudahHadir.length > 0) {
                      idToScan = sudahHadir[Math.floor(Math.random() * sudahHadir.length)].ticketId;
                  }
              }
          }
          
          if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = window.setTimeout(() => {
            onProcessScan(idToScan); // This updates parent's scanStatus and scannedAttendeeInfo
            setIsSimulatingScan(false); // Simulation ends
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }, 2000);

        } catch (err: any) {
          console.error("Camera access denied or error:", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setCameraAccess('DENIED');
          } else {
            setCameraAccess('ERROR');
          }
          setIsSimulatingScan(false);
        }
      };

      requestCameraAndStartScan();

    } else { // When modal is closed
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      setIsSimulatingScan(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraAccess('IDLE');
    }

    return () => { // Cleanup on unmount or before effect re-runs
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]); // Only re-run when isOpen changes

  // These are proxy states/functions to interact with parent's state for display purposes
  // This avoids direct prop mutation and complex callback chains for intermediate states.
  const [lastScanStatusParent, setLastScanStatusParent] = useState<ScanStatus>(scanStatus);
  const [lastScannedAttendeeInfoParent, setLastScannedAttendeeInfoParent] = useState<AttendeeData | null>(scannedAttendeeInfo);

  useEffect(() => {
    setLastScanStatusParent(scanStatus);
  }, [scanStatus]);

  useEffect(() => {
    setLastScannedAttendeeInfoParent(scannedAttendeeInfo);
  }, [scannedAttendeeInfo]);


  const handleRescan = () => {
    if (isSimulatingScan || cameraAccess === 'REQUESTING') return; // Prevent re-scan if already in progress

    setLastScanStatusParent('IDLE'); // Reset result display
    setLastScannedAttendeeInfoParent(null);
    setCameraAccess('REQUESTING'); // Signal camera request start
    setIsSimulatingScan(false);

    const requestCameraAndStartScanAgain = async () => {
        try {
          streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
          setCameraAccess('GRANTED');
          setIsSimulatingScan(true);
          let idToScan = `DEMO-TKT-${Date.now().toString().slice(-4)}`;
           if (availableAttendeesForDemo && availableAttendeesForDemo.length > 0) {
              const rand = Math.random();
              if (rand < 0.65) {
                  const belumHadir = availableAttendeesForDemo.filter(a => a.status === 'Belum Hadir');
                  if (Math.random() < 0.85 && belumHadir.length > 0) {
                       idToScan = belumHadir[Math.floor(Math.random() * belumHadir.length)].ticketId;
                  } else {
                       const randomIndex = Math.floor(Math.random() * availableAttendeesForDemo.length);
                       idToScan = availableAttendeesForDemo[randomIndex].ticketId;
                  }
              } else if (rand < 0.85) {
                  const sudahHadir = availableAttendeesForDemo.filter(a => a.status === 'Sudah Hadir');
                  if (sudahHadir.length > 0) {
                      idToScan = sudahHadir[Math.floor(Math.random() * sudahHadir.length)].ticketId;
                  }
              }
          }
          if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = window.setTimeout(() => {
            onProcessScan(idToScan);
            setIsSimulatingScan(false);
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }, 2000);
        } catch (err: any) {
          console.error("Camera access denied or error on rescan:", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setCameraAccess('DENIED');
          } else {
            setCameraAccess('ERROR');
          }
          setIsSimulatingScan(false);
        }
      };
      requestCameraAndStartScanAgain();
  };

  const renderCameraAreaContent = () => {
    switch (cameraAccess) {
      case 'REQUESTING':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <Loader2 size={32} className="animate-spin mb-2" />
            <p className="text-sm">Meminta izin kamera...</p>
          </div>
        );
      case 'DENIED':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500 p-4">
            <AlertTriangle size={32} className="mb-2" />
            <p className="text-sm text-center">Izin kamera ditolak.</p>
            <p className="text-xs text-center mt-1">Aktifkan izin kamera di browser Anda untuk menggunakan fitur ini.</p>
          </div>
        );
      case 'ERROR':
        return (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-500 p-4">
            <XCircle size={32} className="mb-2" />
            <p className="text-sm text-center">Kamera tidak tersedia atau error.</p>
          </div>
        );
      case 'GRANTED':
        return (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-sm z-0">
                {isSimulatingScan ? 'Arahkan ke QR Code' : 'Kamera Siap'}
              </p>
              {/* Video element would go here for real camera feed */}
            </div>
            {isSimulatingScan && <div className="scan-line z-20"></div>}
          </>
        );
      default: // IDLE
        return (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <p className="text-sm">Area Kamera</p>
          </div>
        );
    }
  };

  const showScanResultUI = !isSimulatingScan && cameraAccess === 'GRANTED' && (lastScanStatusParent === 'SUCCESS' || lastScanStatusParent === 'ALREADY_SCANNED' || lastScanStatusParent === 'NOT_FOUND');

  return (
    <div
      className="fixed inset-0 z-[101] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      aria-labelledby="scan-ticket-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-5 sm:p-6 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear flex flex-col">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-4">
          <h2 id="scan-ticket-modal-title" className="text-lg font-semibold text-hegra-navy flex items-center">
            <ScanIcon size={20} className="mr-2 text-hegra-turquoise" /> Pindai Tiket Pengunjung
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-hegra-turquoise transition-colors" aria-label="Tutup modal">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-64 h-64 sm:w-72 sm:h-72 bg-gray-800 rounded-lg overflow-hidden relative border-4 border-gray-700 shadow-inner mb-4">
            {renderCameraAreaContent()}
          </div>

          <div className="h-28 text-center flex flex-col justify-center items-center w-full px-2">
            {isSimulatingScan && cameraAccess === 'GRANTED' && (
              <div className="flex flex-col items-center text-hegra-turquoise">
                <Loader2 size={32} className="animate-spin mb-2" />
                <p className="text-sm font-medium">Memindai...</p>
              </div>
            )}
            {showScanResultUI && lastScanStatusParent === 'SUCCESS' && lastScannedAttendeeInfoParent && (
              <div className="flex flex-col items-center text-green-600 animate-fade-in-up-sm">
                <CheckCircle size={36} className="mb-2" />
                <p className="text-md font-bold">BERHASIL CHECK-IN</p>
                <p className="text-sm mt-1"><User size={14} className="inline mr-1" /> {lastScannedAttendeeInfoParent.ownerName}</p>
                <p className="text-xs text-gray-600"><Ticket size={13} className="inline mr-1" /> {lastScannedAttendeeInfoParent.ticketCategoryName}</p>
                <p className="text-xs text-gray-500"><CalendarDays size={13} className="inline mr-1" /> {lastScannedAttendeeInfoParent.eventName}</p>
              </div>
            )}
            {showScanResultUI && lastScanStatusParent === 'ALREADY_SCANNED' && lastScannedAttendeeInfoParent && (
              <div className="flex flex-col items-center text-yellow-600 animate-fade-in-up-sm">
                <AlertTriangle size={36} className="mb-2" />
                <p className="text-md font-bold">TIKET SUDAH DIGUNAKAN</p>
                <p className="text-sm mt-1"><User size={14} className="inline mr-1" /> {lastScannedAttendeeInfoParent.ownerName}</p>
                <p className="text-xs text-gray-600">Telah discan pada: {lastScannedAttendeeInfoParent.scanTimestamp ? new Date(lastScannedAttendeeInfoParent.scanTimestamp).toLocaleString('id-ID', {day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : 'N/A'}</p>
              </div>
            )}
            {showScanResultUI && lastScanStatusParent === 'NOT_FOUND' && (
              <div className="flex flex-col items-center text-red-600 animate-fade-in-up-sm">
                <XCircle size={36} className="mb-2" />
                <p className="text-md font-bold">TIKET TIDAK DITEMUKAN</p>
                <p className="text-xs text-gray-600">Pastikan kode QR benar dan coba lagi.</p>
              </div>
            )}
            {!isSimulatingScan && (cameraAccess === 'DENIED' || cameraAccess === 'ERROR' || (cameraAccess === 'IDLE' && lastScanStatusParent === 'IDLE')) && (
                 <p className="text-sm text-gray-500">
                    {cameraAccess === 'IDLE' ? 'Arahkan kamera ke kode QR tiket.' : 
                     cameraAccess === 'DENIED' ? 'Akses kamera diperlukan untuk memindai.' :
                     cameraAccess === 'ERROR' ? 'Tidak dapat mengakses kamera.' : ''}
                 </p>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
           <button
            onClick={handleRescan}
            disabled={isSimulatingScan || cameraAccess === 'REQUESTING'}
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 border border-hegra-turquoise shadow-sm text-sm font-medium rounded-lg text-hegra-turquoise bg-white hover:bg-hegra-turquoise/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors disabled:opacity-60"
          >
            <RefreshCw size={16} /> Scan Ulang
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto justify-center inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        
        .scan-line {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(to right, transparent, rgba(75, 153, 142, 0.8), transparent); /* hegra-turquoise with opacity */
          box-shadow: 0 0 10px rgba(75, 153, 142, 0.7);
          animation: scan-animation 2s infinite linear; 
        }
        @keyframes scan-animation {
          0% { top: 0%; }
          50% { top: 99%; }
          100% { top: 0%; }
        }
        .animate-fade-in-up-sm {
          animation: fadeInUpShort 0.3s ease-out forwards;
        }
        @keyframes fadeInUpShort {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ScanTicketModal;

