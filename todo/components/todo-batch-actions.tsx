"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TodoBatchActionsProps {
  completedTodos: string[];
  allTodos: string[];
}

export function TodoBatchActions({
  completedTodos,
  allTodos,
}: TodoBatchActionsProps) {
  const queryClient = useQueryClient();
  const [isMarkingAllComplete, setIsMarkingAllComplete] = useState(false);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  const markAllCompleteMutation = useMutation({
    mutationFn: async () => {
      return api.markAllComplete();
    },
    onMutate: () => {
      setIsMarkingAllComplete(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("All todos marked as complete");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to mark all complete");
    },
    onSettled: () => {
      setIsMarkingAllComplete(false);
    },
  });

  const deleteCompletedMutation = useMutation({
    mutationFn: async () => {
      return api.deleteCompletedTodos();
    },
    onMutate: () => {
      setIsDeletingCompleted(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Completed todos deleted");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete completed todos");
    },
    onSettled: () => {
      setIsDeletingCompleted(false);
    },
  });

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => markAllCompleteMutation.mutate()}
        disabled={isMarkingAllComplete || allTodos.length === 0}
        variant="outline"
        size="sm"
        className={cn(
          "flex items-center gap-2",
          isMarkingAllComplete && "cursor-not-allowed opacity-50",
        )}
      >
        <CheckCircle className="h-4 w-4" />
        {isMarkingAllComplete ? "Marking..." : "Mark All Complete"}
      </Button>

      <Button
        onClick={() => deleteCompletedMutation.mutate()}
        disabled={isDeletingCompleted || completedTodos.length === 0}
        variant="outline"
        size="sm"
        className={cn(
          "flex items-center gap-2 text-red-600 hover:text-red-700",
          isDeletingCompleted && "cursor-not-allowed opacity-50",
        )}
      >
        <Trash2 className="h-4 w-4" />
        {isDeletingCompleted ? "Deleting..." : "Delete Completed"}
      </Button>
    </div>
  );
}
