var expanseDetails = {};
$(document).ready(function() {
    Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");

    if (!Parse.User.current()) {
        location = 'Welcom.html';
    }

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



    $(".userName").html(userName);
    $(".monthlyBudget").html(MBudget);
    $(".leftToSpendToday").html(mobileDBudget);




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


    $("#saveReport").click(function(event){

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
                            myH3.textContent = key + ":" + " " + keyValue[key];

                            var existingItemExpanseDetails = expanseDetails[key];

                            myLi.appendChild(myH3);

                            var myDiv = document.createElement("div");
                            for (var i in existingItemExpanseDetails) {
                                /*for (var i = 0 ; i < existingItemExpanseDetails.length ; i++) {*/
                                var myP = document.createElement("p");
                                myP.textContent = existingItemExpanseDetails[i].subCategory + ' - ' + existingItemExpanseDetails[i].amount + ' - ' + existingItemExpanseDetails[i].date;
                                myDiv.appendChild(myP);
                            }

                            myLi.appendChild(myDiv);



                                $("#reportForm").slideUp(400);

                            $("#showReport").show();
                            $("#Items-List").show();

                            $('#Items-List').append(myLi);
                        }
                    }




                }, error: function (error) {
                    console.log("Query Error:" + error.message)
                }
            });
        })();


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



