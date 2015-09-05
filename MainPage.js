Parse.initialize("4Yh0GNbCzeWhZximIe9eu2opX686FSZiyytd156K", "3fIASb832eF2WdwfHpAJIo0hyIxAasnru1adn1og");
Parse.User.enableRevocableSession();
$(document).ready(function() {

    $("#sideMenu").hide();
    var expanseDetails = {};

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

                for (var i in results) {
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

                        var existingItemExpanseDetails = expanseDetails[key];

                        myLi.appendChild(myH3);

                        var myDiv = document.createElement("div");
                        for (var i in existingItemExpanseDetails){

                            var myP = document.createElement("p");
                            myP.textContent = existingItemExpanseDetails[i].subCategory + ' - ' + existingItemExpanseDetails[i].amount + ' - ' + existingItemExpanseDetails[i].date;
                            document.createElement("button");
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




    $("#logout").click(function(event){
        Parse.User.logOut();
        location="Welcom.html";
    });




    $("#userlogout").click(function(event){
        Parse.User.logOut();
        location="Welcom.html";
    });
    var MSM = $("#mobileMenuButton");
        MSM.click(function(event) {
            $("#sideMenu").toggle();
            $("#mobileMenuButton").slideToggle( "slow" );

    });


});

