/**
 * Created by Guy Peer on 21/08/2015.
 */
$(document).ready(function() {
Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");
    $("#login").click(function(event){

    var name = $("#username").val();
    var pass = $("#password").val();
    Parse.User.logIn(name, pass, {
        success: function(user){
            alert("welcom" +" " +name), location = "MainPage.html";
        }, error: function(user, error){
            console.log("log in error:"+error.message)
        }
    });

});
$("#signUp").click(function(event){
    location = "SignUp.html";

});




});