/**
 * Created by WangFeng on 2017/1/3.
 */
const express = require('express');
//解析body
const bodyParser = require('body-parser');
//解析cookie
const cookieParser = require('cookie-parser');
//解析上传文件multer是中间件用来处理http提交的Multipart/form-data,也就是文件上传
const multer = require('multer');
const fs = require('fs');
const template = require('art-template');
const app = express();

template.config('cache', false);
app.engine('.html', template.__express);
app.set('view engine', 'html');
//destination用于设置文件的存储目录 uploads会自动创建
const storage = multer.diskStorage({
    destination: 'www/uploads',
    //用于设置文件名
    filename: function (req, file, cb) {
        console.log(req + '666');
        console.log(file.originalname);
        console.log(cb);
        var petname = req.cookies.petname;
        console.log(petname);
        cb(null, `${petname}.jpg`);
    }
});
//添加配置文件到multer对象
const uploads = multer({storage: storage});
app.use(express.static('www'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));


/**************/
//A文件中导入B文件的时候 路径的书写:
//相对路径:相对于A文件的路径
//绝对路径:以/开头 从网站的根目录下寻找文件
app.get('/api/signin', function (req, res) {
    //渲染views文件夹下的signin.html文件 然后返回给客户端
    res.render('signin', {
        title: '登录',
        isLogin: true,
        name: 'signin'
    });
});
/***************/

app.get('/api/register', function (req, res) {
    res.render('register', {
        title: '注册',
        isLogin: false,
        name: 'register'
    });
});


function sign(req, res, next) {
    function send(code, message, data) {
        res.status(200).json({code, message, data});
    }

    if (req.cookies.petname) {
        //如果有密码 继续往下执行
        next();
    } else {
        if (req.xhr) {
            //req.xhr 是通过请求头中的x-request判断是否是Ajax请求 Ajax请求默认带有这个请求头
            send(res, 'sign error', '从星登录');
        } else {
            //在服务端控制浏览器页面的跳转
            //redirect 重定向
            res.redirect('/api/signin');
        }
    }
}
app.get('/api/ask', sign, function (req, res) {
    res.render('ask', {
        title: '提问',
        isLogin: false,
        name: 'ask'
    });
});

app.get('/api/answer/:question', sign, function (req, res) {
    res.render('answer', {
        title: '回答',
        isLogin: false,
        isFeel: true,
        name: 'answer',
        question: req.params.question
    });
});

app.get('/api/user', function (req, res) {
    res.render('user', {
        title: '个人资料',
        isLogin: false,
        name: 'user'
    });
});

template.helper('formTime', function (t) {
    t = new Date(t);
    return t.getTime()
});
template.helper('ms', function (t) {
    t = new Date(t);
    var M = t.getMonth() + 1;
    var d = t.getDate();
    var h = t.getHours();
    var m = t.getMinutes();
    var s = t.getSeconds();

    M = M < 10 ? '0' + M : M;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    s = s < 10 ? '0' + s : s;
    m = m < 10 ? '0' + m : m;

    return t.getFullYear() + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s + ' '
});


app.get('/', function (req, res) {
    // function send(code,message,data){
    //     res.status(200).json({code,message,data})
    // }

    function readFile(i, files, questions, complete) {
        if (i < files.length) {

            fs.readFile(`questions/${files[i]}`, (err, data) => {
                if (!err) {
                    questions.push(JSON.parse(data))
                }
                readFile(++i, files, questions, complete)

                // i++ 先比较在 自增      ++i 先自增 在比较
            })
        }
        else {
            complete()
        }
    }

//     path - 文件路径。
//    callback - 回调函数，回调函数带有两个参数err, files，
//     err 为错误信息，files 为 目录下的文件数组列表
    fs.readdir('questions', (err, files) => {

        if (err) {
            // send('file err','抱歉系统错误')
        }
        else {
            files = files.reverse();
            var questions = [];
            readFile(0, files, questions, function () {
                console.log(questions);
                // send('success','读取数据成功',questions)
                res.render('index', {
                    code: 'success',
                    message: '读取数据成功',
                    datas: questions,
                    title: '问答系统',
                    user: req.cookies.petname
                })
            })
        }
    })
});

/****************注册********************/
app.post('/user/register', function (req, res) {
    //获取主机的ip地址
    req.body.ip = req.ip;
    req.body.time = new Date();
    console.log('ffff');

    //测试某个路径下的文件是否存在

    function send(code, message) {
        res.status(200).json({code, message});
    }

    function saveFile() {
        //js中新增字符串替换``
        //var fileName = 'users/'+req.body.petname +'.txt';
        var fileName = `users/${req.body.petname}.txt`;
        fs.exists(fileName, function (exists) {
            if (exists) {
                send('register', '用户名已经注册过了');
            } else {
                fs.appendFile(fileName, JSON.stringify(req.body), function (error) {
                    if (error) {
                        send('file error', '抱歉,系统错误');
                    } else {
                        send('success', '恭喜,注册成功');
                    }
                });
            }
        });
    }

    fs.exists('users', function (exists) {
        //回調函數包含一个参数 true为文件存在 否则不存在
        if (exists) {
            saveFile();
        }
        else {
            fs.mkdir('users', function (err) {
                if (err) {
                    send('file error', '抱歉,系统错误');
                }
                else {
                    saveFile();
                }
            });
        }
    });
});
/******************end*******************/

