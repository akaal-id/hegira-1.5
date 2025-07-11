/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { EventData, TicketCategory } from '../../HegiraApp';
import TicketItemCardDB from '../../components/dashboard/TicketItemCardDB';
import AddTicketModal from '../../components/dashboard/modals/AddTicketModal';
import { PlusCircle, Search, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export interface TicketCategoryWithEventInfo extends TicketCategory {
  eventId: number;
  eventName: string;
  eventDateDisplay: string;
  eventTimeDisplay: string;
  eventTimezone?: string;
}

interface TicketManagementPageProps {
  selectedEvent: EventData;
  onUpdateEvent: (updatedEvent: EventData) => void;
}

const ITEMS_PER_PAGE = 10;

const TicketManagementPage: React.FC<TicketManagementPageProps> = ({ selectedEvent, onUpdateEvent }) => {
  const [activeTab, setActiveTab] = useState<'management' | 'report'>('management');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddEditTicketModal, setShowAddEditTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketCategoryWithEventInfo | null>(null);

  const allTicketsForEvent: TicketCategoryWithEventInfo[] = useMemo(() => {
    return (selectedEvent.ticketCategories || []).map(tc => ({
      ...tc,
      eventId: selectedEvent.id,
      eventName: selectedEvent.name,
      eventDateDisplay: selectedEvent.dateDisplay,
      eventTimeDisplay: selectedEvent.timeDisplay,
      eventTimezone: selectedEvent.timezone,
    }));
  }, [selectedEvent]);

  const filteredTickets = useMemo(() => {
    return allTicketsForEvent.filter(ticket =>
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allTicketsForEvent, searchTerm]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const currentDisplayTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTickets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTickets, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSaveTicket = (ticketData: Omit<TicketCategory, 'id'> & { id?: string }) => {
    const updatedCategories = [...(selectedEvent.ticketCategories || [])];
    const fullTicketData: TicketCategory = {
      id: ticketData.id || `ticket-${Date.now()}`,
      name: ticketData.name,
      categoryLabel: ticketData.categoryLabel,
      price: ticketData.price,
      description: ticketData.description,
      maxQuantity: ticketData.maxQuantity,
      availabilityStatus: 'available', // Default status
      useEventSchedule: ticketData.useEventSchedule,
      ticketStartDate: ticketData.ticketStartDate,
      ticketEndDate: ticketData.ticketEndDate,
      ticketStartTime: ticketData.ticketStartTime,
      ticketEndTime: ticketData.ticketEndTime,
      ticketIsTimeRange: ticketData.ticketIsTimeRange,
      ticketTimezone: ticketData.ticketTimezone,
    };

    const existingIndex = updatedCategories.findIndex(tc => tc.id === fullTicketData.id);
    if (existingIndex !== -1) {
      updatedCategories[existingIndex] = fullTicketData;
    } else {
      updatedCategories.push(fullTicketData);
    }
    
    onUpdateEvent({ ...selectedEvent, ticketCategories: updatedCategories });
    setShowAddEditTicketModal(false);
    setEditingTicket(null);
  };
  
  const handleDeleteTicket = (ticketToDelete: TicketCategoryWithEventInfo) => {
    const updatedCategories = selectedEvent.ticketCategories.filter(tc => tc.id !== ticketToDelete.id);
    onUpdateEvent({ ...selectedEvent, ticketCategories: updatedCategories });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <div className="mt-8 flex justify-center items-center space-x-1">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button key={page} onClick={() => setCurrentPage(page)} className={`px-3.5 py-1.5 text-sm rounded-md ${currentPage === page ? 'bg-hegra-turquoise text-white' : 'bg-white'}`}>{page}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={16} /></button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Manajemen Tiket</h1>
      <p className="text-sm text-gray-600">Event: <strong className="text-hegra-turquoise">{selectedEvent.name}</strong></p>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button onClick={() => setActiveTab('management')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'management' ? 'border-hegra-turquoise text-hegra-turquoise' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Manajemen Tiket</button>
          <button onClick={() => setActiveTab('report')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'report' ? 'border-hegra-turquoise text-hegra-turquoise' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Laporan Tiket</button>
        </nav>
      </div>

      {activeTab === 'management' && (
        <div className="bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Cari nama tiket" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 text-sm" />
            </div>
            <button onClick={() => { setEditingTicket(null); setShowAddEditTicketModal(true); }} className="w-full sm:w-auto bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-sm flex-shrink-0">
              <PlusCircle size={18} /> Tambah Tiket
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentDisplayTickets.map(ticket => (
              <TicketItemCardDB key={ticket.id} ticket={ticket} onEdit={() => { setEditingTicket(ticket); setShowAddEditTicketModal(true); }} onDelete={() => handleDeleteTicket(ticket)} />
            ))}
          </div>

          {filteredTickets.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                  <Info size={32} className="mx-auto mb-2 text-gray-400" />
                  <p>Belum ada tiket yang ditambahkan untuk event ini.</p>
              </div>
          )}

          {renderPagination()}
        </div>
      )}

      {activeTab === 'report' && (
        <div className="bg-white p-6 rounded-b-lg border border-t-0 border-gray-200 text-center">
            <Info size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">Fitur Segera Hadir</h3>
            <p className="text-sm text-gray-500 mt-1">Halaman laporan tiket sedang dalam pengembangan.</p>
        </div>
      )}

      {showAddEditTicketModal && (
        <AddTicketModal isOpen={showAddEditTicketModal} onClose={() => setShowAddEditTicketModal(false)} onSave={handleSaveTicket} initialTicketData={editingTicket} eventTimezone={selectedEvent.timezone} />
      )}
    </div>
  );
};

export default TicketManagementPage;
