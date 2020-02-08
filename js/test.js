$(function () {
    render();
    $("#input-btn").on("click", function () {
        addtask($("#block").val());
    });

    $("#list").on("click", ".action-delete", function () {
        deletetask(this);
    });

    $("#done-list").on("click", ".action-delete", function () {
        deletetask(this);
    });

    $("#list").on("click", ".choose", function () {
        completetask(this);
    });

    $("#done-list").on("click", ".choose", function () {
        completetask(this);
    });


    $(".showlist").on("click", function () {
        if ($(this).attr("value") === "1") {
            $("#complete").css("display", "none");
            $(this).attr("value", "0");
            $(this).text("显示已完成任务");
        }
        else {
            $("#complete").css("display", "block");
            $(this).text("隐藏已完成任务");
            $(this).attr("value", "1");
        }
    });
});

var render = function () {
    var storage = window.localStorage;
    var tasks = storage.getItem("taskList");
    var taskList = JSON.parse(tasks);
    console.log(taskList);
    var dolist = $("#list ul");
    var donelist = $("#done-list ul");
    dolist.find("li").remove();
    donelist.find("li").remove();
    for (var j = 0; j < taskList.length; j++) {
        if (taskList[j].isChoose === "false") {
            var newtask = $("<li class='listli'>" +
            "<div class='list-item z-depth-3 row'>" +
            "<div class='item-state col m1'>" +
            "<input type='checkbox' id='" + taskList[j].taskId + "' class='choose'/>" +
            "<label for='" + taskList[j].taskId + "'></label>" +
            "</div>" +
            "<div class='item-content col m8'>" + taskList[j].content + "</div>" +
            "<div class='item-time col m2'>" + "<span>" + taskList[j].time + "</span>" + "</div>" +
            "<div class='item-action col m1'>" +
            "<a class='waves-effect waves-light btn action-delete'>删除</a>" +
            "</div>" +
            "</div>" +
            "</li>");
            dolist.append(newtask);
        }
        else if(taskList[j].isChoose === "true") {
            var newtask = $("<li class='listli'>" +
            "<div class='list-item z-depth-3 row'>" +
            "<div class='item-state col m1'>" +
            "<input type='checkbox' id='" + taskList[j].taskId + "' checked='checked' class='choose'/>" +
            "<label for='" + taskList[j].taskId + "'></label>" +
            "</div>" +
            "<div class='item-content col m8'>" + taskList[j].content + "</div>" +
            "<div class='item-time col m2'>" + "<span>" + taskList[j].time + "</span>" + "</div>" +
            "<div class='item-action col m1'>" +
            "<a class='waves-effect waves-light btn action-delete'>删除</a>" +
            "</div>" +
            "</div>" +
            "</li>");
            donelist.append(newtask);
        }
    }
};
var addtask = function (value) {
    var temp = $("#list ul li").length;
    var taskList = [];
    var storage = window.localStorage;
    var numLi = $("#incomplete").find("li").first();
    for (var i = 0; i < temp; i++) {
        taskList.push({
            taskId: i,
            isChoose: 'false',
            content: numLi.find(".item-content").text(),
            time: numLi.find("span").text()
        });
        numLi = numLi.next();
    }
    storage.setItem("taskList", JSON.stringify(taskList));
    taskList.push({
        taskId: temp,
        isChoose: 'false',
        content: value,
        time: getMoment()
    })
    storage.setItem("taskList", JSON.stringify(taskList));
    render();

    $("#block").val("");
};

var getMoment = function () {
    var now = new Date();

    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var currentM = year + "." + month + "." + day + " " + hour + ":" + minute;
    return currentM;
};

var deletetask = function (value) {
    var deleteBtn = $(value);
    var deleteLi = deleteBtn.parent().parent().parent();
    var deleteNum = deleteLi.find("input").attr("id");
    // console.log(deleteNum);
    var storage = window.localStorage;
    var tasks = storage.getItem("taskList");
    var taskList = JSON.parse(tasks);
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].taskId == deleteNum) {
            taskList.splice(i, 1);
            break;
        }
    }
    storage.setItem("taskList", JSON.stringify(taskList));
    render();
};

var completetask = function (value) {
    // var completeHolder=$("#complete");
    // var incompleteHolder=$("#incomplete");
    // var checkBtn=$(value);
    // var removeLi=checkBtn.parent().parent().parent();
    // var togUl=removeLi.parent();
    // var cloneLi=removeLi.clone();

    // if(togUl.attr("id")==="incomplete"){
    //     completeHolder.append(cloneLi);
    // }
    // else if(togUl.attr("id")==="complete"){
    //     incompleteHolder.append(cloneLi);
    // }
    // removeLi.remove();

    var checkBtn = $(value);
    var checkLi = checkBtn.parent().parent().parent();
    var checkNum = checkLi.find("input").attr("id");
    var storage = window.localStorage;
    var tasks = storage.getItem("taskList");
    var taskList = JSON.parse(tasks);
    for (var i = 0; i < taskList.length; i++) {
        if (taskList[i].taskId == checkNum) {
            if (taskList[i].isChoose === "false") {
                taskList[i].isChoose = "true";
            }
            else if (taskList[i].isChoose === "true") {
                taskList[i].isChoose = "false";
            }
            break;
        }
    }
    storage.setItem("taskList", JSON.stringify(taskList));
        render();
};
