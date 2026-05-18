import { workflows } from "@/data";
import { calculateAutomationScore, estimateMonthlySavings, generateRecommendation } from "@/utils";
import { BarChart3, Bot, Clock, PoundSterling } from "lucide-react";

export default function Home(){
  const totalWorkflows = workflows.length;

  const delayedWorkflows = workflows.filter((workflow) => workflow.status === "Delayed").length;

  const totalEstimatedSavings = workflows.reduce((total, workflow) => total + estimateMonthlySavings(workflow), 0);

  const averageAutomationScore = Math.round(workflows.reduce((total, workflow) => total + calculateAutomationScore(workflow),0))

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">AI Workflow Automation Portfolio Project</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900"> AI Workflow Automation Dashboard</h1>
          <p className="mt-3 max-w-3xl text-slate-600">A business operations dashboard that identifies automation opportunities, estimates potential savings, and recommends scalable workflow improvements across multiple departments.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="round-2xl bg-white p-6 shadow-sm">
            <BarChart3 className="mb-4 h-8 w-8 text-blue-700"/>
            <p className="text-sm text-slate-500">Total Workflows</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{totalWorkflows}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Clock className="mb-4 h-8 w- text-orange-600"/>
            <p className="text-sm text-slate-500">Delayed Workflows</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{delayedWorkflows}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <Bot className="mb-4 h-8 w-8 text-purple-700"/>
            <p className="text-sm text-slate-500">Avg Automation Score</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{averageAutomationScore}/100</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <PoundSterling className="mb-4 h-8 w-8 text-green-700"/>
            <p className="text-sm text-slate-500">Estimated Monthly Savings</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">£{totalEstimatedSavings.toLocaleString()}</p>
          </div>

          
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">Workflow Automation Assessment</h2>
              <p className="mt-1 text-sm text-slate-500">
                Processes are scored using volume, manual effort,  error rate, and delay indicators.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4">Process</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Manual Steps</th>
                    <th className="p-4">Monthly Volume</th>
                    <th className="p-4">Error Rate</th>
                    <th className="p-4">Automation Score</th>
                    <th className="p-4">Est. Monthly Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {workflows.map((workflow) => {
                    const score = calculateAutomationScore(workflow);
                    const savings = estimateMonthlySavings(workflow);

                    return (
                      <tr key={workflow.id} className="border-t border-slate-100">
                        <td className="p-4 font-medium text-slate-900">
                          {workflow.processName}
                        </td>
                        <td className="p-4 text-slate-600">{workflow.department}</td>
                        <td className="p-4">
                          <span className="round-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{workflow.status}</span>
                        </td>
                        <td className="p-4 text-slate-600">
                          {workflow.manualSteps}
                        </td>
                        <td className="p-4 text-slate-600">
                          {workflow.monthlyVolume}
                        </td>
                        <td className="p-4 text-slate-600">
                          {workflow.errorRatePercent}
                        </td>
                        <td className="p-4 font-bold text-blue-700">
                          {score}/100
                        </td>
                        <td className="p-4 font-bold text-blue-700">
                          £{savings.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
      </section>
    </main>
  )
}