/**
 * Created by Guy Peer on 21/08/2015.
 */
$(document).ready(function() {

    if (Parse.User.current()) {
        location = "MainPage.html";
    }

    $("#login").click(function(event){

        var name = $("#username").val();
        var pass = $("#password").val();
        Parse.User.logIn(name, pass, {
            success: function(user){
                alert("welcome" +" " +name);
                location = "MainPage.html";
            },
            error: function(user, error){
                console.log("log in error:"+error.message)
            }
        });
    });

    $("#signUp").click(function(event){
        location = "SignUp.html";
    });
});