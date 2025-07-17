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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importing JSON data
import data from "/Users/aryanpatel/Desktop/personal_finance/src/data.json";

export function CardWithForm() {
  const [potsData, setPotsData] = React.useState(data.pots); // Store the pots data in state
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedPotIndex, setSelectedPotIndex] = React.useState(null);
  const [editPot, setEditPot] = React.useState({
    name: "",
    target: "",
    theme: "",
  });
  const [editError, setEditError] = React.useState("");
  const [deletePotName, setDeletePotName] = React.useState("");
  const [newPot, setNewPot] = React.useState({
    name: "",
    target: "",
    theme: "",
  });
  const [addError, setAddError] = React.useState("");

  const themeOptions = [
    { label: "Green", value: "#277C78" },
    { label: "Blue", value: "#82C9D7" },
    { label: "Orange", value: "#F2CDAC" },
    { label: "Purple", value: "#826CB0" },
    { label: "Gray", value: "#626070" },
  ];

  const updatePot = (index, amount, operation) => {
    setPotsData((prevData) => {
      const updatedPots = [...prevData];
      const parsedAmount = parseFloat(amount);
      if (operation === "add") {
        updatedPots[index].total = Math.min(
          updatedPots[index].total + parsedAmount,
          updatedPots[index].target
        );
      } else if (operation === "withdraw") {
        updatedPots[index].total = Math.max(
          updatedPots[index].total - parsedAmount,
          0
        );
      }
      return updatedPots;
    });
  };

  return (
    <div className="mt-2 lg:mt-5 px-4 lg:px-1">
      <div className="px-2.5rem py-2.5rem lg:px-6 pt-[60px] w-[1100px] ">
        <div className="absolute top-8 flex justify-between w-[1060px] h-[56px] ">
          <h1 className="text-2xl font-bold">Pots</h1>

          {/* Add Pot Button with Dialog */}
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="inline-flex items-center justify-center gap-2  rounded-md  shadow bg-black px-4 py-2 h-10 font-semibold  text-white"
                onClick={() => setAddDialogOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  color="white"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add New Pot
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px] h-auto">
              <DialogHeader>
                <DialogTitle>Add New Pot</DialogTitle>
                <DialogDescription>
                  Create a pot to set savings targets. These can help keep you
                  on track as you save for special purchases.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setAddError("");
                  if (!newPot.name.trim()) {
                    setAddError("Pot name is required.");
                    return;
                  }
                  if (
                    !newPot.target ||
                    isNaN(Number(newPot.target)) ||
                    Number(newPot.target) <= 0
                  ) {
                    setAddError("Target must be a positive number.");
                    return;
                  }
                  if (!newPot.theme) {
                    setAddError("Please select a theme.");
                    return;
                  }
                  setPotsData((prev) => [
                    ...prev,
                    {
                      name: newPot.name,
                      target: Number(newPot.target),
                      total: 0,
                      theme: newPot.theme,
                    },
                  ]);
                  setNewPot({ name: "", target: "", theme: "" });
                  setAddDialogOpen(false);
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="pot-name">Pot Name</Label>
                  <Input
                    id="pot-name"
                    maxLength={30}
                    placeholder="e.g. Rainy Days"
                    value={newPot.name}
                    onChange={(e) =>
                      setNewPot((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {30 - newPot.name.length} characters left
                  </div>
                </div>
                <div>
                  <Label htmlFor="pot-target">Target</Label>
                  <Input
                    id="pot-target"
                    type="number"
                    min={1}
                    step={0.01}
                    placeholder="$ e.g. 2000"
                    value={newPot.target}
                    onChange={(e) =>
                      setNewPot((p) => ({ ...p, target: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pot-theme">Theme</Label>
                  <Select
                    value={newPot.theme}
                    onValueChange={(val) =>
                      setNewPot((p) => ({ ...p, theme: val }))
                    }
                  >
                    <SelectTrigger id="pot-theme" className="white">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent side="top" className="bg-white">
                      {themeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {addError && (
                  <div className="text-red-500 text-sm">{addError}</div>
                )}
                <DialogFooter>
                  <Button
                    type="submit"
                    className="w-full bg-black text-white h-[48px] mt-2"
                  >
                    Add Pot
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                        onClick={() => {
                          setSelectedPotIndex(index);
                          setEditPot({
                            name: pot.name,
                            target: pot.target.toString(),
                            theme: pot.theme,
                          });
                          setEditError("");
                          setEditDialogOpen(true);
                        }}
                      >
                        Edit Pot
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="border-t-2 border-gray-300 mx-2 w-24" />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedPotIndex(index);
                          setDeletePotName(pot.name);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete Pot
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
        {/* Edit Pot Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[560px] h-auto">
            <DialogHeader>
              <DialogTitle>Edit Pot</DialogTitle>
              <DialogDescription>
                If your saving targets change, feel free to update your pots.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditError("");
                if (!editPot.name.trim()) {
                  setEditError("Pot name is required.");
                  return;
                }
                if (
                  !editPot.target ||
                  isNaN(Number(editPot.target)) ||
                  Number(editPot.target) <= 0
                ) {
                  setEditError("Target must be a positive number.");
                  return;
                }
                if (!editPot.theme) {
                  setEditError("Please select a theme.");
                  return;
                }
                setPotsData((prev) =>
                  prev.map((p, i) =>
                    i === selectedPotIndex
                      ? {
                          ...p,
                          name: editPot.name,
                          target: Number(editPot.target),
                          theme: editPot.theme,
                        }
                      : p
                  )
                );
                setEditDialogOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="edit-pot-name">Pot Name</Label>
                <Input
                  id="edit-pot-name"
                  maxLength={30}
                  placeholder="e.g. Rainy Days"
                  value={editPot.name}
                  onChange={(e) =>
                    setEditPot((p) => ({ ...p, name: e.target.value }))
                  }
                />
                <div className="text-xs text-muted-foreground text-right">
                  {30 - editPot.name.length} characters left
                </div>
              </div>
              <div>
                <Label htmlFor="edit-pot-target">Target</Label>
                <Input
                  id="edit-pot-target"
                  type="number"
                  min={1}
                  step={0.01}
                  placeholder="$ e.g. 2000"
                  value={editPot.target}
                  onChange={(e) =>
                    setEditPot((p) => ({ ...p, target: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-pot-theme">Theme</Label>
                <Select
                  value={editPot.theme}
                  onValueChange={(val) =>
                    setEditPot((p) => ({ ...p, theme: val }))
                  }
                >
                  <SelectTrigger id="edit-pot-theme" className="!bg-white">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {themeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        {/* Delete Pot Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[560px] h-auto">
            <DialogHeader>
              <DialogTitle>Delete '{deletePotName}'?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this pot? This action cannot be
                reversed, and all the data inside it will be removed forever.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col gap-2 mt-4">
              <Button
                className="w-full bg-red-600 text-white h-[48px]"
                onClick={() => {
                  setPotsData((prev) =>
                    prev.filter((_, i) => i !== selectedPotIndex)
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
  const [amount, setAmount] = React.useState("");
  const [withdrawAmount, setWithdrawAmount] = React.useState("");
  const [progress, setProgress] = React.useState(0);
  const [error, setError] = React.useState(null);

  const total = cardContent ? cardContent.total : 0;
  const target = cardContent ? cardContent.target : 0;

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    setError(null);
    if (type === "add") {
      setAmount(value);
    } else if (type === "withdraw") {
      setWithdrawAmount(value);
    }
  };

  const handleConfirm = () => {
    const newAmount = parseFloat(amount || 0);
    const newWithdrawAmount = parseFloat(withdrawAmount || 0);

    const exceedsTarget = total + newAmount > target;
    const canWithdraw = newWithdrawAmount <= total;

    if (amount && !exceedsTarget && !isNaN(newAmount)) {
      onConfirm(newAmount, "add");
      const updatedTotal = Math.min(total + newAmount, target);
      setProgress((updatedTotal / target) * 100);
      setAmount("");
      setOpen(false);
    } else if (withdrawAmount && canWithdraw && !isNaN(newWithdrawAmount)) {
      onConfirm(newWithdrawAmount, "withdraw");
      const updatedWithdrawTotal = total - newWithdrawAmount;
      setProgress((updatedWithdrawTotal / target) * 100);
      setWithdrawAmount("");
      setOpen(false);
    } else {
      setProgress((total / target) * 100);
      setAmount("");
      setWithdrawAmount("");
      setError("Invalid input. Please check the amount.");
    }
  };

  const isAddDisabled =
    parseFloat(amount || 0) > target - total || isNaN(parseFloat(amount || 0));
  const isWithdrawDisabled =
    parseFloat(withdrawAmount || 0) > total ||
    isNaN(parseFloat(withdrawAmount || 0));

  const newAmountDisplay = Math.min(parseFloat(amount || 0), target - total);
  const newWithdrawAmountDisplay = Math.min(
    parseFloat(withdrawAmount || 0),
    total
  );

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

        {cardContent && (
          <div>
            <div className="flex justify-between mb-4">
              <span>
                {title.includes("Add") ? "New Amount" : "Updated Balance"}
              </span>
              <span className="text-4xl font-bold">
                $
                {title.includes("Add")
                  ? (total + newAmountDisplay).toFixed(2)
                  : (total - newWithdrawAmountDisplay).toFixed(2)}
              </span>
            </div>

            <div className="relative w-full h-[8px] bg-[#F8F4F0] rounded-full mb-4">
              <div
                style={{
                  width: `${(total / target) * 100}%`,
                  backgroundColor: "#000000",
                }}
                className="absolute top-0 left-0 h-full rounded-full"
              ></div>

              {title.includes("Add") && parseFloat(amount || 0) > 0 && (
                <div
                  style={{
                    width: `${(newAmountDisplay / target) * 100}%`,
                    backgroundColor: cardContent.theme,
                    left: `${(total / target) * 100}%`,
                  }}
                  className="absolute top-0 h-full rounded-full"
                ></div>
              )}

              {title.includes("Withdraw") &&
                parseFloat(withdrawAmount || 0) > 0 && (
                  <div
                    style={{
                      width: `${(newWithdrawAmountDisplay / target) * 100}%`,
                      backgroundColor: "#FF0000",
                      left: `${
                        ((total - newWithdrawAmountDisplay) / target) * 100
                      }%`,
                    }}
                    className="absolute top-0 h-full rounded-full"
                  ></div>
                )}
            </div>

            <div className="flex justify-between">
              <span>{progress.toFixed(2)}%</span>
              <span>Target: ${target.toFixed(2)}</span>
            </div>
          </div>
        )}

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
              type="text"
              value={title.includes("Add") ? amount : withdrawAmount}
              onChange={(e) =>
                handleInputChange(e, title.includes("Add") ? "add" : "withdraw")
              }
              className="w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors
                                placeholder:text-[#696868] focus-visible:outline-none focus-visible:ring-1
                                h-[45px] block ps-8 border-[#98908B] rounded-lg"
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
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-dollar-sign absolute top-[37px] left-3"
            >
              <line x1="12" x2="12" y1="2" y2="22"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}

        <DialogFooter>
          <Button
            className="gap-2 rounded-lg h-[53px] px-4 flex mt-2 items-center justify-center w-full py-7 bg-black text-white"
            type="button"
            onClick={handleConfirm}
            disabled={
              title.includes("Add") ? isAddDisabled : isWithdrawDisabled
            }
          >
            Confirm {title.includes("Add") ? "Addition" : "Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
