export type Department = "HR" | "Sales" | "Customer Support" | "Finance" | "Operations";

export type WorkflowStatus = "Pending" | "In Progress" | "Completed" | "Delayed";

export interface IWorkflow {
    id: number;
    processName: string;
    department: Department;
    owner: string;
    status: WorkflowStatus;
    averageCompletionTimeHours: number;
    manualSteps: number;
    monthlyVolume: number;
    errorRatePercent: number;
    estimatedHourlyCost: number;
}