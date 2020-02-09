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

    $(".modal").modal();
    // window.onload = init;  
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
        var newtask = $("<li class='listli'>" +
            "<div class='list-item z-depth-3 row'>" +
            "<div class='item-state col m1'>" +
            "<input type='checkbox' id='" + taskList[j].taskId + "'" + (taskList[j].isChoose ? "checked" : "") + " class='choose'/>" +
            "<label for='" + taskList[j].taskId + "'></label>" +
            "</div>" +
            "<div class='item-content col m8'>" + taskList[j].content + "</div>" +
            "<div class='item-time col m2'>" + "<span>" + taskList[j].time + "</span>" + "</div>" +
            "<div class='item-action col m1'>" +
            "<a class='waves-effect waves-light btn action-delete'>删除</a>" +
            "</div>" +
            "</div>" +
            "</li>");
        if (taskList[j].isChoose) {
            donelist.append(newtask);
        }
        else {
            dolist.append(newtask);
        }
    }
    init();

};
var addtask = function (value) {
    // var taskList = [];
    var storage = window.localStorage;
    var tasks = storage.getItem("taskList");
    var taskList = JSON.parse(tasks);
    var temp = taskList.length;
    // var numLi = $("#incomplete").find("li").first();
    // for (var i = 0; i < temp; i++) {
    //     taskList.push({
    //         taskId: i,
    //         isChoose: false,
    //         content: numLi.find(".item-content").text(),
    //         time: numLi.find("span").text()
    //     });
    //     numLi = numLi.next();
    // }
    // storage.setItem("taskList", JSON.stringify(taskList));
    taskList.push({
        taskId: temp,
        isChoose: false,
        content: value,
        time: getMoment()
    })
    storage.setItem("taskList", JSON.stringify(taskList));
    render();

    $("#block").val("");
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
            taskList[i].isChoose = !taskList[i].isChoose;
            break;
        }
    }
    storage.setItem("taskList", JSON.stringify(taskList));
    render();
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

var drawCircle = function (canvasId, data_arr, color_arr, text_arr) {
    var c = document.getElementById(canvasId);
    var ctx = c.getContext("2d");

    var radius = c.height / 2 - 20; //半径  
    var ox = radius + 20, oy = radius + 20; //圆心  

    var width = 30, height = 10; //图例宽和高  
    var posX = ox * 2 + 20, posY = 30;   //  
    var textX = posX + width + 5, textY = posY + 10;

    var startAngle = 0; //起始弧度  
    var endAngle = 0;   //结束弧度  
    for (var i = 0; i < data_arr.length; i++) {
        //绘制饼图  
        endAngle = endAngle + data_arr[i] * Math.PI * 2; //结束弧度  
        ctx.fillStyle = color_arr[i];
        ctx.beginPath();
        ctx.moveTo(ox, oy); //移动到到圆心  
        ctx.arc(ox, oy, radius, startAngle, endAngle, false);
        ctx.closePath();
        ctx.fill();
        startAngle = endAngle; //设置起始弧度  

        //绘制比例图及文字  
        ctx.fillStyle = color_arr[i];
        ctx.fillRect(posX, posY + 20 * i, width, height);
        ctx.moveTo(posX, posY + 20 * i);
        ctx.font = 'bold 12px 微软雅黑';    //斜体 30像素 微软雅黑字体  
        ctx.fillStyle = color_arr[i];   
        var percent = text_arr[i] + "：" + 100 * data_arr[i] + "%";
        ctx.fillText(percent, textX, textY + 20 * i);
    }
}

var init=function() {
    //绘制饼图  
    //比例数据和颜色  
    var storage = window.localStorage;
    var tasks = storage.getItem("taskList");
    var taskList = JSON.parse(tasks);
    var compete_task=0;
    var incompete_task=0;
    for(var i=0;i<taskList.length;i++) {
        if(taskList[i].isChoose){
            compete_task ++;
        }
        else{
            incompete_task ++;
        }
    }
    var add=incompete_task+compete_task;
    var data_arr = [incompete_task/add,compete_task/add];
    var color_arr = ["#81d4fa", "#9575cd"];
    var text_arr = ["未完成任务", "已完成任务"];

    drawCircle("canvas_circle", data_arr, color_arr, text_arr);
}
