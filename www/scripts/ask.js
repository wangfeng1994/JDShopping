/**
 * Created by WangFeng on 2017/1/4.
 */
$('form').submit(function (ev) {
    ev.preventDefault();
    var formData = $(this).serialize();
    $.post('/ask', formData, function (res) {
        $('.modal-body').text(res.message);
        $('#myModal').modal('show').on('hidden.bs.modal', function () {
            if (res.code == 'success') {
                location.href = '/';
            }
        });
    });
});
