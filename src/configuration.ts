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

import HomePageController from "./controller/homepagecontroller";
import IController from "./controller/icontroller";

/**
 * Class which holds whole configuration of server
 */
export default class Configuration
{
    /**
     * Flag, wherher debugging messages should be emitted (TRUE) or not (FALSE)
     */
    public static readonly debug: boolean = true;

    /**
     * Definition of correct controller for each path
     */
    public static readonly routes: Array<{path: string, controller: IController}> =  [
        {path: "/", controller: new HomePageController()}
    ];

    /**
     * Port on which will server run
     */
    public static readonly port: number = 8080;

}