
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { CouponData } from '../CouponItemCardDB'; // Assuming CouponData is defined here or imported
import { X, Save, Tag, Percent, DollarSign, Hash, CalendarDays, ShoppingBag } from 'lucide-react';

type CouponFormData = Omit<CouponData, 'id'> & { id?: string };

interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (couponData: CouponFormData) => void;
  initialCouponData?: CouponFormData | null;
}

const AddCouponModal: React.FC<AddCouponModalProps> = ({ isOpen, onClose, onSave, initialCouponData }) => {
  const [formData, setFormData] = useState<CouponFormData>({
    name: '',
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    quantity: undefined,
    startDate: undefined,
    endDate: undefined,
    minPurchase: undefined,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialCouponData) {
      setFormData({ ...initialCouponData });
    } else {
      setFormData({
        name: '',
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        quantity: undefined,
        startDate: undefined,
        endDate: undefined,
        minPurchase: undefined,
      });
    }
    setFormErrors({});
  }, [initialCouponData, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama kupon tidak boleh kosong.";
    if (!formData.code.trim()) errors.code = "Kode kupon tidak boleh kosong.";
    else if (formData.code.trim().includes(' ')) errors.code = "Kode kupon tidak boleh mengandung spasi.";
    if (formData.discountValue <= 0) errors.discountValue = "Nilai diskon harus lebih dari 0.";
    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      errors.discountValue = "Diskon persentase tidak boleh lebih dari 100%.";
    }
    if (formData.quantity !== undefined && formData.quantity < 0) errors.quantity = "Jumlah kupon tidak boleh negatif.";
    if (formData.minPurchase !== undefined && formData.minPurchase < 0) errors.minPurchase = "Minimum pembelian tidak boleh negatif.";
    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      errors.endDate = "Tanggal akhir tidak boleh sebelum tanggal mulai.";
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
    const { name, value, type } = e.target;
    let processedValue: string | number | undefined = value;
    if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
    } else if (type === 'date') {
      processedValue = value === '' ? undefined : value;
    } else if (name === 'code') {
      processedValue = value.toUpperCase().replace(/\s+/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const modalTitle = initialCouponData ? "Edit Kupon" : "Tambah Kupon Baru";
  const saveButtonText = initialCouponData ? "Simpan Perubahan" : "Tambah Kupon";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="add-coupon-modal-title"
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

        <h2 id="add-coupon-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy mb-6">
          {modalTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Kupon */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Kupon <span className="text-red-500">*</span></label>
            <div className="relative"><Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className={`w-full py-2 pl-9 pr-3 input-field ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="cth: Diskon Peluncuran" /></div>
            {formErrors.name && <p className="error-text">{formErrors.name}</p>}
          </div>

          {/* Kode Kupon */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Kode Kupon <span className="text-red-500">*</span></label>
            <div className="relative"><Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" name="code" id="code" value={formData.code} onChange={handleInputChange} required className={`w-full py-2 pl-9 pr-3 input-field uppercase ${formErrors.code ? 'border-red-500' : 'border-gray-300'}`} placeholder="cth: LAUNCH10 (tanpa spasi)" /></div>
            {formErrors.code && <p className="error-text">{formErrors.code}</p>}
          </div>

          {/* Jenis & Nilai Diskon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-1">Jenis Diskon <span className="text-red-500">*</span></label>
              <select name="discountType" id="discountType" value={formData.discountType} onChange={handleInputChange} className="w-full py-2 pl-3 pr-8 input-field appearance-none">
                <option value="percentage">Persentase (%)</option>
                <option value="fixed">Nominal Tetap (IDR)</option>
              </select>
            </div>
            <div>
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">Nilai Diskon <span className="text-red-500">*</span></label>
              <div className="relative"><DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="number" name="discountValue" id="discountValue" value={formData.discountValue} onChange={handleInputChange} required min="0" className={`w-full py-2 pl-9 pr-3 input-field ${formErrors.discountValue ? 'border-red-500' : 'border-gray-300'}`} placeholder={formData.discountType === 'percentage' ? 'cth: 10 untuk 10%' : 'cth: 50000'} /></div>
              {formErrors.discountValue && <p className="error-text">{formErrors.discountValue}</p>}
            </div>
          </div>
          
          {/* Jumlah Kupon */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Kupon Tersedia (Opsional)</label>
            <div className="relative"><Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="number" name="quantity" id="quantity" value={formData.quantity === undefined ? '' : formData.quantity} onChange={handleInputChange} min="0" className={`w-full py-2 pl-9 pr-3 input-field ${formErrors.quantity ? 'border-red-500' : 'border-gray-300'}`} placeholder="Kosongkan jika tidak terbatas" /></div>
            {formErrors.quantity && <p className="error-text">{formErrors.quantity}</p>}
          </div>

          {/* Validitas Kupon */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai (Opsional)</label>
              <div className="relative"><CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleInputChange} className="w-full py-2 pl-9 pr-3 input-field" /></div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir (Opsional)</label>
              <div className="relative"><CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="date" name="endDate" id="endDate" value={formData.endDate || ''} onChange={handleInputChange} className={`w-full py-2 pl-9 pr-3 input-field ${formErrors.endDate ? 'border-red-500' : 'border-gray-300'}`} /></div>
              {formErrors.endDate && <p className="error-text">{formErrors.endDate}</p>}
            </div>
          </div>

          {/* Minimum Pembelian */}
          <div>
            <label htmlFor="minPurchase" className="block text-sm font-medium text-gray-700 mb-1">Minimum Pembelian (IDR, Opsional)</label>
            <div className="relative"><ShoppingBag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="number" name="minPurchase" id="minPurchase" value={formData.minPurchase === undefined ? '' : formData.minPurchase} onChange={handleInputChange} min="0" className={`w-full py-2 pl-9 pr-3 input-field ${formErrors.minPurchase ? 'border-red-500' : 'border-gray-300'}`} placeholder="cth: 200000" /></div>
            {formErrors.minPurchase && <p className="error-text">{formErrors.minPurchase}</p>}
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-gray-200 mt-6">
            <button type="submit" className="btn-primary w-full sm:w-auto"><Save size={18} /> {saveButtonText}</button>
            <button type="button" onClick={onClose} className="btn-secondary w-full sm:w-auto">Batal</button>
          </div>
        </form>
      </div>
      <style>{`
        .input-field { background-color: white; border-radius: 0.5rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); transition: border-color 0.2s, box-shadow 0.2s; }
        .input-field:focus { outline: none; border-color: var(--hegra-turquoise, #4b998e); box-shadow: 0 0 0 2px rgba(75, 153, 142, 0.3); }
        .error-text { font-size: 0.75rem; color: #ef4444; margin-top: 0.25rem; }
        .btn-primary { display: inline-flex; items-center; justify-content: center; gap: 0.5rem; border-radius: 0.5rem; border: 1px solid transparent; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.625rem 1.5rem; background-color: var(--hegra-turquoise, #4b998e); font-size: 0.875rem; font-weight: 500; color: white; transition: background-color 0.2s; }
        .btn-primary:hover { background-color: rgba(75, 153, 142, 0.9); }
        .btn-secondary { display: inline-flex; justify-content: center; border-radius: 0.5rem; border: 1px solid #d1d5db; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); padding: 0.625rem 1.5rem; background-color: white; font-size: 0.875rem; font-weight: 500; color: #374151; transition: background-color 0.2s; }
        .btn-secondary:hover { background-color: #f9fafb; }
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

export default AddCouponModal;
