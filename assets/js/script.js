/**
 * 3-Ghost Theme
 * @update by zak wu
 * @author Peiwen Lu (P233)
 */

/**
 * 类收集
 * @constructor
 */
var Blog = function Blog() {
  this.postsList = $('#pl__container');
  this.tag1       = $('.pl__all');
  this.tag2       = '.ghost';
  this.tag3       = '.js';
  this.tag4       = '.css';
  this.tag5       = '.front-end-ac';
  this.tag6       = '.other';
  this.sidebar    = $('#sidebar');
  this.container  = $('#post');
  this.content    = $('#pjax');
  this.button     = $('#icon-arrow');
};

Blog.fn = Blog.prototype;

/**
 * 初始化函数
 */
Blog.fn.init = function init() {
  var _this = this;
  /* mobile fix */
  // Detect window size, if less than 1280px add class 'mobile' to sidebar therefore it will be auto hide when trigger the pjax request in small screen devices.
  if ($(window).width() <= 1280) $('#sidebar').addClass('mobile');

  var postListReady = function postListReady(){
    // sidebar初始化选中
    // If sidebar has class 'mobile', hide it after clicking.
    _this.tag1.on('click', function() {
      $(this).addClass('active').siblings().removeClass('active');
      if (_this.sidebar.hasClass('mobile')) {
        $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
      }
    });

    // 绑定所有文章列表
    _this.articleClick();
    // 绑定非文章列表
    _this.noAticleClick();
    // 其他绑定事件
    _this.eventBind();
    // 初始化非文章列表
    _this.initNoArts();
    // pjax
    _this.PjaxBind();
    // pjax 回调
    _this.afterPjax();
  };

  postListReady();
  if(_this.postsList.find('.pl__all') && _this.postsList.find('.pl__all').length === 0){
    _this.postsList.load('/ .pl__all', function() {
      // 初始化非文章列表
      _this.initNoArts();
    });
  }
};

/**
 * 文章部分绑定click
 */
Blog.fn.articleClick = function articleClick() {
  var _this = this;
  // 文章列表click绑定
  // Tags switcher
  var clickHandler = function clickHandler(k) {
    return function() {
      $(this).addClass('active').siblings().removeClass('active');
      // 展示和隐藏
      if(k !== 1) {
        $('.pl__all').hide();
        $(_this['tag'+k]).delay(50).fadeIn(350);
      } else {
        $('.pl__all').delay(50).fadeIn(350);
      }
      // 非文章的部分隐藏
      $('.no-active').hide();
    }
  };

  for (var i = 1; i <= 6; i++) {
    $('#js-label' + i).on('click', clickHandler(i));
  }
};

/**
 * 为非文章部分绑定
 */
Blog.fn.noAticleClick = function noAticleClick() {
  var _this = this;

  // 增加两步，用于展示作品和分享ppt
  var swithAndShow = function swithAndShow() {
    $(this).addClass('active').siblings().removeClass('active');
    // 隐藏文章部分
    $('.pl__all').hide();
    // 非文章的部分隐藏
    $('.no-active').hide();
  };

  // $('#sthfuns').on('click', function() {
  //   swithAndShow.call(this);
  //   $('#sthfuns-show').removeClass('f-hide').delay(50).fadeIn(350);
  // });
  //
  // $('#shareppt').on('click', function() {
  //   swithAndShow.call(this);
  //   $('#shareppt-show').removeClass('f-hide').delay(50).fadeIn(350);
  // });
};

/**
 * 事件绑定
 */
Blog.fn.eventBind = function eventBind() {
  var _this = this;

  // Enable fullscreen.
  $('#js-fullscreen').on('click', function() {
    if (_this.button.hasClass('fullscreen')) {
      _this.sidebar.removeClass('fullscreen');
      _this.button.removeClass('fullscreen');
      _this.content.delay(300).queue(function(){
        $(this).removeClass('fullscreen').dequeue();
      });
    } else {
      _this.sidebar.addClass('fullscreen');
      _this.button.addClass('fullscreen');
      _this.content.delay(200).queue(function(){
        $(this).addClass('fullscreen').dequeue();
      });
    }
  });

  $('#mobile-avatar').on('click', function(){
    $('#sidebar, #pjax, #icon-arrow').addClass('fullscreen');
  });

  // 简单搜索
  $('#search-input').on('input', function(e) {
    $('#pl__container .pl__title').each(function(it, key) {
        if(key.innerHTML.indexOf(e.currentTarget.value) < 0) {
          $(key).parent().hide();
        } else {
          $(key).parent().show();
        }
    });
  });
};

/**
 * pjax 绑定
 * @constructor
 */
