app.factory('figureUtils', [function() {

    function resetMap(dots) {
        var xArr = [],
            yArr = [];

        angular.forEach(dots, function(dot) {
            xArr.push(dot.x);
            yArr.push(dot.y);
        });

        var xMin = Math.min.apply(null, xArr) - 2,
            xMax = ( Math.max.apply(null, xArr) + 2 ) - xMin,
            yMin = Math.min.apply(null, yArr) - 2,
            yMax = ( Math.max.apply(null, yArr) + 2 ) - yMin;

        angular.forEach(dots, function(dot) {
            dot.x -= xMin;
            dot.y -= yMin;
        });

        return {
            width: xMax,
            height: yMax
        };
    }

    function resetMapToCenter(dots, width, height) {
        var baseDim = resetMap(dots),
            centerX = ( width / 2 ) - ( baseDim.width / 2 ),
            centerY = ( height / 2 ) - ( baseDim.height / 2 );

        angular.forEach(dots, function(dot) {
            dot.x += centerX;
            dot.y += centerY;
        });

        return {
            width: width,
            height: height
        };
    }

    function mapArrayToDollarOneArray(dots) {
        var $1Array = [];
        angular.forEach(dots, function(dot) {
            $1Array.push(new Point(dot.x, dot.y));
        });
        return $1Array;
    }

    return {
        resetMap: resetMap,
        resetMapToCenter: resetMapToCenter,
        mapArrayToDollarOneArray: mapArrayToDollarOneArray
    };
}]);