/****************登录*****************/

app.post('/user/signin', function (req, res) {
    var fileName = `users/${req.body.petname}.txt`;

    function send(code, message) {
        res.status(200).json({code, message});
    }

    fs.exists(fileName, function (exists) {
        if (exists) {
            //readFile读取文件:参数一:为文件的路径
            //参数二为回调函数 包含参数2个参数 第一个为error 第二个为读取的数据
            fs.readFile(fileName, function (err, data) {
                if (err) {

                } else {
                    console.log(data);
                    var user = JSON.parse(data);
                    console.log(user);
                    if (user.password == req.body.password) {
                        //使用cookie记录用户名的值
                        res.cookie('petname', req.body.petname);
                        send('success', '登录成功');
                    } else {
                        send('signin error', '密码错误')
                    }
                }
            });
        }
        else {
            send('register', '用户名未注册')
        }
    });
});


/******************end******************/

/******************ask******************/



app.post('/ask', sign, function (req, res) {
    var petname = req.cookies.petname;
    console.log('fff' + petname);

    function send(code, message) {
        res.status(200).json({code, message});
    }

    // if (!petname) {
    //     send('signin error', '请重新登录');
    //     return;
    // }

    var time = new Date();
    req.body.petname = petname;
    req.body.ip = req.ip;
    req.body.time = time;
    function saveFile() {
        var fileName = `questions/${time.getTime()}.txt`;
        fs.appendFile(fileName, JSON.stringify(req.body), function (err) {
            if (err) {
                send('file error', '抱歉,系统错误');
            } else {
                send('success', '问题提交成功');
            }
        });
    }

    fs.exists('questions', function (exists) {
        if (exists) {
            saveFile();
        } else {
            fs.mkdir('questions', function (err) {
                if (err) {
                    send('file error', '抱歉,系统错误');
                } else {
                    saveFile();
                }
            });
        }
    });
});


/******************end***************/


/*********************home**************/


// app.get('/questions', function (req, res) {
// function send(code, message, data) {
//     res.status(200).json({code: code, message: message, data: data});
//     // res.render('page',{data:data});
// }
//
// function readFile(i, files, questions, complete) {
//     if (i < files.length) {
//         fs.readFile(`questions/${files[i]}`, function (err, data) {
//             if (!err) {
//                 questions.push(JSON.parse(data));
//             }
//             readFile(++i, files, questions, complete);
//         });
//     } else {
//         complete();
//     }
// }
//
//
// //path 文件路径 callback->回调函数 参数一为错误信息,参数二为files 为目录下的数组文件列表
// fs.readdir('questions', function (err, files) {
//     console.log(files);
//     if (err) {
//         send('file error', '抱歉,系统错误');
//     } else {
//         files = files.reverse();
//
//         var questions = [];
//
//         readFile(0, files, questions, function () {
//             send('success', '读取数据成功', questions);
//         })
//     }
// });
// });


/*******************回答answer************/

app.post('/answer', sign, function (req, res) {
    var petname = req.cookies.petname;
    console.log('回答');
    function send(code, message) {
        res.status(200).json({code, message})
    }

    // if (!petname) {
    //     send('signin error', '请重新登录');
    //     return
    // }


    var fileName = `questions/${req.cookies.question}.txt`;
    console.log(fileName);
    req.body.petname = petname;
    req.body.ip = req.ip;
    req.body.time = new Date();
    fs.readFile(fileName, function (err, data) {
        if (err) {
            send('file error', '抱歉，有错误')
        }
        else {
            var question = JSON.parse(data);
            if (!question.answers) question.answers = [];
            question.answers.push(req.body);
            fs.writeFile(fileName, JSON.stringify(question), function (err) {
                if (err) {
                    send('file error', '抱歉,写入错误')
                }
                else {
                    send('success', '提交成功')
                }
            })
        }
    })
});


/********************end***************/

//multer中有single('name')中的名称必须是表单上传字段的name名称的值
app.post('/user/photo', uploads.single('photo'), function (req, res) {
    res.status(200).json({code: 'success', message: '上传成功'});
});

/*******************退出*************/
app.get('/user/signout', function (req, res) {
    //删除cookie
    console.log(111);
    res.clearCookie('petname');
    // res.status(200).json({code: 'success'});
    res.redirect('/')
});
app.listen(5000, function () {
    console.log('server running at port 3000');
});