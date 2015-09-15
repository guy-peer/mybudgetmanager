/**
 * Created by Guy Peer on 30/08/2015.
 */
$(document).ready(function() {

    if (Parse.User.current()) {
        location = "MainPage.html";
    }

    $("#signUpButton").click(function (event) {

        var name = $("#username").val();
        var pass = $("#password").val();
        var budget = $("#monthly_budget").val();

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
    });



















});