app.directive('fileInput', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element.bind('change', function() {
                if(angular.isFunction(scope[attributes.fileInput]))
                    scope[attributes.fileInput](element[0].files);
                scope.$apply()
            });
        }
    };
}]);