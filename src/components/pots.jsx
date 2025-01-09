"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Pots() {
  const [pots, setPots] = useState([
    { id: 1, name: "Vacation Fund", currentAmount: 500, goalAmount: 1000 },
    { id: 2, name: "Emergency Fund", currentAmount: 1500, goalAmount: 3000 },
  ]);

  const [newPot, setNewPot] = useState({
    name: "",
    currentAmount: 0,
    goalAmount: 0,
  });

  const [selectedPot, setSelectedPot] = useState(null);

  // Update a pot's amount or details
  const updatePot = (id, newDetails) => {
    setPots((prev) =>
      prev.map((pot) => (pot.id === id ? { ...pot, ...newDetails } : pot))
    );
  };

  // Add a new pot
  const addPot = () => {
    setPots([
      ...pots,
      {
        ...newPot,
        id: Date.now(),
        currentAmount: Number(newPot.currentAmount),
        goalAmount: Number(newPot.goalAmount),
      },
    ]);
    setNewPot({ name: "", currentAmount: 0, goalAmount: 0 });
  };

  // Delete a pot
  const deletePot = (id) => {
    setPots(pots.filter((pot) => pot.id !== id));
  };

  // Progress bar calculation
  const getProgress = (current, goal) =>
    goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Saving Pots</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Pot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Saving Pot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Pot Name</Label>
                <Input
                  id="name"
                  placeholder="E.g., Vacation Fund"
                  value={newPot.name}
                  onChange={(e) =>
                    setNewPot({ ...newPot, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="currentAmount">Current Amount</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="E.g., 500"
                  value={newPot.currentAmount}
                  onChange={(e) =>
                    setNewPot({
                      ...newPot,
                      currentAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="goalAmount">Goal Amount</Label>
                <Input
                  id="goalAmount"
                  type="number"
                  placeholder="E.g., 1000"
                  value={newPot.goalAmount}
                  onChange={(e) =>
                    setNewPot({ ...newPot, goalAmount: Number(e.target.value) })
                  }
                />
              </div>
              <Button onClick={addPot}>Save Pot</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pots.map((pot) => (
          <Card key={pot.id} className="relative">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {pot.name}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-6 w-6 p-0">
                      <span className="sr-only">Options</span>⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedPot(pot)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deletePot(pot.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                Total Saved: ${pot.currentAmount} / ${pot.goalAmount}
              </div>
              <Progress
                value={getProgress(pot.currentAmount, pot.goalAmount)}
                className="mt-2"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                size="sm"
                onClick={() =>
                  updatePot(pot.id, {
                    currentAmount: pot.currentAmount + 50,
                  })
                }
              >
                Add $50
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  updatePot(pot.id, {
                    currentAmount: Math.max(pot.currentAmount - 50, 0),
                  })
                }
              >
                Withdraw $50
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Pot Dialog */}
      {selectedPot && (
        <Dialog open={!!selectedPot} onOpenChange={() => setSelectedPot(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editName">Pot Name</Label>
                <Input
                  id="editName"
                  value={selectedPot.name}
                  onChange={(e) =>
                    setSelectedPot({ ...selectedPot, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editCurrentAmount">Current Amount</Label>
                <Input
                  id="editCurrentAmount"
                  type="number"
                  value={selectedPot.currentAmount}
                  onChange={(e) =>
                    setSelectedPot({
                      ...selectedPot,
                      currentAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="editGoalAmount">Goal Amount</Label>
                <Input
                  id="editGoalAmount"
                  type="number"
                  value={selectedPot.goalAmount}
                  onChange={(e) =>
                    setSelectedPot({
                      ...selectedPot,
                      goalAmount: Number(e.target.value),
                    })
                  }
                />
              </div>
              <Button
                onClick={() => {
                  updatePot(selectedPot.id, selectedPot);
                  setSelectedPot(null);
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