Blog.fn.PjaxBind = function PjaxBind(){
  var _this = this;
  // Pjax
  $(document).pjax('#mobile-avatar, .pl__all', '#pjax', { fragment: '#pjax', timeout: 10000 });
  $(document).on({
    'pjax:click': function() {
      _this.content.removeClass('fadeIn').addClass('fadeOut');
      NProgress.start();
    },
    'pjax:start': function() {
      _this.content.css({'opacity':0});
    },
    'pjax:end': function() {
      NProgress.done();
      _this.container.scrollTop(0);
      _this.content.css({'opacity':1}).removeClass('fadeOut').addClass('fadeIn');
      // 隐藏页面的fullscreen
      if (!_this.button.hasClass('fullscreen')) {
        _this.sidebar.addClass('fullscreen');
        _this.button.addClass('fullscreen');
        _this.content.delay(200).queue(function(){
          $(this).addClass('fullscreen').dequeue();
        });
      }

      _this.afterPjax();
    }
  });
};

/**
 * Pjax 回调函数
 */
Blog.fn.afterPjax = function afterPjax() {
  var _this = this;

  // Codepen embed js
  var CodePenEmbed={width:"100%",init:function(){this.showCodePenEmbeds(),this.listenToParentPostMessages()},showCodePenEmbeds:function(){var e=document.getElementsByClassName("codepen");for(var t=e.length-1;t>-1;t--){var n=this._getParamsFromAttributes(e[t]);n=this._convertOldDataAttributesToNewDataAttributes(n);var r=this._buildURL(n),i=this._buildIFrame(n,r);this._addIFrameToPage(e[t],i)}},_getParamsFromAttributes:function(e){var t={},n=e.attributes;for(var r=0,i=n.length;r<i;r++)name=n[r].name,name.indexOf("data-")===0&&(t[name.replace("data-","")]=n[r].value);return t},_convertOldDataAttributesToNewDataAttributes:function(e){return e.href&&(e["slug-hash"]=e.href),e.type&&(e["default-tab"]=e.type),e.safe&&(e["safe"]=="true"?e.animations="run":e.animations="stop-after-5"),e},_buildURL:function(e){var t=this._getHost(e),n=e.user?e.user:"anon",r="?"+this._getGetParams(e),i=[t,n,"embed",e["slug-hash"]+r].join("/");return i.replace(/\/\//g,"//")},_getHost:function(e){return e.host?e.host:document.location.protocol=="file:"?"http://codepen.io":"//codepen.io"},_getGetParams:function(e){var t="",n=0;for(var r in e)t!==""&&(t+="&"),t+=r+"="+encodeURIComponent(e[r]);return t},_buildIFrame:function(e,t){var n={id:"cp_embed_"+e["slug-hash"].replace("/","_"),src:t,scrolling:"no",frameborder:"0",height:this._getHeight(e),allowTransparency:"true","class":"cp_embed_iframe",style:"width: "+this.width+"; overflow: hidden;"},r="<iframe ";for(var i in n)r+=i+'="'+n[i]+'" ';return r+="></iframe>",r},_getHeight:function(e){return e.height?e["height"]=="auto"?300:e.height:300},_addIFrameToPage:function(e,t){if(e.parentNode){var n=document.createElement("div");n.innerHTML=t,e.parentNode.replaceChild(n,e)}else e.innerHTML=t},listenToParentPostMessages:function(){var eventMethod=window.addEventListener?"addEventListener":"attachEvent",eventListener=window[eventMethod],messageEvent=eventMethod=="attachEvent"?"onmessage":"message";eventListener(messageEvent,function(e){try{var dataObj=eval("("+e.data+")"),iframe=document.getElementById("cp_embed_"+dataObj.hash);iframe&&(iframe.height=dataObj.height)}catch(err){}},!1)}};

// Open links in new tab
  $('#post__content a').attr('target','_blank');

  // Highlight code after pjax
  // http://schier.co/post/how-to-re-run-prismjs-on-ajax-content
  Prism.highlightAll();

  // Embed codepen after pjax
  CodePenEmbed.init();

  // Generate post TOC for h1 h2 and h3
  var toc = $('#post__toc-ul');
  // Empty TOC and generate an entry for h1
  toc.empty().append('<li class="post__toc-li post__toc-h1"><a href="#post__title" class="js-anchor-link">' + $('#post__title').text() + '</a></li>');

  // Generate entries for h2 and h3
  $('#post__content').children('h2,h3').each(function() {
    if ($(this).prop("tagName") == 'H2') {
      toc.append('<li class="post__toc-li post__toc-h2"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
    } else {
      toc.append('<li class="post__toc-li post__toc-h3"><a href="#' + $(this).attr('id') + '" class="js-anchor-link">' + $(this).text() + '</a></li>');
    }
  });

  // Smooth scrolling
  $('.js-anchor-link').on('click', function() {
    var target = $(this.hash);
    _this.container.animate({scrollTop: target.offset().top + _this.container.scrollTop() - 70}, 500, function() {
      target.addClass('flash').delay(700).queue(function() {
        $(this).removeClass('flash').dequeue();
      });
    });
  });

  // 处理静态页面非主业进入时导致的列表为空
  if(!$('#pl__container').html().trim()) {
    $('#pl__container').html(window.plContainer || '');
  }
}

/**
 * 简单模板引擎
 */
Blog.fn.noArticalAddDom = function noArticalAddDom(obj) {
  var domTpl = '<a class="{{className}}" href="{{url}}" target="_blank">' +
                  '<span class="pl__circle"></span>' +
                  '<span class="pl__title">{{title}}</span>' +
                  '<span class="pl__date">{{date}}</span>' +
              '</a>';

  return domTpl.replace(/({{(\w*)}})/gi, function($0, $1, $2) {
    return obj[$2];
  });
};

/**
 * 初始化非文章列表
 */
Blog.fn.initNoArts = function initNoArts() {
  var _this = this;

  var sfList = [{
    className: 'sthfuns',
    url: '//' + location.host + '/node/assets/performance/preformance.html',
    title: '网页性能报告脚本',
    date: '26 jan 15'
  }, {
    className: 'sthfuns',
    url: '//' + location.host + '/node/assets/testandcover/testandcover.html',
    title: '单元测试和页面测试覆盖率统计脚本',
    date: '16 feb 15'
  }, {
    className: 'sthfuns',
    url: 'http://eng.liveapp.cn/',
    title: '云来场景引擎(需注册)',
    date: '16 feb 15'
  }, {
    className: 'sthfuns',
    url: 'http://myz.uliveapp.com/',
    title: '芈月传(btv推广游戏)',
    date: '16 Dec 15'
  }, {
    className: 'sthfuns',
    url: 'http://www.topgear.com.cn/demo/web/index.html',
    title: '万达寻龙诀(微信游戏)',
    date: '16 Dec 15'
  }, {
    className: 'sthfuns',
    url: 'http://starwars.uliveapp.com/xqdz/',
    title: '星球大战(万达互助推广)',
    date: '14 Feb 16'
  }, {
    className: 'sthfuns',
    url: 'http://xrobot.uliveapp.com/',
    title: 'xrobot(京东扫地机众筹)',
    date: '14 Feb 16'
  }, {
    className: 'sthfuns',
    url: 'http://zhenhu.uliveapp.com/',
    title: '珍护牛奶推广',
    date: '14 Feb 16'
  }, {
    className: 'sthfuns',
    url: 'http://langyu.uliveapp.com/web/index.html',
    title: '成都朗御项目',
    date: '14 Feb 16'
  }];

  var pptList = [{
    className: 'shareppt',
    url: '//' + location.host + '/node/assets/ppts/tpls/bigFe.html',
    title: '大前端发展趋势分享',
    date: '17 feb 15'
  }, {
    className: 'shareppt',
    url: '//' + location.host + '/node/assets/ppts/tpls/jsDoc.html',
    title: 'jsDoc使用分享',
    date: '17 feb 15'
  }, {
    className: 'shareppt',
    url: '//' + location.host + '/node/assets/ppts/tpls/promise.html',
    title: 'promise对象使用剖析',
    date: '17 feb 15'
  }, {
    className: 'shareppt',
    url: '//' + location.host + '/node/assets/ppts/tpls/prototype.html',
    title: 'js内存模型浅谈',
    date: '25 aug 15'
  }];

  var sfRes = '';
  var sPptRes = '';

  for(var i = 0; i < sfList.length; i++) {
    sfRes += _this.noArticalAddDom(sfList[i]);
  }

  for(var i = 0; i < pptList.length; i++) {
    sPptRes += _this.noArticalAddDom(pptList[i]);
  }

  // // 作品集show
  // if(!$('#sthfuns-show')[0]) {
  //   _this.postsList.append('<div class="no-active f-hide" id="sthfuns-show">' + sfRes + '</div>');
  // } else {
  //   $('#sthfuns-show').append(sfRes);
  // }
  // // ppt show
  // if(!$('#shareppt-show')[0]) {
  //   _this.postsList.append('<div class="no-active f-hide" id="shareppt-show">' + sPptRes + '</div>');
  // } else {
  //   $('#shareppt-show').append(sPptRes);
  // }
};

var blog = new Blog();
blog.init();
