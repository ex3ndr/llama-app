export function createDialogTitle(src: string) {
    let r = src.trim();
    while (r.indexOf('\n') >= 0) {
        r = r.replace('\n', ' ');
    }
    while (r.indexOf('  ') >= 0) {
        r = r.replace('  ', ' ');
    }
    if (r.length > 100) {
        r = r.substring(0, 100);
    }
    return r;
}