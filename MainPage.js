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

                    var id = results[i].id;
                    var category = results[i].get("Category");
                    var subCategory = results[i].get("SubCategory");
                    var amount = Number(results[i].get("Amount"));
                    var date = results[i]["createdAt"];

                    if (category && amount && !isNaN(amount) && subCategory && date) {
                        var singleExpanseDetail = {};
                        singleExpanseDetail['id'] = id;
                        singleExpanseDetail['subCategory'] = subCategory;
                        singleExpanseDetail['amount'] = amount;
                        singleExpanseDetail['date'] = utils.formatDate(date);

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

                            var pHolder = document.createElement("div");
                            pHolder.id = existingItemExpanseDetails[i].id;

                            var myP = document.createElement("p");
                            myP.classList.add('costItemText');
                            myP.textContent = existingItemExpanseDetails[i].subCategory + ' - ' + existingItemExpanseDetails[i].amount + ' - ' + existingItemExpanseDetails[i].date;


                            pHolder.appendChild(myP);

                            var editCostItem = document.createElement("span");
                            editCostItem.classList.add('changeCostItem');
                            editCostItem.classList.add('editCostItem');
                            editCostItem.textContent = 'Edit';

                            var deleteCostItem = document.createElement("span");
                            deleteCostItem.classList.add('changeCostItem');
                            deleteCostItem.classList.add('deleteCostItem');
                            deleteCostItem.textContent = 'Delete';

                            pHolder.appendChild(editCostItem);
                            pHolder.appendChild(deleteCostItem);

                            myDiv.appendChild(pHolder);
                        }

                        myLi.appendChild(myDiv);

                        $('#Items-List').append(myLi);
                    }
                }

                bindEditAndDeleteEvents();

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

    function bindEditAndDeleteEvents() {
        $(".editCostItem").bind("click", createEditCostItemDiv)
        $(".deleteCostItem").bind("click", deleteCostItem)
    }

    function createEditCostItemDiv() {
        var editCostItemDiv = document.createElement("div");
        editCostItemDiv.id = $(this).closest('div').attr('id');

        var editCostItemInput = document.createElement("input");
        editCostItemInput.id = 'editCostItemValue';
        editCostItemInput.type = 'text';
        editCostItemInput.placeholder = 'New Amount';
        editCostItemInput.setAttribute('autofocus', 'autofocus');

        editCostItemDiv.appendChild(editCostItemInput);

        var editCostItemInputButton = document.createElement("span");
        editCostItemInputButton.id = 'editCostItemButton';
        editCostItemInputButton.classList.add('changeCostItem');
        editCostItemInputButton.textContent = 'Edit';

        editCostItemDiv.appendChild(editCostItemInputButton);

        $('#' + editCostItemDiv.id).replaceWith(editCostItemDiv);

        $('#editCostItemButton').bind('click', editCostItem);
    }

    function editCostItem() {
        var id = $(this).closest('div').attr('id');
        var CostItem = Parse.Object.extend("Cost_Items");
        var costItem = new CostItem();
        costItem.id = id;

        var newAmount = $('#editCostItemValue').val();

        if (isNaN(newAmount) || Number(newAmount) <= 0) {
            alert('Please enter a valid number')
        }
        else {
            costItem.set("Amount", newAmount);

            costItem.save(null, {
                success: function(costItem) {
                    location.reload();
                },
                error: function(costItem, error) {
                    alert('Failed updating item');
                    location.reload();
                }
            });
        }
    }

    function deleteCostItem() {

        var id = $(this).closest('div').attr('id');
        var costItem = Parse.Object.extend("Cost_Items");
        var query = new Parse.Query(costItem);

        query.get(id, {
            success: function(myObj) {
                // The object was retrieved successfully.
                myObj.destroy({});
                location.reload();
            },
            error: function(object, error) {
                alert('Failed deleting item')
            }
        });
    }
});