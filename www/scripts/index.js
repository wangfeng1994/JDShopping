/**
 * Created by WangFeng on 2017/1/4.
 */

var petname = $.cookie('petname');

if (petname) {
    $('#user').find('span').last().text(petname);
} else {
    $('#user').find('span').last().text('登录').end().end().removeAttr('data-toggle').click(function () {
        location.href = 'signin.html';
    });
}

$('#ask').click(function () {
    if (petname) {
        location.href = 'ask.html';
    } else {
        location.href = 'signin.html';
    }
});

$('.navbar .dropdown-menu li').last().click(function () {
    $.get('/user/signout', null, function (res) {
        if (res.code == 'success') {
            location.href = '/';
        }
    })
});

$('.questions').delegate('[question]', 'click', function () {
    $.cookie('question', $(this).attr('question'));
    if (petname) {
        location.href = 'answer.html';
    } else {
        location.href = 'signin.html';
    }
});


// $.getJSON('/questions', null, function (res) {
//     var html = '';
//     for (var i = 0; i < res.data.length; i++) {
//         var q = res.data[i];
//         html += '<div class="media media-child" question="' + new Date(q.time).getTime() + '">';
//         html += '<div class="media-left">';
//         html += '<a>';
//         html += '<img class="media-object" src="/uploads/' + q.petname + '.jpg" onerror="this.src=\'/images/user.png\';">';
//         html += '</a>';
//         html += '</div>';
//         html += '<div class="media-body">';
//         html += '<h4 class="media-heading">' + q.petname;
//         html += '</h4>';
//         html += q.content;
//         html += '<div class="media-footing">';
//         html += new Date(q.time).toLocaleString();
//         html += '</div>';
//         html += '</div>';
//         html += '</div>';
//         if (q.answers) {
//             for (var j = 0; j < q.answers.length; j++) {
//                 var a = q.answers[j];
//                 html += '<div class="media media-child">';
//                 html += '<div class="media-body">';
//                 html += '<h4 class="media-heading">' + a.petname + '</h4>';
//                 html += a.content;
//                 html += '<div class="media-footing">';
//                 html += '</div>';
//                 html += new Date(a.time).toLocaleString();
//                 html += '</div>';
//                 html += '<div class="media-right"> ';
//                 html += '<a>';
//                 html += '<img class ="media-object" src="/uploads/' + a.petname + '.jpg" onerror ="this.src=\'/images/user.png\'">';
//                 html += '</a>';
//                 html += '</div>';
//                 html += '</div>';
//             }
//
//         }
//     }
//     $('.questions').html(html);
// });

window.onload = function(){
    $.getJSON('/questions',null,function(res){

            var html = template('question-answer',res);
            console.log(html);
            $('.questions').html(html)
    });
};


template.helper('dateFormat',function (date){
    //根据日期的字符串生成日期对象
    var time = new Date(date);
    console.log(time);

    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();

    var hour = time.getHours();
    var minute = time.getMinutes();
    var second = time.getSeconds();

    hour = hour < 10? '0'+hour : hour;
    minute = minute<10 ? '0'+minute :minute;
    second = second<10 ? '0'+second :second;

    var str = year + '-' + month + '-' + day + '  ' + hour + ':' + minute + ':' + second;
    console.log(str);
    return str
});

template.helper('dateTime',function (date) {
    var time = new Date(date);
    return time.getTime();
});



// function formDateTime(t) {
//         t = new Date(t);
//     var M = t.getMonth() + 1;
//     var d = t.getDate();
//     var h = t.getHours();
//     var m = t.getMinutes();
//
//     M = M < 10 ? '0' + M : M;
//     d = d < 10 ? '0' + d : d;
//     h = h < 10 ? '0' + h : h;
//     m = m < 10 ? '0' + m : m;
//
//     return t.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m;
// }


