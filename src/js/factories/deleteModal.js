app.factory('deleteModal', ['$uibModal', function ($uibModal) {
    var modalInstance = null;

    function show(options, callback, failure) {
        callback = callback || angular.noop;
        failure = failure || angular.noop;

        modalInstance = $uibModal.open({
            templateUrl: 'confirmation.html',
            controller: ['$scope', '$uibModalInstance', 'ngNotify',
                function ($scope, $uibModalInstance, ngNotify) {
                    $scope.title = !!options.title ? options.title : '¡Atención!';
                    $scope.description = !!options.description ? options.description : '¿Realmente desea eliminar este dato?';

                    $scope.cancel = function() {
                        failure();
                        $uibModalInstance.close();
                    };
                    $scope.ok = function() {
                        callback();
                        ngNotify.set('El registro ha sido eliminado.');
                        $uibModalInstance.close();
                    };
                }]
        });
    }

    return {
        show: show
    };

}]);