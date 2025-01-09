import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sideBar";
import DataTableDemo from "@/components/Transaction";
import transactions from "/Users/aryanpatel/Desktop/personal_finance/src/data.json"; // Import the JSON data

export default function Layout() {
  return (
    <Router>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <SidebarTrigger />
          <Routes>
            <Route path="/" element={<div>Welcome to the Dashboard</div>} />
            <Route path="/overview" element={<div>Overview Page</div>} />
            <Route path="/budget" element={<div>Budget Page</div>} />
            <Route
              path="/transactions"
              element={<DataTableDemo transactions={transactions} />} // Pass data as prop
            />
            <Route path="/pots" element={<div>Pots Page</div>} />
            <Route
              path="/recurring-bills"
              element={<div>Recurring Bills Page</div>}
            />
          </Routes>
        </main>
      </SidebarProvider>
    </Router>
  );
}
