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

    $('.modal').modal();
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
    showGraph();

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

var showGraph=function() {
    var myChart = echarts.init(document.getElementById('main'));

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
    option = {
        backgroundColor: '#2c343c',
    
        title: {
            text: '任务完成率饼状图',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
    
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
    
        visualMap: {
            show: false,
            min: 0,
            max: 8,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                    {value: compete_task, name: '已完成任务'},
                    {value: incompete_task, name: '未完成任务'},
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    color: 'rgba(255, 255, 255, 0.3)'
                },
                labelLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                },
                itemStyle: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
    
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
};