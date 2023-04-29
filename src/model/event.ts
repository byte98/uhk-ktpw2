// Copyright (C) 2023 Jiri Skoda <developer@skodaj.cz>
// 
// This file is part of b22l-skodaji1-ktpw2-semestral-project.
// 
// b22l-skodaji1-ktpw2-semestral-project is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 2 of the License, or
// (at your option) any later version.
// 
// b22l-skodaji1-ktpw2-semestral-project is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with b22l-skodaji1-ktpw2-semestral-project.  If not, see <http://www.gnu.org/licenses/>.

import mongoose, { Schema, SchemaType, model, mongo } from "mongoose";
import { IUser } from "./user";
import Configuration from "../configuration";

/**
 * Interface defining contract for event data objects
 */
export interface IEvent
{
    /**
     * Name of event
     */
    name: string;

    /**
     * Description of event
     */
    description: string;

    /**
     * Start of the event
     */
    start: Date;

    /**
     * End of the event
     */
    end: Date;

    /**
     * Color of event
     */
    color: "RED" | "YELLOW" | "GREEN" | "BLUE" | "NONE";

    /**
     * Identifier of user which has created event
     */
    user: string;

    /**
     * Identifier of event
     */
    ident: string;
}

/**
 * Schema of event in database
 */
const eventSchema = new Schema<IEvent>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    color: {type: String, required: true},
    user: {type: String, required: true},
    start: {type: Date, required: true},
    end: {type: Date, required: true}
});

/**
 * Model of event in database
 */
export const Event = model<IEvent>("Event", eventSchema);

/**
 * Class which handles all operations over events
 */
export default class EventModel{

    /**
     * Creates new event
     * @param name Name of event
     * @param description Description event
     * @param color Color of event
     * @param start Start of event
     * @param end End of event
     * @param user Author of event
     */
    public static async create(
        name: string, description: string, color: "RED" | "YELLOW" | "GREEN" | "BLUE" | "NONE", start: Date, end: Date, user: IUser
    )
    {
        await mongoose.connect(Configuration.db);
        const event = new Event({
            name: name,
            description: description,
            color: color,
            start: start,
            end: end,
            user: user.ident
        });
        await event.save();
    }
}
