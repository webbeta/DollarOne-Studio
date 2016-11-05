app.directive('paperDraw', ['figureUtils', 'paperUtils', '$timeout', function(figureUtils, paperUtils, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, elements, attributes) {
            var figure = scope[attributes.paperDraw],
                drawer = new paper.PaperScope(),
                canvas = elements[0],
                dots = figure.dots || [],
                recognizer = new DollarRecognizer();

            recognizer.DeleteUserGestures();
            recognizer.Unistrokes.length = 0;
            recognizer.AddGesture(slug(figure.title, {lower: true}), figureUtils.mapArrayToDollarOneArray(dots));

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

                var drawPath = null,
                    dollarOneDrawPath = [],
                    blockDraw = false,
                    dimens = figureUtils.resetMapToCenter(dots, holder.width(), 400);

                angular.forEach(dots, function(dot) {
                    path.add(new paper.Point(dot.x, dot.y));
                });

                paperUtils.drawStartAndEnd(drawer, dots, '#c3ff88', '#ffa3a3');

                view.draw();

                function mousedown(event) {
                    event.preventDefault();
                    var point = paperUtils.getMouseOrTouchPoint(event);
                    if( !drawPath ) drawPath = new drawer.Path();
                    drawPath.add(new paper.Point(point.offsetX, point.offsetY));
                    dollarOneDrawPath.push(new Point(point.offsetX, point.offsetY));
                    drawPath.strokeColor = 'green';
                    drawPath.strokeWidth = 2;
                    scope.recognitionScore = 0;
                    scope.showScore = false;
                    scope.$apply();
                }

                function mousemove(event) {
                    event.preventDefault();
                    if( !drawPath || blockDraw ) return;
                    var point = paperUtils.getMouseOrTouchPoint(event);
                    drawPath.add(new paper.Point(point.offsetX, point.offsetY));
                    dollarOneDrawPath.push(new Point(point.offsetX, point.offsetY));
                    scope.showScore = false;
                }

                function mouseup(event) {
                    event.preventDefault();
                    blockDraw = true;
                    try {
                        var recognition = recognizer.Recognize(dollarOneDrawPath);
                        scope.showScore = true;
                        scope.recognitionScore = recognition.Score;
                    }catch(ex) {}
                    dollarOneDrawPath = [];
                    $timeout(function() {
                        drawPath.remove();
                        drawPath = null;
                        blockDraw = false;
                    }, 500);
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