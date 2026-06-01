export function isValidUrl(str: string): boolean {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function cleanSlashFromUrl(url: string): string {
    return url.replace(/\/+$/, ''); // 1 or more slashes at the end
}
