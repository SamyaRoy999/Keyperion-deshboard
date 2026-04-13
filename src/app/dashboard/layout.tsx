"use client"
import Sidebar from '@/components/common/dash/sideber';
import { childrenProps } from '@/types';
import React, { useState } from 'react'

export default function AppLayout({ children }: childrenProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="flex h-screen overflow-hidden">
            {/* <!-- ===== Sidebar Start ===== --> */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <div>{children}</div>
            </div>
        </div>
    )
}
