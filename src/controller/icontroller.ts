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

/**
 * Interface declaring contract for all controllers
 */
export default interface IController
{
    /**
     * Tells controller to take control of processing request
     * @param req Structure with information about request
     * @param method HTTP method 
     * @returns Content which will be sent to the user or HTTP response code, if request cannot be handled
     */
    takeControl(req: express.Request, method: 'GET' | 'POST' | 'PUT' | 'DELETE'): string | number;
}