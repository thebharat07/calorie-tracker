import {
  Goals,
  MealEntry,
  CreateMealEntryDto,
  UpdateMealEntryDto,
  EntriesResponse,
  ReportsData,
  ExtractResponse,
  MealType,
  Micronutrients,
} from '@/types';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Configurable backend REST API URL (defaults to relative /api proxied via Next.js rewrites or reverse proxy)
const API_BASE_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8080';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}/api${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status);
  }

  return data;
}

function mapBackendEntryToFrontend(item: any): MealEntry {
  const mealTypeFormatted = (item.mealType
    ? item.mealType.charAt(0).toUpperCase() + item.mealType.slice(1).toLowerCase()
    : 'Breakfast') as MealType;

  return {
    id: String(item.id),
    date: item.entryDate,
    mealType: mealTypeFormatted,
    foodName: item.foodName,
    quantity: item.quantity,
    unit: item.unit,
    calories: item.calories,
    protein: item.proteinG ?? 0,
    carbs: item.carbsG ?? 0,
    fat: item.fatG ?? 0,
    micronutrients: {
      fiber: item.fiberG ?? undefined,
      sugar: item.sugarG ?? undefined,
      sodium: item.sodiumMg ?? undefined,
      calcium: item.calciumMg ?? undefined,
      iron: item.ironMg ?? undefined,
      potassium: item.potassiumMg ?? undefined,
      vitaminA: item.vitaminAMcg ?? undefined,
      vitaminC: item.vitaminCMg ?? undefined,
      vitaminD: item.vitaminDMcg ?? undefined,
    },
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
}

function mapFrontendEntryToBackend(dto: CreateMealEntryDto | UpdateMealEntryDto): any {
  const body: any = {};
  if (dto.date !== undefined) body.entryDate = dto.date;
  if (dto.mealType !== undefined) body.mealType = dto.mealType.toUpperCase();
  if (dto.foodName !== undefined) body.foodName = dto.foodName;
  if (dto.quantity !== undefined) body.quantity = dto.quantity;
  if (dto.unit !== undefined) body.unit = dto.unit;
  if (dto.calories !== undefined) body.calories = Math.round(dto.calories);
  if (dto.protein !== undefined) body.proteinG = dto.protein;
  if (dto.carbs !== undefined) body.carbsG = dto.carbs;
  if (dto.fat !== undefined) body.fatG = dto.fat;

  if (dto.micronutrients) {
    if (dto.micronutrients.fiber !== undefined) body.fiberG = dto.micronutrients.fiber;
    if (dto.micronutrients.sugar !== undefined) body.sugarG = dto.micronutrients.sugar;
    if (dto.micronutrients.sodium !== undefined) body.sodiumMg = dto.micronutrients.sodium;
    if (dto.micronutrients.calcium !== undefined) body.calciumMg = dto.micronutrients.calcium;
    if (dto.micronutrients.iron !== undefined) body.ironMg = dto.micronutrients.iron;
    if (dto.micronutrients.potassium !== undefined) body.potassiumMg = dto.micronutrients.potassium;
    if (dto.micronutrients.vitaminA !== undefined) body.vitaminAMcg = dto.micronutrients.vitaminA;
    if (dto.micronutrients.vitaminC !== undefined) body.vitaminCMg = dto.micronutrients.vitaminC;
    if (dto.micronutrients.vitaminD !== undefined) body.vitaminDMcg = dto.micronutrients.vitaminD;
  }
  return body;
}

export const api = {
  // 1. Goals
  async getGoals(): Promise<Goals | null> {
    try {
      const data = await request<any>('/goals');
      if (!data) return null;
      return {
        id: data.id,
        dailyCalories: data.dailyCalories,
        protein: data.proteinG,
        carbs: data.carbsG,
        fat: data.fatG,
        currentWeight: data.currentWeightKg,
        targetWeight: data.targetWeightKg,
        updatedAt: data.updatedAt,
      };
    } catch (err: any) {
      if (err.status === 404) {
        return null;
      }
      throw err;
    }
  },

  async saveGoals(goals: Omit<Goals, 'id' | 'updatedAt'>): Promise<Goals> {
    const payload = {
      dailyCalories: Math.round(goals.dailyCalories),
      proteinG: goals.protein,
      carbsG: goals.carbs,
      fatG: goals.fat,
      currentWeightKg: goals.currentWeight,
      targetWeightKg: goals.targetWeight,
    };
    const data = await request<any>('/goals', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return {
      id: data.id,
      dailyCalories: data.dailyCalories,
      protein: data.proteinG,
      carbs: data.carbsG,
      fat: data.fatG,
      currentWeight: data.currentWeightKg,
      targetWeight: data.targetWeightKg,
      updatedAt: data.updatedAt,
    };
  },

  // 2. Entries
  async getEntries(params?: {
    startDate?: string;
    endDate?: string;
    mealType?: 'All' | MealType;
    page?: number;
    pageSize?: number;
  }): Promise<EntriesResponse> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.set('from', params.startDate);
    if (params?.endDate) searchParams.set('to', params.endDate);
    if (params?.mealType && params.mealType !== 'All') {
      searchParams.set('mealType', params.mealType.toUpperCase());
    }

    // Backend Spring Page is 0-indexed
    const pageIndex = Math.max(0, (params?.page || 1) - 1);
    searchParams.set('page', pageIndex.toString());
    searchParams.set('size', (params?.pageSize || 8).toString());

    const qs = searchParams.toString();
    const res = await request<any>(`/entries${qs ? `?${qs}` : ''}`);

    const items = res.items || [];
    const entries = items.map(mapBackendEntryToFrontend);

    // Compute daily totals for current result
    const dailyTotals: {
      [date: string]: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        count: number;
      };
    } = {};

    entries.forEach((e: MealEntry) => {
      if (!dailyTotals[e.date]) {
        dailyTotals[e.date] = { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 };
      }
      dailyTotals[e.date].calories += e.calories;
      dailyTotals[e.date].protein += e.protein;
      dailyTotals[e.date].carbs += e.carbs;
      dailyTotals[e.date].fat += e.fat;
      dailyTotals[e.date].count += 1;
    });

    return {
      entries,
      total: res.totalElements || entries.length,
      page: (res.page !== undefined ? res.page : pageIndex) + 1,
      pageSize: res.size || (params?.pageSize || 8),
      totalPages: Math.max(1, res.totalPages || 1),
      dailyTotals,
    };
  },

  async getEntryById(id: string): Promise<MealEntry> {
    const data = await request<any>(`/entries/${id}`);
    return mapBackendEntryToFrontend(data);
  },

  async createEntry(dto: CreateMealEntryDto): Promise<MealEntry> {
    const payload = mapFrontendEntryToBackend(dto);
    const data = await request<any>('/entries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapBackendEntryToFrontend(data);
  },

  async updateEntry(id: string, dto: UpdateMealEntryDto): Promise<MealEntry> {
    const payload = mapFrontendEntryToBackend(dto);
    const data = await request<any>(`/entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return mapBackendEntryToFrontend(data);
  },

  async deleteEntry(id: string): Promise<void> {
    await request<void>(`/entries/${id}`, {
      method: 'DELETE',
    });
  },

  // 3. Nutrition Reports
  async getReports(startDate?: string, endDate?: string): Promise<ReportsData> {
    const end = endDate || new Date().toISOString().split('T')[0];
    const d = new Date();
    d.setDate(d.getDate() - 6);
    const start = startDate || d.toISOString().split('T')[0];

    // Fetch reports concurrently from Spring Boot backend endpoints
    const [macrosRes, microsRes, goalVsActualRes, goals] = await Promise.all([
      request<any>(`/reports/macros?from=${start}&to=${end}&groupBy=day`).catch(() => ({ buckets: [] })),
      request<any>(`/reports/micros?from=${start}&to=${end}`).catch(() => ({ nutrients: [] })),
      request<any>(`/reports/goal-vs-actual?from=${start}&to=${end}`).catch(() => ({ hasGoal: false, metrics: [] })),
      this.getGoals().catch(() => null),
    ]);

    // Build complete daily timeline map without calendar gaps
    const dateMap: { [d: string]: { calories: number; protein: number; carbs: number; fat: number } } = {};
    const curDate = new Date(start);
    const stopDate = new Date(end);
    while (curDate <= stopDate) {
      const dStr = curDate.toISOString().split('T')[0];
      dateMap[dStr] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
      curDate.setDate(curDate.getDate() + 1);
    }

    (macrosRes.buckets || []).forEach((b: any) => {
      if (dateMap[b.period]) {
        dateMap[b.period] = {
          calories: b.calories || 0,
          protein: Math.round(b.proteinG || 0),
          carbs: Math.round(b.carbsG || 0),
          fat: Math.round(b.fatG || 0),
        };
      }
    });

    const dailySummaries = Object.keys(dateMap).sort().map((dateStr) => ({
      date: dateStr,
      calories: dateMap[dateStr].calories,
      protein: dateMap[dateStr].protein,
      carbs: dateMap[dateStr].carbs,
      fat: dateMap[dateStr].fat,
      goalCalories: goals ? goals.dailyCalories : 0,
    }));

    let totalCal = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    dailySummaries.forEach((s) => {
      totalCal += s.calories;
      totalProtein += s.protein;
      totalCarbs += s.carbs;
      totalFat += s.fat;
    });

    const proteinCalories = totalProtein * 4;
    const carbsCalories = totalCarbs * 4;
    const fatCalories = totalFat * 9;
    const macroCalSum = Math.max(1, proteinCalories + carbsCalories + fatCalories);

    const proteinPercent = Math.round((proteinCalories / macroCalSum) * 100);
    const carbsPercent = Math.round((carbsCalories / macroCalSum) * 100);
    const fatPercent = Math.max(0, 100 - proteinPercent - carbsPercent);

    const defaultTargets: { [k: string]: number } = {
      'Dietary Fiber': 30,
      'Sugar': 35,
      'Sodium': 2300,
      'Calcium': 1000,
      'Iron': 18,
      'Potassium': 3400,
      'Vitamin A': 900,
      'Vitamin C': 90,
      'Vitamin D': 20,
    };

    const keyMap: { [k: string]: keyof Micronutrients } = {
      'Dietary Fiber': 'fiber',
      'Sugar': 'sugar',
      'Sodium': 'sodium',
      'Calcium': 'calcium',
      'Iron': 'iron',
      'Potassium': 'potassium',
      'Vitamin A': 'vitaminA',
      'Vitamin C': 'vitaminC',
      'Vitamin D': 'vitaminD',
    };

    const micronutrientAverages = (microsRes.nutrients || []).map((n: any) => ({
      name: n.nutrient,
      key: keyMap[n.nutrient] || 'fiber',
      avgDaily: n.avgDailyAmount || 0,
      unit: n.unit,
      target: defaultTargets[n.nutrient] || 50,
    }));

    const goalVsActual = (goalVsActualRes.metrics || []).map((m: any) => ({
      metric: m.metric,
      actual: m.actualDailyAvg || 0,
      target: m.target || 0,
      unit: m.unit,
      percentage: m.percentageAchieved || 0,
    }));

    return {
      period: { startDate: start, endDate: end },
      hasGoals: Boolean(goalVsActualRes.hasGoal && goals && goals.dailyCalories > 0),
      goals,
      dailySummaries,
      macroTotals: {
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        proteinCalories,
        carbsCalories,
        fatCalories,
        totalCalories: totalCal,
        proteinPercent,
        carbsPercent,
        fatPercent,
      },
      micronutrientAverages,
      goalVsActual,
    };
  },

  // 4. AI Photo Extraction (Google Gemini Vision on Spring Boot Backend)
  async extractMealFromPhoto(file: File): Promise<ExtractResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await request<any>('/extract', {
      method: 'POST',
      body: formData,
    });

    const mealTypeFormatted = (res.mealType
      ? res.mealType.charAt(0).toUpperCase() + res.mealType.slice(1).toLowerCase()
      : 'Breakfast') as MealType;

    return {
      foodName: res.detectedFoodName || 'Identified Meal',
      mealType: mealTypeFormatted,
      quantity: res.quantity || 1,
      unit: res.unit || 'serving',
      calories: res.calories || 0,
      protein: res.proteinG || 0,
      carbs: res.carbsG || 0,
      fat: res.fatG || 0,
      micronutrients: {
        fiber: res.fiberG ?? undefined,
        sugar: res.sugarG ?? undefined,
        sodium: res.sodiumMg ?? undefined,
        calcium: res.calciumMg ?? undefined,
        iron: res.ironMg ?? undefined,
        potassium: res.potassiumMg ?? undefined,
        vitaminA: res.vitaminAMcg ?? undefined,
        vitaminC: res.vitaminCMg ?? undefined,
        vitaminD: res.vitaminDMcg ?? undefined,
      },
      confidence: res.confidence,
      message: res.notes,
    };
  },
};
