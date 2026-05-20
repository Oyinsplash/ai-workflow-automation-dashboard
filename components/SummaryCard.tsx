import react, { ReactElement } from 'react'

type Prop = {
    icon: ReactElement;
    title: string;
    count: string;
}
const SummaryCard = ({icon, title, count}: Prop) =>{
    return (
        <div className="round-2xl bg-white p-6 shadow-sm">
            {icon}
            <p className="text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
                {count}
            </p>
        </div>
    )
}

export default SummaryCard;