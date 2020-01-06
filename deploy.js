
var fs = require('fs');
// 读取 index.html
var file_path = './index.html'
var jsFile_ptah = './assets/js/script.js'
var insertHtml = '';

var injectHtmlFn = function (jsFile_ptah) {
    var data = fs.readFileSync(jsFile_ptah, 'utf-8');
    data = 'window.plContainer = `' + insertHtml + '`;' + data;
    console.log(data)
    console.log('注入完成！');
    // 写入文件内容（如果文件不存在会创建一个文件）
    fs.writeFile(jsFile_ptah, data, { 'flag': 'w' }, function(err) {
        if (err) {
            throw err;
        }

        console.log('注入ok');
    });
}
var readIndexHtml = function (file_path) {
    var data = fs.readFileSync(file_path, 'utf-8');
    console.log('读取文件完成！');
    data = data.replace(/pl__all\" href=\"/g, 'pl__all" href="/blog/');
    insertHtml = data.match(/<nav id=\"pl__container\">([\s\S]*)<\/nav>/)[1]
    // 写入文件内容（如果文件不存在会创建一个文件）
    fs.writeFile(file_path, data, { 'flag': 'w' }, function(err) {
        if (err) {
            throw err;
        }

        console.log('写入文件ok~~');
        injectHtmlFn(jsFile_ptah)
    });
}

readIndexHtml(file_path)

