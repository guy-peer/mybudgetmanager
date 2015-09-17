$(document).ready(function() {

    var expanseDetails = {};

    /*
     * Object to populate the data for the bar graph
     */
    var barData = {
        labels:[],
        datasets: []
    };

    /*
     * Object to populate the data for the pie graph
     */
    var pieData = [];

    $("#showReport").hide();
    $("#Items-List").hide();

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

    $("#newReport").click(function(event){
        location.reload();
    });

    /*
     * Retrieve the report data for the selected dates
     */
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
                            singleExpanseDetail['date'] = utils.formatDate(date);

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

    /*
     * Populate the reports details after the data is loaded
     */
    $(document).on('dataLoaded', function(){
        createItemList();
        fillPieChartData();
        fillBarChartData();
    });

    /*
     * Create the textual report
     */
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

    /*
     * Fill the pie chart data
     */
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
                color: utils.getRandomColor()
            });
        }
    }

    /*
     * Fill the bar chart data
     */
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
            dailyBudgetForBarChart.data.push(commonObj.dailyBudget);
            amountSpentForBarChart.data.push(amountSpentPerDay[date]);
        }

        barData.datasets.push(dailyBudgetForBarChart);
        barData.datasets.push(amountSpentForBarChart);
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

    /*
     * Pie chart button click event
     */
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

    /*
     * Bar chart button click event
     */
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

    /*
     * Textual report button click event
     */
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



