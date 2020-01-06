
var fs = require('fs');

var read_file_sync = function (file_path) {
    var data = fs.readFileSync(file_path, 'utf-8');
    console.log('读取文件完成！');
    data = data.replace(/pl__all\" href=\"/g, 'pl__all" href="/blog/');

    // 写入文件内容（如果文件不存在会创建一个文件）
    fs.writeFile(file_path, data, { 'flag': 'w' }, function(err) {
        if (err) {
            throw err;
        }

        console.log('写入文件ok~~');
    });
}

// 读取 index.html
var file_path = './index.html'

read_file_sync(file_path)
