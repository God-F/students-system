/**
 * @params {Object} options
 *          method   请求方式
 *          url    请求地址
 *          isAsync   是否异步
 *          data        请求参数（发送的数据）
 *          callback   拿到数据之后的回调函数
 */

function ajax(options) {
    // options 请求参数对象

    // 对请求参数对象进行结构
    let { method, url, isAsync, data, callback } = options;
    let dataStr = "";

    // 建立兼容性请求对象
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        alert("破浏览器");
    }


    //请求方法的大小写兼容处理
    method = method.toUpperCase();

    // 请求参数的处理（data默认为对象格式）
    if (typeof data === "object") {
        // 参数格式为对象格式
        for (let prop in data) {
            // 判断该属性是原型链上的还是自己的  
            // 只获取自己的属性
            if (data.hasOwnProperty(prop)) {
                dataStr += `${prop}=${data[prop]}&`;
            }

        }
    } else {
        dataStr = data.toString();
    }

    // XMLHttpRequest.readyState   代表请求的状态码。
            // readyState的值 0 - 4   
            // 0 代表还没有进行数据交互  
            // 1 代表还没有建立连接(open方法还没有执行) 
            //  2 代表连接已经建立了 （open方法已经执行）
            // 3 代表数据传递完成  （send方法执行完成）
            //  4代表对方已经给了响应 



    // XMLHttpRequest.responseText  在一个请求被发送后，从服务器端返回文本。
    // XMLHttpRequest.status 返回了XMLHttpRequest 响应中的数字状态码。
            //status == 200  网络请求，结果都会有一个状态码。来表示这个请求是否正常
            //200表示请求成功
            // http状态码
            //2**表示成功
            //3**表示重定向
            //4**表示客户端错误,404页面没找到。
            //5**表示服务端错误



            
    // XMLHttpRequest.onreadystatechange  当 readyState 属性发生变化时，调用
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            //    得到响应
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            }
        }
    }

    // 对请求方式的处理
    if (method == "GET") {
        // 请求方式为get请求
        url = url + `?${dataStr}`;
        // 建立连接
        xhr.open(method, url, isAsync);
        // 发送请求
        xhr.send();

    } else if (method == "POST") {
        // 请求方式为post

        // 建立连接
        xhr.open(method, url, isAsync);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // 发送请求
        xhr.send();
    }





}




