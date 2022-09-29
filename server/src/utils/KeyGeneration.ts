export function generate_pad(word: string, size: number) {
    while (word.length < size) word = "0" + word;
    return word;
}

export function generate_random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}