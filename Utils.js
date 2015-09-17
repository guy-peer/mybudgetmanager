/**
 * Created by Eliran on 15/09/2015.
 */
var utilsObject = (function() {

    /*
     * Format a date to a presentable date
     */
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
    });

    /*
     * Generate a random color
     */
    this.getRandomColor = (function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    });
});

window.utils = new utilsObject();