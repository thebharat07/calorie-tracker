export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Micronutrients {
  fiber?: number;      // g
  sugar?: number;      // g
  sodium?: number;     // mg
  calcium?: number;    // mg
  iron?: number;       // mg
  potassium?: number;  // mg
  vitaminA?: number;   // mcg
  vitaminC?: number;   // mg
  vitaminD?: number;   // mcg
}

export interface MealEntry {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
  mealType: MealType;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number; // g
  carbs: number;   // g
  fat: number;     // g
  micronutrients?: Micronutrients;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateMealEntryDto = Omit<MealEntry, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateMealEntryDto = Partial<CreateMealEntryDto>;

export interface Goals {
  id?: string;
  dailyCalories: number;
  protein: number; // g
  carbs: number;   // g
  fat: number;     // g
  currentWeight: number; // kg
  targetWeight: number;  // kg
  updatedAt?: string;
}

export interface EntryFiltersState {
  startDate?: string;
  endDate?: string;
  mealType?: 'All' | MealType;
  page: number;
  pageSize: number;
}

export interface EntriesResponse {
  entries: MealEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  dailyTotals: {
    [date: string]: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      count: number;
    };
  };
}

export interface DailySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goalCalories: number;
}

export interface ReportsData {
  period: {
    startDate: string;
    endDate: string;
  };
  hasGoals: boolean;
  goals: Goals | null;
  dailySummaries: DailySummary[];
  macroTotals: {
    protein: number;
    carbs: number;
    fat: number;
    proteinCalories: number;
    carbsCalories: number;
    fatCalories: number;
    totalCalories: number;
    proteinPercent: number;
    carbsPercent: number;
    fatPercent: number;
  };
  micronutrientAverages: {
    name: string;
    key: keyof Micronutrients;
    avgDaily: number;
    unit: string;
    target?: number;
  }[];
  goalVsActual: {
    metric: string;
    actual: number;
    target: number;
    unit: string;
    percentage: number;
  }[];
}

export interface ExtractResponse {
  foodName: string;
  mealType: MealType;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  micronutrients?: Micronutrients;
  confidence?: number;
  message?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}
