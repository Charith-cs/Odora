export const generateSlots = (start: Date, end: Date, maxPerHour: number) => {
    const slots: string[] = [];

    const slotDuration = Math.floor(60 / maxPerHour);

    let current = new Date(start);

    while (current < end) {
        const hours = current.getHours().toString().padStart(2, "0");
        const minutes = current.getMinutes().toString().padStart(2, "0");

        slots.push(`${hours}:${minutes}`);

        current.setMinutes(current.getMinutes() + slotDuration);
    }

    return slots;
};