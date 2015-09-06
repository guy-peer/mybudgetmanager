/**
 * Created by Guy Peer on 30/08/2015.
 */
Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");
$(document).ready(function() {






    var userName = (function () {
        if (Parse.User.current()) {
            return(Parse.User.current().get("username") +" "+"<a href='#'  id=userlogout  >(logout)</a>"  );

        }
        else{
            $("#current-user").html("");
        }
    })();

    var MBudget = (function () {


        return ("Monthly budget:" +" "+Parse.User.current().get("budget")+" "+"<a href=Settings.html>(Edit)</a>");



    });
    var DBudget = (function () {
        if (Parse.User.current()) {

            var a =(Parse.User.current().get("budget")/31);
            a = parseFloat(a).toFixed(2);
            return (a +" Left to spend today");
        }
        else{
            $("#current-user").html("");
        }
    })();

    var mobileDBudget = (function () {
        if (Parse.User.current()) {

            var a =(Parse.User.current().get("budget")/31);
            a = parseFloat(a).toFixed(2);
            return (a +" ");
        }
        else{
            $("#current-user").html("");
        }
    })();



    $("#userName").html(userName);
    $("#monthlyBudget").html(MBudget);
    $("#leftToSpendToday").html(mobileDBudget);

    $("#logoutSlideMenu").click(function(event){
        Parse.User.logOut();
        location="Welcom.html";
    });




    $("#logoutDeskMenu").click(function(event){
        Parse.User.logOut();
        location="Welcom.html";
    });
    $("#userlogout").click(function(event){
        Parse.User.logOut();
        location="Welcom.html";
    });


    $("#saveNewBudgetAmount").click(function(){
        var newBudget = $("#newBudgetSum").val();

        var currentUser = Parse.User.current();
        currentUser.save(
            {
                // Set as many properties as you like in this field,
                // think of it as a JSON object except you don't
                // have to enclose the values in strings.
                budget : newBudget
            }, {
                success: function(user) {
                    alert("Budget successfully saved, new budget is: " + user.get("budget"));
                    location="MainPage.html"
                },
                error: function(error) {
                    // error functions will always have an error argument handed back to the client,
                    // with properties error.code and error.message. Error messages are incredibly useful.
                    alert("Budget save failed, error: " + error.code + " " + error.message);
                }
            });
        $("#saveNewUsername").click(function(){
            var newName = $("#newUserName").val();

            var currentUser = Parse.User.current();
            currentUser.save(
                {
                    username : newName
                }, {
                    success: function(user) {
                        alert("Name successfully changed, new name is: " + user.get("username"));
                        location="MainPage.html"
                    },
                    error: function(error) {
                        // error functions will always have an error argument handed back to the client,
                        // with properties error.code and error.message. Error messages are incredibly useful.
                        alert("Username change failed, error: " + error.code + " " + error.message);
                    }}
            )});











    $("#currentBudget").html(CBudget);










});

var CBudget = (function () {
    if (Parse.User.current()) {
        return("Your Current budget is:" +" "+Parse.User.current().get("budget"));

    }
    else{
        $("#current-user").html("");
    }
});
});
