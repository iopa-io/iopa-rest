/*
 * Copyright (c) 2016 Internet of Protocols Alliance (IOPA)
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

 const constants = require('iopa').constants,
    IOPA = constants.IOPA;

exports.mergeContext = function mergeContext(target, defaults) {
   
   if (!target) 
        throw new Error("target must not be empty");
     
     if (!defaults) 
        return; // nothing to do   
        
    for (var key in defaults) {
        if (defaults.hasOwnProperty(key) && (key !== IOPA.Headers)) target[key] = defaults[key];
    }
    
    if (defaults.hasOwnProperty(IOPA.Headers))
    {
        var targetHeaders = target[IOPA.Headers] || {};
        var sourceHeaders = defaults[IOPA.Headers];
                
        for (var key in defaults[IOPA.Headers]) {
            if (sourceHeaders.hasOwnProperty(key)) targetHeaders[key] = sourceHeaders[key];
        }
        
        target[IOPA.Headers] = targetHeaders;
   
    } 
};