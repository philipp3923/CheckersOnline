function generate_pad(word: string, size: number) {
    while (word.length < size) word = "0" + word;
    return word;
}

function generate_random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generate_id(){
    return `${Date.now().toString(36)}${generate_pad(generate_random(0, 1679616).toString(36), 8)}`.toUpperCase();

}

//#TODO move generation checks from auth here

export function generate_guestid(){
    return "GUEST-" + generate_id();
}

export function generate_gameid(){
    return "GAME-" + generate_id();
}

export function generate_userid(){
    return "USER-" + generate_id();
}