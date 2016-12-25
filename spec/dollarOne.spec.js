describe("unitary user input checkings", function() {

    it("user input contains expected elements", function() {
        expect(USER_INPUT.length).toBe(74);
    });

});

describe("functional user input checkings", function() {

    beforeEach(module('app'));

    var recognizer = null,
        _figureUtils = null,
        mapDollarOneArrayToRawArray = function(dots) {
            var arr = [];
            angular.forEach(dots, function(dot) {
                arr.push({ x: dot.X, y: dot.Y });
            });
            return arr;
        };

    beforeEach(inject(['figureUtils', function(figureUtils) {
        recognizer = new DollarRecognizer();

        recognizer.DeleteUserGestures();
        recognizer.Unistrokes.length = 0;

        for(var ix = 0; ix < REFERENCE_PROJECT.figures.length; ix++) {
            var figure = REFERENCE_PROJECT.figures[ix];
            recognizer.AddGesture(slug(figure.title, {lower: true}), figureUtils.mapArrayToDollarOneArray(figure.dots));
        }

        _figureUtils = figureUtils;
    }]));

    it("user does input and get expected results", function() {
        var recognition = recognizer.Recognize(_figureUtils.mapArrayToDollarOneArray(USER_INPUT));
        expect(recognition.Name).toBe('trerror0');
        expect(recognition.Score).toBe(0.9625545136009803);
    });

});