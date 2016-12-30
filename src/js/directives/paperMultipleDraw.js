app.directive('paperMultipleDraw', ['figureUtils', 'paperUtils', '$timeout', 'recognizerEngine', function(figureUtils, paperUtils, $timeout, recognizerEngine) {
    return {
        restrict: 'A',
        link: function(scope, elements, attributes) {
            var figures = scope[attributes.paperMultipleDraw],
                drawer = new paper.PaperScope(),
                canvas = elements[0],
                structArr = [];

            recognizerEngine.loadShapes(figures);

            angular.forEach(figures, function(figure) {
                var slugStr = slug(figure.title, {lower: true});
                structArr[slugStr] = { title: figure.title, dots: figure.dots };
            });

            angular.element(document).ready(function() {
                var holder = angular.element(canvas).parent();
                canvas.width = holder.width();
                canvas.height = '400';

                drawer.setup(canvas);

                var view = drawer.View._views[0],
                    path = new drawer.Path(),
                    waterCircles = null;

                view._project.activate();

                path.strokeColor = '#c4c4c4';
                path.strokeWidth = 1;

                var drawPath = null,
                    rawDrawPath = [],
                    blockDraw = false;

                view.draw();

                function removeWatermark() {
                    path.remove();
                    path = new drawer.Path();
                    path.strokeColor = '#c4c4c4';
                    path.strokeWidth = 1;
                    if( waterCircles !== null ) {
                        waterCircles.start.remove();
                        waterCircles.end.remove();
                        waterCircles = null;
                    }
                }

                function mousedown(event) {
                    event.preventDefault();
                    var point = paperUtils.getMouseOrTouchPoint(event);
                    if( !drawPath ) drawPath = new drawer.Path();
                    drawPath.add(new paper.Point(point.offsetX, point.offsetY));
                    rawDrawPath.push({ x: point.offsetX, y: point.offsetY });
                    drawPath.strokeColor = 'green';
                    drawPath.strokeWidth = 2;
                    scope.recognitionScore = 0;
                    $timeout(function() {
                        removeWatermark();
                        scope.showScore = false;
                        scope.$apply();
                    }, 200);
                }

                function mousemove(event) {
                    event.preventDefault();
                    if( !drawPath || blockDraw ) return;
                    var point = paperUtils.getMouseOrTouchPoint(event);
                    drawPath.add(new paper.Point(point.offsetX, point.offsetY));
                    rawDrawPath.push({ x: point.offsetX, y: point.offsetY });
                    scope.showScore = false;
                }

                function mouseup(event) {
                    event.preventDefault();
                    blockDraw = true;
                    try {
                        var recognition = recognizerEngine.recognize(rawDrawPath),
                            recognitionStruct = structArr[recognition.pattern],
                            title = recognitionStruct.title,
                            dots = recognitionStruct.dots;

                        scope.showScore = true;
                        scope.recognitionScore = recognition.score;
                        scope.recognitionTitle = title;

                        figureUtils.resetMapToCenter(dots, holder.width(), 400);
                        angular.forEach(dots, function(dot) {
                            path.add(new paper.Point(dot.x, dot.y));
                        });
                        waterCircles = paperUtils.drawStartAndEnd(drawer, dots, '#c3ff88', '#ffa3a3');
                    }catch(ex) {}
                    rawDrawPath = [];
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