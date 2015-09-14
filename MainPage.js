Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");
Parse.User.enableRevocableSession();
$(document).ready(function() {

    if (!Parse.User.current()) {
        location = 'Welcom.html';
    }

    var totalAmountSpentToday = 0;

    $("#sideMenu").hide();
    var expanseDetails = {};

    var userName = (function () {
        return(Parse.User.current().get("username") +" "+"<a href='#'  id=userlogout >(logout)</a>"  );
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

    var htmlList = "";
    (function (){
        var Item = Parse.Object.extend("Cost_Items");
        var cuser = Parse.User.current().id;
        var query = new Parse.Query(Item);
        query.equalTo("user", {
            __type: "Pointer",
            className: "_User",
            objectId: cuser
        });

        query.find({
            success: function(results){

                var keyValue = {};

                for (var i = 0 ; i < results.length ; i++) {

                    var category = results[i].get("Category");
                    var subCategory = results[i].get("SubCategory");
                    var amount = Number(results[i].get("Amount"));
                    var date = results[i]["createdAt"];

                    if (category && amount && !isNaN(amount) && subCategory && date) {
                        var singleExpanseDetail = {};
                        singleExpanseDetail['subCategory'] = subCategory;
                        singleExpanseDetail['amount'] = amount;
                        singleExpanseDetail['date'] = date;

                        if (expanseDetails[category]) {
                            expanseDetails[category].push(singleExpanseDetail);
                        }
                        else {
                            expanseDetails[category] = [singleExpanseDetail];
                        }


                        if (keyValue[category]) {
                            keyValue[category] += amount;
                        }
                        else {
                            keyValue[category] = amount;
                        }
                    }
                }

                for (var key in keyValue) {
                    if (keyValue.hasOwnProperty(key)) {

                        var myLi = document.createElement("li");
                        myLi.id = key;
                        myLi.className = 'existing_items';

                        var myH3 = document.createElement("h3");
                        myH3.textContent = key +":"+ " "+ keyValue[key];
                        var editButton = document.createElement("button");
                        editButton.textContent = "Edit";
                        var existingItemExpanseDetails = expanseDetails[key];


                        myLi.appendChild(myH3);

                        var myDiv = document.createElement("div");
                        for (var i in existingItemExpanseDetails){

                            var myP = document.createElement("p");
                            myP.textContent = existingItemExpanseDetails[i].subCategory + ' - ' + existingItemExpanseDetails[i].amount + ' - ' + existingItemExpanseDetails[i].date;

                            myDiv.appendChild(myP);
                        }

                        myLi.appendChild(myDiv);

                        $('#Items-List').append(myLi);
                    }
                }

                $("#Items-List").accordion({
                    active: false,
                collapsible: true

                });
                $("#showDetailsMobile").accordion({
                    active: false,
                    collapsible: true
                });
            }, error: function(error){
                console.log("Query Error:"+error.message)
            }
        });
    })();




    $("#logoutSlideMenu").click(logOut);

    $("#logoutDeskMenu").click(logOut);

    $("#userlogout").click(logOut);

    function logOut(){
        Parse.User.logOut();
        location="Welcom.html";
    }

    var MSM = $("#mobileMenuButton");
        MSM.click(function(event) {
            $("#sideMenu").slideDown(400);


    });
    var CMSM = $("#closeMobileMenuButton");
    CMSM.click(function(event) {
        $("#sideMenu").slideUp(200);


    });


});

