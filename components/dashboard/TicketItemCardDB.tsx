
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { TicketCategoryWithEventInfo } from '../../pages/dashboard/TiketKuponDB';
import { formatEventTime } from '../../HegiraApp';
import { CalendarDays, Clock, Edit3, Trash2, AlertTriangle } from 'lucide-react'; // Added AlertTriangle

interface TicketItemCardDBProps {
  ticket: TicketCategoryWithEventInfo;
  onEdit: () => void;
  onDelete: () => void;
}

// Helper function to format currency (should be centralized ideally)
const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const TicketItemCardDB: React.FC<TicketItemCardDBProps> = ({ ticket, onEdit, onDelete }) => {
  const isPaid = ticket.price !== undefined && ticket.price > 0;
  const ticketType = isPaid ? 'Berbayar' : 'Gratis';
  const ticketTypeStyle = isPaid ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
  
  const availabilityStatusText = {
    'available': 'Tersedia',
    'almost-sold': 'Hampir Habis',
    'sold-out': 'Habis Terjual',
    'default': 'N/A'
  };
  const availabilityStatusColor = {
    'available': 'text-green-600',
    'almost-sold': 'text-yellow-600',
    'sold-out': 'text-red-600',
    'default': 'text-gray-500'
  };
  const currentStatusText = availabilityStatusText[ticket.availabilityStatus || 'default'];
  const currentStatusColor = availabilityStatusColor[ticket.availabilityStatus || 'default'];


  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-hegra-deep-navy group-hover:text-hegra-turquoise transition-colors duration-200 flex-grow mr-2 leading-tight">
            {ticket.name}
          </h3>
          <div className="flex-shrink-0 flex items-center space-x-2">
            <button 
              onClick={onEdit} 
              className="text-blue-500 hover:text-blue-700 p-1"
              aria-label={`Edit tiket ${ticket.name}`}
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={onDelete} 
              className="text-red-500 hover:text-red-700 p-1"
              aria-label={`Hapus tiket ${ticket.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3 -mt-2">Event: <span className="font-medium text-gray-600">{ticket.eventName}</span></p>


        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tipe Tiket:</span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${ticketTypeStyle}`}>
              {ticketType}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Ketersediaan:</span>
            <span className={`font-medium text-xs ${currentStatusColor}`}>
              {ticket.availabilityStatus === 'almost-sold' && <AlertTriangle size={13} className="inline mr-1" />}
              {currentStatusText}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Jumlah Tersedia:</span>
            <span className="font-medium">{ticket.maxQuantity !== undefined ? ticket.maxQuantity : 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tanggal Event:</span>
            <span className="font-medium text-right">{ticket.eventDateDisplay}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Waktu Event:</span>
            <span className="font-medium text-right">{formatEventTime(ticket.eventTimeDisplay, ticket.eventTimezone)}</span>
          </div>
           <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-100">
            <span className="text-gray-500">Harga Tiket:</span>
            <span className="text-lg font-bold text-hegra-turquoise">{formatCurrency(ticket.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketItemCardDB;
