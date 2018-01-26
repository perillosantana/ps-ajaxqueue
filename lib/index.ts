import * as _ from "jsdom";

const jsdom = require("jsdom");
const window = jsdom.jsdom().defaultView;
const $ = require("jquery")(window);

export function ajaxQueue(opts: any) {
    if (typeof $.psAjaxQueue === "function")
        return;

    // Queue storage
    let psAjaxQueue: any;
    psAjaxQueue = {};
    $.psAjaxQueue = psAjaxQueue;

    // Alert on jQuery version
    if (parseInt(($.fn.jquery.replace(/[^0-9]+/g, '') + '000').slice(0, 3), 10) < 150) {
        if (console && typeof console.error == 'function')
            console.error();
    }

    // Plugin
    let defaults = {
        url: "",
        type: 'GET',
        data: "",
        success: function () { },
        error: function () { },
        complete: function () { },
        clearQueueDelay: 5 // Defines the time in milliseconds where the request data will be cached. If "null" is passed the data will never be cleared
    };

    let options = $.extend({}, defaults, opts);

    // Creating unique request ID
    let requestData;
    if (typeof options.data === "object")
        requestData = JSON.stringify(options.data);
    else
        requestData = options.data.toString();

    let urlId = encodeURIComponent(options.url + '|' + options.type + '|' + requestData);

    // Adding a new item to the queue
    psAjaxQueue[urlId] = psAjaxQueue[urlId] || {};

    // Making the Ajax call
    if (typeof psAjaxQueue[urlId].jqXHR == "undefined")
        psAjaxQueue[urlId].jqXHR = $.ajax(options);
    else {
        psAjaxQueue[urlId].jqXHR.done(options.success);
        psAjaxQueue[urlId].jqXHR.fail(options.error);
        psAjaxQueue[urlId].jqXHR.always(options.complete);
    }

    // clearing the cache according to the time passed by parameter
    // Removing the jqXHR data
    psAjaxQueue[urlId].jqXHR.always(function () {
        if (!isNaN(parseInt(options.clearQueueDelay))) {
            setTimeout(function () {
                psAjaxQueue[urlId].jqXHR = undefined;
            }, options.clearQueueDelay);
        }
    });

    return psAjaxQueue[urlId].jqXHR;
}