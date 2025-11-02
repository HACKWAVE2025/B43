// Data Service - Manages local storage (simulates Firebase/MongoDB)

export interface JournalEntry {
  goodThings: string[];
  date: string;
  sentiment?: number;
}

export interface MenstrualEntry {
  startDate: string;
  endDate?: string;
  flowIntensity: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  savedAt: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category?: string;
  createdAt: string;
}

// Journal Entries
export function saveJournalEntry(entry: JournalEntry) {
  const entries = getJournalEntries();
  entries.push(entry);
  localStorage.setItem('journalEntries', JSON.stringify(entries));
}

export function getJournalEntries(): JournalEntry[] {
  const stored = localStorage.getItem('journalEntries');
  return stored ? JSON.parse(stored) : [];
}

// Menstrual Data
export function saveMenstrualData(entry: MenstrualEntry) {
  const data = getMenstrualData();
  data.push(entry);
  localStorage.setItem('menstrualData', JSON.stringify(data));
}

export function getMenstrualData(): MenstrualEntry[] {
  const stored = localStorage.getItem('menstrualData');
  return stored ? JSON.parse(stored) : [];
}

// Todo Items
export function saveTodoItems(items: TodoItem[]) {
  localStorage.setItem('todoItems', JSON.stringify(items));
}

export function getTodoItems(): TodoItem[] {
  const stored = localStorage.getItem('todoItems');
  return stored ? JSON.parse(stored) : [];
}

export function addTodoItem(text: string, category?: string) {
  const items = getTodoItems();
  const newItem: TodoItem = {
    id: Date.now().toString(),
    text,
    completed: false,
    category,
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveTodoItems(items);
}

export function toggleTodoItem(id: string) {
  const items = getTodoItems();
  const item = items.find((i) => i.id === id);
  if (item) {
    item.completed = !item.completed;
    saveTodoItems(items);
  }
}

export function clearTodoItems() {
  saveTodoItems([]);
}

// Analytics Data (for admin)
export function getAnalyticsData() {
  return {
    totalUsers: 1247,
    activeToday: 342,
    avgStressLevel: 4.2,
    highStressUsers: 89,
    journalEntries: 2834,
    completionRate: 78,
    emergencyCalls: 12,
  };
}

// Get user's extracurricular activities count
export function getExtracurricularActivitiesCount(): number {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const activities = user.extracurricularActivities || [];
      return activities.filter((activity: string) => activity && activity.trim() !== '').length;
    }
  } catch (error) {
    console.error('Error getting extracurricular activities count:', error);
  }
  return 0;
}

// Get user's extracurricular activities list
export function getExtracurricularActivities(): string[] {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return (user.extracurricularActivities || []).filter((activity: string) => activity && activity.trim() !== '');
    }
  } catch (error) {
    console.error('Error getting extracurricular activities:', error);
  }
  return [];
}
