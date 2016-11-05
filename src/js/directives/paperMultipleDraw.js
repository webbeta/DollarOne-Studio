app.directive('paperMultipleDraw', ['figureUtils', 'paperUtils', '$timeout', function(figureUtils, paperUtils, $timeout) {
    return {
        restrict: 'A',
        link: function(scope, elements, attributes) {
            var figures = scope[attributes.paperMultipleDraw],
                drawer = new paper.PaperScope(),
                canvas = elements[0],
                recognizer = new DollarRecognizer(),
                structArr = [];

            recognizer.DeleteUserGestures();
            recognizer.Unistrokes.length = 0;

            angular.forEach(figures, function(figure) {
                var slugStr = slug(figure.title, {lower: true});
                structArr[slugStr] = { title: figure.title, dots: figure.dots };
                recognizer.AddGesture(slugStr, figureUtils.mapArrayToDollarOneArray(figure.dots));
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
                    dollarOneDrawPath = [],
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
                    dollarOneDrawPath.push(new Point(point.offsetX, point.offsetY));
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
                    dollarOneDrawPath.push(new Point(point.offsetX, point.offsetY));
                    scope.showScore = false;
                }

                function mouseup(event) {
                    event.preventDefault();
                    blockDraw = true;
                    try {
                        var recognition = recognizer.Recognize(dollarOneDrawPath),
                            recognitionStruct = structArr[recognition.Name],
                            title = recognitionStruct.title,
                            dots = recognitionStruct.dots;

                        scope.showScore = true;
                        scope.recognitionScore = recognition.Score;
                        scope.recognitionTitle = title;

                        figureUtils.resetMapToCenter(dots, holder.width(), 400);
                        angular.forEach(dots, function(dot) {
                            path.add(new paper.Point(dot.x, dot.y));
                        });
                        waterCircles = paperUtils.drawStartAndEnd(drawer, dots, '#c3ff88', '#ffa3a3');
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