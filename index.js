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

var iopa = require('iopa'),
     constants = iopa.constants;

 const RestFactory = require('./src/iopa-rest/factory').default,
       RestConstants = require('./src/iopa-rest/constants'),
       DeviceConstants = require('./src/iopa-devices/constants')
   
iopa.constants = iopa.util.shallow.assign(
    iopa.constants, 
    RestConstants,
    DeviceConstants
    );

exports.App = iopa.App;
exports.Factory = iopa.Factory;
exports.constants = iopa.constants;
exports.util = iopa.util;
