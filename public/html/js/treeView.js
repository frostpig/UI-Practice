/**
 * Created by frostpig on 2018/1/22.
 */
function exspand(event) {
    var target = $(event.target);
    var nodeId = target.closest('li.list-group-item').attr('data-nodeid');
    console.log("id：" + nodeId);

}