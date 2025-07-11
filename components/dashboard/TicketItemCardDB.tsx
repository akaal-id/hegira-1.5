/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { TicketCategoryWithEventInfo } from '../../pages/dashboard/TicketManagementPage';
import { formatEventTime } from '../../HegiraApp';
import { Edit3, Trash2, AlertTriangle, Globe, Ticket as TicketIcon } from 'lucide-react';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal'; // New import

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

  const formatPart = (dateStr: string): string => {
    // Handles YYYY-MM-DD or YYYY/MM/DD
    const parts = dateStr.replace(/\//g, '-').split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
    }
    return dateStr; // fallback
  };
  
  // This handles case for custom ticket dates with start and end
  if (secondaryDateString && secondaryDateString !== dateString) {
      return `${formatPart(dateString)} - ${formatPart(secondaryDateString)}`;
  }
  
  // This handles eventDateDisplay which can be 'YYYY/MM/DD' or 'YYYY/MM/DD - YYYY/MM/DD'
  const dateParts = dateString.split(' - ');
  if (dateParts.length === 2) {
    return `${formatPart(dateParts[0])} - ${formatPart(dateParts[1])}`;
  }
  
  return formatPart(dateString);
};


const TicketItemCardDB: React.FC<TicketItemCardDBProps> = ({ ticket, onEdit, onDelete }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

  const displayTicketDate = formatDateDisplayForTicketCard(
    useEventSched || !ticket.ticketStartDate ? ticket.eventDateDisplay : ticket.ticketStartDate,
    useEventSched || !ticket.ticketStartDate ? undefined : ticket.ticketEndDate
  );

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

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    onDelete();
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center mr-2 flex-grow min-w-0">
              <TicketIcon size={20} className="text-green-600 mr-2 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-hegra-deep-navy group-hover:text-hegra-turquoise transition-colors duration-200 truncate leading-tight">
                {ticket.name}
              </h3>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-2">
              <button 
                onClick={onEdit} 
                className="text-blue-500 hover:text-blue-700 p-1"
                aria-label={`Edit tiket ${ticket.name}`}
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={handleDeleteClick} 
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

          <div className="space-y-3 text-xs text-gray-600">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tipe Tiket</span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${ticketTypeStyle}`}>
                {ticketType}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tiket Dibeli</span>
              <span>{ticketsPurchased}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">Jumlah Tersedia</span>
              <span>{ticket.maxQuantity !== undefined ? ticket.maxQuantity : 'Tidak Terbatas'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Ketersediaan</span>
              <span className={`text-xs ${derivedStatusColor}`}>
                {derivedStatusText}
              </span>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Tanggal Berlaku</span>
                <span className="text-gray-700 text-xs text-right">{displayTicketDate}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Waktu Berlaku</span>
              <span className="text-gray-700 text-xs text-right">{formatEventTime(ticketTimeDisplayValue, ticketTzValue)}</span>
            </div>
            
            {(!useEventSched && ticket.ticketTimezone) && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Zona Waktu Tiket</span>
                <span className="text-gray-700 text-xs text-right">{ticket.ticketTimezone}</span>
              </div>
            )}
            
            <div className="flex justify-between items-baseline pt-2 mt-2 border-t border-gray-100">
              <span className="text-lg text-hegra-deep-navy">Harga Tiket</span>
              <span className="text-lg font-bold text-hegra-turquoise">{formatCurrency(ticket.price)}</span>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={ticket.name}
        itemType="Tiket"
      />
    </>
  );
};

export default TicketItemCardDB;
