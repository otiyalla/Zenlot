
export interface AnalysisProps {
    key: string;
    name: string;
};

export type AnalysisType = 'weekly_analysis' | 'weekly_pips' | 'monthly_analysis' | 'monthly_pips';

export interface IAnalysisCard {
    id: number,
    title: string,
    type: string,
    content: {
        trades: number,
        gain: number,
        loss: number,
        net?: number
    }
}