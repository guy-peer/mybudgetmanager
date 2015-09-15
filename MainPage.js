$(document).ready(function() {

    var expanseDetails = {};

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