import { IWorkflow } from "@/types";

export function calculateAutomationScore(workflow: IWorkflow): number {
    const volumeScore = Math.min(workflow.monthlyVolume / 5, 30);
    const manualStepScore = Math.min(workflow.manualSteps * 4, 30);
    const errorScore = Math.min(workflow.errorRatePercent * 2, 25);
    const delayScore = workflow.status === "Delayed" ? 15 : 0;

    return Math.round(volumeScore + manualStepScore + errorScore + delayScore);
}

export function estimateMonthlySavings(workflow: IWorkflow): number {
    const automatableHours = workflow.averageCompletionTimeHours * workflow.monthlyVolume * 0.35;

    return Math.round(automatableHours * workflow.estimatedHourlyCost);
}

export function generateRecommendation(workflow: IWorkflow): string {
    const score = calculateAutomationScore(workflow);

    if(score >= 80) {
        return `High automation priority. ${workflow.processName} has strong automation potential due to high volume, manual effort, delays, or error rates. Consider implementing AI-assisted routing, automated reminders, rule-based approvals, or workflow orchestration.`;
    }
    if(score >= 50) {
        return `Moderate automation opportunity. ${workflow.processName} could benifit from partial automation such as templates, automated notifications, data validation, or dashboard-based  monitoring.`;
    }

    return `Low automation urgency. ${workflow.processName} appears relative stable, but documentation and periodic monitoring should be maintained.`;
}

