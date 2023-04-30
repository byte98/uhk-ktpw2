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
     * Date of the event
     */
    date: Date;

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
    date: {type: Date, required: true},
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
     * @param date Date of event
     * @param user Author of event
     */
    public static async create(
        name: string, description: string, color: "RED" | "YELLOW" | "GREEN" | "BLUE" | "NONE", date: Date, user: IUser
    )
    {
        await mongoose.connect(Configuration.db);
        const event = new Event({
            name: name,
            description: description,
            color: color,
            date: date,
            user: user.ident
        });
        await event.save();
    }

    /**
     * Gets all users events for specified date
     * @param user User which events will be returned
     * @param date Date of events
     * @returns Array with all users events for specified date
     */
    public static async get(user: IUser, date: Date): Promise<Array<IEvent>>
    {
        let reti: Array<IEvent> = new Array();
        let connection: typeof mongoose;
        connection =  await mongoose.connect(Configuration.db);
        let query :mongoose.Query<any | null, {}, {}, IEvent> =  Event.find({user: user.ident}).sort("start");
        let result: Array<IEvent> | null = await query.exec();
        if (result != null && result.length > 0)
        {
            for (let i: number = 0; i < result.length; i++)
            {
                if (result[i].date.getDate() == date.getDate() && result[i].date.getMonth() == date.getMonth() && result[i].date.getFullYear() == date.getFullYear())
                {
                    reti.push(result[i]);
                }
            }
        }
        return reti;
    }
}
