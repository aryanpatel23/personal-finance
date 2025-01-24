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
} from "@/components/ui/dropdown-menu";

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
  const [potsData, setPotsData] = React.useState(data.pots); // Store the pots data in state

  const updatePot = (index, amount, operation) => {
    setPotsData((prevData) => {
      const updatedPots = [...prevData];
      if (operation === "add") {
        updatedPots[index].total += parseFloat(amount);
      } else if (operation === "withdraw") {
        updatedPots[index].total -= parseFloat(amount);
      }
      return updatedPots;
    });
  };

  return (
    <div className="mt-2 lg:mt-5 px-4 lg:px-1">
      <div className="px-2.5rem py-2.5rem lg:px-6 pt-[60px] w-[1100px] ">
        <div className="absolute top-8 ">
          <h1 className="text-2xl font-bold">Pots</h1>
        </div>
        <section className="min-h-screen grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
          {potsData.map((pot, index) => {
            const progress = Math.min((pot.total / pot.target) * 100, 100); // Ensure progress doesn't exceed 100%
            return (
              <Card
                key={index}
                className="h-[303px] w-[518px] bg-white rounded-xl py-8 px-6 xl:px-10"
              >
                <CardHeader className="flex-row text-xl font-semibold text-[#201F24] flex justify-between items-center h-[24px] w-[470px] pt-2 px-0 ml-[-20px] ">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-[16px] h-[16px] rounded-full "
                      style={{ backgroundColor: pot.theme }}
                    ></div>{" "}
                    <div className="text-xl  font-semibold text-[#201F24]">
                      {pot.name}
                    </div>
                  </div>
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
                        onClick={() => navigator.clipboard.writeText(pot.id)}
                      >
                        <button>Edit Pot</button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-t-2 border-gray-300 mx-2 w-24" />
                      <DropdownMenuItem className="text-red-600">
                        <button>Delete Pot</button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="h-[114px] w-[470px] pt-5 px-0 ml-[-20px]">
                  {/* Total Saved Section Above Progress Bar */}
                  <div className="flex justify-between mb-4 h-[38px] w-[470px]">
                    <span className="text-grey-500 ">Total Saved</span>
                    <span className="text-4xl font-bold text-[#201F24]">
                      ${pot.total.toFixed(2)}
                    </span>
                  </div>

                  <div className=" bg-[#F8F4F0] mb-4 w-full h-[8px] mt-6 rounded-full">
                    <Progress
                      value={progress} // Ensure the progress does not exceed 100%
                      style={{
                        backgroundColor: pot.theme,
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  {/* Percentage and Target Below Progress Bar */}
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-[#201F24]">
                      {progress.toFixed(2)}%
                    </span>
                    <span className="text-sm font-medium text-[#201F24]">
                      Target: ${pot.target.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-3 w-[470px] h-[53px] mt-10 ml-[-20px]">
                  {/* Add Money Button */}
                  <DialogDemo
                    title={`Add to "${pot.name}" ?`}
                    description={`Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet.`}
                    buttonLabel={
                      <Button className="inline-flex items-center gap-4 h-15 px-5 py-2 rounded-md text-base font-semibold transition-colors bg-[#F8F4F0] hover:bg-[#ECE9E6] text-[#201F24] h-[53px] w-[227px] ">
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
                    cardContent={{
                      name: pot.name,
                      total: pot.total,
                      target: pot.target,
                      theme: pot.theme,
                    }}
                    onConfirm={(amount) => {
                      updatePot(index, amount, "add"); // Update pot by adding money
                    }}
                  />
                  {/* Withdraw Money Button */}
                  <DialogDemo
                    className="w-[560px] h-[512px]"
                    title={`Withdraw from '${pot.name}' ?`}
                    description="Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet."
                    buttonLabel={
                      <Button className="inline-flex items-center gap-2 h-15 px-5 py-2 rounded-md text-base font-semibold transition-colors bg-[#F8F4F0] hover:bg-[#ECE9E6] text-[#201F24] h-[53px] w-[227px]  ">
                        Withdraw Money
                      </Button>
                    }
                    cardContent={{
                      name: pot.name,
                      total: pot.total,
                      target: pot.target,
                      theme: pot.theme,
                    }}
                    onConfirm={(amount) => {
                      updatePot(index, amount, "withdraw"); // Update pot by withdrawing money
                    }}
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

export function DialogDemo({
  title,
  description,
  buttonLabel,
  cardContent,
  onConfirm,
}) {
  const [open, setOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(""); // For adding
  const [withdrawAmount, setWithdrawAmount] = React.useState(""); // For withdrawing

  // Ensure cardContent is defined before attempting to access its properties
  const total = cardContent ? cardContent.total : 0;
  const target = cardContent ? cardContent.target : 0;

  const newAmount = parseFloat(amount || 0);
  const newWithdrawAmount = parseFloat(withdrawAmount || 0);

  // For add: Check if the new total exceeds the target
  const exceedsTarget = total + newAmount > target;
  const updatedTotal = exceedsTarget
    ? total
    : Math.min(total + newAmount, target);

  // For withdraw: Check if withdrawal is less than or equal to the total
  const canWithdraw = newWithdrawAmount <= total;
  const updatedWithdrawTotal = canWithdraw ? total - newWithdrawAmount : total;

  // Calculate updated total dynamically, ensuring it doesn't exceed the target
  const progress =
    target > 0
      ? Math.min(
          ((title.includes("Add") ? updatedTotal : updatedWithdrawTotal) /
            target) *
            100,
          100
        )
      : 0;

  // Disable Confirm button if amount exceeds target for add, or if withdrawal exceeds total for withdraw
  const isAddDisabled = exceedsTarget;
  const isWithdrawDisabled = !canWithdraw;

  const handleConfirm = () => {
    if (amount && !isAddDisabled) {
      onConfirm(amount, "add"); // Pass action type
      setOpen(false);
    } else if (withdrawAmount && !isWithdrawDisabled) {
      onConfirm(withdrawAmount, "withdraw"); // Pass action type
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-[560px] h-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-[#696868]">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Card Content */}
        {cardContent && (
          <div>
            <div className="flex justify-between mb-4">
              <span>
                {title.includes("Add") ? "New Amount" : "Updated Balance"}
              </span>
              <span className="text-4xl font-bold">
                $
                {title.includes("Add")
                  ? updatedTotal.toFixed(2)
                  : updatedWithdrawTotal.toFixed(2)}
              </span>
            </div>
            <div className=" bg-[#F8F4F0] rounded-full w-full h-[8px] mb-4">
              <Progress
                value={progress}
                style={{
                  backgroundColor: cardContent.theme,
                  width: `${progress}%`,
                }}
              />
            </div>
            <div className="flex justify-between">
              <span>{progress.toFixed(2)}%</span>
              <span>Target: ${target.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="grid gap-4 py-4">
          <div className="space-y-1 relative">
            {title.includes("Add") ? (
              <Label htmlFor="amount">Amount to Add</Label>
            ) : (
              <Label htmlFor="withdrawAmount">Amount to Withdraw</Label>
            )}
            <input
              id={title.includes("Add") ? "amount" : "withdrawAmount"}
              name={title.includes("Add") ? "amount" : "withdrawAmount"}
              type="number"
              value={title.includes("Add") ? amount : withdrawAmount}
              onChange={(e) =>
                title.includes("Add")
                  ? setAmount(e.target.value)
                  : setWithdrawAmount(e.target.value)
              }
              className="w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors 
                         
                         placeholder:text-[#696868] focus-visible:outline-none focus-visible:ring-1 
                         h-[45px] block ps-8 border-[#98908B]"
              placeholder="e.g. 2000"
              aria-describedby="amount-description amount-message"
              aria-invalid="false"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#696868"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-dollar-sign absolute top-[37px] left-3"
            >
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>

        <DialogFooter>
          <Button
            className="gap-2 rounded-md  h-[53px] px-4 flex mt-2 items-center justify-center w-full py-7 bg-[#201F24] text-white"
            type="button"
            onClick={handleConfirm}
            disabled={
              title.includes("Add") ? isAddDisabled : isWithdrawDisabled
            } // Disable based on action
          >
            Confirm {title.includes("Add") ? "Addition" : "Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
