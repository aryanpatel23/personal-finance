import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sideBar";
import DataTableDemo from "@/components/Transaction";
import transactions from "./data.json"; // Import the JSON data
import { CardWithForm } from "@/components/pots"; // Import the CardWithForm component
import Budgets from "./components/budget";
import RecurringBills from "./components/recurringBills";

import Overview from "./components/Overview";

export default function Layout() {
  return (
    <Router>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/budget" element={<Budgets />} />

            <Route
              path="/transactions"
              element={<DataTableDemo transactions={transactions} />}
            />
            <Route path="/pots" element={<CardWithForm />} />
            <Route path="/recurring-bills" element={<RecurringBills />} />
          </Routes>
        </main>
      </SidebarProvider>
    </Router>
  );
}
