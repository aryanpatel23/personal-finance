import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"; // Importing dropdown components

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";

// Importing JSON data
import data from "/Users/aryanpatel/Desktop/personal_finance/src/data.json";

export function CardWithForm() {
  return (
    <div className="mt-2 lg:mt-5 px-4 lg:px-1">
      <div className="px-2.5rem py-2.5rem lg:px-6 pt-[60px] w-[1100px] ">
        <div className="absolute top-8 ">
          <h1 className="text-2xl font-bold">Pots</h1>
        </div>
        <section className="min-h-screen grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
          {data.pots.map((pot, index) => {
            const progress = (pot.total / pot.target) * 100;
            console.log(progress);
            return (
              <Card
                key={index}
                className="h-[340px] bg-white rounded-xl py-8 px-6 xl:px-10"
                style={{ borderWidth: "2px" }}
              >
                <CardHeader className="flex-row text-xl font-semibold text-[#201F24] flex justify-between items-center">
                  <div>{pot.name}</div>
                  {/* Dropdown Menu with three dots */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(payment.id)
                        }
                      >
                        Edit Pot
                      </DropdownMenuItem>
                      {/* Updated separator with a custom width */}
                      <DropdownMenuSeparator className="border-t-2 border-gray-300 mx-2 w-24" />
                      <DropdownMenuItem className="text-red-600">
                        Delete Pot
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  {/* Total Saved Section Above Progress Bar */}
                  <div className="flex justify-between mb-4">
                    <span className="text-base font-medium text-[#201F24]">
                      Total Saved
                    </span>
                    <span className="text-2xl font-bold text-[#201F24]">
                      ${pot.total.toFixed(2)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Progress
                      value={(pot.total / pot.target) * 100} // Calculate the percentage progress
                      className="w-full"
                      style={{ backgroundColor: pot.theme }}
                    />
                  </div>

                  {/* Percentage and Target Below Progress Bar */}
                  <div className="flex justify-between">
                    {/* Progress Percentage */}
                    <span className="text-sm font-medium text-[#201F24]">
                      {progress.toFixed(2)}%
                    </span>
                    {/* Target */}
                    <span className="text-sm font-medium text-[#201F24]">
                      Target: ${pot.target.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-3 w-full mt-10">
                  {/* Add Money Button */}
                  <DialogDemo
                    title="Add Money"
                    description={`Add funds to your ${pot.name} pot.`}
                    buttonLabel={
                      <Button className="inline-flex items-center gap-4 h-15 px-5 py-2 rounded-md text-base font-semibold transition-colors bg-[#F8F4F0] hover:bg-[#ECE9E6] text-[#201F24] ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#201F24"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                        Add Money
                      </Button>
                    }
                  />
                  {/* Withdraw Money Button */}
                  <DialogDemo
                    title="Withdraw Money"
                    description={`Withdraw funds from your ${pot.name} pot.`}
                    buttonLabel={
                      <Button className="inline-flex items-center gap-2 h-15 px-5 py-2 rounded-md text-base font-semibold transition-colors bg-[#F8F4F0] hover:bg-[#ECE9E6] text-[#201F24]  ">
                        Withdraw Money
                      </Button>
                    }
                  />
                </CardFooter>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}

export function DialogDemo({ title, description, buttonLabel }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{buttonLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
