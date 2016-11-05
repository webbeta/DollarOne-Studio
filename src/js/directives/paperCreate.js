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

                function mousedown(event) {
                    event.preventDefault();
                    var point = paperUtils.getMouseOrTouchPoint(event);
                    if( !scope.drawPath ) {
                        scope.drawPath = new drawer.Path();
                        scope.rawPath = [];
                    }
                    if( scope.blockDraw ) return;
                    scope.rawPath.push({ x: point.offsetX, y: point.offsetY });
                    scope.drawPath.add(new paper.Point(point.offsetX, point.offsetY));
                    scope.drawPath.strokeColor = 'green';
                    scope.drawPath.strokeWidth = 2;
                }

                function mousemove(event) {
                    event.preventDefault();
                    if( !scope.drawPath || scope.blockDraw ) return;
                    var point = paperUtils.getMouseOrTouchPoint(event);
                    scope.drawPath.add(new paper.Point(point.offsetX, point.offsetY));
                    scope.rawPath.push({ x: point.offsetX, y: point.offsetY });
                }

                function mouseup(event) {
                    event.preventDefault();
                    scope.blockDraw = true;
                    scope.resetEnabled = true;
                    scope.okEnabled = true;
                    scope.$apply();
                }

                angular.element(canvas).mousedown(mousedown);
                angular.element(canvas).on('touchstart', mousedown);

                angular.element(canvas).mousemove(mousemove);
                angular.element(canvas).on('touchmove', mousemove);

                angular.element(canvas).mouseup(mouseup);
                angular.element(canvas).on('touchend', mouseup);
            });
        }
    };
}]);