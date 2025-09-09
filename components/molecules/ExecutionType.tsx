import { Badge, BadgeText } from "@/components/ui/badge";
import { useTranslate } from '@/hooks/useTranslate';
import { useTrade } from "@/providers/TradeProvider";
import { useEffect } from "react";

interface ExecutionTypeProp {
    execution: 'buy' | 'sell';
}

const ExecutionType = ({ execution}: ExecutionTypeProp ) => {
    const { localize } = useTranslate();
    const { setTrade } = useTrade();
    const bg_color = (execution === 'buy') ? ' bg-green-500' : ' bg-red-500'
    const style = `rounded justify-center items-center ${bg_color}`

    useEffect(() => {
        if(execution) setTrade(prev => ({ ...prev, execution }));
    }, [execution]);
    return (
        <Badge size="lg" variant="solid" className={style}>
            <BadgeText className="font-bold text-center text-white">
                {localize(`forex.${execution}`)}
            </BadgeText>
        </Badge>
    )
}

export default ExecutionType;