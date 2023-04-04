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

import mongoose, { Schema, model, mongo } from "mongoose";
import Configuration from "../configuration";

/**
 * Interface defining contract for users data objects
 */
export interface IUser{

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

/**
 * Class which can handle all operations over users
 */
export default class UserModel{
    
    /**
     * Gets user by its username
     * @param username Username which will be checked
     * @returns User with defined username or NULL if there is no such user
     */
    public static getByUsername(username: string): IUser | null
    {
        let reti: IUser | null = null;
        let connection: Promise<typeof mongoose>;
        connection =  mongoose.connect(Configuration.db);
        connection.then(function(conn: typeof mongoose){
            let query :mongoose.Query<object | null, {}, {}, IUser> =  User.findOne({"username": username});
            let result: Promise<object | null> = query.exec();
            result.then(function(data: object | null){
                // reti =  new class implements IUser{
                //     id: number = data.id;
                //     name: string;
                //     surname: string;
                //     username: string;
                //     email: string;
                //     password: string;

                // };
                if (data == null)
                {
                    reti = null;
                }
                else
                {
                    let uname: string;
                }
                console.log(data);
            })
        });
        return reti;
    }
}
