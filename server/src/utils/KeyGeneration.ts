export function generate_pad(word: string, size: number) {
    while (word.length < size) word = "0" + word;
    return word;
}

export function generate_random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function generate_guestid(){
    return `GUEST_${Date.now().toString(36)}${generate_pad(generate_random(0, 1679616).toString(36), 8)}`.toUpperCase();
}

export function generate_userid(id: number){
    return (generate_pad(id.toString(36), 6) + generate_pad(generate_random(0, 1679616).toString(36), 8)).toUpperCase();
}