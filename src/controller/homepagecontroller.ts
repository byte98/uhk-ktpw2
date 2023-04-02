// Copyright (C) 2023 Jiri Skoda <skodaji1@uhk.cz>
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
import IController from "./icontroller";
import ejs from "ejs";
import path from "path";
import fs from 'fs';

/**
 * Class which can handle behaviour of home page
 */
export default class HomePageController implements IController
{
    takeControl(req: Request, method: "GET" | "POST" | "PUT" | "DELETE"): string | number
    {
        let reti: string | number = 405;
        if (method === "GET")
        {
            reti = ejs.render(fs.readFileSync(path.join(process.cwd(), "dist", "view", "homepage.ejs"), "utf-8"));
        }
        return reti;
    }

}
