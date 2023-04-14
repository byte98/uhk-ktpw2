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

/**
 * Class which hold information about transition between controllers
 */
export default class Transition
{
    /**
     * Path to which actual request will be transitioned
     */
    private readonly path: string;

    /**
     * Reference to actual request
     */
    private readonly request: Request;

    /**
     * Any additional data which should be transitioned
     */
    private readonly data: any;

    /**
     * New HTTP method of request after transition
     */
    private readonly method: "GET" | "POST" | "PUT" | "DELETE";

    /**
     * Creates new holder of information about request transition
     * @param path Path to which request will be transitioned
     * @param req Reference to actual request
     * @param data Additional data
     * @param method HTTP method of new request
     */
    public constructor(path: string, req: Request, method: "GET" | "POST" | "PUT" | "DELETE",  data: any)
    {
        this.path = path;
        this.request = req;
        this.data = data;
        this.method = method;
    }

    /**
     * Gets path to which request should be transitioned
     * @returns Path to which request should be transitioned
     */
    public getPath(): string
    {
        return this.path;
    }

    /**
     * Gets actually processed reqzest
     * @returns Actually processed request
     */
    public getRequest(): Request
    {
        return this.request;
    }

    /**
     * Gets any additional data
     */
    public getData(): any
    {
        return this.data;
    }

    /**
     * Gets new HTTP method of request after transition
     * @returns HTTP method of request
     */
    public getMethod(): "GET" | "POST" | "PUT" | "DELETE"
    {
        return this.method;
    }
}