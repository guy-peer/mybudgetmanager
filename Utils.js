/**
 * Created by Eliran on 15/09/2015.
 */
var utilsObject = (function() {

    this.formatDate = (function (date) {

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
    })
});

window.utils = new utilsObject();