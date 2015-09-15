$(document).ready(function() {

    if (!Parse.User.current()) {
        location = 'Welcome.html';
    }

    $("#sideMenu").hide();

    var commonObject = (function() {

        this.totalAmountSpentToday = 0;
        this.totalAmountSpentThisMonth = 0;

        this.userName = Parse.User.current().get("username");

        this.monthlyBudget = Parse.User.current().get("budget");

        (function() {
            var Item = Parse.Object.extend("Cost_Items");
            var cuser = Parse.User.current().id;
            var query = new Parse.Query(Item);
            var date = new Date();
            query.lessThanOrEqualTo("createdAt", date);
            query.greaterThanOrEqualTo("createdAt", new Date(date.getFullYear(), date.getMonth(), 1));
            query.equalTo("user", {
                __type: "Pointer",
                className: "_User",
                objectId: cuser
            });

            query.find({
                success: function (results) {
                    for (var i = 0 ; i < results.length ; i++) {
                        commonObj.totalAmountSpentThisMonth += Number(results[i].get("Amount"));
                    }

                    $(document).trigger('totalAmountSpentThisMonthLoaded');
                }, error: function (error) {
                    console.log("Query Error:" + error.message)
                }
            });
        })();

        this.dailyBudget = (function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth();
            var monthStart = new Date(year, month, 1);
            var monthEnd = new Date(2015, month + 1, 1);
            var monthLength = Math.floor((monthEnd - monthStart) / (1000 * 60 * 60 * 24));

            var calculatedDailyBudget = (Parse.User.current().get("budget") / monthLength);

            return calculatedDailyBudget;
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
                        commonObj.totalAmountSpentToday += Number(results[i].get("Amount"));
                    }

                    $(document).trigger('totalAmountSpentTodayLoaded');
                }, error: function (error) {
                    console.log("Query Error:" + error.message)
                }
            });
        })();

        $(".userName").html(this.userName + " "+"<a href='#'  id=userlogout >(logout)</a>" );

        $(document).on('totalAmountSpentThisMonthLoaded', function () {
            $(".monthlyBudget").html("Monthly budget:" + " " + (commonObj.monthlyBudget - commonObj.totalAmountSpentThisMonth) + " " + "<a href=Settings.html>(Edit)</a>");
        });

        $(document).on('totalAmountSpentTodayLoaded', function () {
            $(".leftToSpendToday").html(parseFloat(commonObj.dailyBudget - commonObj.totalAmountSpentToday).toFixed(2));
        });
    });

    window.commonObj = new commonObject();
});
