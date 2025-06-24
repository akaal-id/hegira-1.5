
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Tag, Percent, DollarSign, Edit3, Trash2, CalendarDays, Hash, ShoppingBag } from 'lucide-react';

export interface CouponData {
  id: string;
  name: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  quantity?: number; // Max uses
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  minPurchase?: number; // Minimum purchase amount
}

interface CouponItemCardDBProps {
  coupon: CouponData;
  onEdit: () => void;
  onDelete: () => void;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateString; // Fallback if date is not in YYYY-MM-DD
  }
};

const CouponItemCardDB: React.FC<CouponItemCardDBProps> = ({ coupon, onEdit, onDelete }) => {
  const discountDisplay = coupon.discountType === 'percentage' 
    ? `${coupon.discountValue}%` 
    : formatCurrency(coupon.discountValue);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center mr-2">
            <Tag size={20} className="text-hegra-turquoise mr-2 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-hegra-deep-navy leading-tight truncate" title={coupon.name}>
              {coupon.name}
            </h3>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button 
              onClick={onEdit} 
              className="text-blue-500 hover:text-blue-700 p-1"
              aria-label={`Edit kupon ${coupon.name}`}
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={onDelete} 
              className="text-red-500 hover:text-red-700 p-1"
              aria-label={`Hapus kupon ${coupon.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-center">
          <p className="text-sm text-yellow-700">Kode Kupon:</p>
          <p className="text-xl font-bold text-yellow-800 tracking-wider font-mono">{coupon.code}</p>
        </div>

        <div className="space-y-1.5 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 flex items-center"><Percent size={14} className="mr-1.5"/> Jenis Diskon:</span>
            <span className="font-medium">{coupon.discountType === 'percentage' ? 'Persentase' : 'Nominal Tetap'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 flex items-center"><DollarSign size={14} className="mr-1.5"/> Nilai Diskon:</span>
            <span className="font-medium text-hegra-turquoise">{discountDisplay}</span>
          </div>
          {coupon.quantity !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center"><Hash size={14} className="mr-1.5"/> Jumlah Tersedia:</span>
              <span className="font-medium">{coupon.quantity}</span>
            </div>
          )}
          {(coupon.startDate || coupon.endDate) && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center"><CalendarDays size={14} className="mr-1.5"/> Validitas:</span>
              <span className="font-medium text-xs text-right">
                {formatDate(coupon.startDate)} {coupon.endDate ? `- ${formatDate(coupon.endDate)}` : '(selamanya)'}
              </span>
            </div>
          )}
           {coupon.minPurchase !== undefined && coupon.minPurchase > 0 && (
            <div className="flex justify-between items-center pt-1.5 mt-1 border-t border-gray-100">
              <span className="text-gray-500 flex items-center"><ShoppingBag size={14} className="mr-1.5"/> Min. Pembelian:</span>
              <span className="font-medium">{formatCurrency(coupon.minPurchase)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponItemCardDB;
