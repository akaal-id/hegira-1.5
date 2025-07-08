
<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useMemo, useEffect } from 'react';
import { EventData, TicketCategory, formatEventTime } from '../../HegiraApp';
import TicketItemCardDB from '../../components/dashboard/TicketItemCardDB';
<<<<<<< HEAD
import CouponItemCardDB, { CouponData } from '../../components/dashboard/CouponItemCardDB'; 
import AddTicketModal from '../../components/dashboard/modals/AddTicketModal'; 
import AddCouponModal from '../../components/dashboard/modals/AddCouponModal'; 
import { PlusCircle, Search, ChevronLeft, ChevronRight as ChevronRightIcon, ArrowLeft, Info } from 'lucide-react';
import { DashboardViewId } from '../DashboardPage'; 
=======
import CouponItemCardDB, { CouponData } from '../../components/dashboard/CouponItemCardDB';
import AddTicketModal from '../../components/dashboard/modals/AddTicketModal';
import AddCouponModal from '../../components/dashboard/modals/AddCouponModal';
import { PlusCircle, Search, ChevronLeft, ChevronRight as ChevronRightIcon, ArrowLeft, Info } from 'lucide-react';
import { DashboardViewId } from '../DashboardPage';

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec

export interface TicketCategoryWithEventInfo extends TicketCategory {
  eventId: number;
  eventName: string;
  eventDateDisplay: string; // Main event date
  eventTimeDisplay: string; // Main event time
  eventTimezone?: string; // Main event timezone
}

<<<<<<< HEAD
interface TiketKuponDBProps {
  allEvents: EventData[]; 
  currentEventContext: EventData | null; 
  onSetContextEvent: (event: EventData | null) => void; 
  onSwitchView: (viewId: DashboardViewId, data?: any) => void; 
}

=======

interface TiketKuponDBProps {
  allEvents: EventData[];
  currentEventContext: EventData | null;
  onSetContextEvent: (event: EventData | null) => void;
  onSwitchView: (viewId: DashboardViewId, data?: any) => void;
}


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
const ITEMS_PER_PAGE_TICKETS = 10;
const ITEMS_PER_PAGE_COUPONS = 10;


