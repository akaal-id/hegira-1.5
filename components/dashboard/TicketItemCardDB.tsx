/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { TicketCategoryWithEventInfo } from '../../pages/dashboard/TiketKuponDB';
import { formatEventTime } from '../../HegiraApp';
import { Edit3, Trash2, AlertTriangle, Globe } from 'lucide-react';

interface TicketItemCardDBProps {
  ticket: TicketCategoryWithEventInfo;
  onEdit: () => void;
  onDelete: () => void;
}

const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return 'N/A';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
};

const formatDateDisplayForTicketCard = (dateString?: string, secondaryDateString?: string): string => {
  if (!dateString) return 'Mengikuti Jadwal Event';

  const formatPart = (part: string, options: Intl.DateTimeFormatOptions): string => {
    const dateParts = part.split('-'); // Expects YYYY-MM-DD
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day).toLocaleDateString('id-ID', options);
      }
    }
    return part; // Fallback
  };

  const optionsFull: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const optionsDayMonth: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };

  if (!secondaryDateString || dateString === secondaryDateString) {
    return formatPart(dateString, optionsFull);
  }

  const [sY, sM, sD] = dateString.split('-').map(Number);
  const [eY, eM, eD] = secondaryDateString.split('-').map(Number);

  if (sY === eY) {
    if (sM === eM) { 
      return `${sD} - ${formatPart(secondaryDateString, optionsFull)}`;
    } else { 
      return `${formatPart(dateString, optionsDayMonth)} - ${formatPart(secondaryDateString, optionsFull)}`; 
    }
  } else { 
    return `${formatPart(dateString, optionsFull)} - ${formatPart(secondaryDateString, optionsFull)}`; 
  }
};


const TicketItemCardDB: React.FC<TicketItemCardDBProps> = ({ ticket, onEdit, onDelete }) => {
  const isPaid = ticket.price !== undefined && ticket.price > 0;
  const ticketType = isPaid ? 'Berbayar' : 'Gratis';
  const ticketTypeStyle = isPaid ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';
  
  const ticketsPurchased = ticket.ticketsPurchased === undefined ? 0 : ticket.ticketsPurchased;
  const maxQuantity = ticket.maxQuantity; // This is now a required number > 0

  let derivedStatusText = 'N/A';
  let derivedStatusColor = 'text-gray-500';

  const remainingTickets = maxQuantity - ticketsPurchased;

  if (maxQuantity <= 0) { // Should not happen if maxQuantity is always > 0
    derivedStatusText = 'Tidak Valid';
    derivedStatusColor = 'text-gray-500';
  } else if (remainingTickets <= 0) {
    derivedStatusText = 'Habis';
    derivedStatusColor = 'text-red-600';
  } else if (remainingTickets <= 0.1 * maxQuantity) {
    derivedStatusText = 'Hampir Habis';
    derivedStatusColor = 'text-yellow-600';
  } else {
    derivedStatusText = 'Tersedia';
    derivedStatusColor = 'text-green-600';
  }


  const useEventSched = ticket.useEventSchedule === undefined ? true : ticket.useEventSchedule;

  const displayTicketDate = useEventSched || !ticket.ticketStartDate 
    ? ticket.eventDateDisplay 
    : formatDateDisplayForTicketCard(ticket.ticketStartDate, ticket.ticketEndDate);

  let ticketTimeDisplayValue = ticket.eventTimeDisplay; 
  let ticketTzValue = ticket.eventTimezone;

  if (!useEventSched && ticket.ticketStartTime) {
    ticketTimeDisplayValue = ticket.ticketStartTime;
    if (ticket.ticketIsTimeRange && ticket.ticketEndTime) {
      ticketTimeDisplayValue += ` - ${ticket.ticketEndTime}`;
    } else if (!ticket.ticketIsTimeRange) {
      ticketTimeDisplayValue += ` - Selesai`;
    }
    ticketTzValue = ticket.ticketTimezone || ticket.eventTimezone;
  }


  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
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
        
        <p className="text-xs text-gray-400 font-mono mb-2" title={`ID Tiket: ${ticket.id}`}>ID: {ticket.id}</p>

        {ticket.categoryLabel && (
          <p className="text-xs font-semibold text-hegra-turquoise mb-2">{ticket.categoryLabel}</p>
        )}
        
        <p className="text-xs text-gray-500 mb-3">Event: <span className="font-medium text-gray-600">{ticket.eventName}</span></p>

        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tipe Tiket</span>
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${ticketTypeStyle}`}>
              {ticketType}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tiket Dibeli</span>
            <span className="font-medium">{ticketsPurchased}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Jumlah Tersedia</span>
            <span className="font-medium">{ticket.maxQuantity !== undefined ? ticket.maxQuantity : 'Tidak Terbatas'}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Ketersediaan</span>
            <span className={`font-medium text-xs ${derivedStatusColor}`}>
              {derivedStatusText}
            </span>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tanggal Berlaku</span>
              <span className="font-medium text-gray-700 text-xs text-right">{displayTicketDate}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Waktu Berlaku</span>
            <span className="font-medium text-gray-700 text-xs text-right">{formatEventTime(ticketTimeDisplayValue, ticketTzValue)}</span>
          </div>
          
          {(!useEventSched && ticket.ticketTimezone) && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Zona Waktu Tiket</span>
              <span className="font-medium text-gray-700 text-xs text-right">{ticket.ticketTimezone}</span>
            </div>
          )}
          
           <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-gray-100">
            <span className="text-lg text-hegra-deep-navy">Harga Tiket</span>
            <span className="text-lg font-bold text-hegra-turquoise">{formatCurrency(ticket.price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketItemCardDB;
