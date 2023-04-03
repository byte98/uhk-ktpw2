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

import { Schema, model } from "mongoose";

/**
 * Interface defining contract for users data objects
 */
export interface IUser{

    /**
     * Identifier of user
     */
    id: number;

    /**
     * Name of user
     */
    name: string;

    /**
     * Surname of user
     */
    surname: string;

    /**
     * Username of user
     */
    username: string;

    /**
     * E-mail of user
     */
    email: string,

    /**
     * Hash of password of user
     */
    password: string

}

/**
 * Schema of user in database
 */
const userSchema = new Schema<IUser>({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

/**
 * Model of user in database
 */
export const User = model<IUser>("User", userSchema);


