var app = angular.module('app', [
    'ui.bootstrap',
    'ngNotify'
])
.config([function() {
    //window.engine = 'original';
    window.engine = 'shape-detector'
}]);