$(document).ready(function() {


    var needToLogin = false;

    /*
     * Try to get the logged in user
     */
    try {
        if (!Parse.User.current()) {
            needToLogin = true;
        }
    }
    catch(e) {
        alert('Session expired. Please login again')
        needToLogin = true;
    }

    /*
     * If the user is not logged in, go to the login page
     */
    if (needToLogin) {
        location = 'index.html';
    }

    $("#sideMenu").hide();

    /*
     * Common object that contains the user details and common functions
     */
    var commonObject = (function() {

        this.totalAmountSpentToday = 0;
        this.totalAmountSpentThisMonth = 0;

        this.userName = Parse.User.current().get("username");
        this.monthlyBudget = Parse.User.current().get("budget");

        /*
         * Get the amount spent in the current month
         */
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

        /*
         * Calculate the daily budget according to the monthly budget and number of days of the current month
         */
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

        /*
         * Get the amount spent in the current day
         */
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

        $(".userName").html(this.userName);

        /*
         * After the data is retrieved, populate the html with the monthly remaining budget
         */
        $(document).on('totalAmountSpentThisMonthLoaded', function () {
            $(".monthlyBudget").html("Monthly budget:" + " " + (commonObj.monthlyBudget - commonObj.totalAmountSpentThisMonth));
        });

        /*
         * After the data is retrieved, populate the html with the daily remaining budget
         */
        $(document).on('totalAmountSpentTodayLoaded', function () {
            $(".leftToSpendToday").html("Daily budget:" + " " + parseFloat(commonObj.dailyBudget - commonObj.totalAmountSpentToday).toFixed(2));
        });

        $("#logoutSlideMenu").click(logOut);
        $("#logoutDeskMenu").click(logOut);

        /*
         * Logout
         */
        function logOut(){
            Parse.User.logOut();
            location="index.html";
        }

        /*
         * Check if the inserted amount is in the daily budget
         */
        this.isAmountInDailyBudget = (function(amount) {
            if (commonObj.dailyBudget - commonObj.totalAmountSpentToday - amount >= 0) {
                return true;
            }
            return false;
        });

        /*
         * Check if the inserted amount is in the monthly budget
         */
        this.isAmountInInMonthlyBudget = (function(amount) {
            if (commonObj.monthlyBudget - commonObj.totalAmountSpentThisMonth - amount >= 0) {
                return true;
            }
            return false;
        });
    });

    window.commonObj = new commonObject();
});