<<<<<<< HEAD
=======


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
const TiketKuponDB: React.FC<TiketKuponDBProps> = ({ allEvents, currentEventContext, onSetContextEvent, onSwitchView }) => {
  const [activeTab, setActiveTab] = useState<'tiket' | 'kupon'>('tiket');
  const [searchTermTickets, setSearchTermTickets] = useState('');
  const [searchTermCoupons, setSearchTermCoupons] = useState('');
<<<<<<< HEAD
  
  const [couponsForSelectedEvent, setCouponsForSelectedEvent] = useState<CouponData[]>([]);
  
  const [currentPageTickets, setCurrentPageTickets] = useState(1);
  const [currentPageCoupons, setCurrentPageCoupons] = useState(1);

=======
 
  const [couponsForSelectedEvent, setCouponsForSelectedEvent] = useState<CouponData[]>([]);
 
  const [currentPageTickets, setCurrentPageTickets] = useState(1);
  const [currentPageCoupons, setCurrentPageCoupons] = useState(1);


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const [showAddEditTicketModal, setShowAddEditTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketCategoryWithEventInfo | null>(null);
  const [showAddEditCouponModal, setShowAddEditCouponModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);


<<<<<<< HEAD
  useEffect(() => {
    if (currentEventContext) {
      setCouponsForSelectedEvent([]); 
=======


  useEffect(() => {
    if (currentEventContext) {
      setCouponsForSelectedEvent([]);
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      setCurrentPageTickets(1);
      setCurrentPageCoupons(1);
      setActiveTab('tiket');
    }
  }, [currentEventContext]);


<<<<<<< HEAD
  const handleBackToEventList = () => {
    onSwitchView('daftarEvent'); 
  };


  const ticketsForSelectedEvent: TicketCategoryWithEventInfo[] = useMemo(() => {
    if (!currentEventContext) return [];
    return (currentEventContext.ticketCategories || []) 
=======


  const handleBackToEventList = () => {
    onSwitchView('daftarEvent');
  };




  const ticketsForSelectedEvent: TicketCategoryWithEventInfo[] = useMemo(() => {
    if (!currentEventContext) return [];
    return (currentEventContext.ticketCategories || [])
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      .map(tc => ({
        ...tc,
        eventId: currentEventContext.id,
        eventName: currentEventContext.name,
        eventDateDisplay: currentEventContext.dateDisplay,
        eventTimeDisplay: currentEventContext.timeDisplay,
        eventTimezone: currentEventContext.timezone,
      }))
<<<<<<< HEAD
      .filter(ticket => 
=======
      .filter(ticket =>
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
        ticket.name.toLowerCase().includes(searchTermTickets.toLowerCase())
      );
  }, [currentEventContext, searchTermTickets]);

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const totalPagesTickets = Math.ceil(ticketsForSelectedEvent.length / ITEMS_PER_PAGE_TICKETS);
  const currentDisplayTickets = useMemo(() => {
    const startIndex = (currentPageTickets - 1) * ITEMS_PER_PAGE_TICKETS;
    return ticketsForSelectedEvent.slice(startIndex, startIndex + ITEMS_PER_PAGE_TICKETS);
  }, [ticketsForSelectedEvent, currentPageTickets]);

<<<<<<< HEAD
  const filteredCoupons = useMemo(() => {
    return couponsForSelectedEvent.filter(coupon => 
=======

  const filteredCoupons = useMemo(() => {
    return couponsForSelectedEvent.filter(coupon =>
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      coupon.name.toLowerCase().includes(searchTermCoupons.toLowerCase()) ||
      coupon.code.toLowerCase().includes(searchTermCoupons.toLowerCase())
    );
  }, [couponsForSelectedEvent, searchTermCoupons]);

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const totalPagesCoupons = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE_COUPONS);
  const currentDisplayCoupons = useMemo(() => {
    const startIndex = (currentPageCoupons - 1) * ITEMS_PER_PAGE_COUPONS;
    return filteredCoupons.slice(startIndex, startIndex + ITEMS_PER_PAGE_COUPONS);
  }, [filteredCoupons, currentPageCoupons]);


<<<<<<< HEAD
=======


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const handleAddTicketClick = () => {
    setEditingTicket(null);
    setShowAddEditTicketModal(true);
  };

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const handleEditTicketClick = (ticket: TicketCategoryWithEventInfo) => {
    setEditingTicket(ticket);
    setShowAddEditTicketModal(true);
  };
<<<<<<< HEAD
  
  const handleSaveTicket = (ticketData: Omit<TicketCategory, 'id'> & { id?: string }) => {
    if (!currentEventContext) return;

=======
 
  const handleSaveTicket = (ticketData: Omit<TicketCategory, 'id'> & { id?: string }) => {
    if (!currentEventContext) return;


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
    const updatedCategories = [...(currentEventContext.ticketCategories || [])];
    // Ensure all fields from TicketCategory are preserved or updated
    const fullTicketData: TicketCategory = {
      id: ticketData.id || `ticket-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: ticketData.name,
<<<<<<< HEAD
      categoryLabel: ticketData.categoryLabel,
=======
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      price: ticketData.price,
      description: ticketData.description,
      maxQuantity: ticketData.maxQuantity,
      availabilityStatus: ticketData.availabilityStatus,
      useEventSchedule: ticketData.useEventSchedule,
      ticketStartDate: ticketData.ticketStartDate,
      ticketEndDate: ticketData.ticketEndDate,
      ticketStartTime: ticketData.ticketStartTime,
      ticketEndTime: ticketData.ticketEndTime,
      ticketIsTimeRange: ticketData.ticketIsTimeRange,
      ticketTimezone: ticketData.ticketTimezone,
    };


<<<<<<< HEAD
    if (editingTicket && editingTicket.id === fullTicketData.id) { 
=======


    if (editingTicket && editingTicket.id === fullTicketData.id) {
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      const index = updatedCategories.findIndex(tc => tc.id === editingTicket.id);
      if (index !== -1) {
        updatedCategories[index] = { ...updatedCategories[index], ...fullTicketData };
      }
    } else if (editingTicket && ticketData.id && ticketData.id !== editingTicket.id) { // ID changed during edit, treat as new but try to replace old one if found
      const oldIndex = updatedCategories.findIndex(tc => tc.id === editingTicket.id);
      if (oldIndex !== -1) {
        updatedCategories.splice(oldIndex, 1, fullTicketData);
      } else {
         updatedCategories.push(fullTicketData); // Fallback to add if old not found
      }
    }
<<<<<<< HEAD
    else { 
      updatedCategories.push(fullTicketData);
    }
    
    onSetContextEvent({ ...currentEventContext, ticketCategories: updatedCategories });

=======
    else {
      updatedCategories.push(fullTicketData);
    }
   
    onSetContextEvent({ ...currentEventContext, ticketCategories: updatedCategories });


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
    setShowAddEditTicketModal(false);
    setEditingTicket(null);
  };

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const handleDeleteTicket = (ticketToDelete: TicketCategoryWithEventInfo) => {
    if (!currentEventContext) return;
    if (window.confirm(`Anda yakin ingin menghapus tiket "${ticketToDelete.name}" dari event "${currentEventContext.name}"? Aksi ini tidak dapat diurungkan.`)) {
      const updatedCategories = (currentEventContext.ticketCategories || []).filter(tc => tc.id !== ticketToDelete.id);
      onSetContextEvent({ ...currentEventContext, ticketCategories: updatedCategories });
      alert(`Tiket "${ticketToDelete.name}" dihapus (simulasi).`);
    }
  };

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const handleAddCouponClick = () => {
    setEditingCoupon(null);
    setShowAddEditCouponModal(true);
  };

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const handleEditCouponClick = (coupon: CouponData) => {
    setEditingCoupon(coupon);
    setShowAddEditCouponModal(true);
  };

<<<<<<< HEAD
  const handleSaveCoupon = (couponData: Omit<CouponData, 'id'> & { id?: string }) => {
    if (editingCoupon) { 
      setCouponsForSelectedEvent(prev => 
        prev.map(c => c.id === editingCoupon.id ? { ...editingCoupon, ...couponData } : c)
      );
    } else { 
=======

  const handleSaveCoupon = (couponData: Omit<CouponData, 'id'> & { id?: string }) => {
    if (editingCoupon) {
      setCouponsForSelectedEvent(prev =>
        prev.map(c => c.id === editingCoupon.id ? { ...editingCoupon, ...couponData } : c)
      );
    } else {
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      const newCouponId = couponData.id || `coupon-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      setCouponsForSelectedEvent(prev => [...prev, { ...couponData, id: newCouponId }]);
    }
    setShowAddEditCouponModal(false);
    setEditingCoupon(null);
  };
<<<<<<< HEAD
  
=======
 
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const handleDeleteCoupon = (couponToDelete: CouponData) => {
     if (window.confirm(`Anda yakin ingin menghapus kupon "${couponToDelete.name}"? Aksi ini tidak dapat diurungkan.`)) {
      setCouponsForSelectedEvent(prev => prev.filter(c => c.id !== couponToDelete.id));
      alert(`Kupon "${couponToDelete.name}" dihapus (simulasi).`);
    }
  };


<<<<<<< HEAD
=======


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  const renderPagination = (currentPage: number, totalPages: number, onPageChange: (page: number) => void, totalItems: number, itemsPerPage: number, displayedItems: number) => {
    if (totalPages <= 1) return null;
    const pageNumbers = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);
        if (currentPage > 4) pageNumbers.push('...');
        for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
            pageNumbers.push(i);
        }
        if (currentPage < totalPages - 3) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
    return (
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 bg-white p-4 rounded-b-lg border-t border-gray-200">
        <p className="mb-2 sm:mb-0">
          Menampilkan {displayedItems > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} item
        </p>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
            aria-label="Halaman Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers.map((number, index) =>
            typeof number === 'string' ? (
              <span key={`ellipsis-${index}`} className="px-2 py-1.5 text-gray-500">...</span>
            ) : (
              <button
                key={number}
                onClick={() => onPageChange(number)}
                className={`px-3 py-1.5 rounded-md transition-colors border focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50
<<<<<<< HEAD
                  ${currentPage === number 
                    ? 'bg-hegra-turquoise text-white font-semibold border-hegra-turquoise' 
=======
                  ${currentPage === number
                    ? 'bg-hegra-turquoise text-white font-semibold border-hegra-turquoise'
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                  }`}
                aria-label={`Ke Halaman ${number}`}
                aria-current={currentPage === number ? 'page' : undefined}
              >
                {number}
              </button>
            )
          )}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-md bg-white text-gray-500 hover:bg-gray-100 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50"
            aria-label="Halaman Berikutnya"
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    );
  };

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  if (!currentEventContext) {
    return (
      <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full space-y-6 text-center">
         <Info size={48} className="mx-auto text-gray-400 my-6" />
        <h1 className="text-xl font-semibold text-hegra-deep-navy">Pilih Event Terlebih Dahulu</h1>
        <p className="text-gray-600 mb-6">Untuk mengelola tiket dan kupon, silakan pilih event dari daftar event utama.</p>
        <button
            onClick={handleBackToEventList}
            className="bg-hegra-turquoise text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 mx-auto"
        >
            <ArrowLeft size={18} /> Kembali ke Daftar Event
        </button>
      </div>
    );
  }

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
  return (
    <div className="p-0 sm:p-2 md:p-4 bg-gray-50 min-h-full space-y-2">
      <h1 className="text-2xl sm:text-3xl font-bold text-hegra-deep-navy">Manajemen Tiket & Kupon</h1>
      <p className="text-sm text-gray-600 mb-6">
        Event: <strong className="text-hegra-turquoise">{currentEventContext.name}</strong>
      </p>

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      <div className="border-b border-gray-200 bg-white px-4 pt-2 rounded-t-lg">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('tiket')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
<<<<<<< HEAD
                  ${activeTab === 'tiket' 
                  ? 'border-hegra-turquoise text-hegra-turquoise' 
=======
                  ${activeTab === 'tiket'
                  ? 'border-hegra-turquoise text-hegra-turquoise'
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Tiket
            </button>
            <button
              onClick={() => setActiveTab('kupon')}
              className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm
<<<<<<< HEAD
                  ${activeTab === 'kupon' 
                  ? 'border-hegra-turquoise text-hegra-turquoise' 
=======
                  ${activeTab === 'kupon'
                  ? 'border-hegra-turquoise text-hegra-turquoise'
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Kupon
            </button>
        </nav>
      </div>

<<<<<<< HEAD
      {activeTab === 'tiket' && (
        <div className="space-y-6 bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
          <div className="flex items-center gap-4"> 
=======

      {activeTab === 'tiket' && (
        <div className="space-y-6 bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
          <div className="flex items-center gap-4">
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama tiket"
                value={searchTermTickets}
                onChange={(e) => { setSearchTermTickets(e.target.value); setCurrentPageTickets(1); }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm bg-white"
              />
            </div>
            <button
              onClick={handleAddTicketClick}
              className="bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm flex-shrink-0"
            >
              <PlusCircle size={18} /> Tambah Tiket Baru
            </button>
          </div>
          {currentDisplayTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentDisplayTickets.map((ticket) => (
<<<<<<< HEAD
                <TicketItemCardDB 
                  key={`${ticket.eventId}-${ticket.id}`} 
=======
                <TicketItemCardDB
                  key={`${ticket.eventId}-${ticket.id}`}
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
                  ticket={ticket}
                  onEdit={() => handleEditTicketClick(ticket)}
                  onDelete={() => handleDeleteTicket(ticket)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Search size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Tidak ada tiket yang dikonfigurasi untuk event ini, atau tidak cocok dengan pencarian.</p>
            </div>
          )}
          {renderPagination(currentPageTickets, totalPagesTickets, setCurrentPageTickets, ticketsForSelectedEvent.length, ITEMS_PER_PAGE_TICKETS, currentDisplayTickets.length)}
        </div>
      )}
<<<<<<< HEAD
      
=======
     
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      {activeTab === 'kupon' && (
        <div className="space-y-6 bg-white p-4 rounded-b-lg border border-t-0 border-gray-200">
           <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau kode kupon"
                value={searchTermCoupons}
                onChange={(e) => { setSearchTermCoupons(e.target.value); setCurrentPageCoupons(1); }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-hegra-turquoise/20 focus:border-hegra-turquoise/50 text-sm bg-white"
              />
            </div>
            <button
              onClick={handleAddCouponClick}
              className="bg-hegra-turquoise text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 text-sm flex-shrink-0 hover:bg-opacity-90"
            >
              <PlusCircle size={18} /> Tambah Kupon Baru
            </button>
          </div>
           {currentDisplayCoupons.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentDisplayCoupons.map((coupon) => (
                    <CouponItemCardDB
                        key={coupon.id}
                        coupon={coupon}
<<<<<<< HEAD
                        eventTickets={currentEventContext?.ticketCategories || []}
=======
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
                        onEdit={() => handleEditCouponClick(coupon)}
                        onDelete={() => handleDeleteCoupon(coupon)}
                    />
                ))}
             </div>
           ) : (
            <div className="text-center py-10">
                <Search size={40} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">Belum ada kupon yang ditambahkan untuk event ini.</p>
            </div>
           )}
          {renderPagination(currentPageCoupons, totalPagesCoupons, setCurrentPageCoupons, filteredCoupons.length, ITEMS_PER_PAGE_COUPONS, currentDisplayCoupons.length)}
        </div>
      )}

<<<<<<< HEAD
=======

>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      {showAddEditTicketModal && (
        <AddTicketModal
          isOpen={showAddEditTicketModal}
          onClose={() => { setShowAddEditTicketModal(false); setEditingTicket(null); }}
          onSave={handleSaveTicket}
          initialTicketData={editingTicket}
<<<<<<< HEAD
          eventTimezone={currentEventContext?.timezone} 
        />
      )}

=======
          eventTimezone={currentEventContext?.timezone}
        />
      )}


>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
      {showAddEditCouponModal && (
        <AddCouponModal
            isOpen={showAddEditCouponModal}
            onClose={() => { setShowAddEditCouponModal(false); setEditingCoupon(null); }}
            onSave={handleSaveCoupon}
            initialCouponData={editingCoupon}
<<<<<<< HEAD
            availableTickets={currentEventContext?.ticketCategories || []}
=======
>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
        />
      )}
    </div>
  );
};

<<<<<<< HEAD
export default TiketKuponDB;
=======

export default TiketKuponDB;



>>>>>>> 9d6e35a8089e767e27e085b51a51b23558e643ec
