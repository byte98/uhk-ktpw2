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
                templateData.hasData = false;
                templateData.eventName = "Nová událost";
                templateData.backLink = "/my/" + DateUtils.formatDate(date);
                templateData.eventFormDate = DateUtils.formatDate(date);
                templateData.eventFormTime = DateUtils.formatTime(now);
                if (typeof(req.params.id) != "undefined")
                {
                    templateData.hasData = true;
                }
                reti = ejs.render(fs.readFileSync(path.join(process.cwd(), "dist", "view", "event.ejs"), "utf-8"), templateData);
            }
            else if (method == "PUT")
            {
                templateData.eventName = "Nová událost";
                let correct: boolean = false;
                templateData.backLink = "/my";
                let date: Date = new Date();
                templateData.eventFormDate = DateUtils.formatDate(date);
                templateData.eventFormTime = DateUtils.formatTime(date);
                if (typeof (req.body.name) != "undefined")
                {
                    templateData.hasData = true;
                    templateData.eventFormName = req.body.name;
                    templateData.eventFormDescription = "";
                    templateData.eventFormColor = "NONE";
                    templateData.eventFormId = "/my/event/" + DateUtils.formatDate(date);
                    if (typeof(req.body.description) != "undefined")
                    {
                        templateData.eventFormDescription = req.body.description;
                        if (typeof(req.body.color) != "undefined" && (req.body.color == "NONE" || req.body.color == "RED" || req.body.color == "YELLOW" || req.body.color == "GREEN" || req.body.color == "BLUE"))
                        {
                            templateData.eventFormColor = req.body.color;

                            if (typeof(req.body.date) != "undefined")
                            {
                                templateData.eventFormDate = req.body.date;
                                if (typeof(req.body.time) != "undefined")
                                {
                                    templateData.eventFormTime = req.body.time;
                                    correct = true;
                                }
                            }
                        }
                    }
                }
                if (correct)
                {
                    let date: Date = new Date(req.body.date + "T" + req.body.time + ":00");
                    await EventModel.create(req.body.name, req.body.description, req.body.color.toUpperCase(), date, user);
                    reti = new Redirect("/my");
                    reti.setMessage("INFO", "Událost byla úspěšně vytvořena");
                }
                else
                {
                    templateData.error = "Chyba: Některé údaje jsou neplatné.";
                    reti = ejs.render(fs.readFileSync(path.join(process.cwd(), "dist", "view", "event.ejs"), "utf-8"), templateData);
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
