
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { AuthRoleType } from '../../HegiraApp';

interface RoleTabsProps {
  roles: AuthRoleType[] | string[]; // Allow string array for CreatorAuthPage
  activeRole: AuthRoleType | string;
  onRoleChange: (role: AuthRoleType | string) => void;
  primaryColor?: string; 
  accentColor?: string;  
  textColor?: string;    
  inactiveTextColor?: string;
  borderColor?: string; // New prop for the bottom border of the tab container
}

const RoleTabs: React.FC<RoleTabsProps> = ({
  roles,
  activeRole,
  onRoleChange,
  primaryColor = 'hegira-turquoise', 
  accentColor = 'hegira-yellow',     
  textColor = 'hegira-navy',         
  inactiveTextColor = 'gray-500', 
  borderColor = 'gray-200'        
}) => {
  // Construct dynamic Tailwind classes to ensure they are processed
  const activeBorderClass = `border-${accentColor.replace('#', '')}`; // e.g., border-hegira-auth-accent or border-F5AF47
  const activeTextClass = `text-${textColor.replace('#', '')}`;     // e.g., text-hegira-auth-primary or text-339999
  const inactiveTextClass = `text-${inactiveTextColor}`;
  const hoverTextClass = `hover:text-${textColor.replace('#', '')}`;
  const hoverBorderClass = `hover:border-${accentColor.replace('#', '')}/50`;
  const containerBorderClass = `border-${borderColor}`;

  return (
    <div className="mb-6">
      <div className={containerBorderClass + ' border-b'}>
        <nav className="-mb-px flex space-x-2 sm:space-x-4" aria-label="Tabs">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-150
                ${
                  activeRole === role
                    ? `${activeBorderClass} ${activeTextClass}`
                    : `border-transparent ${inactiveTextClass} ${hoverTextClass} ${hoverBorderClass}`
                }
              `}
              aria-current={activeRole === role ? 'page' : undefined}
            >
              {role}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default RoleTabs;
