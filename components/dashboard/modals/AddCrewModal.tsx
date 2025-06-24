/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { X, Save, User, Briefcase, Phone } from 'lucide-react';
import { CrewMember } from '../../../pages/dashboard/ManajemenCrewPageDB'; // Adjust path if needed

type CrewFormData = Omit<CrewMember, 'id' | 'eventId' | 'eventName' | 'status' | 'scanTimestamp'>;

interface AddCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (crewData: CrewFormData) => void;
}

const AddCrewModal: React.FC<AddCrewModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<CrewFormData>({
    name: '',
    role: '',
    phoneNumber: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({ name: '', role: '', phoneNumber: '' });
      setFormErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama lengkap tidak boleh kosong.";
    if (!formData.role.trim()) errors.role = "Role tidak boleh kosong.";
    if (!formData.phoneNumber.trim()) errors.phoneNumber = "Nomor telepon tidak boleh kosong.";
    else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      errors.phoneNumber = "Format nomor telepon tidak valid (10-15 digit).";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-[102] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="add-crew-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white text-hegra-navy p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-out scale-95 opacity-0 animate-modal-appear max-h-[90vh] overflow-y-auto custom-scrollbar-modal">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-hegra-turquoise transition-colors z-20"
          aria-label="Tutup modal"
        >
          <X size={24} />
        </button>

        <h2 id="add-crew-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy mb-6">
          Tambah Anggota Crew Baru
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="crew-name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" name="name" id="crew-name" value={formData.name} onChange={handleInputChange} required
                     className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="Masukkan nama lengkap crew" />
            </div>
            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="crew-role" className="block text-sm font-medium text-gray-700 mb-1">Role/Posisi <span className="text-red-500">*</span></label>
             <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" name="role" id="crew-role" value={formData.role} onChange={handleInputChange} required
                     className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.role ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="cth: Keamanan, Logistik, Dokumentasi" />
            </div>
            {formErrors.role && <p className="mt-1 text-xs text-red-500">{formErrors.role}</p>}
          </div>
          
          <div>
            <label htmlFor="crew-phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon <span className="text-red-500">*</span></label>
             <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="tel" name="phoneNumber" id="crew-phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required
                    className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="cth: 081234567890" />
            </div>
            {formErrors.phoneNumber && <p className="mt-1 text-xs text-red-500">{formErrors.phoneNumber}</p>}
          </div>
          
          <p className="text-xs text-gray-500">ID Crew akan digenerate otomatis dan status awal akan menjadi "Belum Hadir".</p>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-hegra-turquoise text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-yellow sm:text-sm transition-colors"
            >
              <Save size={18} /> Simpan Data Crew
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-6 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-turquoise sm:text-sm transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .animate-modal-appear { animation: modalAppear 0.3s ease-out forwards; }
        @keyframes modalAppear { to { opacity: 1; transform: scale(1); } }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: var(--hegra-chino, #d0cea9); border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #b8b495; }
      `}</style>
    </div>
  );
};

export default AddCrewModal;
