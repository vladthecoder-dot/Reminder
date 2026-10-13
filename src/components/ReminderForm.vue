<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Reminder } from '../types/reminder'

const emit = defineEmits<{
    addReminder: [reminder: Reminder]
}>()

const reminderText = ref<string>('');
const reminderTime = ref<string>('');

function toLocalISOString(date: Date): string {
    const tzOffsetMs = date.getTimezoneOffset() * 60000;

    const localTime = new Date(date.getTime() - tzOffsetMs); 

    return localTime.toISOString().slice(0, -1);
}

const rawDate = ref<Date>(new Date())
const stringDate = computed({
    get() {
        return toLocalISOString(rawDate.value).split('T')[0]
    },
    set(newValue: string) {
        const [year, month, day] = newValue.split('-').map(Number)

        if (year == undefined || month == undefined || day == undefined) {
            rawDate.value = new Date()
            return
        }

        rawDate.value = new Date(
            year,
            month - 1,
            day,
            rawDate.value.getHours(),
            rawDate.value.getMinutes()
        )
    }
})

function setLocalTime() {
    rawDate.value = new Date();
    rawDate.value.setHours(rawDate.value.getHours() + 1)

    const hours = String(rawDate.value.getHours()).padStart(2, '0')
    const minutes = String(rawDate.value.getMinutes()).padStart(2, '0')

    reminderTime.value = `${hours}:${minutes}`
}

function addReminder() {
    const text = reminderText.value.trim()

    if (!text || !reminderTime.value || !stringDate.value) {
        return
    }

    const reminder: Reminder = {
        id: crypto.randomUUID(),
        text,
        dateTime: `${stringDate.value}T${reminderTime.value}`,
        completed: false
    }

    emit('addReminder', reminder)

    reminderText.value = ''
}

setLocalTime()

</script>

<template>
    <form @submit.prevent="addReminder">
        <input type="text" placeholder="Reminder" class="reminder-text" v-model="reminderText" required>

        <input type="time" class="reminder-time" v-model="reminderTime" required>
        <input type="date" class="reminder-date" v-model="stringDate" required>

        <button type="submit">
            Add
        </button>
    </form>
</template>

<style scoped>
form {
    display: flex;
    width: 100%;
    gap: 5px;
}

.reminder-text {
    flex-grow: 1;
}

.reminder-time {
    display: inline-block;
    width: 100px;
    text-align: center;
}

.reminder-date {
    display: inline-block;
    width: 140px;
    text-align: center;
}

</style>