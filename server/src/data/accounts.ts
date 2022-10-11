const connections: { [ext_id: string]: string[] } = {};

export function connect(ext_id: string, socket_id: string) {
    if (typeof connections[ext_id] === "undefined") {
        connections[ext_id] = [];
    }
    connections[ext_id].push(socket_id);
}

export function disconnect(ext_id: string, socket_id: string) {
    const result = connections[ext_id];
    const index = result?.indexOf(socket_id);

    if (index < 0 || typeof index === "undefined") {
        throw new Error("Trying to disconnect non existent account connection");
    }

    result.splice(index, 1);

    if (result.length < 1) {
        delete connections[ext_id];
    }
}


export function getConnections(ext_id: string): string[] {
    const result = connections[ext_id];

    if (typeof result === "undefined") {
        throw new Error("Trying to access non existent account connections");
    }

    return result;
}
