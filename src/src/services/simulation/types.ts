
export interface SavedSimulation {
    id: string;
    user_id: string;
    title: string;
    daily_rate: number;
    days_per_month: number;
    months_per_year: number;
    expenses: number;
    regime?: string;
    employee_gross_salary?: number;
    employee_meal_allowance?: number;
    created_at: string;
}
