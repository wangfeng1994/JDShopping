/**
 * Created by WangFeng on 2017/1/4.
 */
$('#goBack').click(function () {
    history.go(-1);
});

// var question = $.cookie('question');
// console.log(question + 'qqq');
$('form').submit(function (ev) {
    ev.preventDefault();
    //通过序列化表单来创建对象数组
    var formData = $(this).serializeArray();
    // formData.push({
    //     name: 'question',
    //     value: question
    // });
    console.log(formData);
    $.post('/answer', formData, function (res) {
        $('.modal-body').text(res.message);
        //on方法在被选元素及子元素添加一个或多个事件处理程序
        //hidden.bs.modal事件->当模态框对用户隐藏
        $('#myModal').modal('show').on('hidden.bs.modal', function () {
            if (res.code == 'success') {
                location.href = '/';
            }
        });
    });
});