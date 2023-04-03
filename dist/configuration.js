"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homepagecontroller_1 = __importDefault(require("./controller/homepagecontroller"));
const registercontroller_1 = __importDefault(require("./controller/registercontroller"));
/**
 * Class which holds whole configuration of server
 */
class Configuration {
}
/**
 * Flag, wherher debugging messages should be emitted (TRUE) or not (FALSE)
 */
Configuration.debug = false;
/**
 * Definition of correct controller for each path
 */
Configuration.routes = [
    { path: "/", controller: new homepagecontroller_1.default() },
    { path: "/register", controller: new registercontroller_1.default() }
];
/**
 * Port on which will server run
 */
Configuration.port = 8088;
exports.default = Configuration;
