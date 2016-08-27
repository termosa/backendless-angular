(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define("backendless-angular", ["angular", "angular-mock-backend"], factory);
  } else if (typeof exports === "object") {
    module.exports = factory(require("angular"), require("angular-mock-backend"));
  } else {
    factory(root.angular);
  }
}(this, function (angular) {
  "use strict";

  var mocks = [];
  var delayIndex = 1;
  var responseIndex = 2;

  var moduleId = "mockBackend";
  angular.module(moduleId, [ "vinkaga.mockBackend" ])
    .constant("vinkaga.mockBackend.mock", mocks)
    .provider("mockBackend", function() {
      function when(method, url, data, headers, keys) {
        var mock;

        if (typeof method === "object") {
          mock = [ method.request, method.delay, method.response ];
        } else {
          mock = [[ method, url, data, headers, keys ], null, null ];
        }

        var chain = {
          respond: function(status, data, headers, statusText) {
            mock[responseIndex] = {
              status: status,
              data: data,
              headers: headers,
              statusText: statusText
            };
            return chain;
          },
          delay: function(time) {
            mock[delayIndex] = time;
            return chain;
          }
        };

        mocks.push(mock);
        return chain;
      }

      when.when = when;

      return {
        when: when,
        $get: function() {
          return null;
        }
      };
    });

  return moduleId;
}));
