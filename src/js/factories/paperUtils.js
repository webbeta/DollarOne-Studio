app.factory('paperUtils', [function() {

    function drawStartAndEnd(drawer, dots, startColor, endColor) {
        startColor = startColor || '#00ff00';
        endColor = endColor || '#ff0000';
        var startCircle = new drawer.Path.Circle({
            center: new paper.Point(dots[0].x, dots[0].y),
            radius: 1.5,
            fillColor: startColor,
            strokeColor: startColor,
            strokeWidth: 1
        }),endCircle = new drawer.Path.Circle({
            center: new paper.Point(dots[dots.length-1].x, dots[dots.length-1].y),
            radius: 1.5,
            fillColor: endColor,
            strokeColor: endColor,
            strokeWidth: 1
        });

        return {
            start: startCircle,
            end: endCircle
        };
    }

    function paperMapToDollarOneMap(dots) {
        var $1Array = [];
        angular.forEach(dots, function(dot) {
            $1Array.push(new Point(dot.x, dot.y));
        });
        return $1Array;
    }

    return {
        drawStartAndEnd: drawStartAndEnd
    };
}]);