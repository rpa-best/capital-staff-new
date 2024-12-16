export const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
]

export const getDashedDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const parseDate = (date: string) => {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
        throw new Error("Неверный формат даты");
    }
    
    const [day, month, year] = date.split('.').map(Number);
    return new Date(year, month - 1, day);
}