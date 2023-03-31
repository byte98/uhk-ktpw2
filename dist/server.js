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
const express_1 = __importDefault(require("express"));
const configuration_1 = __importDefault(require("./configuration"));
/**
 * Class which represents server which can respond to all requests
 */
class Server {
    /**
     * Creates new instance of server
     * @param port Port on which will server listen on
     * @param routes Routes connecting path to correct controller
     */
    constructor(port, routes) {
        this.port = port;
        this.routes = routes;
        this.app = (0, express_1.default)();
    }
    /**
     * Initializes server
     */
    init() {
        this.app.set("view engine", "ejs");
        this.initRoutes();
    }
    /**
     * Initializes routes
     */
    initRoutes() {
        for (let i = 0; i < this.routes.length; i++) {
            this.app.get(this.routes[i].path, (req, res) => {
                this.handleRequest(req, res, this.routes[i].controller, "GET");
            });
            this.app.post(this.routes[i].path, (req, res) => {
                res.setHeader("Content-Type", "text/html");
                this.handleRequest(req, res, this.routes[i].controller, "POST");
            });
            this.app.put(this.routes[i].path, (req, res) => {
                res.setHeader("Content-Type", "text/html");
                this.handleRequest(req, res, this.routes[i].controller, "PUT");
            });
            this.app.delete(this.routes[i].path, (req, res) => {
                res.setHeader("Content-Type", "text/html");
                this.handleRequest(req, res, this.routes[i].controller, "DELETE");
            });
        }
    }
    /**
     * Handles one single request
     * @param req Information about request
     * @param res Refenrece to responder to request
     * @param ctrl Controller of request
     * @param met HTTP method of request
     */
    handleRequest(req, res, ctrl, met) {
        if (configuration_1.default.debug) {
            console.log("Incoming request (" + req.headers['x-forwarded-for'] || req.socket.remoteAddress + ", " + met);
        }
        let response = ctrl.takeControl(req, met);
        if (typeof response === "string") {
            res.setHeader("Content-Type", "text/html");
            res.send(response);
        }
        else {
            res.sendStatus(response);
        }
    }
    /**
     * Starts server
     */
    start() {
        this.init();
        this.app.listen(this.port, () => {
            if (configuration_1.default.debug) {
                console.info("Server started (port: " + this.port + ")");
            }
        });
    }
}
exports.default = Server;
