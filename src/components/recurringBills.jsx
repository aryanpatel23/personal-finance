import React, { useState, useMemo } from "react";
import data from "../data.json";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CheckCircle, AlertCircle } from "lucide-react";

// Helper to get due date string from date
function getDueDate(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const suffix = ["th", "st", "nd", "rd"][
    day % 10 > 3 || ~~((day % 100) / 10) === 1 ? 0 : day % 10
  ];
  return `Monthly - ${day}${suffix}`;
}

// Helper to get status (paid, due soon, upcoming)
function getBillStatus(bill) {
  const today = new Date();
  const dueDate = new Date(bill.date);
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  if (dueDate < today) return "paid";
  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays <= 7) return "due";
  return "upcoming";
}

export default function RecurringBills() {
  const bills = data.transactions.filter((t) => t.recurring);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Latest");

  // Filtered and sorted bills
  const filteredBills = useMemo(() => {
    let filtered = bills.filter((bill) =>
      bill.name.toLowerCase().includes(search.toLowerCase())
    );
    filtered = filtered.sort((a, b) => {
      if (sort === "Latest") return new Date(b.date) - new Date(a.date);
      else return new Date(a.date) - new Date(b.date);
    });
    return filtered;
  }, [bills, search, sort]);

  return (
    <div className="min-h-screen bg-[#F8F4F0] w-full">
      <div className="flex-1 flex flex-col lg:flex-row gap-12 px-20 py-12 max-w-[1500px] mx-auto">
        {/* Left: Summary */}
        <div className="w-full lg:w-[300px] flex flex-col gap-8">
          <div className="bg-black text-white rounded-xl p-6 flex flex-col items-start shadow">
            <div className="text-lg mb-2 flex items-center gap-2">
              <span className="inline-block w-7 h-7 bg-white/10 rounded-full flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M16 3v4M8 3v4M3 11h18" />
                </svg>
              </span>
              <span className="font-semibold">Total Bills</span>
            </div>
            <div className="text-3xl font-bold mt-2">$384.98</div>
          </div>
          <div className="bg-white rounded-xl p-6 flex flex-col gap-2 shadow border border-[#ECE9E6] ">
            <div className="font-semibold mb-2 text-[#201F24]">Summary</div>
            <div className="flex justify-between items-center py-1 border-b border-[#ECE9E6] last:border-b-0">
              <span className="text-[#201F24]">Paid Bills</span>
              <span className="text-[#201F24]">4 ($190.00)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#ECE9E6] last:border-b-0">
              <span className="text-[#201F24]">Total Upcoming</span>
              <span className="text-[#201F24]">4 ($194.98)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-red-600">Due Soon</span>
              <span className="text-red-600">2 ($59.98)</span>
            </div>
          </div>
        </div>
        {/* Right: Bills Table */}
        <div className="flex-1 min-w-[650px]">
          <div className="bg-white rounded-xl shadow p-12">
            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative w-full md:w-[320px]">
                <Input
                  className="h-11 rounded-xl border text-base pl-12 pr-4 bg-[#F8F4F0] border-[#ECE9E6] placeholder:text-[#B3B3B3]"
                  placeholder="Search bills"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B3B3B3] w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#696868]">Sort by</span>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[120px] bg-[#F8F4F0] border border-[#ECE9E6] rounded-xl">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="Latest">Latest</SelectItem>
                    <SelectItem value="Oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Table Header */}
            <div className="grid grid-cols-12 py-2 px-2 text-xs font-semibold text-[#B3B3B3] border-b border-[#ECE9E6]">
              <div className="col-span-6">Bill Title</div>
              <div className="col-span-3">Due Date</div>
              <div className="col-span-3 text-right">Amount</div>
            </div>
            {/* Table Rows */}
            {filteredBills.map((bill, idx) => {
              const status = getBillStatus(bill);
              return (
                <div
                  key={idx}
                  className="grid grid-cols-12 items-center py-4 px-2 border-b border-[#ECE9E6] last:border-b-0 hover:bg-[#F8F4F0] transition"
                >
                  {/* Icon and Name */}
                  <div className="col-span-6 flex items-center gap-3">
                    <img
                      src={bill.avatar}
                      alt={bill.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="font-semibold text-[#201F24]">
                      {bill.name}
                    </span>
                  </div>
                  {/* Due Date */}
                  <div className="col-span-3 flex items-center gap-2">
                    <span
                      className={
                        status === "due"
                          ? "text-red-600 font-medium"
                          : status === "paid"
                          ? "text-[#277C78] font-medium"
                          : "text-[#277C78] font-medium"
                      }
                    >
                      {getDueDate(bill.date)}
                    </span>
                    {status === "paid" && (
                      <CheckCircle className="w-4 h-4 text-[#277C78]" />
                    )}
                    {status === "due" && (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  {/* Amount */}
                  <div
                    className={`col-span-3 text-right font-bold ${
                      status === "due" ? "text-red-600" : "text-[#201F24]"
                    }`}
                  >
                    ${Math.abs(bill.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
            {filteredBills.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                No bills found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
