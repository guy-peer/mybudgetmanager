Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");
var categoryToSubCategory = {};
$(document).ready(function() {

    if (!Parse.User.current()) {
        location = 'Welcom.html';
    }

    var totalAmountSpentToday = 0;

    $("#sideMenu").hide();

    var userName = (function () {
        if (Parse.User.current()) {
            return ("logged in as:" + " " + Parse.User.current().get("username") + " " + "<a href='#'  id=userlogout  >(logout)</a>"  );

        }
        else {
            $("#current-user").html("");
        }
    });
    $("#user_name").html(userName);
    $(".container1").hide();
    $(".container2").hide();

    $("#Ready").click(function () {
        $("#Ready").slideUp(400);
        $("#Custom").slideUp(400);
        $(".container1").slideDown(500);
    });

    $("#Custom").click(function () {
        $("#Ready").slideUp(400);
        $("#Custom").slideUp(400);
        $(".container2").slideDown(500);
    });

    $("#Back1").click(function () {
        $(".container1").slideUp(400);
        $(".container2").slideUp(400);
        $("#Ready").slideDown(500);
        $("#Custom").slideDown(500);
    });

    $("#Back2").click(function () {
        $(".container1").slideUp(400);
        $(".container2").slideUp(400);
        $("#Ready").slideDown(400);
        $("#Custom").slideDown(400);
    });

    var Item = Parse.Object.extend("Cost_Items");
    var query = new Parse.Query(Item);

    query.find({
        success: function (results) {

            for (var i = 0 ; i < results.length ; i++) {
                var category = results[i].get("Category");
                var subCategory = results[i].get("SubCategory");

                if (categoryToSubCategory.hasOwnProperty(category)) {
                    var existingSubCategories = categoryToSubCategory[category];

                    if (subCategory && $.inArray(subCategory, existingSubCategories) < 0){
                        existingSubCategories.push(subCategory);
                    }
                }
                else{
                    if (subCategory) {
                        categoryToSubCategory[category] = [subCategory];
                    }
                }
            }

            $("#savenewitem1").click(function () {

                var Category = $("#Category1").val();
                var Subcats = $("#SubCats1").val();
                var Amount = $("#Amount1").val();
                var user = Parse.User.current();
                var newItem = new Item();
                newItem.set("Category", Category);
                newItem.set("SubCategory", Subcats);
                newItem.set("Amount", Amount);
                newItem.set("user", user);
                newItem.save({
                    success: function () {
                        document.location = "MainPage.html";
                    }
                });
            });

            $("#savenewitem2").click(function () {
                var Category2 = $("#Category2").val();
                var Subcats2 = $("#SubCats2").val();
                var Amount2 = $("#Amount2").val();
                var user2 = Parse.User.current();
                var newItem = new Item();
                newItem.set("Category", Category2);
                newItem.set("SubCategory", Subcats2);
                newItem.set("Amount", Amount2);
                newItem.set("user", user2);
                newItem.save({
                    success: function () {
                        document.location = "MainPage.html";
                    }
                });
            })

            $(document).trigger('dataLoaded');
        }
    });

    $("#logoutDeskMenu").click(logOut);
    $("#userlogout").click(logOut);
    $("#logoutSlideMenu").click(logOut);

    function logOut(){
        Parse.User.logOut();
        location="Welcom.html";
    }


    $(document).on("dataLoaded", function() {

        var keys = Object.keys(categoryToSubCategory);

        for (var i = 0 ; i < keys.length ; i++){
            var opt = document.createElement('option');
            opt.value = keys[i];
            opt.textContent = keys[i];
            $("#Category1").append(opt);
        }

        $("#Category1").on('change', function () {
            list(categoryToSubCategory[$(this).val()])
        })
    });

    function list(array_list) {
        $("#SubCats1").html("");
        var pleaseSelectOption = document.createElement('option');
        pleaseSelectOption.value = '';
        pleaseSelectOption.textContent = '-- Please Select --';
        $("#SubCats1").append(pleaseSelectOption);


        $(array_list).each(function (i) {
            var opt = document.createElement('option');
            opt.value = this.toString();
            opt.textContent = this.toString();
            $("#SubCats1").append(opt);

        });
    }

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

    var MSM = $("#mobileMenuButton");
    MSM.click(function(event) {
        $("#sideMenu").slideDown(400);


    });
    var CMSM = $("#closeMobileMenuButton");
    CMSM.click(function(event) {
        $("#sideMenu").slideUp(200);


    });
});












