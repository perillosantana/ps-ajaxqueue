'use strict';

const jsdom = require("jsdom");
const window = jsdom.jsdom().defaultView;
const $ = require("jquery")(window);

module.exports = function (opts) {
    if (typeof $.psAjaxQueue === "function")
        return;

    // Aramazenamento da fila
    var psAjaxQueue = {};
    $.psAjaxQueue = psAjaxQueue;

    // Alerta sobre a versão do jQuery
    if (parseInt(($.fn.jquery.replace(/[^0-9]+/g, '') + '000').slice(0, 3), 10) < 150) {
        if (console && typeof console.error == 'function')
            console.error();
    }

    // Plugin
    var defaults = {
        url: "",
        type: 'GET',
        data: "",
        success: function () { },
        error: function () { },
        complete: function () { },
        clearQueueDelay: 5 // Defines the time in milliseconds where the request data will be cached. If "null" is passed the data will never be cleared
    };
    var options = $.extend({}, defaults, opts);

    // Criando ID único da requsição
    var requestData;
    if (typeof options.data === "object")
        requestData = JSON.stringify(options.data);
    else
        requestData = options.data.toString();
    var urlId = encodeURIComponent(options.url + '|' + options.type + '|' + requestData);

    // Adicionando um novo item a fila
    psAjaxQueue[urlId] = psAjaxQueue[urlId] || {};

    // Fazendo a chamada Ajax
    if (typeof psAjaxQueue[urlId].jqXHR == "undefined")
        psAjaxQueue[urlId].jqXHR = $.ajax(options);
    else {
        psAjaxQueue[urlId].jqXHR.done(options.success);
        psAjaxQueue[urlId].jqXHR.fail(options.error);
        psAjaxQueue[urlId].jqXHR.always(options.complete);
    }

    // limpando o cache conforme o tempo passado por parametro
    // Removendo os dados jqXHR
    psAjaxQueue[urlId].jqXHR.always(function () {
        if (!isNaN(parseInt(options.clearQueueDelay))) {
            setTimeout(function () {
                psAjaxQueue[urlId].jqXHR = undefined;
            }, options.clearQueueDelay);
        }
    });

    return psAjaxQueue[urlId].jqXHR;
};