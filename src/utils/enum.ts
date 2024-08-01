interface Enum {
    [id: number]: string
}

export function EnumToObjects(e: Enum) {
    return Object.entries(e).map(([label, value]) => ({ label, value }));
}