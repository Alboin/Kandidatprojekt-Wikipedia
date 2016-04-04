angular.module('PopupDemo', ['ui.bootstrap']);
        angular.module('PopupDemo').controller('PopupDemoController', ['$scope','$modal',function ($scope, $modal) {

            $scope.open = function () {
                console.log('opening pop up');
                var modalInstance = $modal.open({
                    templateUrl: 'Popup.html',
                    // added controller statement
                    controller: 'PopupInstanceController',

                    /*
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }*/
                });
            }

        }]);

        // added this
        angular.module('PopupDemo').controller('PopupInstanceController', ['$scope','$modalInstance',function ($scope, $modalInstance) {
            $scope.close = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
