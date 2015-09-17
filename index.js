/**
 * Created by Guy Peer on 21/08/2015.
 */
$(document).ready(function() {

    if (Parse.User.current()) {
        location = "MainPage.html";
    }

    /*
     * Login with user name and password
     */
    $("#login").click(function(event){

        var name = $("#username").val();
        var pass = $("#password").val();
        Parse.User.logIn(name, pass, {
            success: function(user){
                alert("welcome" +" " +name);
                location = "MainPage.html";
            },
            error: function(user, error){
                alert('Incorrect user name or password');
                $("#username").val('');
                $("#password").val('');
                $("#username").focus();
            }
        });
    });

    /*
     * Go to the sign up page
     */
    $("#signUp").click(function(event){
        location = "SignUp.html";
    });
});
