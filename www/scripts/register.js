/**
 * Created by WangFeng on 2017/1/3.
 */
$('#goBack').click(function () {
    history.go(-1);
});

$('form').submit(function (ev) {
    //阻止表单默认提交
    ev.preventDefault();
    var pass = $(':password').map(function () {
        return $(this).val();
    });
    //将表单元素的name属性的值和表单内容序列化为urlencoded编码格式 用于ajax提交
    if (pass[0] == pass[1]) {
        console.log('输入的密码相同,准备提交数据');
        var data = $(this).serialize();
        console.log(data);
        $.post('/user/register', data, function (res)  {
            console.log(res);
            $('.modal-body').text(res.message);
            //on方法在被选元素及子元素添加一个或多个事件处理程序
            //hidden.bs.modal事件->当模态框对用户隐藏
            $('#myModal').modal('show').on('hidden.bs.modal', function () {
                if (res.code == 'success') {
                    location.href = 'signin.html';
                }
            });
        });
    } else {
        $('.modal-body').text('两次输入的密码不一致');
        $('#myModal').modal('show');
    }
});