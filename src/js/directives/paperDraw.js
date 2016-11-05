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

                angular.element(canvas).mousedown(function(event) {
                    if( !drawPath ) drawPath = new drawer.Path();
                    drawPath.add(new paper.Point(event.offsetX, event.offsetY));
                    dollarOneDrawPath.push(new Point(event.offsetX, event.offsetY));
                    drawPath.strokeColor = 'green';
                    drawPath.strokeWidth = 2;
                    scope.recognitionScore = 0;
                    scope.showScore = false;
                    scope.$apply();
                });

                angular.element(canvas).mousemove(function(event) {
                    if( !drawPath || blockDraw ) return;
                    drawPath.add(new paper.Point(event.offsetX, event.offsetY));
                    dollarOneDrawPath.push(new Point(event.offsetX, event.offsetY));
                    scope.showScore = false;
                });

                angular.element(canvas).mouseup(function(event) {
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
                });
            });
        }
    };
}]);