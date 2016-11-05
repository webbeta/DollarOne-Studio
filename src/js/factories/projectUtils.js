app.factory('projectUtils', [function() {

    var loadedProject = null,
        defaultStruct = {
            title: null,
            figures: null
        },
        itemStruct = {
            title: null,
            group: null,
            dimens: null,
            dots: null
        },
        dotStruct = {
            x: null,
            y: null
        };

    function validateProjectObject(content) {
        try {
            var json = JSON.parse(content),
                loadedKeys = Object.keys(json),
                defaultStructKeys = Object.keys(defaultStruct),
                itemStructKeys = Object.keys(itemStruct),
                dotStructKeys = Object.keys(dotStruct),
                defaultStructHasKeys = true,
                itemStructHasKeys = true,
                dotStructHasKeys = true;

            if( defaultStructKeys.length !== loadedKeys.length )
                return false;

            angular.forEach(loadedKeys, function(key) {
                if( !~defaultStructKeys.indexOf(key) ) {
                    defaultStructHasKeys = false;
                    return false;
                }
            });

            if( !defaultStructHasKeys )
                return false;

            angular.forEach(json.figures, function(figure) {
                var figureKeys = Object.keys(figure);
                if( itemStructKeys.length !== figureKeys.length ) {
                    itemStructHasKeys = false;
                    return false;
                }

                angular.forEach(figureKeys, function(key) {
                    if( !~itemStructKeys.indexOf(key) ) {
                        itemStructHasKeys = false;
                        return false;
                    }
                });

                if( !itemStructHasKeys )
                    return false;

                angular.forEach(figure.dots, function(dot) {
                    var dotKeys = Object.keys(dot);
                    if( dotStructKeys.length !== dotKeys.length ) {
                        dotStructHasKeys = false;
                        return false;
                    }

                    angular.forEach(dotKeys, function(key) {
                        if( !~dotStructKeys.indexOf(key) ) {
                            dotStructHasKeys = false;
                            return false;
                        }
                    });

                    if( !dotStructHasKeys )
                        return false;
                });

                if( !dotStructHasKeys )
                    return false;
            });

            return !(!itemStructHasKeys || !dotStructHasKeys);
        }catch(e) {
            return false;
        }
    }

    function loadProject(content) {
        if( !validateProjectObject(content) )
            throw new Error('No se ha podido cargar el proyecto.');

        loadedProject = JSON.parse(content);
    }

    function closeProject() {
        loadedProject = null;
    }

    function returnProjectByGroups() {
        var project = loadedProject,
            groupsByIdx = [],
            groups = [];

        angular.forEach(project.figures, function(figure) {
            var group = groupsByIdx[figure.group];
            figure.id = guid();
            if( !group ) {
                groupsByIdx[figure.group] = [figure];
            }else
                groupsByIdx[figure.group].push(figure);
        });

        angular.forEach(groupsByIdx, function(figures, id) {
            groups.push({ id: id, figures: figures });
        });

        project.groups = groups;

        return project;
    }

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function replaceFigureDotsById(id, newDots, project) {
        angular.forEach(project.groups, function(group) {
            angular.forEach(group.figures, function(figure) {
                if( figure.id === id ) {
                    figure.dots = newDots;
                }
            });
        });

        return JSON.parse(JSON.stringify(project));
    }

    function addFigure(title, dots, group, project) {
        group = parseInt(group);
        var figure = {
            title: title,
            id: guid(),
            group: group,
            dots: dots,
            dimens: 200
        };

        project.figures.push(figure);

        var groupFound = false;
        angular.forEach(project.groups, function(g) {
            if( g.id === group ) {
                g.figures.push(figure);
                groupFound = true;
            }
        });

        if( !groupFound )
            project.groups.push({ id: group, figures: [figure] });

        return JSON.parse(JSON.stringify(project));
    }

    function saveProject(project) {
        var newStruct = {
            title: project.title,
            figures: []
        };
        angular.forEach(project.figures, function(figure) {
            newStruct.figures.push({
                title: figure.title,
                group: figure.group,
                dimens: figure.dimens,
                dots: figure.dots
            });
        });

        return JSON.stringify(newStruct, null, 2);
    }

    return {
        guid: guid,
        loadProject: loadProject,
        closeProject: closeProject,
        returnProjectByGroups: returnProjectByGroups,
        replaceFigureDotsById: replaceFigureDotsById,
        addFigure: addFigure,
        saveProject: saveProject
    };

}]);