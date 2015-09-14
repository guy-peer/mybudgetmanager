$(document).ready(function() {
    Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");

    if (!Parse.User.current()) {
        location = 'Welcom.html';
    }

    var totalAmountSpentToday = 0;

    var expanseDetails = {};
    var barData = {
        labels:[],
        datasets: []
    };

    var pieData = [];

    $("#sideMenu").hide();
    $("#showReport").hide();
    $("#Items-List").hide();
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

    var userName = (function () {
        if (Parse.User.current()) {
            return ("logged in as:" + " " + Parse.User.current().get("username") + " " + "<a href='#'  id=userlogout  >(logout)</a>"  );

        }
        else {
            $("#current-user").html("");
        }
    });

    $("#showDetailsMobile").accordion({
        active: false,
        collapsible: true
    });
    $("#SDatePicker").datepicker();
    $("#EDatePicker").datepicker();

    $(".DatePicker").on('change',function(){
        if ($(this).val()) {
            $(this).css('border-color', 'white');
        }
    });

    $("#Cancel").click(function(){
        location="Reports.html";
    });


    $("#logout").click(function(event){
        Parse.User.logOut();
        location="Welcom.html";
    });

    $("#newReport").click(function(event){
        location.reload();
    });

    $("#userlogout").click(logOut);
    $("#logoutDeskMenu").click(logOut);
    $("#logoutSlideMenu").click(logOut);

    function logOut(){
        Parse.User.logOut();
        location="Welcom.html";
    }

    $("#Retrieve").click(function() {

        var startDateElement = $("#SDatePicker");
        var endDateElement = $("#EDatePicker");

        var startDate = startDateElement.val();
        var endDate = endDateElement.val();

        if (!startDate) {
            startDateElement.css('border-color', 'red');
            startDateElement.focus();
            return;
        }

        if (!endDate) {
            endDateElement.css('border-color', 'red');
            endDateElement.focus();
            return;
        }
        var startDateAsDate = new Date(startDate);
        var endDateAsDate = new Date(endDate);
        endDateAsDate.setHours(23);
        endDateAsDate.setMinutes(59);
        endDateAsDate.setSeconds(59);

        if (startDateAsDate > endDateAsDate) {
            alert('startDateAsDate > endDateAsDate');
            return;
        }

        var htmlList = "";
        (function () {
            var Item = Parse.Object.extend("Cost_Items");
            var cuser = Parse.User.current().id;
            var query = new Parse.Query(Item);
            query.lessThanOrEqualTo("createdAt", endDateAsDate);
            query.greaterThanOrEqualTo("createdAt", startDateAsDate);
            query.equalTo("user", {
                __type: "Pointer",
                className: "_User",
                objectId: cuser
            });


            query.find({
                success: function (results) {

                    for (var i = 0 ; i < results.length ; i++) {
                        var category = results[i].get("Category");
                        var subCategory = results[i].get("SubCategory");
                        var amount = Number(results[i].get("Amount"));
                        var date = results[i]["createdAt"];

                        if (category && amount && !isNaN(amount) && subCategory && date) {
                            var singleExpanseDetail = {};
                            singleExpanseDetail['subCategory'] = subCategory;
                            singleExpanseDetail['amount'] = amount;
                            singleExpanseDetail['date'] = formatDate(date);

                            if (expanseDetails[category]) {
                                expanseDetails[category].push(singleExpanseDetail);
                            }
                            else {
                                expanseDetails[category] = [singleExpanseDetail];
                            }
                        }
                    }

                    $(document).trigger('dataLoaded');

                }, error: function (error) {
                    console.log("Query Error:" + error.message)
                }
            });
        })();
    });

    $(document).on('dataLoaded', function(){
        createItemList();
        fillPieChartData();
        fillBarChartData();
    });

    function createItemList(){

        var isDataEmpty = true;

        for (var category in expanseDetails) {

            isDataEmpty = false;

            var categoryListItem = document.createElement("li");
            categoryListItem.id = category;
            categoryListItem.className = 'existing_items';

            var totalCategoryAmount = 0;

            var subCategories = expanseDetails[category];

            for (var i = 0 ; i < subCategories.length ; i++){
                totalCategoryAmount += subCategories[i].amount;
            }

            var categoryHeader = document.createElement("h3");
            categoryHeader.textContent = category + ":" + " " + totalCategoryAmount;

            categoryListItem.appendChild(categoryHeader);

            var subCategoriesWrapper = document.createElement("div");

            for (var i = 0 ; i < subCategories.length ; i++){
                var subCategoryElement = document.createElement("p");
                subCategoryElement.textContent = subCategories[i].subCategory + ' - ' + subCategories[i].amount + ' - ' + subCategories[i].date;
                subCategoriesWrapper.appendChild(subCategoryElement);
            }

            categoryListItem.appendChild(subCategoriesWrapper);

            $("#reportForm").slideUp(400);
            $("#showReport").show();
            $("#Items-List").show();
            $('#Items-List').append(categoryListItem);
        }

        if (isDataEmpty){
            var categoryListItem = document.createElement("li");
            categoryListItem.id = 'emptyResult';
            categoryListItem.className = 'existing_items';

            var categoryHeader = document.createElement("h3");
            categoryHeader.textContent = 'No data for the selected dates';

            categoryListItem.appendChild(categoryHeader);

            $("#reportForm").slideUp(400);
            $("#showReport").show();
            $("#Items-List").show();
            $('#Items-List').append(categoryListItem);

        }
        else {
            $('#reportButton').show();
            $('#pieChartButton').show();
            $('#barChartButton').show();
        }
    }

    function fillPieChartData(){
        for (var category in expanseDetails) {
            var totalCategoryAmount = 0;

            var subCategories = expanseDetails[category];

            for (var i = 0 ; i < subCategories.length ; i++){
                totalCategoryAmount += subCategories[i].amount;
            }

            pieData.push(
            {
                value: totalCategoryAmount,
                label: category,
                color: getRandomColor()
            });
        }
    }

    function fillBarChartData(){
        var dailyBudgetForBarChart =
        {
            label: 'Daily Budget',
            fillColor: '#382765',
            data: []
        };

        var amountSpentForBarChart =
        {
            label: 'Amount spent',
            fillColor: '#7BC225',
            data: []
        };

        var amountSpentPerDay = {};

        for (var category in expanseDetails) {

            var subCategories = expanseDetails[category];

            for (var i = 0; i < subCategories.length; i++) {

                var formattedDate = (subCategories[i].date).split(' ')[0];

                if (amountSpentPerDay.hasOwnProperty(formattedDate)) {
                    amountSpentPerDay[formattedDate] += subCategories[i].amount;
                }
                else {
                    amountSpentPerDay[formattedDate] = subCategories[i].amount;
                }
            }
        }

        for (var date in amountSpentPerDay) {
            barData.labels.push(date);
            dailyBudgetForBarChart.data.push(mobileDBudget);
            amountSpentForBarChart.data.push(amountSpentPerDay[date]);
        }

        barData.datasets.push(dailyBudgetForBarChart);
        barData.datasets.push(amountSpentForBarChart);
    }

    function formatDate(date) {

        var day = date.getDate().toString();
        var month = (date.getMonth() + 1).toString();
        var year = date.getFullYear().toString();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var second = date.getSeconds().toString();

        if (second.length == 1){
            second = '0' + second;
        }

        var formattedDate = day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + second;

        return formattedDate;
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    var MSM = $("#mobileMenuButton");
    MSM.click(function(event) {
        $("#sideMenu").slideDown(400);


    });
    var CMSM = $("#closeMobileMenuButton");
    CMSM.click(function(event) {
        $("#sideMenu").slideUp(200);
    });

    var slidePieChartWrapperUp = false;

    $('#pieChartButton').click(function(){
        $("#showReport").slideUp(400);
        $("#barChartWrapper").slideUp(400);
        $(".barChartInfoWrapper").hide();
        $("#pieChartWrapper").show();
        $("#pieChartWrapper").slideDown(400);
        var pieContext = document.getElementById('pieChart').getContext('2d');
        var pieChart = new Chart(pieContext).Pie(pieData);

        slidePieChartWrapperUp = true;
    });

    $('#barChartButton').click(function(){
        $("#showReport").slideUp(400);

        if (slidePieChartWrapperUp) {
            $("#pieChartWrapper").slideUp(400);
        }

        $("#pieChartWrapper").hide();

        $("#barChartWrapper").slideDown(400);
        $(".barChartInfoWrapper").show();
        var barContext = document.getElementById('barChart').getContext('2d');
        var barChart = new Chart(barContext).Bar(barData);
    });

    $('#reportButton').click(function(){
        if (slidePieChartWrapperUp) {
            $("#pieChartWrapper").slideUp(400);
        }

        $("#pieChartWrapper").hide();
        $("#barChartWrapper").slideUp(400);
        $(".barChartInfoWrapper").hide();
        $("#showReport").slideDown(400);
    });
});



