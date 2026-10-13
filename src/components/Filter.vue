<script setup lang="ts">

type ReminderFilter = 'active' | 'finished'

const props = defineProps<{
    activeFilter: ReminderFilter
}>()

const emit = defineEmits<{
    filterActive: [],
    filterFinished: []
}>()

function filterActive() {
    emit('filterActive')
}

function filterFinished() {
    emit('filterFinished')
}
</script>

<template>
    <div class="reminder-filter">
        <button 
            type="button"
            :class="{selected: props.activeFilter === 'active'}"
            @click="filterActive"
        >
            Active Reminders
        </button>
        <button 
            type="button"
            :class="{selected: props.activeFilter === 'finished'}"
            @click="filterFinished"
        >
            Finished Reminders
        </button>
    </div>
</template>

<style scoped>
    div {
        margin-bottom: 10px;
    }

    .reminder-filter button.selected {
        background-color: #2563eb;
        border-color: #2563eb;
        color: white;
    }

</style>