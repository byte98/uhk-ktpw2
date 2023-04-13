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

import express from 'express';
import session from 'express-session';
import machineId, { machineIdSync } from 'node-machine-id';
import body_parser from 'body-parser';
import http from 'http';
import path from 'path';
import IController from './controller/icontroller';
import Configuration from './configuration';

/**
 * Class which represents server which can respond to all requests
 */
export default class Server
{
    /**
     * Port on which server listens
     */
    private readonly port: number;

    /**
     * Reference to instance of express web server
     */
    private readonly app: express.Application;

    /**
     * Routes of possible paths to correct controller
     */
    private readonly routes: Array<{path: string, controller: IController}>;

    /**
     * Creates new instance of server
     * @param port Port on which will server listen on
     * @param routes Routes connecting path to correct controller
     */
    public constructor(port: number, routes: Array<{path: string, controller: IController}>)
    {
        this.port = port;
        this.routes = routes;
        this.app = express();
    }

    /**
     * Initializes server
     */
    private init(): void
    {
        this.app.set("view engine", "ejs");
        this.app.use(express.static(path.join(process.cwd() , "dist", "public")));
        this.app.use(body_parser.urlencoded({extended: true}));
        this.app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: machineIdSync()
        }));
        this.initRoutes();
    }

    /**
     * Initializes routes
     */
    private initRoutes(): void
    {
        for (let i: number = 0; i < this.routes.length; i++)
        {
            this.app.get(this.routes[i].path, (req: express.Request, res: express.Response) => {
                this.handleRequest(req, res, this.routes[i].controller, "GET");
            });
            this.app.post(this.routes[i].path, (req: express.Request, res: express.Response) => {
                res.setHeader("Content-Type", "text/html");
                this.handleRequest(req, res, this.routes[i].controller, "POST");
            });
            this.app.put(this.routes[i].path, (req: express.Request, res: express.Response) => {
                res.setHeader("Content-Type", "text/html");
                this.handleRequest(req, res, this.routes[i].controller, "PUT");
            });
            this.app.delete(this.routes[i].path, (req: express.Request, res: express.Response) => {
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
    private handleRequest(req: express.Request, res: express.Response, ctrl: IController, met: "GET" | "POST" | "PUT" | "DELETE")
    {
        ctrl.takeControl(req, met).then(function(result: string | number){
            let addr: string | undefined = req.header("x-forwarded.for");
            if (typeof addr === "undefined")
            {
                addr = req.socket.remoteAddress;
            }
            let debugMsg: string = "REQUEST (" + addr + ", " + met + ") -> ";
            if (typeof result === "string")
            {
                debugMsg += 200 + ": " + http.STATUS_CODES[200];
                if (Configuration.debug)
                {
                    console.log(debugMsg);
                }
                res.setHeader("Content-Type", "text/html");
                res.send(result);
            }
            else
            {
                debugMsg += result + ": " + http.STATUS_CODES[result];
                if (Configuration.debug)
                {
                    console.log(debugMsg);
                }
                res.sendStatus(result);
            }
        });
    }

    /**
     * Starts server
     */
    public start(): void
    {
        this.init();
        this.app.listen(this.port, () => {
            if (Configuration.debug)
            {
                console.info("Server started (port: " + this.port +")");
            }
        });
    }
}
