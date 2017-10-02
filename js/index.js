angular.module("myApp", []).controller("myCtrl", function ($scope) {
    $scope.model = { "todos": [] };
    var dbSize = 5 * 1024 * 1024; // 5MB
    $scope.webdb = {};

    $scope.addTodo = function () {
        //$scope.model.todos.push({ "name": $scope.todo_to_add })

        var db = $scope.webdb.db;
        db.transaction(function (tx) {
            var dToday = new Date();
            tx.executeSql("INSERT INTO todo(ID, todo, added_on) VALUES(?, ?, ?) ",
                [uuid.v4(), $scope.todo_to_add, dToday],
                function () {
                    $scope.todo_to_add = "";
                    $scope.readTodos();
                },
                function () {
                    console.log("failed");
                }
            );
        });

    }
    $scope.readTodos = function () {
        var db = $scope.webdb.db;
        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM todo", [],
                function (tx, rs) {
                    $scope.model.todos = [];
                    for (var i = 0; i < rs.rows.length; i++) {
                        $scope.model.todos.push({
                            "name": rs.rows.item(i).todo,
                            "ID": rs.rows.item(i).ID
                        });
                    }
                    $scope.$apply();
                },
                function () {
                    console.log("failed");
                });
        });
    }
    $scope.deleteTodo = function (sId) {
        var db = $scope.webdb.db;
        db.transaction(function (tx) {
            tx.executeSql("DELETE FROM todo WHERE ID = ?", [sId],
                function () {
                    console.log("deleted");
                    $scope.readTodos();
                },
                function () {
                    console.log("failed to delete");
                }
            );
        });
    }
    $scope.webdb.db = openDatabase("Todo", "1", "Todo manager", dbSize);
    var db = $scope.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS " +
            "todo(ID TEXT PRIMARY KEY, todo TEXT, added_on DATETIME, finished_on DATETIME)", [],
            function () {
                console.log("success");
                $scope.readTodos();
            },
            function () { console.log("failure") }
        );
    });

});

