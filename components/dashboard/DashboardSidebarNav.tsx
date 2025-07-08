
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import Logo from '../Logo';
import { PageName } from '../../HegiraApp';
import { CombinedDashboardViewId } from './DashboardLayout'; // Updated import
import { SidebarOpen, SidebarClose } from 'lucide-react';


export interface SidebarItem {
  id: CombinedDashboardViewId; 
  label: string;
  icon: React.ElementType; 
  path: string; 
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface DashboardSidebarNavProps {
  sidebarSections: SidebarSection[];
  activeViewId: CombinedDashboardViewId; 
  onSelectView: (viewId: CombinedDashboardViewId) => void; 
  isDesktopSidebarOpen: boolean; 
  onToggleDesktopSidebar: () => void; 
  onNavigate: (page: PageName, data?: any) => void; 
  onCloseMobileSidebar: () => void;
}

const DashboardSidebarNav: React.FC<DashboardSidebarNavProps> = ({
  sidebarSections,
  activeViewId,
  onSelectView,
  isDesktopSidebarOpen, 
  onToggleDesktopSidebar, 
  onNavigate,
  onCloseMobileSidebar
}) => {
  
  const handleItemClick = (viewId: CombinedDashboardViewId) => { 
    onSelectView(viewId);
    if (window.innerWidth < 768) { 
        onCloseMobileSidebar();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo Area & Desktop Toggle */}
      <div 
        className={`flex items-center px-3 sm:px-4 h-16 shrink-0 border-b border-gray-200 
                    ${isDesktopSidebarOpen ? 'justify-between' : 'justify-center md:justify-end'}`}
      >
        {/* Logo - Visible when sidebar is open or on mobile (where isDesktopSidebarOpen is effectively true for layout) */}
        {isDesktopSidebarOpen && (
            <button 
                onClick={() => { onNavigate('landing'); onCloseMobileSidebar();}} 
                aria-label="Hegira Beranda" 
                className="focus:outline-none md:mr-2"
            >
            <Logo className="h-8 w-auto" />
            </button>
        )}
        
        {/* Desktop Sidebar Toggle Button */}
        <button
          onClick={onToggleDesktopSidebar}
          className="hidden md:block text-gray-500 hover:text-hegra-turquoise p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-hegra-yellow"
          aria-label={isDesktopSidebarOpen ? "Minimize sidebar" : "Expand sidebar"}
        >
          {isDesktopSidebarOpen ? <SidebarClose size={20} /> : <Logo className="h-5 w-auto" />}
        </button>
      </div>


      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {sidebarSections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}>
            {isDesktopSidebarOpen && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-hegra-deep-navy/70 tracking-wider uppercase">
                {section.title}
              </h3>
            )}
            {!isDesktopSidebarOpen && sectionIndex > 0 && <div className="h-4"></div>} 
            
            <div className="space-y-1">
              {section.items.map(item => (
                <button
                  key={item.id as string} // Cast to string if id can be number
                  onClick={() => handleItemClick(item.id)}
                  title={!isDesktopSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center py-2.5 rounded-md transition-all duration-200 text-sm group
                    ${isDesktopSidebarOpen ? 'px-3 space-x-3' : 'px-3 justify-center'}
                    ${
                      activeViewId === item.id
                        ? 'bg-hegra-turquoise/20 text-hegra-turquoise font-medium shadow-sm'
                        : 'text-hegra-deep-navy/70 hover:text-hegra-turquoise hover:bg-hegra-turquoise/10'
                    }
                  `}
                  aria-current={activeViewId === item.id ? 'page' : undefined}
                >
                  <item.icon
                    size={isDesktopSidebarOpen ? 18 : 22}
                    className={`flex-shrink-0 transition-colors
                      ${
                        activeViewId === item.id
                          ? 'text-hegra-turquoise'
                          : 'text-hegra-deep-navy/60 group-hover:text-hegra-turquoise'
                      }
                    `}
                  />
                  {isDesktopSidebarOpen && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebarNav;
