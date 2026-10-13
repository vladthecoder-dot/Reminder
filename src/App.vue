<script setup lang="ts">
import { saveReminders, loadReminders } from './services/reminderStorage.ts';
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Reminder } from './types/reminder.ts'
import ReminderForm from './components/ReminderForm.vue';
import ReminderItem from './components/ReminderItem.vue'
import Filter from './components/Filter.vue';

type ReminderFilter = 'active' | 'finished'

const filter = ref<ReminderFilter>('active')
const reminders = ref<Reminder[]>(loadReminders())

const now = ref(Date.now())
const notifiedIds = new Set<string>()

let timer: ReturnType<typeof setInterval> | undefined

function isTriggered(reminder: Reminder): boolean {
	return (
		!reminder.completed &&
		new Date(reminder.dateTime).getTime() <= now.value
	)
}

function checkReminders() {
    now.value = Date.now()

    if (!('Notification' in window)) {
        return
    }

    if (Notification.permission !== 'granted') {
        return
    }

    for (const reminder of reminders.value) {
        if (!isTriggered(reminder)) {
            continue
        }

        if (notifiedIds.has(reminder.id)) {
            continue
        }

        new Notification('Время напоминания!', {
            body: reminder.text,
            tag: reminder.id
        })

        notifiedIds.add(reminder.id)
    }
}

onMounted(() => {
    checkReminders()
    timer = setInterval(checkReminders, 1000)
})

onUnmounted(() => {
    if (timer !== undefined) {
        clearInterval(timer)
    }
})

watch(
	reminders,
	(newReminders) => {
		saveReminders(newReminders)
	},
	{deep: true}
)

const filteredReminders = computed(() => {
    return reminders.value
        .filter(reminder => {
            if (filter.value === 'active') {
                return !reminder.completed
            }

            return reminder.completed
        })
        .sort((a, b) => {
            return Number(isTriggered(b)) - Number(isTriggered(a))
        })
})

function handleAddReminder(reminder: Reminder) {
	reminders.value.push(reminder)
}

function handleFinishReminder(reminderId: string) {
	const reminder = reminders.value.find(item => item.id === reminderId)

	if (reminder) {
		reminder.completed = true
	}
}

function handleDeleteReminder(reminderId: string) {
	reminders.value = reminders.value.filter(
		reminder => reminder.id !== reminderId
	)
}

function handleActiveFilter() {
	filter.value = 'active'
}

function handleFinishedFilter() {
	filter.value = 'finished'
}
</script>

<template>
    <main>
        <h1>Reminders</h1>

        <ReminderForm 
			@add-reminder="handleAddReminder" 
		/>

        <p>My reminders</p>
		<Filter
			:active-filter="filter"
			@filter-active="handleActiveFilter"
			@filter-finished="handleFinishedFilter"
		/>
        <div class="reminder-list">
			<ReminderItem
				v-for="reminder in filteredReminders"
				:key="reminder.id"
				:reminder="reminder"
				:is-triggered="isTriggered(reminder)"
				@finish-reminder="handleFinishReminder"
				@delete-reminder="handleDeleteReminder"
			/>
		</div>
    </main>
</template>

<style scoped>
main {
	max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    margin-bottom: 2rem;
}

p {
	padding-top: 10px;
}
</style>