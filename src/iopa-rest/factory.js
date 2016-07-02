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
    VERSION = constants.VERSION
    mergeContext = require('../util/shallow').mergeContext,
    Factory = iopa.Factory,
    IopaContext = iopa.Factory.Context;

// Add Rest Extensions to Iopa Context Prototype
contextExtensionsRESTAddTo(IopaContext.prototype);

/**
* Create a new IOPA Context, with default [iopa.*] values populated
*/
Factory.prototype.createContextCore = Factory.prototype.createContext;


var _coreCreateContext = Factory.prototype.createContext;

Factory.prototype.createContext = function factory_createRestContext(url) {
    var context = _coreCreateContext.call(this, url);
    var response = this._create();
    context.response = response;
    context.response[SERVER.ParentContext] = context;

    context[IOPA.Headers] = {};
    context[IOPA.Protocol] = "";

    response[IOPA.Headers] = {};
    response[IOPA.StatusCode] = null;
    response[IOPA.ReasonPhrase] = "";
    response[IOPA.Protocol] = "";
    response[IOPA.Body] = null;
    response[IOPA.Headers]["Content-Length"] = null;

   const SCHEMES = IOPA.SCHEMES,
        PROTOCOLS = IOPA.PROTOCOLS,
        PORTS = IOPA.PORTS

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
            context[IOPA.Port] =parseInt(context[IOPA.Port]) || 0;
            break;
       };

   context[SERVER.RemoteAddress] =  context[IOPA.Host] 
   context[SERVER.RemotePort] =  context[IOPA.Port] 
  
    return context;
};

/**
* Create a new IOPA Context, with default [iopa.*] values populated
*/
Factory.prototype.createRequest = function createRequest(urlStr, options) {

    if (typeof options === 'string' || options instanceof String)
        options = { "iopa.Method": options };

    options = options || {};

    var context = _coreCreateContext.call(this, urlStr);
    context[SERVER.IsLocalOrigin] = true;
    context[SERVER.IsRequest] = true;
    context[SERVER.OriginalUrl] = urlStr;
    context[IOPA.Method] = options[IOPA.Method] || IOPA.METHODS.GET;

    context[SERVER.RemoteAddress] =  context[IOPA.Host] 
    context[IOPA.Headers] = {};

    const SCHEMES = IOPA.SCHEMES,
        PROTOCOLS = IOPA.PROTOCOLS,
        PORTS = IOPA.PORTS

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
            context[IOPA.Port] =parseInt(context[IOPA.Port]) || 0;
            break;
       };

    context[SERVER.RemotePort] =  context[IOPA.Port] 
  
    mergeContext(context, options);

    return context;
};

/**
* Create a new IOPA Context, with default [iopa.*] values populated
*/
Factory.prototype.createRequestResponse = function createRequestResponse(urlStr, options) {
    var context = this.createRequest.call(this, urlStr, options);

    var response = this._create();
    context.response = response;
    context.response[SERVER.ParentContext] = context;

    response[IOPA.Headers] = {};
    response[IOPA.StatusCode] = null;
    response[IOPA.ReasonPhrase] = "";
    response[IOPA.Protocol] = context[IOPA.Protocol];
    response[IOPA.Body] = null;
    response[SERVER.TLS] = context[SERVER.TLS];
     response[SERVER.IsLocalOrigin] = false;
    response[SERVER.IsRequest] = false;
    response[SERVER.Logger] = context[SERVER.Logger];
   response[SERVER.RemoteAddress] =  context[SERVER.RemoteAddress] 
   response[SERVER.RemotePort] =  context[SERVER.RemotePort] 
  
    return context;
}

exports = Factory;