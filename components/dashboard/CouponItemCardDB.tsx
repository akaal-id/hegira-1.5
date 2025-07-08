/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Tag, Edit3, Trash2 } from 'lucide-react';
import { TicketCategory } from '../../HegiraApp'; // Import TicketCategory

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
  applicableTicketIds?: string[]; // New field
}

interface CouponItemCardDBProps {
  coupon: CouponData;
  eventTickets: TicketCategory[]; // New prop
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

const CouponItemCardDB: React.FC<CouponItemCardDBProps> = ({ coupon, eventTickets, onEdit, onDelete }) => {
  const discountDisplay = coupon.discountType === 'percentage' 
    ? `${coupon.discountValue}%` 
    : formatCurrency(coupon.discountValue);

  const applicableTicketNames = coupon.applicableTicketIds && coupon.applicableTicketIds.length > 0
    ? coupon.applicableTicketIds.map(id => {
        const ticket = eventTickets.find(t => t.id === id);
        return ticket ? ticket.name : `ID: ${id}`; // Fallback if ticket not found
    }).join(', ')
    : 'Semua Tiket';

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center mr-2">
            <Tag size={20} className="text-hegra-turquoise mr-2 flex-shrink-0" />
            <div>
                <h3 className="text-lg font-semibold text-hegra-deep-navy leading-tight truncate" title={coupon.name}>
                {coupon.name}
                </h3>
                <p className="text-xs text-gray-400 font-mono -mt-1" title={`ID Kupon: ${coupon.id}`}>ID: {coupon.id}</p>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-1.5">
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
          <p className="text-sm text-yellow-700">Kode Kupon</p>
          <p className="text-xl font-bold text-yellow-800 tracking-wider font-mono">{coupon.code}</p>
        </div>

        <div className="space-y-1.5 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Jenis Diskon</span>
            <span className="font-medium">{coupon.discountType === 'percentage' ? 'Persentase' : 'Nominal Tetap'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Nilai Diskon</span>
            <span className="font-medium text-hegra-turquoise">{discountDisplay}</span>
          </div>
          {coupon.quantity !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Jumlah Tersedia</span>
              <span className="font-medium">{coupon.quantity}</span>
            </div>
          )}
          {(coupon.startDate || coupon.endDate) && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Validitas</span>
              <span className="font-medium text-right">
                {formatDate(coupon.startDate)} {coupon.endDate ? `- ${formatDate(coupon.endDate)}` : '(selamanya)'}
              </span>
            </div>
          )}
           {coupon.minPurchase !== undefined && coupon.minPurchase > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Min. Pembelian</span>
              <span className="font-medium">{formatCurrency(coupon.minPurchase)}</span>
            </div>
          )}
          <div className="flex justify-between items-start pt-1.5 mt-1 border-t border-gray-100">
            <span className="text-gray-500 pt-0.5">Berlaku untuk</span>
            <span className="font-medium text-right max-w-[60%] truncate" title={applicableTicketNames}>
                {applicableTicketNames}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponItemCardDB;