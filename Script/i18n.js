/**
 * 国际化工具类
 * https://github.com/ekoz/jquery-i18n
 *
 * @author eko.zhan
 * @required
 *    jquery.min.js
 *    jquery.cookie.js
 */
(function ($) {
  'use strict'

  $.i18n = $.i18n || {}

  $.extend($.i18n, {
    /* 获取当前环境语言 */
    getLocale: function () {
      return $.cookie('locale') == undefined ? 'en' : $.cookie('locale')
    },
    /**
         * 设置语言类型，参数为空时默认从浏览器里获取
         * key zh/zh-tw/en
         **/
    setLocale: function (key) {
      if (typeof key == 'undefined' || key == null || key == '') {
        var type = navigator.appName
        if (type == 'Netscape') {
          key = navigator.language
        } else {
          key = navigator.userLanguage
        }
        //取得浏览器语言的前两个字母
        key = key.toLowerCase()
        key = key == 'zh-hk' ? 'zh-tw' : key
        if (key != 'zh-tw') {
          key = key.substr(0, 2)
        }
      }
      if ($.cookie('locale') != key) {
        $.cookie('locale', key, {expires: 3000})
      }
    },

    /**
     * 加载多语言资源文件
     * 资源文件格式
     * @param langScript 以/开头，相对于 contextPath 的路径 /resource/kbase/base/login/language.js
     */
    load: function (langScript, callback) {
      var success = false
      if (langScript != null) {
        if (typeof langScript === 'object' && !isNaN(langScript.length)) {
          $(langScript).each(function (i, item) {
            _appendScript(item)
          })
        } else {
          _appendScript(langScript)
        }
        success = true
      }
      if (typeof callback == 'function') callback(success)
    },

    /**
     * 参数可以传入元素标识，或者 资源id
     * 获取元素的多语言资源 <span lang-key="zh">中文</span>
     * 优先返回id对应的资源，如果为null，则返回defaultValue，否则返回id
     * 用法：
     * $.i18n.prop('username_is_null')
     * $.i18n.prop('username_is_null', '用户名不能为空')
     *
     */
    prop: function (elem, defaultValue) {
      var id = ''
      var res = ''
      var locale = $.i18n.getLocale()
      if (typeof $.i18n.lang == 'undefined') {
        $.i18n.lang = {}
        $.i18n.lang[locale] = {}
      }
      if (!$.i18n.lang[locale]) $.i18n.lang[locale] = {}
      if ($(elem).attr('lang-key') == undefined) {
        //传入的是资源id
        id = elem
        res = $.i18n.lang[locale][elem]
        if (res != undefined && res.indexOf('{0}') != -1) {
          //需要填充占位符，如果参数未填满，会显示undefined
          //不支持参数是资源id的情况，如果需要适配语言，参数可以使用 alert($.i18n.prop('username', '你好', $.i18n.prop('login'), '测试'));$.i18n.prop('msg_hello', '你好', $.i18n.prop('login'), '测试');
          var args = arguments
          return res.replace(/\$\{(\d+)\}/g, function (m, i) {
            i++
            return args[i]
          })
        }
      } else {
        //传入的是元素
        id = $(elem).attr('lang-key')
        res = $.i18n.lang[locale][id]

        // 如果没有设置对应的语言，使用元素内的文本
        if (!res) {
          if ($(elem).attr('placeholder')) res = $(elem).attr('placeholder')
          else res = $(elem).html()
        }
      }
      return res || defaultValue || id
    },
  })

  /**
   * 向页面加载javascript文件
   */
  function _appendScript(langScript) {
    var _key = langScript.substring(0, langScript.length - 3).replace(/\//gi, '_')
    if ($('script[_key="' + _key + '"]').length == 0) {
      $('head').append(
        '<script _key="' + _key + '" src="' + langScript + '" charset="utf-8" type="text/javascript"></script>'
      )
    }
  }
})(jQuery)

$(function () {
  // 基于浏览器设置默认语言
  if (!$.cookie('locale')) $.i18n.setLocale()
  $(`#lang-switch-${$.cookie('locale')}`).removeAttr('href')

  // 绑定语言切换
  $('[id|="lang-switch"]').on('click', function () {
    var lang = $(this).attr('id').replace(/^lang-switch-/, '')
    $.i18n.setLocale(lang)
    location.reload()
  })

  // 加载资源文件
  $.i18n.load('lang/language.js', function () {
    $('title').text($.i18n.prop('title'))
    $('[lang-key]').each(function (i, item) {
      // 如果含有placeholder属性则替换该属性
      if ($(item).attr('placeholder')) {
        $(item).attr('placeholder', $.i18n.prop(item))
      } else {
        $(item).text($.i18n.prop(item))
      }
    })
  })
})
