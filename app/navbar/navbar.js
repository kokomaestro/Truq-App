 angular.module('navbar', [])

        .controller('NavbarCtrl', ['cart', 'user', , function (cart, user) {
            var navbarCtrl = this;
            navbarCtrl.user = user;
            navbarCtrl.cart = cart;
            console.log(navbarCtrl.cart);

        }]);