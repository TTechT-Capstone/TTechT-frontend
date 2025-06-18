'use client';

import React, { useState } from 'react';
import LeftSideProfile from './LeftSideProfile';
import RightSideProfile from './RightSideProfile';

export default function ProfilePage() {
  const [activeSection, setActiveSection] = useState(1);

  return (
    <div className="overflow-x-hidden bg-[#F5F5F5] min-h-screen">
      {/* Header */}
      <div className="flex justify-center mt-6 p-4">
        <h1 className="font-urbanist font-bold text-primary text-[40px]">
          My Account
        </h1>
      </div>

      {/* Content Layout */}
      <div className="flex flex-row items-start max-w-screen-lg mx-auto mt-4">
        {/* Left Side */}
        <div className="w-1/4">
          <LeftSideProfile setActiveSection={setActiveSection} />
        </div>

        {/* Right Side */}
        <div className="w-3/4 ml-6">
          <RightSideProfile setActiveSection={setActiveSection} />
        </div>
      </div>
    </div>
  );
}
