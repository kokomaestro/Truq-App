"use strict";
angular.module('truq.business.create', ['firebase', 'firebase.utils', 'firebase.auth', 'ngFileUpload'])


    .controller('CreateBusinessCtrl', ['$scope', 'Auth', '$location', 'fbutil', 'user', '$firebaseArray',
        function($scope, Auth, $location, fbutil, user, $firebaseArray) {
            var business = this;
        business.user = fbutil.ref('businesses', user.uid);
        business.addBusiness = function() {
            $scope.err = null;
            if(assertValidBusinessProps()){
                var businessNm = $scope.businessNm;
                var phone = $scope.phone;

                //console.log(parseInt(zipcode, 10));
                return fbutil.handler(function(cb) {
                    $scope.business.set({businessName: businessNm, phoneNumber: phone, active: false}, cb)
                }).then(function(/* user */) {
                    // redirect to the business page
                    $scope.added = true;
                    $location.path('/cartManagement')
                    console.log("Good Job");
                }, function(err) {
                    console.log(err);
                    $scope.err = err;
                });
            }
        };
            console.log(business.user);
        business.hasCart = function(){
            if(business.user == null){

                return "Add A FoodCart";
            }
            else
                return "Cart Management";
        };
        function assertValidBusinessProps() {
            if (!$scope.businessNm) {
                $scope.err = 'Please enter your Business Name';
            }
            else if (!$scope.phone) {
                $scope.err = 'Please enter a Phone Number';
            }
            return !$scope.err;
        }

        function errMessage(err) {
            return angular.isObject(err) && err.code? err.code : err + '';
        }

    }]).config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('truq.business.create', {
            url: '/createBusiness',
            templateUrl: 'app/business/create/create.business.tmpl.html',
            controller: 'CreateBusinessCtrl',
            authRequired: true
        });
    }]);