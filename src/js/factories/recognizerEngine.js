app.factory('recognizerEngine', ['figureUtils', function(figureUtils) {
    var originalEngine = window.engine === 'original',
        shapeDetectorEngine = window.engine === 'shape-detector',
        recognizer = null;

    if( originalEngine ) {
        recognizer = new DollarRecognizer();
        recognizer.DeleteUserGestures();
        recognizer.Unistrokes.length = 0;
    }else if( shapeDetectorEngine ) {
        recognizer = new ShapeDetector([]);
    }

    function loadShapes(figures) {
        angular.forEach(figures, function(figure) {
            var slugStr = slug(figure.title, {lower: true});
            if( originalEngine )
                recognizer.AddGesture(slugStr, figureUtils.mapArrayToDollarOneArray(figure.dots));
            else
                recognizer.learn(slugStr, figure.dots);
        });
    }

    function recognize(dots) {
        var recognition = null;

        if (originalEngine) {
            recognition = recognizer.Recognize(figureUtils.mapArrayToDollarOneArray(dots));

            return {
                pattern: recognition.Name,
                score: recognition.Score
            };
        }else if( shapeDetectorEngine ) {
            return recognizer.spot(dots);
        }
    }

    return {
        loadShapes: loadShapes,
        recognize: recognize
    };
}]);