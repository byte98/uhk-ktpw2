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

/**
 * Counter of created windows
 */
var __window_counter = 0;

/**
 * Class which can handle all windows
 */
class WindowManager{
    /**
     * Array of all created windows
     */
    _windows = array();

    /**
     * Creates new window
     * @param {string} path Path to content of window
     * @param {string} title Title of window
     * @returns {Window} Newly created window
     */
    createWindow(path, title)
    {

    }
};

/**
 * Class which represents window in application
 */
class Window{

    /**
     * Path to content of window
     */
    _path = "";

    /**
     * Flag, whether close button should be visible
     */
    _close = true;

    /**
     * Flag, whether minimize button should be visible
     */
    _minimize = true;

    /**
     * Flag, whether maximize button should be visible
     */
    _maximize = true;

    /**
     * Title of window
     */
    _title = "";

    /**
     * Identifier of window
     */
    _id = "window_0x00000000";

    /**
     * General block which represents window in DOM
     */
    _div = null;

    /**
     * Flag, whether window is visible (TRUE) or not (FALSE)
     */
    _visible = false;

    /**
     * 
     * @param {string} path Path to content of window
     * @param {string} title Title of window
     * @param {boolean} close Flag, whether close button should be visible
     * @param {boolean} minimize Flag, whether minimze button should be visible
     * @param {boolean} maximize Flag, whether maximize button should be visible
     */
    constructor(path, title, close, minimize, maximize,)
    {
        this._path = path;
        this._title = title;
        this._close = close;
        this._minimize = minimize;
        this._maximize = maximize;
        __window_counter++;
        this._id = "window_0x0" + __window_counter.toString(16);
    }

    /**
     * Generates HTML representation of window
     */
    async _generateHTML()
    {
        return new Promise(async resolve => {
            let reti = document.createElement("div");
            reti.classList.add("app-window");
            reti.classList.add("win7");
            reti.id = this._id;
            reti.style.minWidth = "400px";
            reti.style.width = "600px";
            let windowDiv = document.createElement("div");
            windowDiv.classList.add("window");
            windowDiv.classList.add("active");
            windowDiv.classList.add("glass");
                let titleDiv = document.createElement("div");
                titleDiv.classList.add("title-bar");
                    let titleTextDiv = document.createElement("div");
                    titleTextDiv.classList.add("title-bar-text");
                    titleTextDiv.innerText = this._title;
                    titleDiv.appendChild(titleTextDiv);
                    let titleControlsDiv = document.createElement("div");
                    titleControlsDiv.classList.add("title-bar-controls");
                    if (this._minimize == true)
                    {
                        let minimizeButton = document.createElement("button");
                        minimizeButton.ariaLabel = "Minimize";
                        titleControlsDiv.appendChild(minimizeButton);
                    }
                    if (this._maximize == true || (this._minimize == true && this._maximize == false))
                    {
                        let maximizeButton = document.createElement("button");
                        maximizeButton.ariaLabel = "Maximize";
                        titleControlsDiv.appendChild(maximizeButton);
                        if (this.maximize == false)
                        {
                            maximizeButton.disabled = true;
                        }
                    }
                    if (this._close == true)
                    {
                        let closeButton = document.createElement("button");
                        closeButton.setAttribute("aria-label", "Close");
                        closeButton.classList.add("exit-button");
                        titleControlsDiv.appendChild(closeButton);
                    }
                titleDiv.appendChild(titleControlsDiv);
                windowDiv.appendChild(titleDiv);
                let windowBody = document.createElement("div");
                windowBody.classList.add("window-body");
                //windowBody.classList.add("has-space");
                let req = await fetch(this._path);
                let content = await req.text();
                windowBody.innerHTML = content;
                windowDiv.appendChild(windowBody);
                reti.appendChild(windowDiv);
            resolve(reti);
        });
    }

    /**
     * Shows window
     */
    async show()
    {
        const delta = 40;
        this._div = await this._generateHTML();
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(this._div);
        this._div.style.visibility = "hidden";
        let main = document.getElementsByTagName("main")[0];
        let leftFrom = $(main).position().left + ($(main).width() / 2)- ($(this._div).width() / 2) + (delta / 2);
        let topFrom = $(main).position().top + ($(main).height() / 2) - ($(this._div).height() / 2) + (delta / 2);
        let widthFrom = $(this._div).width() - delta;
        let heightFrom = $(this._div).height() - delta;
        let leftTo = leftFrom - (delta / 2);
        let topTo = topFrom - (delta / 2);
        let widthTo = widthFrom + delta;
        let heightTo = heightFrom + delta;
        $(this._div).css({
            "opacity": 0,
            "width": widthFrom + "px",
            "height": heightFrom + "px",
            "top": topFrom + "px",
            "left": leftFrom + "px",
            "visibility": "visible"
        });
        $(this._div).animate({
            "opacity": 1,
            "width": widthTo,
            "height": heightTo,
            "top": topTo,
            "left": leftTo
        }, 500, "easeInOutQuart");
        $(this._div).draggable({
            "handle": $(this._div).find(".title-bar"),
            "containment": $(main)
        });
        $(this._div).resizable({
            "containment": $(main)
        });
        let ref = this._div;
        $(this._div).find("button.exit-button").on("click", function(){
            $(ref).animate({
                "opacity": 0,
                "width": "-=" + delta.toString(),
                "height": "-=" + delta.toString(),
                "left": "+=" + (delta / 2).toString(),
                "top": "+=" + (delta / 2).toString()
            }, 500, "easeInOutQuart", function(){
                $(ref).remove();
            });
        });
    }
}
