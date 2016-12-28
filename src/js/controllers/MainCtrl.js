app.controller('MainCtrl', ['$scope', 'ngNotify', 'projectUtils', '$uibModal', 'deleteModal', '$templateCache', '$http', '$timeout',
function($scope, ngNotify, projectUtils, $uibModal, deleteModal, $templateCache, $http, $timeout) {

    $scope.project = {
        loaded: false,
        content: {
            title: null,
            figures: [],
            groups: []
        }
    };

    function exportSomething(type, data) {
        var template = $templateCache.get('dollar_one_cpp.html'),
            filename = 'export';

        if( type === 'figure' )
            filename = slug(data.title, {lower: true}) + '.cpp';
        else if( type === 'group' )
            filename = slug('grupo '+data.id, {lower: true}) + '.cpp';
        else if( type === 'project' )
            filename = slug(data.title, {lower: true}) + '.cpp';
        else if( type === 'project_save' ) {
            filename = $scope.project.content.title + '.json';
            template = null;
        }

        $http({
            url: '/exports',
            method: "POST",
            data: {
                data: data,
                type: type,
                template: template,
                filename: filename
            }
        }).then(function(response) {
            var popup = window.open('/download?tmp=' + encodeURI(response.data.filename) + '&filename=' + encodeURI(filename), '_blank', 'width=1,height=1,alwaysLowered,z-lock,scrollbars=no', true);
            $timeout(function() {
                window.focus();
                popup.blur();
                popup.close();
            }, 30000);
            ngNotify.set('Exportación correcta.');
        }, function(response) {
            ngNotify.set('No se ha podido exportar la selección.', {type: 'error'});
        });
    }

    function loadBgImage(files, scope) {
        if( files.length === 0 || !files[0].type.match('image.*') )
            ngNotify.set('Debes seleccionar una imagen.', {type: 'error'});
        else {
            var file = files[0],
                reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = function(evt) {
                scope.backgroundImage = evt.target.result;
                $timeout(function() {
                    scope.backgroundImage = evt.target.result;
                }, 200);
            };
            reader.onerror = function() {
                ngNotify.set('Debes seleccionar una imagen.', {type: 'error'});
            };
        }
    }

    $scope.closeProject = function() {
        $scope.project.loaded = false;
        $scope.project.content = null;
        projectUtils.closeProject();

        document.location.reload();
    };

    $scope.newProject = function() {
        $scope.project.content.title = '';
        $scope.project.content.groups.push({ id: 0, figures: [] });
        $scope.project.loaded = true;
    };

    $scope.hasFigures = function(group) {
        if( !!group )
            return group.figures.length > 0;
        else
            return $scope.project.content.figures.length > 0;
    };

    $scope.hasTitle = function() {
        return $scope.project.content.title.trim() !== '';
    };

	$scope.loadProject = function(files) {
        if( files.length === 0 )
            ngNotify.set('Fichero de proyecto incorrecto.', {type: 'error'});
        else {
            var file = files[0],
                reader = new FileReader();

            reader.readAsText(file, 'UTF-8');

            reader.onload = function(evt) {
                var content = evt.target.result;

                try {
                    projectUtils.loadProject(content);
                    $scope.project.content = projectUtils.returnProjectByGroups();

                    $scope.project.loaded = true;
                    $scope.$apply();
                }catch(ex) {
                    ngNotify.set('Fichero de proyecto incorrecto.', {type: 'error'});
                }
            };
            reader.onerror = function() {
                ngNotify.set('Fichero de proyecto incorrecto.', {type: 'error'});
            };
        }
    };

    $scope.testFigure = function(figure) {
        $uibModal.open({
            templateUrl: 'test_figure.html',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.recognitionScore = 0;
                $scope.figure = figure;
            }]
        });
    };

    $scope.editFigure = function(figure) {
        var mainScope = $scope;
        $uibModal.open({
            templateUrl: 'edit_figure.html',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                function initEdition() {
                    $scope.rawPath = null;
                    $scope.drawPath = null;
                    $scope.blockDraw = false;
                    $scope.okEnabled = false;
                    $scope.resetEnabled = false;
                }
                $scope.backgroundImage = null;
                $scope.backgroundSize = 'cover';
                $scope.backgroundColor = 'white';
                $scope.setBackgroundSizeCover = function() {
                    $scope.backgroundSize = 'cover';
                };
                $scope.setBackgroundSizeContain = function() {
                    $scope.backgroundSize = 'contain';
                };
                $scope.setBackgroundColor = function(color) {
                    $scope.backgroundColor = color;
                };
                $scope.loadBgImage = function(files) {
                    loadBgImage(files, $scope);
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.reset = function() {
                    $scope.drawPath.remove();
                    initEdition();
                };
                $scope.ok = function() {
                    var editedProject = projectUtils.replaceFigureDotsById(figure.id, $scope.rawPath, mainScope.project.content);
                    mainScope.project.loaded = false;
                    mainScope.project.content.groups.length = 0;
                    mainScope.project.content.figures.length = 0;

                    $timeout(function() {
                        angular.forEach(editedProject.groups, function(group) {
                            mainScope.project.content.groups.push(group);
                            angular.forEach(group.figures, function(figure) {
                                mainScope.project.content.figures.push(figure);
                            });
                        });
                        mainScope.project.loaded = true;
                        ngNotify.set('Figura editada correctamente.');
                    }, 100);

                    $uibModalInstance.dismiss('cancel');
                };
                $scope.figure = figure;
                initEdition();
            }]
        });
    };

    $scope.newFigure = function(group) {
        group = group || null;
        var mainScope = $scope;
        $uibModal.open({
            templateUrl: 'new_figure.html',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                if( group === null )
                    $scope.modalTitle = 'en el proyecto';
                else
                    $scope.modalTitle = 'en el grupo #'+group.id;

                var groups = [],
                    lastId = 0;
                angular.forEach(mainScope.project.content.groups, function(group) {
                    groups.push({ id: group.id, name: 'Grupo #'+group.id });
                    lastId = group.id;
                });
                groups.push({ id: lastId + 1, name: 'Nuevo grupo' });

                $scope.selectedGroup = group == null ? null : group.id;
                $scope.title = null;
                $scope.group = {
                    model: group === null ? '0' : group.id,
                    availableOptions: groups
                };

                function initEdition() {
                    $scope.rawPath = null;
                    $scope.drawPath = null;
                    $scope.blockDraw = false;
                    $scope.okEnabled = false;
                    $scope.resetEnabled = false;
                    $scope.titleEnabled = false;
                }
                $scope.backgroundImage = null;
                $scope.backgroundSize = 'cover';
                $scope.backgroundColor = 'white';
                $scope.setBackgroundSizeCover = function() {
                    $scope.backgroundSize = 'cover';
                };
                $scope.setBackgroundSizeContain = function() {
                    $scope.backgroundSize = 'contain';
                };
                $scope.setBackgroundColor = function(color) {
                    $scope.backgroundColor = color;
                };
                $scope.loadBgImage = function(files) {
                    loadBgImage(files, $scope);
                };
                $scope.buttonsEnabled = function() {
                    return $scope.okEnabled && $scope.titleEnabled;
                };
                $scope.titleChange = function() {
                    this.title = this.title === null ? '' : this.title;
                    var title = this.title.trim();
                    $scope.titleEnabled = title !== '';
                };
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.reset = function() {
                    $scope.drawPath.remove();
                    initEdition();
                    $scope.titleChange();
                };
                $scope.ok = function() {
                    projectUtils.addFigure($scope.title, $scope.rawPath, $scope.group.model, mainScope.project.content);
                    ngNotify.set('Figura creada correctamente.');

                    $uibModalInstance.dismiss('cancel');
                };
                initEdition();
            }]
        });
    };

    $scope.testMultiple = function(type, data) {
        var group = null;
        if( type === 'group' )
            group = data.id;
        else {
            data = $scope.project.content;
        }
        $uibModal.open({
            templateUrl: 'test_multiple.html',
            controller: ['$scope', '$uibModalInstance', function($scope, $uibModalInstance) {
                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
                if( group === null )
                    $scope.title = 'proyecto';
                else
                    $scope.title = 'grupo #'+group;

                $scope.group = group;
                $scope.recognitionScore = 0;
                $scope.recognitionTitle = 0;
                $scope.figures = data.figures;
            }]
        });
    };

    $scope.deleteFigure = function(figure) {
        deleteModal.show({}, function() {
            var ixToDelete = null;
            angular.forEach($scope.project.content.figures, function(fig, ix) {
                if( fig.id === figure.id ) {
                    ixToDelete = ix;
                    return false;
                }
            });
            if( ixToDelete !== null )
                $scope.project.content.figures.splice(ixToDelete, 1);
            angular.forEach($scope.project.content.groups, function(group, groupix) {
                ixToDelete = null;
                angular.forEach(group.figures, function(fig, ix) {
                    if( fig.id === figure.id ) {
                        ixToDelete = ix;
                        return false;
                    }
                });
                if( ixToDelete !== null )
                    group.figures.splice(ixToDelete, 1);
                if( group.figures.length === 0 )
                    $scope.project.content.groups.splice(groupix, 1);
            });
        });
    };

    $scope.exportFigure = function(figure) {
        exportSomething('figure', figure);
    };

    $scope.exportGroup = function(group) {
        exportSomething('group', group);
    };

    $scope.exportProject = function() {
        exportSomething('project', $scope.project.content);
    };

    $scope.saveProject = function() {
        exportSomething('project_save', projectUtils.saveProject($scope.project.content));
    };

}]);