import type { Reminder } from '@/types/reminder'

const STORAGE_KEY = 'reminders'

export function loadReminders(): Reminder[] {
    const data = localStorage.getItem(STORAGE_KEY)

    if (data === null) {
        return []
    }

    try {
        return JSON.parse(data) as Reminder[]
    } catch {
        return []
    }
}

export function saveReminders(reminders: Reminder[]): void {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reminders)
    )
}