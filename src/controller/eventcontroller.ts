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
import DateUtils from "../utils/dateutils";
import EventModel from "../model/event";

/**
 * Controller of event page
 */
export default class EventController implements IController
{
    async takeControl(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, method: "GET" | "POST" | "PUT" | "DELETE", data: any): Promise<string | number | Redirect> {
        let reti: string | number | Redirect = 405;
        let user: IUser | null | undefined = req.session.user;
        let templateData: ejs.Data = new class implements ejs.Data{};
        if (typeof(user) != "undefined" && user != null)
        {

            templateData.username = user.name + " " + user.surname + " (" + user.username + ")"
            if (method == "GET")
            {
                let date = DateUtils.getValid(req.params.year, req.params.month, req.params.day);
                let now = new Date();
                date.setHours(now.getHours());
                date.setMinutes(now.getMinutes());
                date.setSeconds(now.getSeconds());
                let end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, date.getMinutes() + date.getSeconds());
                templateData.hasData = false;
                templateData.eventName = "Nová událost";
                templateData.backLink = "/my/" + DateUtils.formatDate(date);
                templateData.eventFormDateStart = DateUtils.formatDate(date);
                templateData.eventFormTimeStart = ((date.getHours() < 10)? "0": "") + date.getHours().toString() + ":" + ((date.getMinutes() < 10)? "0" : "") + date.getMinutes().toString();
                templateData.eventFormDateEnd = DateUtils.formatDate(end);
                templateData.eventFormTimeEnd = ((end.getHours() < 10)? "0": "") + end.getHours().toString() + ":" + ((end.getMinutes() < 10)? "0" : "") + end.getMinutes().toString();
                if (typeof(req.params.id) != "undefined")
                {
                    templateData.hasData = true;
                }
                reti = ejs.render(fs.readFileSync(path.join(process.cwd(), "dist", "view", "event.ejs"), "utf-8"), templateData);
            }
            else if (method == "PUT")
            {
                let correct: boolean = false;
                templateData.backLink = "/my";
                let date: Date = new Date();
                let end : Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1, date.getMinutes(), date.getSeconds());
                templateData.eventFormDateStart = DateUtils.formatDate(date);
                templateData.eventFormTimeStart = ((date.getHours() < 10)? "0": "") + date.getHours().toString() + ":" + ((date.getMinutes() < 10)? "0" : "") + date.getMinutes().toString();
                templateData.eventFormDateEnd = DateUtils.formatDate(end);
                templateData.eventFormTimeEnd = ((end.getHours() < 10)? "0": "") + end.getHours().toString() + ":" + ((end.getMinutes() < 10)? "0" : "") + end.getMinutes().toString();
                if (typeof (req.body.name) != "undefined")
                {
                    templateData.hasData = true;
                    templateData.eventFormName = req.body.name;
                    templateData.eventFormDescription = "";
                    templateData.eventFormColor = "none";
                    if (typeof(req.body.description) != "undefined")
                    {
                        templateData.eventFormDescription = req.body.description;
                        if (typeof(req.body.color) != "undefined" && (req.body.color == "none" || req.body.color == "red" || req.body.color != "yellow" || req.body.color != "green" || req.body.color != "blue"))
                        {
                            templateData.eventFormColor = req.body.color;
                            if (typeof(req.body.startDate) != "undefined")
                            {
                                templateData.eventFormDateStart = req.body.startDate;
                                if (typeof(req.body.startTime) != "undefined")
                                {
                                    templateData.eventFormTimeStart = req.body.startTime;
                                    if (typeof(req.body.endDate) != "undefined")
                                    {
                                        templateData.eventFormDateEnd = req.body.endDate;
                                        if (typeof(req.body.endTime) != "undefined")
                                        {
                                            templateData.eventFormTimeEnd = req.body.endTime;
                                            correct = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (correct)
                {
                    let start: Date = new Date(req.body.startDate + "T" + req.body.startTime + ":00");
                    let end: Date = new Date(req.body.endDate + "T" + req.body.endTime + ":00");
                    await EventModel.create(req.body.name, req.body.description, req.body.color.toUpperCase(), start, end, user);
                    reti = new Redirect("/my");
                    reti.setMessage("INFO", "Událost byla úspěšně vytvořena");
                }
                else
                {
                    templateData.error = "Chyba: Některé údaje jsou neplatné.";
                }
            }
        }
        else
        {
            
            // User is not logged in
            reti = new Redirect("/login");
            reti.setMessage("ERROR", "Pro pokračování se, prosím, přihlašte.");
        }
        return reti;
    }

}
