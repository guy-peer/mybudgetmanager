/**
 * Created by Guy Peer on 30/08/2015.
 */

$(document).ready(function() {
    Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");

    if (!Parse.User.current()) {
        location = 'Welcom.html';
    }

    var totalAmountSpentToday = 0;

    $("#sideMenu").hide();

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

    var mobileDBudget = (function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var monthStart = new Date(year, month, 1);
        var monthEnd = new Date(2015, month + 1, 1);
        var monthLength = Math.floor((monthEnd - monthStart) / (1000 * 60 * 60 * 24));

        var dailyBudget = (Parse.User.current().get("budget") / monthLength);

        return dailyBudget;
    })();

    (function() {
        var Item = Parse.Object.extend("Cost_Items");
        var cuser = Parse.User.current().id;
        var query = new Parse.Query(Item);
        var date = new Date();
        query.lessThanOrEqualTo("createdAt", date);
        query.greaterThanOrEqualTo("createdAt", new Date(date.getFullYear(), date.getMonth(), date.getDate()));
        query.equalTo("user", {
            __type: "Pointer",
            className: "_User",
            objectId: cuser
        });

        query.find({
            success: function (results) {
                for (var i = 0 ; i < results.length ; i++) {
                    totalAmountSpentToday += Number(results[i].get("Amount"));
                }

                $(document).trigger('totalAmountSpentTodayLoaded');
            }, error: function (error) {
                console.log("Query Error:" + error.message)
            }
        });
    })();

    $(".userName").html(userName);
    $(".monthlyBudget").html(MBudget);

    $(document).on('totalAmountSpentTodayLoaded', function () {
        $(".leftToSpendToday").html(parseFloat(mobileDBudget - totalAmountSpentToday).toFixed(2));
    })

    $("#logoutSlideMenu").click(logOut);
    $("#logoutDeskMenu").click(logOut);
    $("#userlogout").click(logOut);

    function logOut(){
        Parse.User.logOut();
        location="Welcom.html";
    }


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

    var MSM = $("#mobileMenuButton");
    MSM.click(function(event) {
        $("#sideMenu").slideDown(400);


    });
    var CMSM = $("#closeMobileMenuButton");
    CMSM.click(function(event) {
        $("#sideMenu").slideUp(200);
    });

});
