"use client"

import { useMemo, useState } from "react";
import { calculateAutomationScore, estimateMonthlySavings, generateRecommendation } from "@/utils";
import {Department} from "@/types/workflow";
import { BarChart3, Bot, Clock, PoundSterling } from "lucide-react";
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts"
import { workflows } from "@/data";
import { MarkdownRenderer, SummaryCard } from "@/components";

const departments: Array<Department | "All"> = ["All", "HR", "Sales", "Customer Support", "Finance", "Operations"]

export default function Home() {
    const [selectedDepartment, setSelectedDepeartment] = useState<Department | "All">("All");
    const filteredWorkflows = useMemo(()=> {
        if(selectedDepartment === "All") return workflows;

        return workflows.filter((workflow)=> workflow.department === selectedDepartment);
    }, [selectedDepartment])

    const totalWorkflows = filteredWorkflows.length;
    const delayedWorkflows = filteredWorkflows.filter((workflow)=> workflow.status === "Delayed").length;
    const totalEstimatedSavings = filteredWorkflows.reduce((total, workflow) => total + estimateMonthlySavings(workflow), 0);

    const averageAutomationScore = filteredWorkflows.length > 0 ? Math.round(filteredWorkflows.reduce((total, workflow) => total + calculateAutomationScore(workflow), 0)/ filteredWorkflows.length) : 0;

    const chartData = filteredWorkflows.map((workflow)=> ({
        name: workflow.processName,
        score: calculateAutomationScore(workflow),
        savings: estimateMonthlySavings(workflow)
    }))

    const [aiRecommendation, setAiRecommendation] = useState<Record<number, string>>({});
    const [loadingWorkflowId, setLoadingWorkflowId] = useState<number | null>(null);

    async function handleGenerateAIRecommendation(workflow: any) {
        setLoadingWorkflowId(workflow.id)

        try{
            const response = await fetch("/api/ai-recommendation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(workflow),
            });
            const data = await response.json();

            setAiRecommendation((previous)=> ({
                ...previous,
                [workflow.id]: data.recommendation,
            }));
        } catch {
            setAiRecommendation((previous) => ({
                ...previous,
                [workflow.id]: "Unable to generate AI recommencdation"
            }))
        } finally{
            setLoadingWorkflowId(null);
        }
    }

    const dashboardSummary = [
        {
            icon: <BarChart3 className="mb-4 h-8 w-8 text-blue-700" />,
            title: "Total Workflows",
            count: `${totalWorkflows}`
        },
        {
            icon: <Clock className="mb-4 h-8 w- text-orange-600" />,
            title: "Delayed Workflows",
            count: `${delayedWorkflows}`
        },
        {
            icon: <Bot className="mb-4 h-8 w-8 text-purple-700" />,
            title: "Avg Automation Score",
            count: `${averageAutomationScore}/100`
        },
        {
            icon: <PoundSterling className="mb-4 h-8 w-8 text-green-700" />,
            title: "Estimated Monthly Savings",
            count: `£${totalEstimatedSavings.toLocaleString()}`
        }
    ]

    return (
      <main className="min-h-screen bg-slate-100 p-8">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                AI Workflow Automation Portfolio Project
              </p>
              <h1 className="mt-2 text-4xl font-bold text-slate-900">
                {" "}
                AI Workflow Automation Dashboard
              </h1>
              <p className="mt-3 max-w-3xl text-slate-600">
                A business operations dashboard that identifies automation
                opportunities, estimates potential savings, and recommends
                scalable workflow improvements across multiple departments.
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Filter by department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) =>
                  setSelectedDepeartment(e.target.value as Department | "All")
                }
                className="rounded-xl border-slate-300 bg-white px-4 py-3 text-sm shadow-sm text-slate-700"
              >
                {departments.map((department) => (
                  <option
                    key={department}
                    value={department}
                    className="text-slate-700"
                  >
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            {
                dashboardSummary.map((card)=> <SummaryCard key={card.title} icon={card.icon} title={card.title} count={card.count} />)
            }
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Automation Priority Score
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Higher score indicate stronger automation potential.
              </p>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Bar dataKey="score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Estimated Monthly Savings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Estimated savings from reducing manual workload by 35%
              </p>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Bar dataKey="savings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Workflow Automation Assessment
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Processes are scored using volume, manual effort, error rate,
                and delay indicators.
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
                  {filteredWorkflows.map((workflow) => {
                    const score = calculateAutomationScore(workflow);
                    const savings = estimateMonthlySavings(workflow);

                    return (
                      <tr
                        key={workflow.id}
                        className="border-t border-slate-100"
                      >
                        <td className="p-4 font-medium text-slate-900">
                          {workflow.processName}
                        </td>
                        <td className="p-4 text-slate-600">
                          {workflow.department}
                        </td>
                        <td className="p-4">
                          <span className="round-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                            {workflow.status}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600">
                          {workflow.manualSteps}
                        </td>
                        <td className="p-4 text-slate-600">
                          {workflow.monthlyVolume}
                        </td>
                        <td className="p-4 text-slate-600">
                          {workflow.errorRatePercent}%
                        </td>
                        <td className="p-4 font-bold text-blue-700">
                          {score}/100
                        </td>
                        <td className="p-4 font-bold text-blue-700">
                          £{savings.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {filteredWorkflows.map((workflow)=> (
                <div key={workflow.id} className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {workflow.processName}
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">{workflow.department} . Owner: {workflow.owner}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{calculateAutomationScore(workflow)}/100</span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">
                        {generateRecommendation(workflow)}
                    </p>
                    <button onClick={()=> handleGenerateAIRecommendation(workflow)} disabled={loadingWorkflowId === workflow.id} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                        {
                            loadingWorkflowId === workflow.id 
                            ? "Generating AI recommendation..."
                            : "Generate AI recommendation"
                        }
                    </button>
                    {
                        aiRecommendation[workflow.id] && (
                            <div className="mt-4 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">
                                <p className="mb-2 font-bold text-blue-800">AI Recommendation</p>
                                {/* <p className="whitespace-pre-line">{aiRecommendation[workflow.id]}</p> */}
                                <MarkdownRenderer content={aiRecommendation[workflow.id]} />
                            </div>
                        )
                    }
                </div>
            ))}
          </div>
        </section>
      </main>
    );
}