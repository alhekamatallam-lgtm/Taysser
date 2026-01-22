
import React from 'react';

interface ProgressChartProps {
    plan: number;
    actual: number;
    unit: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ plan, actual, unit }) => {
    const percentage = plan > 0 ? Math.round((actual / plan) * 100) : 100;
    const barWidth = Math.min(percentage, 100);
    const isOverAchieved = percentage > 100;

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-baseline">
                <span className="font-medium text-stone-700">
                    المقدار المحفوظ: <span className="font-bold">{actual}</span> / {plan} {unit}
                </span>
                <span className={`font-bold text-lg ${isOverAchieved ? 'text-green-600' : 'text-teal-700'}`}>
                    {percentage}%
                </span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-4">
                <div 
                    className={`h-4 rounded-full transition-all duration-500 ${isOverAchieved ? 'bg-green-500' : 'bg-teal-600'}`}
                    style={{ width: `${barWidth}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                ></div>
            </div>
            {isOverAchieved && (
                <p className="text-sm text-green-600 text-right">
                    إنجاز رائع! تم تجاوز الخطة بمقدار {actual - plan} {unit}.
                </p>
            )}
        </div>
    );
};
