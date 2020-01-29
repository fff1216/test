$(function () {
    $("#input-btn").on("click", function () {
        addtask($("#block").val());
    });

    $("#list").on("click",".action-delete",function(){
        deletetask(this);
    });

    $("#done-list").on("click",".action-delete",function(){
        deletetask(this);
    });

    $("#list").on("click",".choose",function(){
        completetask(this);
    });

    $("#done-list").on("click",".choose",function(){
        completetask(this);
    });

    var comClone=$("#complete").clone();
    $(".showlist").on("click",function(){
        if($(this).attr("value")==="1"){
            $("#complete").detach();
            $(this).attr("value","0");
            $(this).text("显示已完成任务");
        }
        else{
            $("#done-list").append(comClone);
            $(this).text("隐藏已完成任务");
            $(this).attr("value","1");
        }
    });
 
});

var addtask = function (value) {
    var temp=$("#list ul li").length;
    var dolist = $("#list ul");
    var newtask = $("<li class='listli'>" +
        "<div class='list-item z-depth-3'>" +
            "<div class='item-state col m1'>" +
                "<input type='checkbox' id='" + temp + "' class='choose'/>" +
                "<label for='" + temp + "'></label>" +
            "</div>" +
            "<div class='item-content col m8'>" + value + "</div>" +
            "<div class='item-time col m2'>" + "<span>" + getMoment() + "</span>" +"</div>" +
            "<div class='item-action col m1'>" +
                "<a class='waves-effect waves-light btn action-delete'>删除</a>" +
            "</div>" +
        "</div>" +
        "</li>");
    dolist.append(newtask);
    $("#block").val("") ;
};

var getMoment = function() {
    var now = new Date();
    
    var year = now.getFullYear();
    var month=now.getMonth() + 1;
    var day = now.getDate();
    var hour=now.getHours();
    var minute=now.getMinutes();
    var currentM=year+"."+month+"."+day+" "+hour+":"+minute;
    return currentM;
};

var deletetask=function(value){
    var deleteBtn=$(value);
    deleteLi=deleteBtn.parent().parent().parent();
    deleteLi.remove();
};

var completetask=function(value){
    var completeHolder=$("#complete");
    var incompleteHolder=$("#incomplete");
    var checkBtn=$(value);
    var removeLi=checkBtn.parent().parent().parent();
    var togUl=removeLi.parent();
    var cloneLi=removeLi.clone();

    if(togUl.attr("id")==="incomplete"){
        // checkBtn.checked=true;
        // checkBtn.disabled="disabled";
        completeHolder.append(cloneLi);
    }
    else if(togUl.attr("id")==="complete"){
        incompleteHolder.append(cloneLi);
    }
    removeLi.remove();
};
