"use strict";
angular.module('truq.business.edit', ['firebase', 'firebase.utils', 'firebase.auth', 'uiGmapgoogle-maps'])


    .controller('EditBusinessCtrl', ['$scope', 'Auth', '$location', 'fbutil', 'user', 'Cart', '$firebaseObject', '$firebaseArray', 'Upload',
        function($scope, Auth, $location, fbutil, user, Cart, $firebaseObject, $firebaseArray, Upload) {
            if (!navigator.geolocation){
                //output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
                return;
            }


            var firebusiness = fbutil.ref('businesses', user.uid);
            $scope.business = $firebaseObject(firebusiness);
            var fireImage = fbutil.ref('images', user.uid);
            $scope.images = $firebaseArray(fireImage);
            $scope.geoFire = new GeoFire(fbutil.ref('truckNodes'));
            //$scope.business.$bindTo($scope, "firebusiness");
            //console.log($scope.business);
            $scope.geolocation = navigator.geolocation;
            $scope.submit = function(file) {
                if (file != null) {
                    $scope.upload(file);
                }
            };

            $scope.removeImg = function(){
                $scope.upload("");
            };

            // upload on file select or drop
            $scope.upload = function (file) {
                Upload.base64DataUrl(file).then(function(base64Urls) {
                    var done = fbutil.handler(function(cb) {
                        $scope.images.$add({"data": base64Urls},
                            function (error) {
                                if (error) {
                                    alert("Data could not be saved." + error);
                                }
                            })
                    });
                });
            };

            var geo_options = {
                enableHighAccuracy: true,
                maximumAge        : 30000,
                timeout           : 20000
            };
            function geo_success(position) {
                $scope.coords = position.coords;
                $scope.map = {
                    center: { latitude: $scope.coords.latitude, longitude: $scope.coords.longitude },
                    zoom: 15,
                    events: {
                        center_changed: $scope.$apply()
                    }

                };
                $scope.marker = {
                    id: user.uid,
                    coords: {
                        latitude: $scope.coords.latitude,
                        longitude: $scope.coords.longitude
                    },
                    events: {
                        position_changed : $scope.$apply()
                    },
                    options: { icon: "images/incoming-bus.png" }
                };
                console.log($scope.coords);
                console.log("Watching " + watchId);
            }

            function geo_error() {
                alert("Sorry, no position available.");
            }
            $scope.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
            var watchId;
            $scope.business.$loaded().then(function(data){
                //console.log(data.active);
                if($scope.business.active == true && $scope.business.watching != true) {
                    watchId = $scope.geolocation.watchPosition(geo_success, geo_error, geo_options);
                    console.log("Loaded " + watchId);
                    firebusiness.update({watching: true});
                }
            });




            $scope.updateStatus = function(active){
                if(active == true){
                    $scope.geoFire.set(user.uid, [$scope.coords.latitude, $scope.coords.longitude]);
                    watchId = $scope.geolocation.watchPosition(geo_success, geo_error, geo_options);
                    console.log("Update " + watchId);
                } else {
                    $scope.geoFire.remove(user.uid);
                    $scope.geolocation.clearWatch(watchId);
                    console.log("Here");
                }
                //console.log($geolocation);
                firebusiness.update({"active" : active});

            }

        }]).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('truq.business.create', {
            url: '/editBusiness',
            templateUrl: 'app/business/edit/edit.business.tmpl.html',
            controller: 'EditBusinessCtrl',
            authRequired: true,
            resolve: {
                user: ['Auth', function (Auth) {
                    return Auth.$requireAuth();
                }]
            }
        });
    }]);