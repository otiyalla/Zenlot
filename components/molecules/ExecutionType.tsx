import { Badge, BadgeText } from "@/components/ui/badge";
import { useTranslate } from '@/hooks/useTranslate';

interface ExecutionTypeProp {
    execution: 'buy' | 'sell'
    language?: 'en' | 'fr';
}

const ExecutionType = ({language, execution}: ExecutionTypeProp ) => {
    const { localize } = useTranslate(language);
    const bg_color = (execution === 'buy') ? ' bg-green-500' : ' bg-red-500'
    const style = `rounded justify-center items-center ${bg_color}`
    return (
        <Badge size="lg" variant="solid" className={style}>
            <BadgeText className="font-bold text-center text-white">
                {localize(`forex.${execution}`)}
            </BadgeText>
        </Badge>
    )
}

export default ExecutionType;