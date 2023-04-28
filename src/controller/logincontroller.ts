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
import IController from "./icontroller";
import Redirect from "../utils/redirect";
import ejs from "ejs";
import path from "path";
import fs from 'fs';

/**
 * Class which represents controller of login page
 */
export default class LoginController implements IController
{
    async takeControl(req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, method: "GET" | "POST" | "PUT" | "DELETE", data: any): Promise<string | number | Redirect> {
        let reti: string | number | Redirect = 405;
        if (method == "GET")
        {
            let templateData: ejs.Data = new class implements ejs.Data{};
            let info: string[] = req.flash("info");
            if (info.length > 0)
            {
                templateData["info"] = info[0];
            }
            reti = ejs.render(fs.readFileSync(path.join(process.cwd(), "dist", "view", "login.ejs"), "utf-8"), templateData);
        }
        return reti;
    }

}