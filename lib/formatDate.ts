/**
 * Format a date to "DD MMM YYYY" (e.g., "12 Jan 2026")
 */
export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Format a datetime to "DD MMM YYYY, HH:MM AM/PM" (e.g., "12 Jan 2026, 2:30 PM")
 */
export function formatDateTime(date: string | Date): string {
    const d = new Date(date);
    const datePart = d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    const timePart = d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${datePart}, ${timePart}`;
}

/**
 * Format time only to "HH:MM AM/PM" (e.g., "2:30 PM")
 */
export function formatTime(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
