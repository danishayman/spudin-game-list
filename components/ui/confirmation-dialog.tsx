"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmationText?: string;
  confirmationPlaceholder?: string;
  confirmButtonText?: string;
  confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onConfirm: (confirmationInput?: string) => void | Promise<void>;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmationText,
  confirmationPlaceholder = "Type to confirm",
  confirmButtonText = "Confirm",
  confirmButtonVariant = "destructive",
  onConfirm,
  isLoading = false,
}: ConfirmationDialogProps) {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = async () => {
    if (confirmationText && inputValue !== confirmationText) {
      return;
    }
    await onConfirm(inputValue);
    setInputValue("");
  };

  const handleCancel = () => {
    setInputValue("");
    onOpenChange(false);
  };

  const isConfirmDisabled = confirmationText 
    ? inputValue !== confirmationText 
    : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {description}
          </DialogDescription>
        </DialogHeader>

        {confirmationText && (
          <div className="space-y-2">
            <Label htmlFor="confirmation" className="text-slate-300">
              Type <span className="font-mono font-bold text-red-400">{confirmationText}</span> to confirm:
            </Label>
            <Input
              id="confirmation"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmationPlaceholder}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              disabled={isLoading}
            />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled || isLoading}
          >
            {isLoading ? "Processing..." : confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}