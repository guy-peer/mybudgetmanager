$(document).ready(function() {

    var categoryToSubCategory = {};

    $(".addItemContainer").hide();

    $("#Ready").click(function () {
        $("#Ready").slideUp(400);
        $("#Custom").slideUp(400);
        $("#addReadyItemContainer").slideDown(500);
    });

    $("#Custom").click(function () {
        $("#Ready").slideUp(400);
        $("#Custom").slideUp(400);
        $("#addCustomItemContainer").slideDown(500);
    });

    $(".cancelButton").click(function () {
        $(".addItemContainer").slideUp(400);
        $("#Ready").slideDown(500);
        $("#Custom").slideDown(500);
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

            $(".saveButton").click(function () {

                var prefix =  $(this).closest('div').attr('id') == 'readyButtons' ? 'ready' : 'custom';

                var Amount = $('#' + prefix + 'Amount').val();

                var insertCostItem = true;

                if (!isAmountInDailyBudget(Amount)) {
                    insertCostItem = confirm("You are about to go over your daily budget. Continue anyway?")
                }

                if (!isAmountInInMonthlyBudget(Amount)) {
                    insertCostItem = confirm("You are about to go over your monthly budget. Continue anyway?")
                }

                if (insertCostItem) {
                    var Category = $('#' + prefix + 'Category').val();
                    var SubCategories = $('#' + prefix + 'SubCategories').val();
                    var user = Parse.User.current();
                    var newItem = new Item();
                    newItem.set("Category", Category);
                    newItem.set("SubCategory", SubCategories);
                    newItem.set("Amount", Amount);
                    newItem.set("user", user);
                    newItem.save({
                        success: function () {
                            document.location = "MainPage.html";
                        }
                    });
                }
            });

            $(document).trigger('dataLoaded');
        }
    });

    function isAmountInDailyBudget(amount) {
        if (commonObj.dailyBudget - commonObj.totalAmountSpentToday - amount >= 0) {
            return true;
        }
        return false;
    }

    function isAmountInInMonthlyBudget(amount) {
        if (commonObj.monthlyBudget - commonObj.totalAmountSpentThisMonth - amount >= 0) {
            return true;
        }
        return false;
    }

    $(document).on("dataLoaded", function() {

        var keys = Object.keys(categoryToSubCategory);

        for (var i = 0 ; i < keys.length ; i++){
            var opt = document.createElement('option');
            opt.value = keys[i];
            opt.textContent = keys[i];
            $("#readyCategory").append(opt);
        }

        $("#readyCategory").on('change', function () {
            list(categoryToSubCategory[$(this).val()])
        })
    });

    function list(array_list) {
        $("#readySubCategories").html("");
        var pleaseSelectOption = document.createElement('option');
        pleaseSelectOption.value = '';
        pleaseSelectOption.textContent = '-- Please Select --';
        $("#readySubCategories").append(pleaseSelectOption);

        $(array_list).each(function (i) {
            var opt = document.createElement('option');
            opt.value = this.toString();
            opt.textContent = this.toString();
            $("#readySubCategories").append(opt);

        });
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












