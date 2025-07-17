import React, { useState } from "react";
import data from "/Users/aryanpatel/Desktop/personal_finance/src/data.json";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, MoreHorizontal, Plus, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Label } from "recharts";

// Helper: get color for each category
const categoryColors = {
  Entertainment: "#277C78",
  Bills: "#82C9D7",
  "Dining Out": "#F2CDAC",
  "Personal Care": "#626070",
  // Ensure all categories have a default color if not using themes initially
  Transportation: "#FF7F50", // Example color
  Shopping: "#DA70D6", // Example color
  Healthcare: "#6A5ACD", // Example color
  Education: "#ADD8E6", // Example color
};

// Available budget categories
const availableCategories = [
  "Entertainment",
  "Bills",
  "Dining Out",
  "Personal Care",
  "Transportation",
  "Shopping",
  "Healthcare",
  "Education",
];

// Available themes
const availableThemes = [
  { name: "Ocean Blue", color: "#277C78" },
  { name: "Sky Blue", color: "#82C9D7" },
  { name: "Sunset Orange", color: "#F2CDAC" },
  { name: "Slate Gray", color: "#626070" },
  { name: "Forest Green", color: "#4A759" }, // This looks like an incomplete hex code
  { name: "Lavender", color: "#9B7DE" }, // This looks like an incomplete hex code
  { name: "Coral", color: "#FF6666" },
  { name: "Gold", color: "#FFD93D" },
];

// Helper: get latest spending for a category
function getLatestSpending(category, transactions) {
  return transactions
    .filter((t) => t.category === category)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
}

