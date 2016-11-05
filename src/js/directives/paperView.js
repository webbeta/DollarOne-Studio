app.directive('paperView', ['figureUtils', 'paperUtils', function(figureUtils, paperUtils) {
    return {
        restrict: 'A',
        link: function(scope, elements, attributes) {
            var figure = scope[attributes.paperView],
                drawer = new paper.PaperScope(),
                canvas = elements[0],
                dots = figure.dots || [],
                dimens = figureUtils.resetMap(dots);

            canvas.width = dimens.width;
            canvas.height = dimens.height;

            drawer.setup(canvas);

            var view = drawer.View._views[0],
                path = new drawer.Path();

            view._project.activate();

            path.strokeColor = 'black';
            path.strokeWidth = 1;

            angular.forEach(dots, function(dot) {
                path.add(new paper.Point(dot.x, dot.y));
            });

            paperUtils.drawStartAndEnd(drawer, dots);

            // var size = new paper.Size(dimens.width, dimens.height);
            //
            // view.setViewSize(size);

            view.draw();
        }
    };
}]);