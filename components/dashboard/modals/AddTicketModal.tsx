
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { TicketCategory } from '../../../HegiraApp';
import { X, Save,DollarSign, List, CheckSquare, AlertTriangle, Info } from 'lucide-react';

type TicketFormData = Omit<TicketCategory, 'id'> & { id?: string }; // Allow id to be optional for new tickets

interface AddTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ticketData: TicketFormData) => void;
  initialTicketData?: TicketFormData | null;
  eventTimezone?: string;
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTicketData,
  eventTimezone
}) => {
  const [formData, setFormData] = useState<TicketFormData>({
    name: '',
    price: 0,
    description: '',
    maxQuantity: undefined,
    availabilityStatus: 'available',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialTicketData) {
      setFormData({ ...initialTicketData });
    } else {
      // Reset form for new ticket
      setFormData({
        name: '',
        price: 0,
        description: '',
        maxQuantity: undefined,
        availabilityStatus: 'available',
      });
    }
    setFormErrors({}); // Clear errors when modal opens or data changes
  }, [initialTicketData, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama kategori tiket tidak boleh kosong.";
    if (formData.price < 0) errors.price = "Harga tiket tidak boleh negatif.";
    if (formData.maxQuantity !== undefined && formData.maxQuantity < 0) {
      errors.maxQuantity = "Jumlah tiket tidak boleh negatif.";
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value,
    }));
    // Clear error for this field on change
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const modalTitle = initialTicketData ? "Edit Kategori Tiket" : "Tambah Kategori Tiket Baru";
  const saveButtonText = initialTicketData ? "Simpan Perubahan" : "Tambah Tiket";

  const availabilityOptions: { value: TicketCategory['availabilityStatus'], label: string, icon?: React.ElementType }[] = [
    { value: 'available', label: 'Tersedia', icon: CheckSquare },
    { value: 'almost-sold', label: 'Hampir Habis', icon: AlertTriangle },
    { value: 'sold-out', label: 'Habis Terjual', icon: X },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      aria-labelledby="add-ticket-modal-title"
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

        <h2 id="add-ticket-modal-title" className="text-xl sm:text-2xl font-semibold text-hegra-navy mb-6">
          {modalTitle}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori Tiket <span className="text-red-500">*</span></label>
            <div className="relative">
              <List className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required
                     className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="cth: Regular, VIP, Early Bird" />
            </div>
            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Harga Tiket (IDR) <span className="text-red-500">*</span></label>
             <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="number" name="price" id="price" value={formData.price} onChange={handleInputChange} required min="0" step="1000"
                     className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                     placeholder="cth: 150000" />
            </div>
            {formErrors.price && <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tiket (Opsional)</label>
             <div className="relative">
                <Info className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3}
                        className="w-full py-2.5 pl-9 pr-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm"
                        placeholder="cth: Akses ke semua area, Merchandise eksklusif"></textarea>
            </div>
          </div>

          <div>
            <label htmlFor="maxQuantity" className="block text-sm font-medium text-gray-700 mb-1">Jumlah Tiket Tersedia (Opsional)</label>
             <div className="relative">
                <CheckSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="number" name="maxQuantity" id="maxQuantity" value={formData.maxQuantity === undefined ? '' : formData.maxQuantity} onChange={handleInputChange} min="0"
                    className={`w-full py-2.5 pl-9 pr-3 bg-white border rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors placeholder-gray-400 text-sm ${formErrors.maxQuantity ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Kosongkan jika tidak terbatas" />
            </div>
            {formErrors.maxQuantity && <p className="mt-1 text-xs text-red-500">{formErrors.maxQuantity}</p>}
          </div>

          <div>
            <label htmlFor="availabilityStatus" className="block text-sm font-medium text-gray-700 mb-1">Status Ketersediaan <span className="text-red-500">*</span></label>
            <div className="relative">
              {formData.availabilityStatus && availabilityOptions.find(opt => opt.value === formData.availabilityStatus)?.icon && 
                React.createElement(availabilityOptions.find(opt => opt.value === formData.availabilityStatus)!.icon!, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" })
              }
              <select name="availabilityStatus" id="availabilityStatus" value={formData.availabilityStatus} onChange={handleInputChange} required
                      className="w-full py-2.5 pl-9 pr-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-1 focus:ring-hegra-turquoise transition-colors text-sm appearance-none">
                {availabilityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 bg-hegra-turquoise text-base font-medium text-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hegra-yellow sm:text-sm transition-colors"
            >
              <Save size={18} /> {saveButtonText}
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
        .animate-modal-appear { 
          animation: modalAppear 0.3s ease-out forwards;
        }
        @keyframes modalAppear {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .custom-scrollbar-modal::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-modal::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb { background: var(--hegra-chino, #d0cea9); border-radius: 10px; }
        .custom-scrollbar-modal::-webkit-scrollbar-thumb:hover { background: #b8b495; }
      `}</style>
    </div>
  );
};

export default AddTicketModal;
