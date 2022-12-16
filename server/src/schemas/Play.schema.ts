import CoordinateSchema from "./Coordinate.schema";

export default interface PlaySchema{
    timestamp: number,
    time_left: number,
    capture: boolean,
    color: string,

    start: CoordinateSchema,
    target: CoordinateSchema
}