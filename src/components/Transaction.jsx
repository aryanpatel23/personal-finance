"use client";

import React, { useState } from "react";
import transactions from "/Users/aryanpatel/Desktop/personal_finance/src/data.json";
import { Label } from "@/components/ui/label";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function DataTableDemo() {
  const [sorting, setSorting] = useState([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = useState([
    // { id: "category", value: "General" }, // Default filter
  ]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All Transactions");

  const table = useReactTable({
    data: transactions.transactions, // Use transactions from JSON file
    columns: [
      {
        accessorKey: "recipientSender", // Logical name for the column
        header: "Recipient / Sender",
        cell: ({ row }) => {
          const avatar = row.original.avatar; // Ensure data matches your structure
          const name = row.original.name;

          return (
            <div className="flex items-center space-x-3">
              {avatar && (
                <img
                  src={avatar}
                  alt={name || "Avatar"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="text-left font-semibold text-[#201F24]">
                {name || "No Name"}
              </div>
            </div>
          );
        },
      },

      {
        accessorKey: "category",
        cell: ({ row }) => (
          <div className="lowercase">{row.getValue("category")}</div>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("date")).toLocaleDateString();
          return <div>{date}</div>;
        },
      },
      {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const formatted = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);
          return <div className="text-right font-medium">{formatted}</div>;
        },
      },
    ],
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const categories = Array.from(
    new Set(
      transactions.transactions.map((transaction) => transaction.category)
    )
  );

  return (
    <div className="px-2.5rem py-2.5rem lg:px-6 pt-[90px] w-[1000px]">
      <div className="absolute top-8 ">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>
      <section className="rounded-xl border max-lg:px-4 p-10 w-[1050px]  ">
        <div className="rounded-md border-none ">
          <div className="flex max-xl:flex-col max-xl:items-end items-center justify-between w-full pb-10 gap-4">
            <div className="relative">
              {" "}
              <Input
                className="flex h-11 rounded-xl border text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm p-5 border-[#98908B] placeholder:max-lg:text-xs placeholder:text-sm w-full lg:min-w-[320px]"
                placeholder="Search Transaction"
                value={table.getColumn("name")?.getFilterValue() ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
              />
            </div>
            <div className="flex items-center space-x-2 py-4 ">
              <Label htmlFor="sort-select">Sort by:</Label>
              <Select
                value={sorting[0]?.desc === false ? "Oldest" : "Latest"} // Dynamically set value based on sorting state
                onValueChange={(value) => {
                  if (value === "Oldest") {
                    // Sort by oldest (ascending)
                    setSorting([
                      { id: "date", desc: false }, // Ascending by date
                    ]);
                  } else if (value === "Latest") {
                    // Sort by latest (descending)
                    setSorting([
                      { id: "date", desc: true }, // Descending by date
                    ]);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Sorting" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="Oldest">Oldest</SelectItem>
                  <SelectItem value="Latest">Latest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 py-4 ">
              <Label htmlFor="category-select">Category:</Label>
              <Select
                onValueChange={(value) => {
                  if (value === "All Transactions") {
                    setSelectedCategory("All Transactions");
                    table.getColumn("category")?.setFilterValue(""); // Clear the filter
                  } else {
                    setSelectedCategory(value);
                    table.getColumn("category")?.setFilterValue(value);
                  }
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue
                    placeholder={
                      selectedCategory === "All Transactions"
                        ? "All Transactions"
                        : selectedCategory
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="All Transactions">
                    All Transactions
                  </SelectItem>{" "}
                  {/* Default option */}
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <Table className="w-full caption-bottom text-sm relative ">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              />
            </PaginationItem>
            {Array.from({ length: table.getPageCount() }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={table.getState().pagination.pageIndex === index}
                  onClick={() => table.setPageIndex(index)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  );
}
