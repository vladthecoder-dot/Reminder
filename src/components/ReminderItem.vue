<script setup lang="ts">
import type { Reminder } from '@/types/reminder';

const props = defineProps<{
    reminder: Reminder,
    isTriggered: boolean
}>()

const emit = defineEmits<{
    finishReminder: [id: string],
    deleteReminder: [id: string]
}>()

function getTime(): string {
    return props.reminder.dateTime.split('T')[1] ?? 'NaN'
}

function getDate(): string {
    return props.reminder.dateTime.split('T')[0] ?? 'NaN'
}

function finishReminder() {
    emit('finishReminder', props.reminder.id)
}

function deleteReminder() {
    emit('deleteReminder', props.reminder.id)
}
</script>

<template>
    <div 
        class="reminder-item"
        :class="{'reminder-triggered': props.isTriggered}"
    >
        <span>
            {{ props.reminder.text }}
        </span>
        <span class="reminder-time">
            {{ getTime() }}
        </span>
        <span class="reminder-date">
            {{ getDate() }}
        </span>
        <button 
            type="button" 
            :disabled="props.reminder.completed"
            @click="finishReminder"
        >
            Finish
        </button>

        <button type="button" @click="deleteReminder">
            Delete
        </button>
    </div>
</template>

<style scoped>
    div {
        display: flex;
        justify-content: end;
        align-items: center;
        margin-bottom: 10px;
    }
    div span {
        padding: 5px 10px;
    }
    div > :first-child {
        margin-right: auto;
    }
    
    button:disabled {
        opacity: 50%;
        cursor: not-allowed;
    }

    .reminder-triggered {
        background-color: #fff0cc;
        border: 1px solid #e6a23c;
        border-left: 5px solid #e6a23c;
        color: black;
    }
</style>