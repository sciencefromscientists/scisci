myApp.service('UserService', ['$http', '$location', function ($http, $location) {
    console.log('UserService Loaded');
    let self = this;
    self.userObject = { list: [] };
    self.userLibrary = { list: [] };
    self.userTypes = { list: [] };
    self.currentLaborRate = { list: [] };

    /******************************************/
    /*              GET REQUESTS              */
    /******************************************/

    // This is for the manage users view
    self.getAllUsers = function () {// Start of getAllUsers function.
        $http.get('/api/user/users')
            .then(function (response) {
                console.log('Get response for all users: ', response.data);
                self.userLibrary.list = response.data;
            })
            .catch(function (error) {
                console.log('Get response for all users failed: ', error);
            });
    }; // End of getAllUsers function.

    self.getUserTypes = function () {// Start of getUserTypes function.
        $http.get('/api/user/types')
            .then(function (response) {
                console.log('Get response for user types: ', response.data);
                self.userTypes.list = response.data;
            })
            .catch(function (error) {
                console.log('Get response for user types failed: ', error);
            });
    }; // End of getUserTypes function.

    self.sortUsers = function (sortMethod) {
        $http.get(`/api/user/sorting/${sortMethod}`)
            .then(function (response) {
                console.log('Get response for sort users: ', response.data);
                self.userLibrary.list = response.data;
            })
            .catch(function (error) {
                console.log('Get response for sort users failed: ', error);
            });
    };

    /******************************************/
    /*             POST REQUESTS              */
    /******************************************/

    self.addUser = function (newUser) {// Start of addUser function.

        console.log(newUser);

        $http.post('/api/user', newUser)
            .then(function (response) {
                console.log('Response from add new user: ', response);
                self.getAllUsers();
                swal({
                    title: `The account for ${newUser.first_name} ${newUser.last_name} has been created`,
                    icon: "success",
                    timer: 1200,
                    buttons: false
                })
            })
            .catch(function (error) {
                console.log('Error on new user POST request: ', error);
            });

    }; // End of addUser function.

    /******************************************/
    /*              PUT REQUESTS              */
    /******************************************/

    self.submitEdit = function (userEdit) {

        $http.put('/api/user', userEdit)
            .then(function (response) {
                console.log('Response from edit a user (PUT request): ', response);
                self.getAllUsers();
                swal({
                    title: `Account Edit Complete`,
                    icon: "success",
                    timer: 1200,
                    buttons: false
                })
            })
            .catch(function (error) {
                console.log('Error on edit user PUT request: ', error);
            });

    }

    self.resetPassword = function (id) {

        $http.put(`/api/user/resetPassword/${id}`)
            .then(function (response) {
                console.log('Response from reset Password PUT request: ', response);
                // self.getAllUsers();
                swal({
                    title: `Password Reset Complete`,
                    icon: "success",
                    timer: 1200,
                    buttons: false
                })
            })
            .catch(function (error) {
                console.log('Error on reset password PUT request: ', error);
            });

    }

    self.setNewPassword = function (newPass) {
        console.log('sending new password: ', newPass);

        $http.put(`/api/user/newPassword`, newPass)
            .then(function (response) {
                console.log('Response from set new Password PUT request: ', response);
                // self.getAllUsers();
                swal({
                    title: `Password Update Complete`,
                    icon: "success",
                    timer: 1200,
                    buttons: false
                })
                $location.path('/user');
            })
            .catch(function (error) {
                console.log('Error on set new password PUT request: ', error);
            });

    }


    /******************************************/
    /*            DELETE REQUESTS             */
    /******************************************/

    self.deleteUser = function (userId) {    // Start of deleteUser function

        $http.delete(`/api/user/${userId}`)
            .then(function (response) {
                console.log('User successfully removed: ', response);
                self.getAllUsers();
                swal({
                    title: `Account Deleted`,
                    icon: "success",
                    timer: 1200,
                    buttons: false
                })
            })
            .catch(function (error) {
                console.log('Error removing user: ', error);
            });

    }; // End of deleteUser function

    /******************************************/
    /*            OTHER FUNCTIONS             */
    /******************************************/


    /************* VERIFICATION/LOGOUT FUNCTIONS *************/

    self.getuser = function (authorized, userType1, userType2) {
        console.log('UserService -- getuser');
        $http.get('/api/user').then(function (response) {
          if (authorized) {
            if (response.data.username && response.data.usertype !=  userType1 && response.data.usertype !=  userType2) {
                // user has a current session on the server
                self.userObject.list = response.data;
                console.log('UserService -- getuser -- User Data: ', self.userObject);
            } else {
                console.log('UserService -- getuser -- failure');
                // user has no session, bounce them back to the login page
                $location.path("/404");
            }
          } else {
            if (response.data.username) {
                // user has a current session on the server
                self.userObject.list = response.data;
                console.log('UserService -- getuser -- User Data: ', self.userObject);
            } else {
                console.log('UserService -- getuser -- failure');
                // user has no session, bounce them back to the login page
                $location.path("/home");
            }
          }
        }, function (response) {
            console.log('UserService -- getuser -- failure: ', response);
            $location.path("/home");
        });
    };

    self.logout = function () {
        console.log('UserService -- logout');
        $http.get('/api/user/logout').then(function (response) {
            console.log('UserService -- logout -- logged out');
            $location.path("/home");
        });
    }


    /*****************  LABOR RATE GET AND POST  *****************/

    self.setLaborRate = function (rate) {// Start of set labor rate function.
        $http.put(`/api/user/set/rates/${rate}`)
            .then(function (response) {
                console.log('Post response for set labor rate: ', response.data);
                self.retrieveLaborRate()
            })
            .catch(function (error) {
                console.log('Post response for set labor rates failed: ', error);
            });
    }; // End of set labor rate function.

    self.retrieveLaborRate = function () {// Start of retrieveLaborRate function.
        $http.get('/api/user/laborRates')
            .then(function (response) {
                console.log('Get response for retrieve labor rate: ', response.data);
                self.currentLaborRate.list = response.data;
            })
            .catch(function (error) {
                console.log('Get response for retrieve labor rates failed: ', error);
            });
    }; // End of retrieveLaborRate function.


    self.userTypeHomePage = function (user) {
      if(user.usertype === 1) {
        $location.path('/user');
      } else if (user.usertype === 2) {
        $location.path('/module-nav');
      } else {
        $location.path('/shopping-nav');
      }
    };

    self.onLoad = function () {
        self.retrieveLaborRate()
        self.getuser()
        self.getUserTypes();
        self.getAllUsers();
    }

    self.onLoad()

}]);
