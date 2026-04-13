import Avatars from "@/components/reuseable/avater";
import { BackBtn } from "@/components/reuseable/back-btn";
import React from "react";

const activityLog = [
  { user: "Marks", action: "Marks books an appointment.", time: "09:00 AM", active: true },
  { user: "Daniel", action: "Daniel books an appointment.", time: "09:00 AM", active: true },
  { user: "Sarah", action: "Sarah cancels her appointment.", time: "10:30 AM", active: false },
  { user: "John", action: "John reschedules his appointment.", time: "11:15 AM", active: true },
  { user: "Emily", action: "Emily confirms her appointment.", time: "01:45 PM", active: false },
  { user: "Michael", action: "Michael requests a new appointment.", time: "03:20 PM", active: true },
  { user: "Jessica", action: "Jessica updates her profile information.", time: "04:00 PM", active: false },
  { user: "David", action: "David sends a message to support.", time: "05:30 PM", active: true }
];

 
export default function Ntification() {
  return (

    <div className="wapper">
      <ul className="flex-between mb-10">
         <li className="text-lg font-semibold flex items-center space-x-2"><BackBtn/> <span className="relative -ml-4">Notification</span></li>
         <li className="text-red-500 underline cursor-pointer">Read all</li>
      </ul>
      <div>
        <div className="space-y-4">
          {activityLog.map((item, index) => (
            <div key={index} className={`flex items-center ${item.active && "bg-[#575757]/20 *:text-blacks"}  py-2 px-2 rounded-md justify-between space-x-2`}>
              <div className="flex space-x-2 items-center">
                <Avatars src="" fallback={item.user} alt={item.user} fallbackStyle="fallbackStyle" />
                <p className={`text-figma-gray  ${item.active && "!text-blacks"}`}>{item.action}</p>
              </div>
              <p className="text-figma-gray text-sm">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
