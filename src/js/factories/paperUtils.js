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

    function getMouseOrTouchPoint(event) {
        var isTouch = event.type === 'touchstart' || event.type === 'touchmove' || event.type === 'touchend';
        if( isTouch ) {
            var touch = event.touches[0],
                targetOffset = angular.element(touch.target).offset();
            return {
                offsetX: touch.pageX - targetOffset.left,
                offsetY: touch.pageY - targetOffset.top
            };
        }else
            return event;
    }

    return {
        drawStartAndEnd: drawStartAndEnd,
        getMouseOrTouchPoint: getMouseOrTouchPoint
    };
}]);