/**
 * Created by WangFeng on 2017/1/5.
 */
$('#goBack').click(function () {
    history.go(-1);
});

$('#register').click(function () {
    location.href = '/api/register';
});

$('form').submit(function (ev) {
    ev.preventDefault();
    var data = new FormData(this);
    // console.log(data);
    $.ajax({
        url: '/user/photo',
        data: data,
        contentType: false,//默认为application/x-www-form-urlencoded
        type: 'POST',
        cache: false,
        processData: false,
        success: function (res) {
            if (res.code == 'success') {
                location.href = '/'
            } else {
                $('.modal-body').text(res.message);
                $('.modal').modal('show');
            }
        }
    });
});

