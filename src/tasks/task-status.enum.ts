export const StatusTask = {
    OPEN: 'OPEN',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE'
} as const;

export type StatusTaskType = typeof StatusTask[keyof typeof StatusTask];