export default function Budgets() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    maximumSpend: "",
    theme: "",
  });
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  // NEW: Budgets state
  const [budgetsData, setBudgetsData] = useState(data.budgets);
  // Edit/Delete dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudgetIndex, setSelectedBudgetIndex] = useState(null);
  const [editBudget, setEditBudget] = useState({
    category: "",
    maximum: "",
    theme: "",
  });
  const [editError, setEditError] = useState("");
  const [deleteBudgetName, setDeleteBudgetName] = useState("");

  // Filter available themes to prevent color repetition
  // Corrected: Filter based on the 'color' property of the theme
  const usedThemes = new Set(budgetsData.map((b) => b.theme));
  const unusedThemes = availableThemes.filter(
    (theme) => !usedThemes.has(theme.color)
  );

  // Budgets and transactions from data.json
  const budgets = budgetsData;
  const transactions = data.transactions;
  const totalBudget = budgets.reduce((sum, b) => sum + b.maximum, 0);
  const spentByCategory = budgets.map((budget) => {
    const spent = transactions
      .filter((t) => t.category === budget.category)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return { ...budget, spent };
  });
  const totalSpent = spentByCategory.reduce((sum, b) => sum + b.spent, 0);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.category.trim()) return;
    if (
      !formData.maximumSpend ||
      isNaN(Number(formData.maximumSpend)) ||
      Number(formData.maximumSpend) <= 0
    )
      return;
    if (!formData.theme) return;

    setBudgetsData((prev) => [
      ...prev,
      {
        category: formData.category,
        maximum: Number(formData.maximumSpend),
        theme: formData.theme,
      },
    ]);
    setIsModalOpen(false);
    setFormData({ category: "", maximumSpend: "", theme: "" });
  };

  const selectedTheme = availableThemes.find((t) => t.color === formData.theme); // Changed to t.color

  return (
    <div className="bg-[#F4F6FA] min-h-screen flex">
      {/* Sidebar is assumed to be rendered outside this component */}
      <main className="flex-1 ml-5 p-8   ">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#201F24]">Budgets</h1>
          <Button
            className="bg-black text-white lg:h-11 flex items-center gap-2 font-semibold shadow hover:bg-gray-800"
            style={{ borderRadius: "8px" }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" /> Add New Budget
          </Button>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 w-[1000px]">
          {/* Left: Donut chart and summary */}
          <div className="w-full lg:w-[480px] flex flex-col gap-8">
            <div className="bg-white rounded-xl shadow p-12 flex flex-col items-center">
              {/* Donut with text pie chart from shadcn/ui */}
              {(() => {
                // Calculate spent for each budget from transactions
                const chartData = budgets.map((budget) => ({
                  category: budget.category,
                  spent: transactions
                    .filter(
                      (t) => t.category === budget.category && t.amount < 0
                    )
                    .reduce((sum, t) => sum + Math.abs(t.amount), 0),
                  // Use the budget's theme directly as the fill color
                  fill:
                    budget.theme || categoryColors[budget.category] || "#ccc",
                }));

                // chartConfig should map category names to label and color for ChartTooltipContent
                const chartConfig = Object.fromEntries(
                  budgets.map((b) => [
                    b.category,
                    {
                      label: b.category,
                      color: b.theme || categoryColors[b.category] || "#ccc",
                    },
                  ])
                );

                const totalSpent = chartData.reduce(
                  (sum, b) => sum + b.spent,
                  0
                );
                return (
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={chartData}
                        dataKey="spent"
                        nameKey="category"
                        innerRadius={60}
                        strokeWidth={5}
                      >
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                >
                                  <tspan
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    className="fill-foreground text-3xl font-bold"
                                  >
                                    ${totalSpent.toLocaleString()}
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 24}
                                    className="fill-muted-foreground"
                                  >
                                    Spent
                                  </tspan>
                                </text>
                              );
                            }
                          }}
                        />
                        {chartData.map((entry, idx) => (
                          // Each Cell's fill property comes directly from the chartData's fill property
                          <Cell key={entry.category} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                );
              })()}
              {/* Spending Summary */}
              <div className="w-full mt-10">
                <div className="font-bold text-[#201F24] mb-6 text-2xl">
                  Spending Summary
                </div>
                <div className="flex flex-col gap-5">
                  {spentByCategory.map((b, i) => (
                    <div
                      key={b.category}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full"
                          style={{
                            background: b.theme || categoryColors[b.category],
                          }}
                        ></span>
                        <span className="text-[#201F24] text-lg font-semibold">
                          {b.category}
                        </span>
                      </div>
                      <span className="font-bold text-[#201F24] text-lg">
                        ${b.spent.toFixed(2)}
                      </span>
                      <span className="text-[#B3B3B3] text-base">
                        of ${b.maximum.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Right: Budget cards */}
          <div className="flex-1 lg:w-[900px]">
            {spentByCategory.map((b, i) => {
              const latest = getLatestSpending(b.category, transactions);
              return (
                <div
                  key={b.category}
                  className="bg-white rounded-xl shadow p-12 flex flex-col gap-8 mb-10 w-full"
                >
                  <div className="flex items-center mb-4">
                    <span
                      className="w-6 h-6 rounded-full mr-3"
                      style={{
                        background: b.theme || categoryColors[b.category],
                      }}
                    ></span>
                    <span className="font-extrabold text-2xl text-[#201F24]">
                      {b.category}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="ml-auto p-3 rounded-full hover:bg-[#F4F6FA] h-10 w-10 flex items-center justify-center"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="w-6 h-6 text-[#B3B3B3]" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedBudgetIndex(i);
                            setEditBudget({
                              category: b.category,
                              maximum: b.maximum.toString(),
                              theme: b.theme || "",
                            });
                            setEditError("");
                            setEditDialogOpen(true);
                          }}
                        >
                          Edit Budget
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="border-t-2 border-gray-300 mx-2 w-24" />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedBudgetIndex(i);
                            setDeleteBudgetName(b.category);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete Budget
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="text-gray-500 text-lg mb-6 font-semibold">
                    Maximum of ${b.maximum.toFixed(2)}
                  </div>
                  <div
                    className="w-full bg-gray-100 h-8 mb-6 relative"
                    style={{ borderRadius: "8px" }}
                  >
                    <div
                      className="h-8"
                      style={{
                        width: `${Math.min((b.spent / b.maximum) * 100, 100)}%`,
                        background:
                          b.theme || categoryColors[b.category] || "#ccc",
                        borderRadius: "8px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mb-8">
                    <div>
                      <div className="text-gray-500 text-base font-semibold">
                        Spent
                      </div>
                      <div className="font-extrabold text-2xl text-[#201F24]">
                        ${b.spent.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-base font-semibold">
                        Remaining
                      </div>
                      <div className="font-extrabold text-2xl text-[#201F24]">
                        ${Math.max(0, b.maximum - b.spent).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  {/* Latest Spending */}
                  <div className="bg-[#F9F7F4] rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg text-[#201F24]">
                        Latest Spending
                      </span>
                      <span className="text-lg font-bold text-gray-600 flex items-center gap-2 cursor-pointer hover:underline">
                        See All <ChevronRight className="w-5 h-5" />
                      </span>
                    </div>
                    {/* Spending rows */}
                    {latest.length === 0 && (
                      <span className="text-base text-gray-400">
                        No recent spending
                      </span>
                    )}
                    {latest.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-5 py-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="rounded-full w-12 h-12 object-cover"
                        />
                        <div>
                          <div className="font-bold text-lg text-[#201F24]">
                            {t.name}
                          </div>
                          <div className="text-base text-gray-400">
                            {new Date(t.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="ml-auto font-extrabold text-lg text-[#201F24]">
                          -${Math.abs(t.amount).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add New Budget Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-[#201F24]">
                  Add New Budget
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Choose a category to set a spending budget. These categories
                  can help you monitor spending.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 ">
                  {/* Budget Category */}
                  <div>
                    <label className="block text-sm font-semibold text-[#201F24] mb-2">
                      Budget Category
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryDropdown(!showCategoryDropdown);
                          setShowThemeDropdown(false);
                        }}
                        className="w-full text-left p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                      >
                        <span
                          className={
                            formData.category
                              ? "text-[#201F24]"
                              : "text-gray-500"
                          }
                        >
                          {formData.category || "Select budget category"}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform  ${
                            showCategoryDropdown ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {showCategoryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full border border-gray-300 rounded-lg shadow-lg bg-white z-10 max-h-48 overflow-y-auto">
                          {availableCategories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => {
                                handleInputChange("category", category);
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 border-b border-gray-10 last:border-b-0"
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Maximum Spend */}
                  <div>
                    <label className="block text-sm font-semibold text-[#201F24] mb-2">
                      Maximum Spend
                    </label>
                    <input
                      type="number"
                      value={formData.maximumSpend}
                      onChange={(e) =>
                        handleInputChange("maximumSpend", e.target.value)
                      }
                      placeholder="$ e.g. 2000"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-semibold text-[#201F24] mb-2">
                      Theme
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setShowThemeDropdown(!showThemeDropdown);
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {selectedTheme && (
                            <div
                              className="w-4 h-4 rounded-full "
                              style={{ backgroundColor: selectedTheme.color }}
                            />
                          )}
                          <span
                            className={
                              formData.theme
                                ? "text-[#201F24]"
                                : "text-gray-500"
                            }
                          >
                            {selectedTheme
                              ? selectedTheme.name
                              : "Select theme"}{" "}
                            {/* Show theme name */}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            showThemeDropdown ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {showThemeDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-full border border-gray-300 rounded-lg shadow-lg bg-white z-10 max-h-48 overflow-y-auto">
                          {unusedThemes.map((theme) => (
                            <button
                              key={theme.name}
                              type="button"
                              onClick={() => {
                                handleInputChange("theme", theme.color); // Store color
                                setShowThemeDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 flex items-center gap-2 border-b border-gray-10 last:border-b-0"
                            >
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: theme.color }}
                              />
                              {theme.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black text-white rounded-lg py-3 font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Add Budget
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Edit Budget Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[560px] h-auto">
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
              <DialogDescription>
                Update your budget details below.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditError("");
                if (!editBudget.category.trim()) {
                  setEditError("Budget category is required.");
                  return;
                }
                if (
                  !editBudget.maximum ||
                  isNaN(Number(editBudget.maximum)) ||
                  Number(editBudget.maximum) <= 0
                ) {
                  setEditError("Maximum must be a positive number.");
                  return;
                }
                if (!editBudget.theme) {
                  setEditError("Please select a theme.");
                  return;
                }
                setBudgetsData((prev) =>
                  prev.map((b, idx) =>
                    idx === selectedBudgetIndex
                      ? {
                          ...b,
                          category: editBudget.category,
                          maximum: Number(editBudget.maximum),
                          theme: editBudget.theme,
                        }
                      : b
                  )
                );
                setEditDialogOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-[#201F24] mb-2">
                  Budget Category
                </label>
                <input
                  type="text"
                  value={editBudget.category}
                  onChange={(e) =>
                    setEditBudget((b) => ({ ...b, category: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#201F24] mb-2">
                  Maximum Spend
                </label>
                <input
                  type="number"
                  value={editBudget.maximum}
                  onChange={(e) =>
                    setEditBudget((b) => ({ ...b, maximum: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#201F24] mb-2">
                  Theme
                </label>
                <select
                  value={editBudget.theme}
                  onChange={(e) =>
                    setEditBudget((b) => ({ ...b, theme: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select theme</option>
                  {availableThemes.map((theme) => (
                    <option key={theme.name} value={theme.color}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
              {editError && (
                <div className="text-red-500 text-sm">{editError}</div>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  className="w-full bg-black text-white h-[48px] mt-2"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Delete Budget Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[560px] h-auto">
            <DialogHeader>
              <DialogTitle>Delete '{deleteBudgetName}'?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this budget? This action cannot
                be reversed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 mt-4">
              <Button
                className="w-full bg-red-600 text-white h-[48px]"
                onClick={() => {
                  setBudgetsData((prev) =>
                    prev.filter((_, idx) => idx !== selectedBudgetIndex)
                  );
                  setDeleteDialogOpen(false);
                }}
              >
                Yes, Confirm Deletion
              </Button>
              <Button
                className="w-full bg-black text-white h-[48px]"
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                No, Go Back
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
