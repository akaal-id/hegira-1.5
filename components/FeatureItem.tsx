/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

export interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBgClass: string;
  iconColorClass: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, title, description, iconBgClass, iconColorClass }) => (
  <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 flex flex-col items-center text-center h-full hover:border-hegra-turquoise/20 hover:-translate-y-1 transition-all duration-300">
    <div className={`p-4 rounded-full ${iconBgClass} mb-4 sm:mb-6 inline-block`}>
      <Icon size={32} className={iconColorClass} />
    </div>
    <h3 className="text-xl font-semibold text-hegra-deep-navy mb-2">{title}</h3>
    <p className="text-sm text-gray-600 flex-grow">{description}</p>
  </div>
);

export default FeatureItem;