angular.module('meanNASDAQ').controller('RegisterController', RegisterController);

function RegisterController($http, stockDataFactory) {
    var vm = this;
    
    vm.register = function() {
        var user = {
            username: vm.username,
            password: vm.password,
            funds: 10000
        };
        
        if (!vm.username || !vm.password) {
            vm.error = "Please add a username and password.";
        } else {
            if (vm.password !== vm.passwordRepeat) {
                vm.error = "Please make sure the passwords match.";
            } else {
                stockDataFactory.register(user).then(function(result) {
                    console.log(result);
                    vm.message = 'Successful registration, please login';
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }
    };
    
} // ends RegisterController