angular.module('umbraco').controller('DeclutterTypesController', function ($scope, $http, assetsService, editorState, Upload) {

    var vm = this;
    vm.serverErrorMessage = "";
    vm.state = "new";
    vm.model = {};
    vm.dataTypes = [];
    vm.dataTypesTree = {};
    vm.umbracoDataTypes = [];
    vm.umbracoDataTypesTree = {};
    vm.thirdPartyDataTypes = [];
    vm.thirdPartyDataTypesTree = {};
    vm.documentTypes = [];
    vm.documentTypesTree = {};
    vm.documentTypesNotUsed = 0;
    vm.dataTypesNotUsed = 0;
    vm.thirdPartyDataTypesNotUsed = 0;
    vm.umbracoDataTypesNotUsed = 0;
    vm.uploadStatus = "";
    vm.fileName = '';
    vm.url = '/umbraco/DWLDeclutter/DeclutterTypes/GetValues';
    vm.getSavedUrl = '/umbraco/DWLDeclutter/DeclutterTypes/GetSavedValues';
    vm.saveResponse = false;

    vm.$onInit = function () {
        $http.get(vm.getSavedUrl)
            .then(handleDownloadResponse)
            .catch(function (err) {
                console.error("Error:", err);
            });
    };

    vm.saveResponseToggle = function () {
        vm.saveResponse = !vm.saveResponse;
    }

    $scope.runTidy = function (event) {
        event.preventDefault();
        $("#run-btn").prop('disabled', true);
        document.querySelector('.loading-container').classList.add('is-visible');
        $http.get(vm.url + '?isSaving=' + vm.saveResponse)
            .then(handleDownloadResponse);
    };

    function handleDownloadResponse(response) {
        if (response.data.isSuccess) {
            vm.dataTypes = response.data.dataTypes;
            vm.dataTypesTree = buildTree(vm.dataTypes);

            vm.umbracoDataTypes = response.data.umbracoDataTypes;
            vm.umbracoDataTypesTree = buildTree(vm.umbracoDataTypes);

            vm.thirdPartyDataTypes = response.data.thirdPartyDataTypes;
            vm.thirdPartyDataTypesTree = buildTree(vm.thirdPartyDataTypes);

            vm.documentTypes = response.data.documentTypes;
            vm.documentTypesTree = buildTree(vm.documentTypes);

            vm.documentTypesNotUsed = response.data.typeUsageResult.documentTypes;
            vm.dataTypesNotUsed = response.data.typeUsageResult.dataTypes;
            vm.thirdPartyDataTypesNotUsed = response.data.typeUsageResult.thirdPartyDataTypes;
            vm.umbracoDataTypesNotUsed = response.data.typeUsageResult.umbracoDataTypes;
        }
        $("#run-btn").prop('disabled', false);
        document.querySelector('.loading-container').classList.remove('is-visible');
    }

    function buildTree(usageTypes) {
        const root = {};

        usageTypes.forEach(dt => {
            let currentLevel = root;

            dt.path.forEach((part, index) => {
                if (!currentLevel[part]) {
                    currentLevel[part] = {
                        __children: {},
                        __items: []
                    };
                }

                if (index === dt.path.length - 1) {
                    currentLevel[part].__items.push(dt);
                } else {
                    currentLevel = currentLevel[part].__children;
                }
            });
        });
        return root;
    }
});

angular.module('umbraco')
    .directive('umbAccordionTree', function ($compile) {
        return {
            restrict: 'E',
            scope: {
                nodes: '='
            },
            link: function (scope, element) {

                scope.open = {};

                scope.toggle = function (key) {
                    scope.open[key] = !scope.open[key];
                };

                scope.isOpen = function (key) {
                    return scope.open[key];
                };

                scope.isEmpty = function (obj) {
                    return !obj || Object.keys(obj).length === 0;
                };

                scope.shouldBeAccordion = function (node) {
                    const childCount = Object.keys(node.__children || {}).length;
                    const itemCount = (node.__items || []).length;
                    return childCount > 0;
                };

                scope.getEditUrl = function (item) {
                    if (item.type === 'documentType') {
                        return './#/settings/documentTypes/edit/' + item.id;
                    }
                    return './#/settings/dataTypes/edit/' + item.id;
                };

                const template = `
                    <div ng-repeat="(key, node) in nodes">

                        <div class="usage-panel" ng-if="shouldBeAccordion(node)" style="margin-bottom: 6px;">
                            <div class="usage-panel-header" ng-click="toggle(key)" ng-class="{'open': isOpen(key)}">
                                <span class="chevron"></span>
                                <strong>{{ key }}</strong>
                            </div>

                            <div class="usage-panel-body" ng-show="isOpen(key)">
                                <div ng-repeat="item in node.__items">
                                    <div class="usage-panel-card">
                                        <div><strong>{{ item.name }}</strong></div>
                                        <div>ID: {{ item.id }}</div>
                                    </div>
                                </div>

                                <umb-accordion-tree ng-if="!isEmpty(node.__children)" nodes="node.__children"></umb-accordion-tree>
                            </div>
                        </div>

                        <div ng-if="!shouldBeAccordion(node)">
                            <div ng-repeat="item in node.__items">
                                <div class="usage-panel-card">
                                    <div class="usage-panel-card__name"><strong>{{ item.name }}</strong></div>
                                    <div class="usage-panel-card__id">ID: {{ item.id }}</div>
                                     <a class="usage-panel-card__link" ng-href="{{ getEditUrl(item) }}" target="_blank">Open in Umbraco</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                element.html(template);
                $compile(element.contents())(scope);
            }
        };
    });