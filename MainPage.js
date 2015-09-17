$(document).ready(function() {

    var expanseDetails = {};

    /*
     * Get all the categories and cost items from Parse and populate the html
     */
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

                var categoryToAmount = {};

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

                        /*
                         * If the category was already retrieved, add the amount, else, set the new category with the amount
                         */
                        if (categoryToAmount[category]) {
                            categoryToAmount[category] += amount;
                        }
                        else {
                            categoryToAmount[category] = amount;
                        }
                    }
                }

                /*
                 * Populate the html with all the categories, cost items and amounts
                 */
                for (var category in categoryToAmount) {
                    if (categoryToAmount.hasOwnProperty(category)) {

                        var categoryListItem = document.createElement("li");
                        categoryListItem.id = category;
                        categoryListItem.className = 'existing_items';

                        var categoryHeader = document.createElement("h3");
                        categoryHeader.textContent = category +":"+ " "+ categoryToAmount[category];
                        var editButton = document.createElement("button");
                        editButton.textContent = "Edit";
                        var existingItemExpanseDetails = expanseDetails[category];


                        categoryListItem.appendChild(categoryHeader);

                        var expanseDetailsWrapper = document.createElement("div");
                        for (var i in existingItemExpanseDetails){

                            var costItemWrapper = document.createElement("div");
                            costItemWrapper.id = existingItemExpanseDetails[i].id;

                            var costItemText = document.createElement("p");
                            costItemText.classList.add('costItemText');
                            costItemText.textContent = existingItemExpanseDetails[i].subCategory + ' - ' + existingItemExpanseDetails[i].amount + ' - ' + existingItemExpanseDetails[i].date;

                            costItemWrapper.appendChild(costItemText);

                            var editCostItem = document.createElement("span");
                            editCostItem.classList.add('changeCostItem');
                            editCostItem.classList.add('editCostItem');
                            editCostItem.textContent = 'Edit';

                            var deleteCostItem = document.createElement("span");
                            deleteCostItem.classList.add('changeCostItem');
                            deleteCostItem.classList.add('deleteCostItem');
                            deleteCostItem.textContent = 'Delete';

                            costItemWrapper.appendChild(editCostItem);
                            costItemWrapper.appendChild(deleteCostItem);

                            expanseDetailsWrapper.appendChild(costItemWrapper);
                        }

                        categoryListItem.appendChild(expanseDetailsWrapper);

                        $('#Items-List').append(categoryListItem);
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

    var MSM = $("#mobileMenuButton");

        MSM.click(function(event) {
            $("#sideMenu").slideDown(400);
    });

    var CMSM = $("#closeMobileMenuButton");

    CMSM.click(function(event) {
        $("#sideMenu").slideUp(200);
    });

    /*
     * Add click events for the dynamically generated edit and delete buttons
     */
    function bindEditAndDeleteEvents() {
        $(".editCostItem").bind("click", createEditCostItemDiv)
        $(".deleteCostItem").bind("click", deleteCostItem)
    }

    /*
     * Create the "Edit cost item div", and replace the "Cost item div" with it
     */
    function createEditCostItemDiv() {
        var editCostItemDiv = document.createElement("div");
        editCostItemDiv.id = $(this).closest('div').attr('id');

        var editCostItemInput = document.createElement("input");
        editCostItemInput.classList.add('editCostItemValue');
        editCostItemInput.type = 'text';
        editCostItemInput.placeholder = 'New Amount';
        editCostItemInput.setAttribute('autofocus', 'autofocus');

        editCostItemDiv.appendChild(editCostItemInput);

        var editCostItemInputButton = document.createElement("span");
        editCostItemInputButton.classList.add('editCostItemButton');
        editCostItemInputButton.classList.add('changeCostItem');
        editCostItemInputButton.textContent = 'Edit';

        editCostItemDiv.appendChild(editCostItemInputButton);

        $('#' + editCostItemDiv.id).replaceWith(editCostItemDiv);

        $('.editCostItemButton').bind('click', editCostItem);
    }

    /*
     * Edit cost item
     */
    function editCostItem() {
        var id = $(this).closest('div').attr('id');
        var CostItem = Parse.Object.extend("Cost_Items");
        var costItem = new CostItem();
        costItem.id = id;

        var newAmount = $('#' + id + ' .editCostItemValue').val();

        if (isNaN(newAmount) || Number(newAmount) <= 0) {
            alert('Please enter a valid number')
        }
        else {

            var editCostItem = true;

            if (!commonObj.isAmountInDailyBudget(newAmount)) {
                editCostItem = confirm("You are about to go over your daily budget. Continue anyway?")
            }

            if (!commonObj.isAmountInInMonthlyBudget(newAmount)) {
                editCostItem = confirm("You are about to go over your monthly budget. Continue anyway?")
            }

            if (editCostItem) {
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
    }

    /*
     * Delete cost item
     */
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