! function () {
    function get_attribute(node, attr, default_value) {
        return node.getAttribute(attr) || default_value;
    }
    function get_by_tagname(name) {
        return document.getElementsByTagName(name);
    }
    //检测是否为暗色模式
    function isDarkMode() {
        // 检查 documentElement 的 dataset.scheme 属性
        return document.documentElement.dataset.scheme === 'dark';
    }
    //获取配置参数
    function get_config_option() {
        var scripts = get_by_tagname("script"),
            script_len = scripts.length,
            script = scripts[script_len - 1]; //当前加载的script
        //根据暗色模式设置默认颜色
        var defaultColor = isDarkMode() ? "255,255,255" : "0,0,0";
        //根据屏幕宽度设置默认点数，手机端设为25，其他设备保持75
        var isMobile = window.innerWidth < 768;
        var defaultCount = isMobile ? 25 : 75;
        console.log('Canvas nest color:', defaultColor, 'Dark mode:', isDarkMode(), 'Is mobile:', isMobile, 'Count:', defaultCount);
        return {
            l: script_len, //长度，用于生成id用
            z: get_attribute(script, "zIndex", -1), //z-index
            o: get_attribute(script, "opacity", 0.8), //opacity - increased for more visible lines
            c: get_attribute(script, "color", defaultColor), //color
            n: get_attribute(script, "count", defaultCount) //count
        };
    }
    //设置canvas的高宽
    function set_canvas_size() {
        canvas_width = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            canvas_height = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    //绘制过程
    function draw_canvas() {
        context.clearRect(0, 0, canvas_width, canvas_height);
        //根据当前模式更新颜色
        config = get_config_option();
        context.lineWidth = 0.4;
        //随机的线条和当前位置联合数组
        var all_array = [current_point].concat(random_lines);
        var e, i, d, x_dist, y_dist, dist, opacity; //临时节点

        //处理点击效果
        if (click_info.active) {
            var click_time = (new Date().getTime() - click_info.time) / 1000;
            if (click_time > 1) {
                click_info.active = false;
            }
        }

        //遍历处理每一个点
        random_lines.forEach(function (r) {
            //处理点击排斥效果
            if (click_info.active) {
                var click_x_dist = r.x - click_info.x;
                var click_y_dist = r.y - click_info.y;
                var click_dist = click_x_dist * click_x_dist + click_y_dist * click_y_dist;
                var click_radius = 15000; //点击影响半径

                if (click_dist < click_radius) {
                    var force = (click_radius - click_dist) / click_radius * 5; //减小排斥力
                    var angle = Math.atan2(click_y_dist, click_x_dist);
                    r.x += Math.cos(angle) * force;
                    r.y += Math.sin(angle) * force;
                    //同时给点一个初始速度，使效果更明显
                    r.xa += Math.cos(angle) * 0.3;
                    r.ya += Math.sin(angle) * 0.3;
                }
            }

            //添加速度衰减，使点在被推开后能逐渐恢复正常
            // 确保点不会完全停止运动
            r.xa *= 0.99;
            r.ya *= 0.99;

            // 如果速度太小，给点一个小的随机速度
            if (Math.abs(r.xa) < 0.1) {
                r.xa = 2 * Math.random() - 1;
            }
            if (Math.abs(r.ya) < 0.1) {
                r.ya = 2 * Math.random() - 1;
            }

            r.x += r.xa,
                r.y += r.ya, //移动
                r.xa *= r.x > canvas_width || r.x < 0 ? -1 : 1,
                r.ya *= r.y > canvas_height || r.y < 0 ? -1 : 1, //碰到边界，反向反弹
                // 更新透明度，实现闪烁效果
                r.opacity += r.opacitySpeed;
            if (r.opacity > 1) {
                r.opacity = 1;
                r.opacitySpeed = -Math.abs(r.opacitySpeed); // 反向
            } else if (r.opacity < 0) {
                r.opacity = 0;
                r.opacitySpeed = Math.abs(r.opacitySpeed); // 反向
            }
            context.fillStyle = "rgba(" + config.c + ", " + r.opacity + ")";
            // 绘制圆形的点
            context.beginPath();
            context.arc(r.x, r.y, r.size / 2, 0, Math.PI * 2);
            context.fill(); //绘制圆形的点
            for (i = 0; i < all_array.length; i++) {
                e = all_array[i];
                //不是当前点
                if (r !== e && null !== e.x && null !== e.y) {
                    x_dist = r.x - e.x, //x轴距离 l
                        y_dist = r.y - e.y, //y轴距离 n
                        dist = x_dist * x_dist + y_dist * y_dist; //总距离, m
                    if (dist < e.max) {
                        // 计算线条透明度，距离越近透明度越高
                        opacity = (e.max - dist) / e.max * config.o;
                        context.strokeStyle = "rgba(" + config.c + ", " + opacity + ")";
                        context.beginPath();
                        context.moveTo(r.x, r.y);
                        context.lineTo(e.x, e.y);
                        context.stroke();
                        // 靠近的时候加速，距离越近吸引力越大
                        if (e === current_point) {
                            // 当距离超过最大值的80%时，吸引力开始减弱
                            const attractionFactor = Math.max(0, (e.max - dist) / (e.max * 0.8));
                            if (attractionFactor > 0) {
                                // 进一步减少吸引力强度
                                r.x -= 0.0025 * x_dist * attractionFactor;
                                r.y -= 0.0025 * y_dist * attractionFactor;
                            }
                        }
                    }
                }
            }
            all_array.splice(all_array.indexOf(r), 1);

        }), frame_func(draw_canvas);
    }
    //创建画布，并添加到body中
    var the_canvas = document.createElement("canvas"), //画布
        config = get_config_option(), //配置
        canvas_id = "c_n" + config.l, //canvas id
        context = the_canvas.getContext("2d"), canvas_width, canvas_height,

        frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (func) {
            window.setTimeout(func, 1000 / 45);
        }, random = Math.random,
        current_point = {
            x: null, //当前鼠标x
            y: null, //当前鼠标y
            max: 35000 //鼠标沾附距离 - increased for longer connections
        };

    the_canvas.id = canvas_id;
    the_canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
    get_by_tagname("body")[0].appendChild(the_canvas);
    //初始化画布大小

    set_canvas_size(), window.onresize = set_canvas_size;
    //当时鼠标位置存储，离开的时候，释放当前位置信息
    window.onmousemove = function (e) {
        e = e || window.event, current_point.x = e.clientX, current_point.y = e.clientY;
    }, window.onmouseout = function () {
        current_point.x = null, current_point.y = null;
    };

    //点击事件，实现线条向四周散开的效果
    var click_info = {
        x: null,
        y: null,
        time: 0,
        active: false
    };

    window.onclick = function (e) {
        e = e || window.event;
        click_info.x = e.clientX;
        click_info.y = e.clientY;
        click_info.time = new Date().getTime();
        click_info.active = true;

        // 1秒后结束点击效果
        setTimeout(function () {
            click_info.active = false;
        }, 1000);
    };
    //随机生成config.n条线位置信息
    for (var random_lines = [], i = 0; config.n > i; i++) {
        var x = random() * canvas_width, //随机位置
            y = random() * canvas_height,
            xa = (2 * random() - 1) * 1.5, //增加初始速度
            ya = (2 * random() - 1) * 1.5, //增加初始速度
            size = 1 + Math.random() * 7; // 随机大小，范围1-8，在创建时固定
        opacity = Math.random(), // 初始透明度，范围0-1
            opacitySpeed = (Math.random() - 0.5) * 0.04; // 透明度变化速度，增大范围使闪烁更明显
        random_lines.push({
            x: x,
            y: y,
            xa: xa,
            ya: ya,
            size: size, // 存储点的大小
            opacity: opacity, // 存储点的透明度
            opacitySpeed: opacitySpeed, // 透明度变化速度
            max: 12000 //沾附距离 - increased for longer connections
        });
    }
    //0.1秒后绘制
    setTimeout(function () {
        draw_canvas();
    }, 100);

    //监听暗色模式变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        //重新获取配置，更新颜色
        config = get_config_option();
    });
}();