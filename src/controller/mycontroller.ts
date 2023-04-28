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

import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import Redirect from "../utils/redirect";
import IController from "./icontroller";
import { IUser } from "../model/user";
import ejs from "ejs";
import path from "path";
import fs from 'fs';

/**
 * Class which controls my calendar page
 */
export default class MyController implements IController{
    async takeControl(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, method: "GET" | "POST" | "PUT" | "DELETE", data: any): Promise<string | number | Redirect> {
        let reti: string | number | Redirect = 405;
        let user: IUser | null | undefined = req.session.user;
        let templateData: ejs.Data = new class implements ejs.Data{};
        if (typeof (user) != "undefined" && user != null)
        {
            // User is logged in
            templateData.username = user.name + " " + user.surname + " (" + user.username + ")"

            // Date validation (at the end, if not valid date is entered, today date will be used)
            let today: Date = new Date();
            let date: Date = today;
            if (typeof(req.params.year) != "undefined" && typeof(req.params.month) != "undefined" && typeof(req.params.day) != null)
            {
                let yearStr: string = req.params.year;
                let monthStr: string = req.params.month;
                let dayStr: string = req.params.day;
                if (monthStr.length < 2) monthStr = '0' + monthStr;
                if (dayStr.length < 2) dayStr = '0' + dayStr;
                let day: number = (isNaN(Number(dayStr))) ? today.getDate() : Number(dayStr);
                let month: number = (isNaN(Number(monthStr))) ? today.getMonth() :Number(monthStr) - 1;
                let year: number = (isNaN(Number(yearStr))) ? today.getFullYear(): Number(yearStr);
                date = new Date(year, month, day);
                if (isNaN(Number(date)))
                {
                    date = today;
                }
            }
            const options: Intl.DateTimeFormatOptions = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            let dayBefore   = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
            let dayAfter    = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
            let monthBefore = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
            let monthAfter  = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate()); 
            // const dayBefore: Date = new Date(date.valueOf()); dayBefore.setDate(date.getDate() + 1);
            // const dayAfter: Date = new Date(date.valueOf()); dayBefore.setDate(date.getDate() - 1);
            // const monthBefore: Date = new Date(date.valueOf()); dayBefore.setMonth(date.getMonth() - 1);
            // const monthAfter: Date = new Date(date.valueOf()); dayBefore.setMonth(date.getMonth() + 1);

            templateData.date = date.toLocaleDateString("cs-CZ", options);
            templateData.dayBefore = "/my/" + this.formatDate(dayBefore);
            templateData.dayAfter = "/my/" + this.formatDate(dayAfter);
            templateData.monthBefore = "/my/" + this.formatDate(monthBefore);
            templateData.monthAfter = "/my/" + this.formatDate(monthAfter);
            reti = ejs.render(fs.readFileSync(path.join(process.cwd(), "dist", "view", "my.ejs"), "utf-8"), templateData);
        }
        else
        {
            // User is not logged in
            reti = new Redirect("/login");
            reti.setMessage("ERROR", "Pro pokračování se, prosím, přihlašte.");
        }
        return reti;
    }

    /**
     * Formats date to string usable in links
     * @param date Date which will be formatted into string
     * @returns String containing date in format usable in links
     */
    private formatDate(date: Date): string{
        let dayStr: string = date.getDate().toString();
        if (dayStr.length < 2) dayStr = '0' + dayStr;
        let monthStr: string = (date.getMonth() + 1).toString();
        if (dayStr.length < 2) monthStr + '0' + monthStr;
        let yearStr: string = date.getFullYear().toString();
        while (yearStr.length < 2)
        {
            yearStr = '0' + yearStr;
        }
        return yearStr + "-" + monthStr + "-" + dayStr;
    }

}
