/**
 * Created by frostpig on 2018/1/22.
 */
function exspand(event) {
    var target = $(event.target);
    var nodeId = target.closest('li.list-group-item').attr('data-nodeid');
    console.log("id：" + nodeId);

}


function getData() {
    //初始化文件数据
    $.ajax({
        type:"POST",
        url:"/trace/span/getData",
        data:{t_id: '$!{traceId}', start_time: '$!{startTime}', end_time: '$!{endTime}'},

        success:function (data) {
            var result = data.result;
            var parent = "";
            //存储将要作为父节点的id
            var  ids= [];
            //存储根节点id
            var root=[];
            $("#traceList").html("");
            for (var i = 0 ;i < result.length; i++){
                //判断是父节点、子节点
                if (result[i].__parentId == null){
                    parent += "<div class='accordion-group' id='root-"+ result[i].id +"'>"

                        +  "<div class='accordion-heading' onclick=\"getNode('"+result[i].tId+"','"+result[i].id+"','"+result[i].startTime+"',this)\">"
                        +       "<span class='accordion-toggle' >"
                        +       "<i class='icon-align-justify'> </i> "+ result[i].name +""
                        +  "</span>"
                        +  "</div>"
                        +  "<div class='accordion-body collapse in'>"
                        +       "<div class='accordion-inner'>"
                        +            "<table id='detail' class='table table-bordered table-striped table-condensed'>"
                        +                 "<tbody>"
                        +                    "<td>卧室</td>"
                        +                    "<td>客厅</td>"
                        +                 "</tbody>"
                        +           "</table>"
                        +       "</div>"
                        +   "</div>"
                        + "</div>";

                    result.splice(i,1);    //移除根节点
                    root.push(result[i].id);
                }else {
                    var status = $.inArray(result[i].__parentId,ids);
                    if (status == -1)
                        ids.push(result[i].__parentId);
                }

            }
            $(".accordion").append(parent);
            var children ="";
            console.log("子节点："+ result);

            //剩余的是子节点
            for ( var i = 0 ;i < result.length; i++){
                children +="<div class='accordion-group'>"
                    +   "<div class='accordion-heading'>"
                    +      "<span class='accordion-toggle' >"
                    +        "&nbsp;&nbsp;&nbsp;&nbsp;<i class='icon-chevron-right'></i>"+ result[i].name +""
                    +       "</span>"
                    +   "</div>"
                    +   "<div class='accordion-body collapse in'>"
                    +       "<div class='accordion-inner'>"
                    +           "<table id='detail' class='table table-bordered table-striped table-condensed'>"
                    +            "<tbody>"
                    +             "</tbody>"
                    +           "</table>"
                    +       "</div>"
                    +   "</div>"
                    +"</div>";

                //判断是谁的子节点
                $("div[id^=root-]").each(function () {
                    var x = $(this).attr("id");
                    var id = x.replace("root-", ""); //通道名
                });

                var statusRoot = $.inArray(result[i].__parentId,root); //父节点是否是根节点
                var statusChild = $.inArray(result[i].__parentId,ids); //父节点是否是除根节点之外的其余节点
                if (statusRoot != -1) //如果存在,判断是根节点还是其余节点
                    $("#root-"+result[i].__parentId+"").append(children);
                else
                    $("#"+result[i].__parentId+"").append(children);
            }

        }
    });

}