import OpenAI from "openai";
import {NextResponse} from "next/server";

const API_KEY = process.env.GROQ_API_KEY

const client = new OpenAI({
    apiKey: API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
})

export async function POST(request: Request){
    try{
        if(!API_KEY){
            return NextResponse.json(
                {error: "Missing key in .env.local"},
                {status: 500}
            )
        }
        const workflow = await request.json();

        const prompt = `
        You are an AI automation consultant.

        Analyse tis business workflow and provide:
        1. Automation opportunity
        2.Recommended AI/SaaS tools
        3. Estimated business benefit
        4. Implementation risks\Practical next steps

        Workflow:
        Process: ${workflow.processName}
        Department: ${workflow.department}
        Status: ${workflow.status}
        Manual steps: ${workflow.manualSteps}
        Monthly volume: ${workflow.monthlyVolume}
        Average completion time: ${workflow.averageCompletionTimeHours}
        Error rate: ${workflow.errorRatePercent}
        Estimated hourly cost: ${workflow.estimatedHourlyCost}

        Keep the answer clear, practical and business-focused.
        `

        const completion = await client.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are a practical AI automation specialist helping businesses reduce manual work and improve operational efficiency.",
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            temperature: 0.4,
            max_tokens: 700
        });

        return NextResponse.json({
            recommendation: completion.choices[0]?.message?.content ?? "No recommendation returned.",
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || "Failed to generate AI recommendation.",
                message: error?.response?.data || null
            },
            {status: 500}
        );
    }
}