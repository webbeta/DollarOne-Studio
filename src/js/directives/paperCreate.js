app.directive('paperCreate', ['figureUtils', 'paperUtils', '$timeout', function(figureUtils, paperUtils, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, elements, attributes) {
            var drawer = new paper.PaperScope(),
                canvas = elements[0];

            angular.element(document).ready(function() {
                var holder = angular.element(canvas).parent();
                canvas.width = holder.width();
                canvas.height = '400';

                drawer.setup(canvas);

                var view = drawer.View._views[0],
                    path = new drawer.Path();

                view._project.activate();

                path.strokeColor = '#c4c4c4';
                path.strokeWidth = 1;

                scope.rawPath = null;
                scope.drawPath = null;
                scope.blockDraw = false;

                view.draw();

                angular.element(canvas).mousedown(function(event) {
                    if( !scope.drawPath ) {
                        scope.drawPath = new drawer.Path();
                        scope.rawPath = [];
                    }
                    if( scope.blockDraw ) return;
                    scope.rawPath.push({ x: event.offsetX, y: event.offsetY });
                    scope.drawPath.add(new paper.Point(event.offsetX, event.offsetY));
                    scope.drawPath.strokeColor = 'green';
                    scope.drawPath.strokeWidth = 2;
                });

                angular.element(canvas).mousemove(function(event) {
                    if( !scope.drawPath || scope.blockDraw ) return;
                    scope.drawPath.add(new paper.Point(event.offsetX, event.offsetY));
                    scope.rawPath.push({ x: event.offsetX, y: event.offsetY });
                });

                angular.element(canvas).mouseup(function(event) {
                    scope.blockDraw = true;
                    scope.resetEnabled = true;
                    scope.okEnabled = true;
                    scope.$apply();
                });
            });
        }
    };
}]);