export default function debounce<F extends (...args: Parameters<F>[]) => void>(
    fn: F,
    delay: number = 1500,
) {
    let timer: NodeJS.Timeout;

    const debounced = (...args: Parameters<F>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };

    debounced.cancel = () => clearTimeout(timer);

    return debounced as F & { cancel: () => void };
}
