var JSON;
if (!JSON) {
    JSON = {}
} (function () {
    "use strict";

    function f(n) {
        return n < 10 ? '0' + n : n
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }
    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
            value = value.toJSON(key)
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null'
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null'
                    }
                    v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v)
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v)
                            }
                        }
                    }
                }
                v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' '
                }
            } else if (typeof space === 'string') {
                indent = space
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {
                '': value
            })
        }
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '': j
                }, '') : j
            }
            throw new SyntaxError('JSON.parse');
        }
    }
} ());
(function (a) {
    var r = a.fn.domManip,
        d = "_tmplitem",
        q = /^[^<]*(<[\w\W]+>)[^>]*$|\{\{\! /,
        b = {},
        f = {},
        e, p = {
            key: 0,
            data: {}
        },
        i = 0,
        c = 0,
        l = [];

    function g(g, d, h, e) {
        var c = {
            data: e || (e === 0 || e === false) ? e : d ? d.data : {},
            _wrap: d ? d._wrap : null,
            tmpl: null,
            parent: d || null,
            nodes: [],
            calls: u,
            nest: w,
            wrap: x,
            html: v,
            update: t
        };
        g && a.extend(c, g, {
            nodes: [],
            parent: d
        });
        if (h) {
            c.tmpl = h;
            c._ctnt = c._ctnt || c.tmpl(a, c);
            c.key = ++i;
            (l.length ? f : b)[i] = c
        }
        return c
    }
    a.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (f, d) {
        a.fn[f] = function (n) {
            var g = [],
                i = a(n),
                k, h, m, l, j = this.length === 1 && this[0].parentNode;
            e = b || {};
            if (j && j.nodeType === 11 && j.childNodes.length === 1 && i.length === 1) {
                i[d](this[0]);
                g = this
            } else {
                for (h = 0, m = i.length; h < m; h++) {
                    c = h;
                    k = (h > 0 ? this.clone(true) : this).get();
                    a(i[h])[d](k);
                    g = g.concat(k)
                }
                c = 0;
                g = this.pushStack(g, f, i.selector)
            }
            l = e;
            e = null;
            a.tmpl.complete(l);
            return g
        }
    });
    a.fn.extend({
        tmpl: function (d, c, b) {
            return a.tmpl(this[0], d, c, b)
        },
        tmplItem: function () {
            return a.tmplItem(this[0])
        },
        template: function (b) {
            return a.template(b, this[0])
        },
        domManip: function (d, m, k) {
            if (d[0] && a.isArray(d[0])) {
                var g = a.makeArray(arguments),
                    h = d[0],
                    j = h.length,
                    i = 0,
                    f;
                while (i < j && !(f = a.data(h[i++], "tmplItem")));
                if (f && c) g[2] = function (b) {
                    a.tmpl.afterManip(this, b, k)
                };
                r.apply(this, g)
            } else r.apply(this, arguments);
            c = 0;
            !e && a.tmpl.complete(b);
            return this
        }
    });
    a.extend({
        tmpl: function (d, h, e, c) {
            var i, k = !c;
            if (k) {
                c = p;
                d = a.template[d] || a.template(null, d);
                f = {}
            } else if (!d) {
                d = c.tmpl;
                b[c.key] = c;
                c.nodes = [];
                c.wrapped && n(c, c.wrapped);
                return a(j(c, null, c.tmpl(a, c)))
            }
            if (!d) return [];
            if (typeof h === "function") h = h.call(c || {});
            e && e.wrapped && n(e, e.wrapped);
            i = a.isArray(h) ? a.map(h, function (a) {
                return a ? g(e, c, d, a) : null
            }) : [g(e, c, d, h)];
            return k ? a(j(c, null, i)) : i
        },
        tmplItem: function (b) {
            var c;
            if (b instanceof a) b = b[0];
            while (b && b.nodeType === 1 && !(c = a.data(b, "tmplItem")) && (b = b.parentNode));
            return c || p
        },
        template: function (c, b) {
            if (b) {
                if (typeof b === "string") b = o(b);
                else if (b instanceof a) b = b[0] || {};
                if (b.nodeType) b = a.data(b, "tmpl") || a.data(b, "tmpl", o(b.innerHTML));
                return typeof c === "string" ? (a.template[c] = b) : b
            }
            return c ? typeof c !== "string" ? a.template(null, c) : a.template[c] || a.template(null, q.test(c) ? c : a(c)) : null
        },
        encode: function (a) {
            return ("" + a).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;")
        }
    });
    a.extend(a.tmpl, {
        tag: {
            tmpl: {
                _default: {
                    $2: "null"
                },
                open: "if($notnull_1){__=__.concat($item.nest($1,$2));}"
            },
            wrap: {
                _default: {
                    $2: "null"
                },
                open: "$item.calls(__,$1,$2);__=[];",
                close: "call=$item.calls();__=call._.concat($item.wrap(call,__));"
            },
            each: {
                _default: {
                    $2: "$index, $value"
                },
                open: "if($notnull_1){$.each($1a,function($2){with(this){",
                close: "}});}"
            },
            "if": {
                open: "if(($notnull_1) && $1a){",
                close: "}"
            },
            "else": {
                _default: {
                    $1: "true"
                },
                open: "}else if(($notnull_1) && $1a){"
            },
            html: {
                open: "if($notnull_1){__.push($1a);}"
            },
            "=": {
                _default: {
                    $1: "$data"
                },
                open: "if($notnull_1){__.push($.encode($1a));}"
            },
            "!": {
                open: ""
            }
        },
        complete: function () {
            b = {}
        },
        afterManip: function (f, b, d) {
            var e = b.nodeType === 11 ? a.makeArray(b.childNodes) : b.nodeType === 1 ? [b] : [];
            d.call(f, b);
            m(e);
            c++
        }
    });

    function j(e, g, f) {
        var b, c = f ? a.map(f, function (a) {
            return typeof a === "string" ? e.key ? a.replace(/(<\w+)(?=[\s>])(?![^>]*_tmplitem)([^>]*)/g, "$1 " + d + '="' + e.key + '" $2') : a : j(a, e, a._ctnt)
        }) : e;
        if (g) return c;
        c = c.join("");
        c.replace(/^\s*([^<\s][^<]*)?(<[\w\W]+>)([^>]*[^>\s])?\s*$/, function (f, c, e, d) {
            b = a(e).get();
            m(b);
            if (c) b = k(c).concat(b);
            if (d) b = b.concat(k(d))
        });
        return b ? b : k(c)
    }
    function k(c) {
        var b = document.createElement("div");
        b.innerHTML = c;
        return a.makeArray(b.childNodes)
    }
    function o(b) {
        return new Function("jQuery", "$item", "var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('" + a.trim(b).replace(/([\\'])/g, "\\$1").replace(/[\r\t\n]/g, " ").replace(/\$\{([^\}]*)\}/g, "{{= $1}}").replace(/\{\{(\/?)(\w+|.)(?:\(((?:[^\}]|\}(?!\}))*?)?\))?(?:\s+(.*?)?)?(\(((?:[^\}]|\}(?!\}))*?)\))?\s*\}\}/g, function (m, l, k, g, b, c, d) {
            var j = a.tmpl.tag[k],
                i, e, f;
            if (!j) throw "Unknown template tag: " + k;
            i = j._default || [];
            if (c && !/\w$/.test(b)) {
                b += c;
                c = ""
            }
            if (b) {
                b = h(b);
                d = d ? "," + h(d) + ")" : c ? ")" : "";
                e = c ? b.indexOf(".") > -1 ? b + h(c) : "(" + b + ").call($item" + d : b;
                f = c ? e : "(typeof(" + b + ")==='function'?(" + b + ").call($item):(" + b + "))"
            } else f = e = i.$1 || "null";
            g = h(g);
            return "');" + j[l ? "close" : "open"].split("$notnull_1").join(b ? "typeof(" + b + ")!=='undefined' && (" + b + ")!=null" : "true").split("$1a").join(f).split("$1").join(e).split("$2").join(g || i.$2 || "") + "__.push('"
        }) + "');}return __;")
    }
    function n(c, b) {
        c._wrap = j(c, true, a.isArray(b) ? b : [q.test(b) ? b : a(b).html()]).join("")
    }
    function h(a) {
        return a ? a.replace(/\\'/g, "'").replace(/\\\\/g, "\\") : null
    }
    function s(b) {
        var a = document.createElement("div");
        a.appendChild(b.cloneNode(true));
        return a.innerHTML
    }
    function m(o) {
        var n = "_" + c,
            k, j, l = {},
            e, p, h;
        for (e = 0, p = o.length; e < p; e++) {
            if ((k = o[e]).nodeType !== 1) continue;
            j = k.getElementsByTagName("*");
            for (h = j.length - 1; h >= 0; h--) m(j[h]);
            m(k)
        }
        function m(j) {
            var p, h = j,
                k, e, m;
            if (m = j.getAttribute(d)) {
                while (h.parentNode && (h = h.parentNode).nodeType === 1 && !(p = h.getAttribute(d)));
                if (p !== m) {
                    h = h.parentNode ? h.nodeType === 11 ? 0 : h.getAttribute(d) || 0 : 0;
                    if (!(e = b[m])) {
                        e = f[m];
                        e = g(e, b[h] || f[h]);
                        e.key = ++i;
                        b[i] = e
                    }
                    c && o(m)
                }
                j.removeAttribute(d)
            } else if (c && (e = a.data(j, "tmplItem"))) {
                o(e.key);
                b[e.key] = e;
                h = a.data(j.parentNode, "tmplItem");
                h = h ? h.key : 0
            }
            if (e) {
                k = e;
                while (k && k.key != h) {
                    k.nodes.push(j);
                    k = k.parent
                }
                delete e._ctnt;
                delete e._wrap;
                a.data(j, "tmplItem", e)
            }
            function o(a) {
                a = a + n;
                e = l[a] = l[a] || g(e, b[e.parent.key + n] || e.parent)
            }
        }
    }
    function u(a, d, c, b) {
        if (!a) return l.pop();
        l.push({
            _: a,
            tmpl: d,
            item: this,
            data: c,
            options: b
        })
    }
    function w(d, c, b) {
        return a.tmpl(a.template(d), c, b, this)
    }
    function x(b, d) {
        var c = b.options || {};
        c.wrapped = d;
        return a.tmpl(a.template(b.tmpl), b.data, c, b.item)
    }
    function v(d, c) {
        var b = this._wrap;
        return a.map(a(a.isArray(b) ? b.join("") : b).filter(d || "*"), function (a) {
            return c ? a.innerText || a.textContent : a.outerHTML || s(a)
        })
    }
    function t() {
        var b = this.nodes;
        a.tmpl(null, null, null, this).insertBefore(b[0]);
        a(b).remove()
    }
})(jQuery);
(function ($) {
    $.alerts = {
        verticalOffset: -75,
        horizontalOffset: 0,
        repositionOnResize: true,
        overlayOpacity: .08,
        overlayColor: '#000',
        draggable: true,
        okButton: '&nbsp;Aceptar&nbsp;',
        cancelButton: '&nbsp;Cancelar&nbsp;',
        dialogClass: null,
        alert: function (message, title, callback) {
            if (title == null) title = 'Alert';
            $.alerts._show(title, message, null, 'alert', function (result) {
                if (callback) callback(result)
            })
        },
        alertInfo: function (message, title, callback) {
            if (title == null) title = 'Alert';
            $.alerts._show(title, message, null, 'alertInfo', function (result) {
                if (callback) callback(result)
            })
        },
        confirm: function (message, title, callback) {
            if (title == null) title = 'Confirm';
            $.alerts._show(title, message, null, 'confirm', function (result) {
                if (callback) callback(result)
            })
        },
        prompt: function (message, value, title, callback) {
            if (title == null) title = 'Prompt';
            $.alerts._show(title, message, value, 'prompt', function (result) {
                if (callback) callback(result)
            })
        },
        _show: function (title, msg, value, type, callback) {
            $.alerts._hide();
            $.alerts._overlay('show');
            $("BODY").append('<div id="popup_container">' + '<h1 id="popup_title"></h1>' + '<div id="popup_content">' + '<img></img><div id="popup_message"></div>' + '</div>' + '</div>');
            if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);
            //var pos = ($.browser.msie && parseInt($.browser.version) <= 6) ? 'absolute' : 'fixed';
            var pos = 'fixed';
            $("#popup_container").css({
                position: pos,
                zIndex: 99999,
                padding: 0,
                margin: 0
            });
            $("#popup_title").text(title);
            $("#popup_content").addClass(type);
            $("#popup_message").text(msg);
            $("#popup_message").html($("#popup_message").text().replace(/\n/g, '<br />'));
            $("#popup_container").css({
                minWidth: $("#popup_container").outerWidth(),
                maxWidth: $("#popup_container").outerWidth()
            });
            //-----------------------------------------------------------------------------------
            $.alerts._reposition();
            $.alerts._maintainPosition(true);
            switch (type) {
                case 'alert':
                    $("#popup_message").after('<div id="popup_panel"><input class="popup_boton" type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true)
                    });
                    $("#popup_ok").focus().keypress(function (e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click')
                    });
                    break;
                case 'alertInfo':
                    $("#popup_message").after('<div id="popup_panel"><input class="popup_boton" type="button" value="' + $.alerts.okButton + '" id="popup_ok" /></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        callback(true)
                    });
                    $("#popup_ok").focus().keypress(function (e) {
                        if (e.keyCode == 13 || e.keyCode == 27) $("#popup_ok").trigger('click')
                    });
                    break;
                case 'confirm':
                    $("#popup_message").after('<div id="popup_panel"><input class="popup_boton" type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input class="popup_boton" type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_ok").click(function () {
                        $.alerts._hide();
                        if (callback) callback(true)
                    });
                    $("#popup_cancel").click(function () {
                        $.alerts._hide();
                        if (callback) callback(false)
                    });
                    $("#popup_ok").focus();
                    $("#popup_ok, #popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13) $("#popup_ok").trigger('click');
                        if (e.keyCode == 27) $("#popup_cancel").trigger('click')
                    });
                    break;
                case 'prompt':
                    $("#popup_message").append('<br /><input class="popup_boton" type="text" size="30" id="popup_prompt" />').after('<div id="popup_panel"><input class="popup_boton" type="button" value="' + $.alerts.okButton + '" id="popup_ok" /> <input class="popup_boton" type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
                    $("#popup_prompt").width($("#popup_message").width());
                    $("#popup_ok").click(function () {
                        var val = $("#popup_prompt").val();
                        $.alerts._hide();
                        if (callback) callback(val)
                    });
                    $("#popup_cancel").click(function () {
                        $.alerts._hide();
                        if (callback) callback(null)
                    });
                    $("#popup_prompt, #popup_ok, #popup_cancel").keypress(function (e) {
                        if (e.keyCode == 13) $("#popup_ok").trigger('click');
                        if (e.keyCode == 27) $("#popup_cancel").trigger('click')
                    });
                    if (value) $("#popup_prompt").val(value);
                    $("#popup_prompt").focus().select();
                    break
            }
            if ($.alerts.draggable) {
                try {
                    $("#popup_container").draggable({
                        handle: $("#popup_title")
                    });
                    $("#popup_title").css({
                        cursor: 'move'
                    })
                } catch (e) { }
            }
        },
        _hide: function () {
            $("#popup_container").remove();
            $.alerts._overlay('hide');
            $.alerts._maintainPosition(false)
        },
        _overlay: function (status) {
            switch (status) {
                case 'show':
                    $.alerts._overlay('hide');
                    $("BODY").append('<div id="popup_overlay"></div>');
                    $("#popup_overlay").css({
                        position: 'absolute',
                        zIndex: 99998,
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: $(document).height(),
                        background: $.alerts.overlayColor,
                        opacity: $.alerts.overlayOpacity
                    });
                    break;
                case 'hide':
                    $("#popup_overlay").remove();
                    break
            }
        },
        _reposition: function () {
            var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
            var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
            if (top < 0) top = 0;
            if (left < 0) left = 0;
            //if ($.browser.msie && parseInt($.browser.version) <= 6) top = top + $(window).scrollTop();
            $("#popup_container").css({
                top: top + 'px',
                left: left + 'px'
            });
            $("#popup_overlay").height($(document).height())
        },
        _maintainPosition: function (status) {
            if ($.alerts.repositionOnResize) {
                switch (status) {
                    case true:
                        $(window).bind('resize', $.alerts._reposition);
                        break;
                    case false:
                        $(window).unbind('resize', $.alerts._reposition);
                        break
                }
            }
        }
    };
    jAlert = function (message, title, callback) {
        $.alerts.alert('Ha ocurrido un error. Por favor comuníquese con el administrador del sistema.', 'SITP - Error', callback)
    };
    jAlertInfo = function (message, title, callback) {
        $.alerts.alertInfo(message, title, callback)
    };
    jConfirm = function (message, title, callback) {
        $.alerts.confirm(message, title, callback)
    };
    jPrompt = function (message, value, title, callback) {
        $.alerts.prompt(message, value, title, callback)
    }
})(jQuery);
eval(function (p, a, c, k, e, d) {
    e = function (c) {
        return (c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36))
    };
    if (!''.replace(/^/, String)) {
        while (c--) {
            d[e(c)] = k[c] || e(c)
        }
        k = [function (e) {
            return d[e]
        } ];
        e = function () {
            return '\\w+'
        };
        c = 1
    };
    while (c--) {
        if (k[c]) {
            p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c])
        }
    }
    return p
} ('(2($){$.c.f=2(p){p=$.d({g:"!@#$%^&*()+=[]\\\\\\\';,/{}|\\":<>?~`.- ",4:"",9:""},p);7 3.b(2(){5(p.G)p.4+="Q";5(p.w)p.4+="n";s=p.9.z(\'\');x(i=0;i<s.y;i++)5(p.g.h(s[i])!=-1)s[i]="\\\\"+s[i];p.9=s.O(\'|\');6 l=N M(p.9,\'E\');6 a=p.g+p.4;a=a.H(l,\'\');$(3).J(2(e){5(!e.r)k=o.q(e.K);L k=o.q(e.r);5(a.h(k)!=-1)e.j();5(e.u&&k==\'v\')e.j()});$(3).B(\'D\',2(){7 F})})};$.c.I=2(p){6 8="n";8+=8.P();p=$.d({4:8},p);7 3.b(2(){$(3).f(p)})};$.c.t=2(p){6 m="A";p=$.d({4:m},p);7 3.b(2(){$(3).f(p)})}})(C);', 53, 53, '||function|this|nchars|if|var|return|az|allow|ch|each|fn|extend||alphanumeric|ichars|indexOf||preventDefault||reg|nm|abcdefghijklmnopqrstuvwxyz|String||fromCharCode|charCode||alpha|ctrlKey||allcaps|for|length|split|1234567890|bind|jQuery|contextmenu|gi|false|nocaps|replace|numeric|keypress|which|else|RegExp|new|join|toUpperCase|ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('|'), 0, {}));
