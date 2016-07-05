/*
 * Internet Open Protocol Abstraction (IOPA)
 * Copyright (c) 2016 Internet of Protocols Alliance 
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const
    iopa = require('iopa'),
    URL = require('url'),
    contextExtensionsRESTAddTo = require('./context').addTo,
    constants = require('./constants'),
    IOPA = constants.IOPA,
    SERVER = constants.SERVER,
    VERSION = constants.VERSION,
    SCHEMES = IOPA.SCHEMES,
    PROTOCOLS = IOPA.PROTOCOLS,
    PORTS = IOPA.PORTS,
    mergeContext = iopa.util.shallow.mergeContext,
    Factory = iopa.Factory,
    IopaContext = iopa.Factory.Context;

// Add Rest Extensions to Iopa Context Prototype
contextExtensionsRESTAddTo(IopaContext.prototype);

Factory.prototype.createContextCore = Factory.prototype.createContext;

const _next_createContext = Factory.prototype.createContext;

//OVERRIDES PUBLIC METHODS 

/**
 * Creates a new IOPA Context 
 *
 * @method createContext
 *
 * @param url string representation of scheme://host/hello?querypath
 * @param options object 
 * @returns context
 * @public
 */
Factory.prototype.createContext = function factory_rest_createContext(url, options) {

    options = this.validOptions(options);
    var context;
    context = _next_createContext.call(this, url, null);

    context[IOPA.Headers] = {};
    context[IOPA.Protocol] = "";

    context[SERVER.OriginalUrl] = url;
    context[IOPA.Method] = options[IOPA.Method] || context[IOPA.Method];

    switch (context[IOPA.Scheme]) {
        case SCHEMES.HTTP:
            context[IOPA.Protocol] = PROTOCOLS.HTTP;
            context[SERVER.TLS] = false;
            context[IOPA.Headers]["Host"] = context[IOPA.Host];
            context[IOPA.Port] = parseInt(context[IOPA.Port]) || PORTS.HTTP;
            break;
        case SCHEMES.HTTPS:
            context[IOPA.Protocol] = PROTOCOLS.HTTP;
            context[SERVER.TLS] = true;
            context[IOPA.Headers]["Host"] = context[IOPA.Host];
            context[IOPA.Port] = parseInt(context[IOPA.Port]) || PORTS.HTTPS;
            break;
        case SCHEMES.COAP:
            context[IOPA.Protocol] = PROTOCOLS.COAP;
            context[SERVER.TLS] = false;
            context[IOPA.Port] = parseInt(context[IOPA.Port]) || PORTS.COAP;
            break;
        case SCHEMES.COAPS:
            context[IOPA.Protocol] = PROTOCOLS.COAP;
            context[SERVER.TLS] = true;
            context[IOPA.Port] = parseInt(context[IOPA.Port]) || PORTS.COAPS;
            break;
        case SCHEMES.MQTT:
            context[IOPA.Protocol] = PROTOCOLS.MQTT;
            context[SERVER.TLS] = false;
            context[IOPA.Port] = parseInt(context[IOPA.Port]) || PORTS.MQTT;
            break;
        case SCHEMES.MQTTS:
            context[IOPA.Protocol] = PROTOCOLS.MQTT;
            context[SERVER.TLS] = true;
            context[IOPA.Port] = parseInt(context[IOPA.Port]) || PORTS.MQTTS;
            break;
        default:
            context[IOPA.Protocol] = null;
            context[SERVER.TLS] = false;
            context[IOPA.Port] = parseInt(context[IOPA.Port]) || 0;
            break;
    };

    context[SERVER.RemoteAddress] = context[IOPA.Host]
    context[SERVER.RemotePort] = context[IOPA.Port]

    mergeContext(context, options);

    context.create = this.rest_createContextChild.bind(this, context, context.create);

    context.addResponse = this.addResponse.bind(this, context);

    if (context.response)
        context.addResponse();

    return context;
};

/**
 * Creates a new IOPA Context that is a child request/response of a parent Context
 *
 * @method rest_createContextChild
 *
 * @param parentContext IOPA Context for parent
 * @param url string representation of /hello to add to parent url
 * @param options object 
 * @returns context
 * @public
 */
Factory.prototype.rest_createContextChild = function factory_rest_createContextChild(parentContext, next, url, options) {

    options = this.validOptions(options);

    var context = next(url, null);

    context[SERVER.SessionId] = parentContext[SERVER.SessionId];
    context[SERVER.TLS] = parentContext[SERVER.TLS];

    context[IOPA.Protocol] = parentContext[IOPA.Protocol];

    context[SERVER.RemoteAddress] = parentContext[SERVER.RemoteAddress];
    context[SERVER.RemotePort] = parentContext[SERVER.RemotePort];
    context[SERVER.LocalAddress] = parentContext[SERVER.LocalAddress];
    context[SERVER.LocalPort] = parentContext[SERVER.LocalPort];
    context[SERVER.RawStream] = parentContext[SERVER.RawStream];

    mergeContext(context, options);

    return context;
};

/**
 * Add a new IOPA Context that is a response of a request Context
 *
 * @method addResponse
 *
 * @param context IOPA Context for parent request
 * @returns response
 * @public
 */
Factory.prototype.addResponse = function factory_rest_addResponse(context, options) {
    var response = this.createContext(null, options);
    context.response = response;
    context.response[SERVER.ParentContext] = context;
    this.mergeCapabilities(response, context);

    response[IOPA.StatusCode] = null;
    response[IOPA.ReasonPhrase] = "";
    response[IOPA.Protocol] = context[IOPA.Protocol];
    response[IOPA.Body] = null;
    response[SERVER.IsRequest] = false;
    response[IOPA.Headers] = {};

    response[SERVER.TLS] = context[SERVER.TLS];
    response[SERVER.RemoteAddress] = context[SERVER.RemoteAddress]
    response[SERVER.RemotePort] = context[SERVER.RemotePort]
    response[SERVER.RawStream] = context[SERVER.RawStream];


    return response;
};



exports = Factory;