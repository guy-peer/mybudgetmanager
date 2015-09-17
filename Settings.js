/**
 * Created by Guy Peer on 30/08/2015.
 */

$(document).ready(function() {

    $("#saveNewBudgetAmount").click(function(){
        var newBudget = $("#newBudgetSum").val();

        if (isNaN(newBudget)) {
            alert('Please enter a valid number')
        }
        else {
            var currentUser = Parse.User.current();
            currentUser.save(
                {
                    // Set as many properties as you like in this field,
                    // think of it as a JSON object except you don't
                    // have to enclose the values in strings.
                    budget : newBudget
                },
                {
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
        }
    });

    $("#saveNewUsername").click(function(){
        var newName = $("#newUserName").val();

        if (!newName || newName.trim() == '') {
            alert("User name can't be empty")
        }
        else {
            var currentUser = Parse.User.current();
            currentUser.save(
                {
                    username : newName
                },
                {
                    success: function(user) {
                        alert("Name successfully changed, new name is: " + user.get("username"));
                        location="MainPage.html"
                    },
                    error: function(error) {
                        // error functions will always have an error argument handed back to the client,
                        // with properties error.code and error.message. Error messages are incredibly useful.
                        alert("Username change failed, error: " + error.code + " " + error.message);
                    }
                }
            )};
    });

    var MSM = $("#mobileMenuButton");

    MSM.click(function(event) {
        $("#sideMenu").slideDown(400);
    });

    var CMSM = $("#closeMobileMenuButton");

    CMSM.click(function(event) {
        $("#sideMenu").slideUp(200);
    });
});
