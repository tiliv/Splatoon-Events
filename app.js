angular.module('splatoontracker', [])

.controller("MainCtrl", ["$http", function($http){
    var vm = this;

    this.eventList = [];

    var linePattern = /.+?\n/g;
    var itemPattern = /(")?([^,]*?)(\1)?[,\n]/g;
    var ignoredChars = /(\r)|(^\s+)|(\s+$)/;

    function retainData(data) {
        // Data is in CSV format for easier web editing; parse it to something JSON-y
        vm.eventList.length = 0;

        var fieldOrder = ["name", "start", "end", "description"];

        var lineMatch;
        var itemMatch;
        var item;
        for (var i = 0; lineMatch = linePattern.exec(data); i++) {
            if (i === 0) {
                continue;  // first row is just the CSV headers
            }
            item = {};
            for (var itemIndex = 0; itemMatch = itemPattern.exec(lineMatch[0]); itemIndex++) {
                item[fieldOrder[itemIndex]] = itemMatch[2];
            }
            vm.eventList.push(item);
        }
    }

    function init(){
        $http.get('./events.csv').then(function(response){
            if (response.status == 200) {
                retainData(response.data);
            }
        })
    }

    init();
}])
