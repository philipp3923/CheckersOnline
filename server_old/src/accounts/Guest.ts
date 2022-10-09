import Account from "./Account";
import {generate_guestid} from "../utils/KeyGeneration";

export default class Guest extends Account{

    constructor() {
        super(generate_guestid());
    }



}