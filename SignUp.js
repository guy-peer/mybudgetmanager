/**
 * Created by Guy Peer on 30/08/2015.
 */
$(document).ready(function() {

    /*
     * If the user is already logged in, go the the main page
     */
    if (Parse.User.current()) {
        location = "MainPage.html";
    }

    /*
     * signUp button click event
     */
    $("#signUpButton").click(function (event) {

        var isValid = true;

        var name = $("#username").val();
        var pass = $("#password").val();
        var budget = $("#monthly_budget").val();

        if (!name || name.trim() == '') {
            alert("User Name can't be empty");
            isValid = false;
        }

        if (!pass || pass.trim() == '') {
            alert("Password can't be empty");
            isValid = false;
        }

        if (isNaN(budget)) {
            alert("Please enter a valid number for the budget");
            isValid = false;
            $("#monthly_budget").val('');
        }

        if (isValid) {
            var user = new Parse.User();
            user.set("username", name);
            user.set("password", pass);
            user.set("budget", budget )
            user.signUp(null, {
                success: function (user) {
                    location = "MainPage.html";
                },
                error: function (user, error) {
                    console.log("signup error:" + error.message);
                }
            });
        }
    });



















});