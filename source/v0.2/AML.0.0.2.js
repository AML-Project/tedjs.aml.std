var aml = {};
(function() {
    HTMLElement.prototype.accessVar = CharacterData.prototype.accessVar = function(name) {
        var el = this;
        while (el) {
            var G = aml.__varFindWithAccessKey(el.AML_AccessKey);
            if (G != -1) {
                for (var GL = 0; GL < G.length; GL++) {
                    if (G[GL].left == name) return G[GL].varAccess;
                }
            }
            el = el.parentNode;
        }
        return -1;
    };

    function resetTextNodes(e){
        var children = tedApi.children(e);
        for(var i = 0 ; i < children.length ; i++){
            if( tedApi.isTextNode(children[i]) &&  !tedApi.isUndefined(children[i].oldIn) ){
                children[i].nodeValue = children[i].oldIn;
                ted.compile(children[i],true);
            }
        }
    }
    ted.amlStorage = {
        vars: [],
        runModules: function(r, w) {
            if (!(tedApi.isElement(r))) return 0;
            if (tedApi.isUndefined(w)) w = 1;
            for (var y in ted.amlStorage.modules) {
                if (ted.amlStorage.modules.hasOwnProperty(y)) {
                    var Module = (function() {
                        return ted.amlStorage.modules[y];
                    }).call(r);
                    if (Module.hasOwnProperty("function")) {
                        if (w == 1 && Module["before"] === true) {
                            if (Module["elm"].length == 0) Module["function"].call(r);
                            else {
                                if (Module["elm"].indexOf(r.tagName.toLowerCase()) != -1) {
                                    Module["function"].call(r);
                                }
                            }
                        }
                        if (w == -1 && Module["after"] === true) {
                            if (Module["elm"].length == 0) Module["function"].call(r);
                            else {
                                if (Module["elm"].indexOf(r.tagName.toLowerCase()) != -1) {
                                    Module["function"].call(r);
                                }
                            }
                        }
                    }
                }
            }
        },
        module_funcs: {
            control: {
                func: function(y) {
                    if (tedApi.attr(this.self, "aml") == -1 || (!tedApi.isFunction(y) && !tedApi.isObject(y))) return 0;
                    ted.amlStorage.modules.controlers.functions.push({
                        tag: this.self.tagName.toLowerCase(),
                        aml: tedApi.attr(this.self, "aml"),
                        do: y
                    });
                    return this;
                },
                elm: []
            }
        },
        modules: {
            controlers: {
                elm: [],
                function: function() {
                    var controlers = {};
                    var THAT = this;
                    controlers.copy(ted.amlStorage.modules.controlers.global);
                    if (ted.amlStorage.modules.controlers.local.length > 0) {
                        controlers.copy(ted.amlStorage.modules.controlers.local[this.tagName.toLowerCase()]);
                    }
                    controlers.self = this;
                    controlers.sub = {};
                    var childAml = tedApi.find(this, "[aml]");
                    for (var i = 0; i < childAml.length; i++) {
                        var name = tedApi.attr(childAml[i], "aml");
                        //controlers.sub[name].module = aml.module(name);
                        controlers.sub[name] = __GLOBALS__(childAml[i]);
                    }

                    function $GetVars(THAT) {
                        var l = {};
                        if (typeof THAT.AML_AccessKey !== typeof undefined) {
                            var w = aml.__varFindWithAccessKey(THAT.AML_AccessKey);
                            if (w != -1) {
                                for (var i = 0; i < w.length; i++) {
                                    var t = w[i].left;
                                    l[t] = aml.varValue(t, THAT);
                                }
                            }
                        }
                        return l;
                    }
                    var setWatch = {
                        set: function(obj, prop, value) {
                            aml.addVar({
                                name: prop,
                                value: value
                            }, THAT);
                            if (typeof THAT.AML_AccessKey !== typeof undefined) {
                                var w = aml.__varFindWithAccessKey(THAT.AML_AccessKey);
                                if (w != -1) {
                                    for (var i = 0; i < w.length; i++) {
                                        var t = w[i].left;
                                        obj[t] = aml.varValue(t, THAT);
                                    }
                                }
                            }
                            resetTextNodes(THAT);
                        },
                        get: function(target, name) {
                            var store = new $GetVars(THAT);
                            if (name in store) {
                                return store[name];
                            }
                        }
                    };
                    controlers.vars = new Proxy({}, setWatch);
                    for (var i = 0; i < ted.amlStorage.modules.controlers.functions.length; i++) {
                        var h = ted.amlStorage.modules.controlers.functions[i];
                        if (h["tag"].toLowerCase() == this.tagName.toLowerCase()) {
                            if (h["aml"] == tedApi.attr(this, "aml")) {
                                h["do"].call(this, controlers);
                            }
                            return 1;
                        }
                    }
                    return 0;
                },
                local: {},
                global: (__GLOBALS__(this.self)),
                functions: [],
                before: true,
                after: false
            }
        }
    };
    aml = {
        access: "AML",
        creatModule: function(o) {
            if (typeof o != "object") return
            false;
            if ((typeof o.name === typeof undefined || typeof o.name != "string") || typeof o["function"] === typeof undefined || typeof o["function"] != "function") return -2;
            var r = {
                createBasic: function() { //
                    var controlers = {};
                    var THAT = this;
                    controlers.copy(THAT.main.global);
                    if (THAT.main.local.count > 0) {
                        var LOCAL = THAT.main.local[this.self.tagName.toLowerCase()];
                        if (tedApi.isObject(LOCAL)) {
                            controlers.copy(LOCAL);
                        }
                    }
                    controlers.self = this.self;

                    function $GetVars(THAT) {
                        var l = {};
                        if (typeof THAT.AML_AccessKey !== typeof undefined) {
                            var w = aml.__varFindWithAccessKey(THAT.AML_AccessKey);
                            if (w != -1) {
                                for (var i = 0; i < w.length; i++) {
                                    var t = w[i].left;
                                    l[t] = aml.varValue(t, THAT);
                                }
                            }
                        }
                        return l;
                    }
                    var setWatch = {
                        set: function(obj, prop, value) {
                            aml.addVar({
                                name: prop,
                                value: value
                            }, THAT.self);
                            if (typeof THAT.self.AML_AccessKey !== typeof undefined) {
                                var w = aml.__varFindWithAccessKey(THAT.self.AML_AccessKey);
                                if (w != -1) {
                                    for (var i = 0; i < w.length; i++) {
                                        var t = w[i].left;
                                        obj[t] = aml.varValue(t, THAT.self);
                                    }
                                }
                            }
                        },
                        get: function(target, name) {
                            var store = new $GetVars(THAT.self);
                            if (name in store) {
                                return store[name];
                            }
                        }
                    };
                    controlers.vars = new Proxy({}, setWatch);
                    return controlers;
                },
                runFunctions: function(a) {
                    var THAT = this;
                    for (var i = 0; i < THAT.main.functions.length; i++) {
                        var h = THAT.main.functions[i];
                        if (h["tag"].toLowerCase() == THAT.self.tagName.toLowerCase()) {
                            if (h["aml"] == tedApi.attr(THAT.self, "aml") && tedApi.isFunction(h["do"])) {
                                h["do"].call(THAT.self, a);
                            }
                            return 1;
                        }
                    }
                    return 0;
                },
                Functions: function(f) {
                    if (!tedApi.isFunction(f)) return 0;
                    var THAT = this;
                    for (var i = 0; i < THAT.main.functions.length; i++) {
                        var h = THAT.main.functions[i];
                        if (h["tag"].toLowerCase() == THAT.self.tagName.toLowerCase()) {
                            if (h["aml"] == tedApi.attr(THAT.self, "aml")) {
                                f.call(THAT.self, h["do"]);
                            }
                            return 1;
                        }
                    }
                    return 0;
                }
            }
            var k = {
                elm: [],
                function: function() {
                    var __this = {
                        main: ted.amlStorage.modules["AML_" + o.name]
                    };
                    __this.self = this;
                    __this.push(r);
                    o["function"].call(this, __this);
                },
                local: {},
                global: {},
                functions: [],
                before: true,
                after: false
            };
            if (typeof o.elm !== typeof undefined) {
                if (o.elm.constructor === Array.prototype.constructor) k.elm = o.elm;
            }
            if (typeof o.global !== typeof undefined) {
                if (o.global.constructor !== ({})
                    .constructor) return false;
                k.global = o.global;
            }
            if (typeof o.local !== typeof undefined) {
                if (o.local.constructor !== ({})
                    .constructor) return
                false;
                k.local = o.local;
            }
            if (typeof o.after !== typeof undefined) {
                if (typeof o.after == "boolean") k.after = o.after;
            }
            if (typeof o.before !== typeof undefined) {
                if (typeof o.before == "boolean") k.before = o.before;
            }
            ted.amlStorage.modules["AML_" + o.name] = k;
            ted.amlStorage.module_funcs[o.name] = {};
            ted.amlStorage.module_funcs[o.name]
                ["func"] = function(y) {
                    if (tedApi.attr(this.self, "aml") == -1 || (!tedApi.isFunction(y) && !tedApi.isObject(y))) return 0;
                    ted.amlStorage.modules["AML_" + o.name].functions.push({
                        tag: this.self.tagName.toLowerCase(),
                        aml: tedApi.attr(this.self, "aml"),
                        do: y
                    });
                    return this;
                }
            if (typeof o.elm !== typeof undefined) {
                if (o.elm.constructor === Array.prototype.constructor) ted.amlStorage.module_funcs[o.name]
                    ["elm"] = o.elm;
            }
            return true;
        },
        __varFindWithVarAccess: function(a) {
            for (var i = 0; i < ted.amlStorage.vars.length; i++) {
                if (ted.amlStorage.vars[i].varAccess == a) {
                    return ted.amlStorage.vars[i];
                }
            }
            return -1;
        },
        __posVarFindWithVarAccess: function(a) {
            for (var i = 0; i < ted.amlStorage.vars.length; i++) {
                if (ted.amlStorage.vars[i].varAccess == a) {
                    return i;
                }
            }
            return -1;
        },
        __varFindWithAccessKey: function(a) {
            var All = [];
            for (var i = 0; i < ted.amlStorage.vars.length; i++) {
                if (ted.amlStorage.vars[i].access == a) {
                    All.push(ted.amlStorage.vars[i]);
                }
            }
            if (All.length > 0) return All;
            return -1;
        },
        amlVar: function(el, f, r) {
            if (typeof el === typeof undefined) return undefined;
            if (typeof r == typeof undefined) r = "not";
            r = r.toString()
                .toLowerCase();
            var AVK = el.accessVar(f.trim());

            function rr(b) {
                return eval(b);
            }
            if (AVK != -1) {
                var FU = aml.__varFindWithVarAccess(AVK)
                    .right;
                if (r == "run") FU = rr.call(el, rr.call(el, FU));
                else if (r == "number") FU = parseInt(rr.call(el, FU));
                return FU;
            }
            return undefined;
        },
        editVar: function(n, v, o) {
            if (typeof n === typeof undefined || typeof v === typeof undefined || typeof o === typeof undefined || !(tedApi.isElement(o)) || typeof o.AML_AccessKey === typeof undefined)
                return 0;
            var y = aml.__varFindWithAccessKey(o.AML_AccessKey);
            if (y == -1) return -1;
            for (var i = 0; i < y.length; i++) {
                if (y[i].left == n) {
                    ted.amlStorage.vars[aml.__posVarFindWithVarAccess(y[i].varAccess)].right = (typeof v == "string" ? "'" + v + "'" : tedApi.objectToString(v)
                        .toString());
                    return 1;
                }
            }
            return -2;
        },
        varExist: function(f, el) {
            if (typeof el === typeof undefined || !(tedApi.isElement(el))) return false;
            var AVK = el.accessVar(f);
            if (AVK != -1) {
                return true;
            }
            return false;
        },
        addVar: function(v, o) {
            if (typeof v === typeof undefined || !(tedApi.isElement(o))) return -3;
            if (typeof v.name === typeof undefined || typeof v.value === typeof undefined) return -2;
            if (typeof o.AML_AccessKey === typeof undefined) return -1;
            if (aml.varExist(v.name, o)) {
                var c = aml.editVar(v.name, v.value, o);
                return (c === 1 ? 1 : 0);
            }
            var u = "Var_" + tedApi.random(30, "hash");
            var p = {
                left: (typeof v.name == "string" ? v.name : v.name.toString()),
                right: (typeof v.value == "string" ? "'" + v.value.escape() + "'" : tedApi.objectToString(v.value)
                    .toString()),
                access: o.AML_AccessKey,
                varAccess: u
            };
            ted.amlStorage.vars.push(p);
            return 1;
        },
        varValue: function(n, el) {
            if (typeof n === typeof undefined || typeof el === typeof undefined || !(tedApi.isElement(el))) return undefined;
            while (el) {
                var G = aml.__varFindWithAccessKey(el.AML_AccessKey, n);
                if (G != -1) {
                    for (var GL = 0; GL < G.length; GL++) {
                        if (G[GL].left == n) {
                            try {
                                return tedApi.run.call(el, "return " + G[GL].right);
                            } catch (e) {
                                return G[GL].right
                            }
                        }
                    }
                }
                el = el.parentNode;
            }
            return undefined;
        },
        module: function(v) {
            if (typeof v != "string") return {
                type: "error",
                message: "Module Input Must Be String!"
            };
            var o = document.querySelectorAll("[aml='" + v + "']");
            if (o.length == 0) return {
                type: "error",
                message: "There Is No Such Element!"
            };
            if (o.length > 1) return {
                type: "error",
                message: "There Is More Than One Element With This AML Name!"
            };
            var st = {};
            for (var nn in ted.amlStorage.module_funcs) {
                if (ted.amlStorage.module_funcs.hasOwnProperty(nn)) {
                    if (ted.amlStorage.module_funcs[nn]
                        ["elm"].indexOf(o[0].tagName.toLowerCase()) != -1 || ted.amlStorage.module_funcs[nn]
                        ["elm"].isEmpty()) {
                        st[nn] = ted.amlStorage.module_funcs[nn]
                            ["func"];
                    }
                }
            }
            var j = st;
            j.self = o[0];
            return tedApi.constObj(j, "Module");
        },
        varCompile: function(el) {
            var THAT = el,
                TIH = (tedApi.isElement(el) ? el.innerHTML : el.nodeValue),
                chld = el.children,
                choh = [],
                Vars = [],
                IsText = (tedApi.isElement(el) ? false : true);
            if (!tedApi.isUndefined(chld)) {
                for (var i = 0; i < chld.length; i++) {
                    choh.push({
                        html: chld[i].outerHTML,
                        AC: tedApi.random(100, "number")
                    });
                }
            }
            for (var i = 0; i < choh.length; i++) {
                TIH = TIH.replace(choh[i].html, "&%AML_" + choh[i].AC + "%&");
            }
            var VAR_REGEXP = /\{\{(\s*(js\s*\:|aml\s*\:|)\s*([\u0622-\u06CC\s\w\d\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\/\|\\\'\"\?\>\.\<\,\;\:\]\[]+))\s*\}\}/igm;
            var WH_TR = true;
            while (WH_TR && TIH.match(VAR_REGEXP) !== null) {
                var VARIABLES = TIH.match(VAR_REGEXP);
                if (VARIABLES !== null) {
                    var LEN = VARIABLES.length;
                    for (var t = 0; t < LEN; t++) {
                        var f = VARIABLES[t];
                        var FU = 0;
                        f = f.slice(2, -2)
                            .trim();
                        if (/js\s*\:/.test(f)) {
                            f = f.slice(3);
                            try {
                                FU = tedApi.run.call(THAT, f);
                            } catch (e) {
                                FU = undefined;
                            }
                        } else if (/aml\s*\:/.test(f)) {
                            f = f.slice(4);
                            var AVK = aml.amlVar(THAT, f);
                            if (typeof AVK !== typeof undefined && f.toLowerCase() != "undefined" && f.toLowerCase() != "'undefined'") {
                                FU = tedApi.objectToString(AVK);
                            } else {
                                WH_TR = false;
                                continue;
                            }
                        } else {
                            var AVK = aml.amlVar(THAT, f);
                            if (typeof AVK !== typeof undefined && f.toLowerCase() != "undefined" && f.toLowerCase() != "'undefined'") {
                                FU = tedApi.objectToString(AVK);
                            } else {
                                try {
                                    FU = tedApi.run.call(THAT, f);
                                } catch (e) {
                                    WH_TR = false;
                                    continue;
                                }
                            }
                        }
                        Vars.push({
                            text: VARIABLES[t],
                            runed: FU
                        });
                    }
                    for (var n = 0; n < Vars.length && WH_TR; n++) {
                        TIH = TIH.replace(Vars[n].text, (Vars[n].runed instanceof HTMLElement ? Vars[n].runed.outerHTML : Object.prototype.toString.call(Vars[n].runed) ==
                            "[object HTMLDocument]" ? Vars[n].runed.body.innerHTML : Vars[n].runed));
                    }
                    for (var n = 0; n < choh.length && WH_TR; n++) {
                        TIH = TIH.replace("&%AML_" + choh[n].AC + "%&", choh[n].html);
                    }
                    if (WH_TR && IsText) THAT.nodeValue = TIH;
                    if (WH_TR && !IsText) THAT.innerHTML = TIH;
                }
            }
        },
        adVariable: function(obj) {
            if (typeof obj != "object") return -1
            if (typeof obj.for === typeof undefined || !(obj.for instanceof HTMLElement)) obj.for = document.querySelector("html");
            if (typeof obj.name === typeof undefined || typeof obj.value === typeof undefined) return -1;
            var VACC = "Var_" + tedApi.random(30, "hash");
            var OBJECT = {
                left: obj.name,
                right: obj.value,
                access: obj.for.AML_AccessKey,
                varAccess: VACC
            };
            ted.amlStorage.vars.push(OBJECT);
            aml.varCompile(obj.for);
            return aml.__posVarFindWithVarAccess(VACC);
        },
    };
    var AML_IMPORT = ted.define("import", ["parse", "src"]),
        AML_SWITCH = ted.define("switch", ["cond"]),
        AML_IF = ted.define("if", ["is", "not"]),
        AML_FOR = ted.define("for", ["from", "to", "step", "stepback", "infinity", "is", "append"]),
        AML_GO = ted.define("go", ["to", "after"]),
        AML_DEFINE = ted.define("def", ["name"]),
        AML_FUNCTIONS = ted.define("func", ["name"]);
    ted.create(AML_IMPORT, function(parse, src) {
        var THAT = this;
        this.html("");
        if (typeof src === typeof undefined) return 0;
        if (typeof parse === typeof undefined) parse = "text";
        var t = ["html", "text", "xml", "json", "js", "css", "image"];
        if (t.indexOf(parse) == -1) return 0;
        if (parse == "image") {
            var j = document.createElement("img");
            if (tedApi.hasattr(this.self, "success")) {
                j.onload = new Function(tedApi.attr(this.self, "success"));
            }
            if (tedApi.hasattr(this.self, "error")) {
                j.onerror = new Function(tedApi.attr(this.self, "error"));
            }
            j.src = src;
            this.changeWith(j);
            return 1;
        } else if (parse == "css") {
            var j = document.createElement("link");
            if (tedApi.hasattr(this.self, "success")) {
                j.onload = new Function(tedApi.attr(this.self, "success"));
            }
            j.href = src;
            j.rel = "stylesheet";
            this.changeWith(j);
            return 1;
        } else if (parse == "js") {
            var j = document.createElement("script");
            if (tedApi.hasattr(this.self, "success")) {
                j.onload = new Function(tedApi.attr(this.self, "success"));
            }
            if (tedApi.hasattr(this.self, "error")) {
                j.onerror = new Function(tedApi.attr(this.self, "error"));
            }
            j.src = src;
            this.changeWith(j);
            return 1;
        } else {
            var v = {
                type: parse,
                url: src,
                async: false,
            };
            if (tedApi.hasattr(this.self, "success")) {
                v.success = new Function("content", "xhr", tedApi.attr(this.self, "success"));
            } else {
                v.success = new Function("return 1;");
            }
            if (tedApi.hasattr(this.self, "save")) {
                (function() {
                    var n = v.success;
                    v.success = function(a) {
                        window[tedApi.attr(THAT.self, "save")] = a.content;
                        ted.returnBack(THAT.self);
                        THAT.show();
                        n.call(THAT.self, a.content, this);
                    }
                })();
            } else {
                (function() {
                    var n = v.success;
                    v.success = function(a) {
                        THAT.html(
                            (parse == "html" ? a.content.body.innerHTML : parse == "xml" ? a.content.documentElement.innerHTML : parse == "json" ? tedApi.serialize(a.content) :
                                a.content));
                        THAT.show();
                        n.call(THAT.self, a.content, this);
                    }
                })();
            }
            if (tedApi.hasattr(this.self, "error")) {
                v.error = new Function(tedApi.attr(this.self, "error"));
            }
            if (tedApi.hasattr(this.self, "async")) {
                v.async = true;
            }
            tedApi.http(v);
        }
    });
    ted.create(AML_SWITCH, function(cond) {
        if (typeof cond === typeof undefined) return false;
        var Sons;
        this.removeText();
        tedApi.each(this.sons(), function() {
            tedApi.hide(this);
        });
        Sons = this.sons("case");
        for (var i = 0; i < Sons.length; i++) {
            if (tedApi.hasattr(Sons[i], "cond")) {
                ted.compile(Sons[i]);
                if (tedApi.attr(Sons[i], "cond") == cond) {
                    tedApi.show(Sons[i]);
                    if (tedApi.hasattr(Sons[i], "break")) {
                        break;
                    }
                }
            }
        }
        this.show();
    });
    ted.create(AML_IF, function(is, not) {
        if (typeof is === typeof undefined && typeof not === typeof undefined) return false;
        if (typeof not === typeof undefined) {
            try {
                if (this.run("return " + is)) this.show();
            } catch (e) {
                this.hide();
            }
        } else if (typeof is === typeof undefined) {
            try {
                if (!this.run("return " + not)) this.show();
            } catch (e) {
                this.hide();
            }
        } else {
            try {
                if (this.run("return " + is) && !this.run("return " + not)) this.show();
            } catch (e) {
                this.hide();
            }
        }
    });
    ted.create(AML_FOR, function(from, to, step, stepback, infinity, is, append) {
        if (typeof from === typeof undefined) {
            return -1;
        }
        var SK = 1;
        var TSelf = this,
            SELF = this.self;
        if (typeof step !== typeof undefined && typeof stepback !== typeof undefined) return -1;
        if (typeof step === typeof undefined) {
            SK = 2;
        }
        if (typeof to === typeof undefined && typeof infinity === typeof undefined) {
            return -1;
        }
        this.show();
        var THAT = this;
        var content = this.html();
        if (aml.varExist(THAT.name, THAT.self)) {
            aml.editVar(THAT.name, 0, THAT.self);
        } else {
            aml.addVar({
                name: THAT.name,
                value: 0
            }, THAT.self);
        }
        var StepObj = {
            val: 0,
            kind: 1
        };
        if (/\d+(s|ms|m|h|)/.test((SK == 1 ? step : stepback))) {
            if (SK == 1) {
                step = step.trim();
            } else {
                stepback = stepback.trim();
            }
            if (/\d+s/.test((SK == 1 ? step : stepback))) {
                StepObj.val = tedApi.run.call(THAT, "return " + (SK == 1 ? step : stepback)
                    .replace("s", "")) * 1000;
                StepObj.kind = 2;
            } else if (/\d+ms/.test((SK == 1 ? step : stepback))) {
                StepObj.val = tedApi.run.call(THAT, "return " + (SK == 1 ? step : stepback)
                    .replace("ms", ""));
                StepObj.kind = 2;
            } else if (/\d+m/.test((SK == 1 ? step : stepback))) {
                StepObj.val = tedApi.run.call(THAT, "return " + (SK == 1 ? step : stepback)
                    .replace("m", "")) * 60 * 1000;
                StepObj.kind = 2;
            } else if (/\d+h/.test((SK == 1 ? step : stepback))) {
                StepObj.val = tedApi.run.call(THAT, "return " + (SK == 1 ? step : stepback)
                    .replace("h", "")) * 60 * 60 * 1000;
                StepObj.kind = 2;
            } else if (/\d+/.test((SK == 1 ? step : stepback))) {
                StepObj.val = tedApi.run.call(THAT, "return " + (SK == 1 ? step : stepback));
                StepObj.kind = 1;
            } else {
                return -1;
            }
            from = tedApi.run.call(THAT, "return " + from);
            if (typeof to !== typeof undefined) {
                to = tedApi.run.call(THAT, "return " + to);
            }
            if (SK == 1) {
                if (from > to && typeof infinity === typeof undefined) {
                    return -2;
                }
            } else {
                if (from < to && typeof infinity === typeof undefined) {
                    return -2;
                }
            }
            if (typeof from != "number" || (typeof to != "number" && typeof infinity === typeof undefined) || typeof StepObj.val != "number") return -1;
            if (StepObj.kind == 1) {
                if (SK == 1) {
                    THAT.html("");

                    function IsCond() {
                        var IsCondition = false;
                        try {
                            IsCondition = (TSelf.attr("is") !== null ? !(!tedApi.run.call(TSelf.self, "return " + TSelf.attr("is"))) : true);
                        } catch (e) {
                            IsCondition = false;
                        }
                        return IsCondition;
                    }
                    for (var Loop = from; Loop < to && IsCond(); Loop += StepObj.val) {
                        aml.editVar(THAT.name, Loop, THAT.self);
                        if (tedApi.isUndefined(append)) THAT.self.innerHTML = content;
                        else {
                            THAT.self.innerHTML += content;
                        }
                        var elQ = tedApi.children(THAT.self);
                        for (var n = 0; n < elQ.length; n++) {
                            ted.compile(elQ[n]);
                        }
                    }
                } else {
                    THAT.html("");

                    function IsCond() {
                        var IsCondition = false;
                        try {
                            IsCondition = (TSelf.attr("is") !== null ? !(!tedApi.run.call(TSelf.self, "return " + TSelf.attr("is"))) : true);
                        } catch (e) {
                            IsCondition = false;
                        }
                        return IsCondition;
                    }
                    for (var Loop = to; Loop >= from && IsCond(); Loop -= StepObj.val) {
                        aml.editVar(THAT.name, Loop, THAT.self);
                        if (tedApi.isUndefined(append)) THAT.self.innerHTML = content;
                        else {
                            THAT.self.innerHTML += content;
                        }
                        var el = tedApi.children(THAT.self);
                        for (var n = 0; n < el.length; n++) {
                            ted.compile(el[n]);
                        }
                    }
                }
            } else {
                if (SK == 1) {
                    var Loop = from;
                    THAT.html("")
                    var InterTime = setInterval(function() {
                        Loop++;
                        var IsCondition = (TSelf.attr("is") !== null ? tedApi.run.call(TSelf.self, "return " + TSelf.attr("is")) : 1);
                        if (
                            (typeof infinity === typeof undefined ? (Loop >= to - 1) : 0) || !IsCondition) clearInterval(InterTime);
                        aml.editVar(THAT.name, Loop, THAT.self);
                        if (tedApi.isUndefined(append)) THAT.self.innerHTML = content;
                        else {
                            THAT.self.innerHTML += content;
                        }
                        var elL = tedApi.children(THAT.self);
                        for (var n = 0; n < elL.length; n++) {
                            ted.compile(elL[n]);
                        }
                    }, StepObj.val);
                } else {
                    var Loop = from;
                    THAT.html("")
                    var InterTime = setInterval(function() {
                        Loop--;
                        var IsCondition = (TSelf.attr("is") !== null ? tedApi.run.call(TSelf.self, "return " + TSelf.attr("is")) : 1);
                        if (
                            (typeof infinity === typeof undefined ? (Loop <= to) : 0) && !IsCondition) clearInterval(InterTime);
                        aml.editVar(THAT.name, Loop, THAT.self);
                        if (tedApi.isUndefined(append)) THAT.self.innerHTML = content;
                        else {
                            THAT.self.innerHTML += content;
                        }
                        var elL = tedApi.children(THAT.self);
                        for (var n = 0; n < elL.length; n++) {
                            ted.compile(elL[n]);
                        }
                    }, StepObj.val);
                }
            }
        }
    });
    ted.create(AML_GO, function(to, afetr) {
        var time = 0,
            THAT = this;
        if (typeof to === typeof undefined) {
            return 0;
        }
        to = to.trim();
        if (typeof afetr !== typeof undefined) {
            afetr = afetr.trim();
        }
        if (to == "here") {
            to = window.location.href;
        }
        if (/^\d+(s|ms|m|h|)$/.test(afetr) && typeof afetr !== typeof undefined) {
            if (/\d+s/.test(afetr)) {
                time = tedApi.run.call(THAT, "return " + afetr.replace("s", "")) * 1000;
            } else if (/\d+ms/.test(afetr)) {
                time = tedApi.run.call(THAT, "return " + afetr.replace("ms", ""));
            } else if (/\d+m/.test(afetr)) {
                time = tedApi.run.call(THAT, "return " + afetr.replace("m", "")) * 60 * 1000;
            } else if (/\d+h/.test(afetr)) {
                time = tedApi.run.call(THAT, "return " + afetr.replace("h", "")) * 60 * 60 * 1000;
            }
            if (time < 0) return 0;
        }
        var RedFunc = function() {
            window.location.replace(to);
        };
        if (time == 0) {
            RedFunc();
        } else {
            setTimeout(function() {
                RedFunc();
            }, time);
        }
    });
    ted.create(AML_DEFINE, function(name) {
        var DName = ted.define("def-" + name, []);
        var In = this.html();
        ted.create(DName, function() {
            this.asHtml(In);
        });
        this.delete();
    });
    ted.create(AML_FUNCTIONS, function(name) {
        var INN = this.html(),
            AttrsOfFunc = [],
            ThisAttr = this.attr(),
            FTHAT = this,
            REG = new RegExp("" + name + "\\-[\\w\\d\\$]+", "i");
        var StorageElm = FTHAT.html();
        for (var x in ThisAttr) {
            if (REG.test(x)) {
                AttrsOfFunc.push(x.replace(name + "-", ""));
            }
        }
        var Fn_T = ted.define(name, AttrsOfFunc);
        ted.create(Fn_T, function() {
            this.html(StorageElm);
            var THAT = this.self,
                AOF = AttrsOfFunc,
                FNAME = name,
                ARGS = arguments;

            function FN_SetVar(obj) {
                for (var i = 0; i < AttrsOfFunc.length; i++) {
                    if (tedApi.attr(obj, "var") !== null) {
                        tedApi.attr(obj, "var", (tedApi.attr(obj, "var") !== null ? tedApi.attr(obj, "var") : "") + ";" + ThisAttr[FNAME + "-" + AOF[i]] + "=" + (typeof ARGS[i] !==
                            typeof undefined ? "'" + ARGS[i].escape() + "'" : ARGS[i]));
                    }
                }
            }

            function Ad_FN_SetVar(obj) {
                for (var i = 0; i < AttrsOfFunc.length; i++) {
                    var Out = aml.adVariable({
                        for: obj,
                        name: ThisAttr[FNAME + "-" + AOF[i]],
                        value: (typeof ARGS[i] !== typeof undefined ? "'" + ARGS[i].escape() + "'" : ARGS[i])
                    });
                }
            }
            Ad_FN_SetVar(this.self)
            for (var k = 0; k < tedApi.children(this.self)
                .length; k++) {}
            this.show();
        });
        this.delete();
    });
    ted.creatAttr("change", function(b) {
        var THIS = this.self,
            TH = this;
        var des = tedApi.elm("[aml='" + b.escape() + "']");
        if (des === null) return -1;
        if (des.constructor == Array.prototype.constructor) des = des[0];
        if (typeof des.value === typeof undefined) return -1;
        var v = des.value;
        if (aml.varExist(b + "_val", THIS)) {
            aml.editVar(b + "_val", v, THIS);
        } else {
            aml.addVar({
                name: b + "_val",
                value: v
            }, THIS);
        }
        des.onchange = des.oninput = function() {
            var THAT = this;
            if (aml.varExist(b + "_val", THIS)) {
                aml.editVar(b + "_val", THAT.value, THIS);
            } else {
                aml.addVar({
                    name: b + "_val",
                    value: THAT.value
                }, THIS);
            }
            ted.returnBack(THIS);
            tedApi.compile(THIS);
        };
    }, []);
    ted.creatAttr("var", function(content) {
        var THAT = this;
        var RE =
            /([\w\$\_]+)(\s*\=\s*)([\w\$\_]+\(.+?(?!\;)\)|\{.+?(?!\;)\}|\[.+?(?!\;)\]|\d+|[\s\w\d\$\_]+|\'[\w\d\s\;\`\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\"\/\?\.\>\,\<\\\|\}\]\{\[\:]*\'|\"[\w\d\s\;:\`\~\!\@\#\$\%\^\&\*\(\)\_\+\=\-\'\/\?\.\>\,\<\\\|\}\]\{\[]*\")\s*/igm;
        var All = content.match(RE);
        if (All === null) return -1;
        for (var i = 0; i < All.length; i++) {
            var na = All[i];
            var y = na.slice(na.indexOf("=") + 1)
                .trim();
            if (y[0] == "'" && y[y.length - 1] == "'" || y[0] == '"' && y[y.length - 1] == '"') {
                y = "'" + y.escape() + "'";
            }
            var RightText = tedApi.run.call(THAT.self, "return " + y);
            var OBJECT = {
                left: na.slice(0, na.indexOf("="))
                    .replace(/\s+/, ""),
                right: RightText,
                access: THAT.self.AML_AccessKey,
                varAccess: "Var_" + tedApi.random(30, "hash")
            };
            try {
                eval(OBJECT.right);
                var trust = true;
                for (var j = 0; j < ted.amlStorage.vars.length; j++) {
                    var asv = ted.amlStorage.vars[j];
                    if (asv.left == OBJECT.left && asv.access == OBJECT.access) {
                        trust = false;
                        aml.editVar(asv.left, OBJECT.right, THAT.self)
                    }
                }
                if (trust) ted.amlStorage.vars.push(OBJECT);
            } catch (e) {
                tedApi.error("Uncaught: This statement is Wrong: " + OBJECT.right + "\n  Element:" + THAT.self.tagName);
                continue;
            }
        }
    }, []);
    ted.creatAttr("repeat", function(content) {
        var reg_to = /(\d+)\s*to\s*(\d+)/,
            reg_in = /([\d\w\$]+)\s+in\s+(\[[\S\s]+\])/,
            reg_as = /(\{[\S\s]+\})\s+as\s+([\w\$\d]+)\s*\=\>\s*([\w\$\d]+)/,
            THIS = this.self;
        if (reg_to.test(content)) {
            content = content.match(reg_to)[0];
            var __ans = content.match(reg_to);
            var start = parseInt(__ans[1]),
                end = parseInt(__ans[2]);
            if (aml.varExist(THIS.tagName.toLowerCase() + "_loop", THIS)) {
                aml.editVar(THIS.tagName.toLowerCase() + "_loop", start, THIS);
            } else {
                aml.addVar({
                    name: THIS.tagName.toLowerCase() + "_loop",
                    value: start
                }, THIS);
            }
            var pointDom = THIS;
            for (var i = (start < end) ? start + 1 : start - 1;
                (start < end) ? (i <= end) : (i >= end);
                (start < end) ? i++ : i--) {
                var elm = document.createElement(THIS.tagName.toLowerCase());
                elm.innerHTML = THIS.innerHTML;
                var ELM = tedApi.insert(elm);
                ELM.after(pointDom);
                tedApi.copyAttr(THIS, elm);
                tedApi.removeAttr(elm, "repeat");
                tedApi.compile(elm);
                if (aml.varExist(THIS.tagName.toLowerCase() + "_loop", elm)) {
                    aml.editVar(THIS.tagName.toLowerCase() + "_loop", start, elm);
                } else {
                    aml.addVar({
                        name: THIS.tagName.toLowerCase() + "_loop",
                        value: i
                    }, elm);
                }
                pointDom = elm;
            }
        } else if (reg_in.test(content)) {
            content = content.match(reg_in)[0];
            var __ans = content.match(reg_in);
            var dim = __ans[1],
                array = __ans[2];
            try {
                eval("array = " + array);
            } catch (e) {
                return 0;
            }
            if (aml.varExist(dim, THIS)) {
                aml.editVar(dim, array[0], THIS);
            } else {
                aml.addVar({
                    name: dim,
                    value: array[0]
                }, THIS);
            }
            var pointDom = THIS;
            for (var i = 1; i < array.length; i++) {
                var elm = document.createElement(THIS.tagName.toLowerCase());
                elm.innerHTML = THIS.innerHTML;
                var ELM = tedApi.insert(elm);
                ELM.after(pointDom);
                tedApi.copyAttr(THIS, elm);
                tedApi.removeAttr(elm, "repeat");
                tedApi.compile(elm);
                if (aml.varExist(dim, elm)) {
                    aml.editVar(dim, array[0], elm);
                } else {
                    var t = aml.addVar({
                        name: dim,
                        value: array[i]
                    }, elm);
                }
                pointDom = elm;
            }
        } else if (reg_as.test(content)) {
            content = content.match(reg_as)[0];
            var __ans = content.match(reg_as);
            var obj = __ans[1],
                key = __ans[2],
                value = __ans[3];
            try {
                obj = tedApi.run.call(THIS, "return " + obj);
            } catch (e) {
                return 0;
            }
            var i = 0;
            var pointDom = THIS;
            tedApi.each(obj, function(_Key) {
                if (tedApi.isFunction(this)) return 0;
                if (i == 0) {
                    if (aml.varExist(key, THIS) && aml.varExist(value, THIS)) {
                        aml.editVar(key, _Key, THIS);
                        aml.editVar(value, this, THIS);
                    } else {
                        aml.addVar({
                            name: key,
                            value: _Key
                        }, THIS);
                        aml.addVar({
                            name: value,
                            value: this
                        }, THIS);
                    }
                } else {
                    var elm = document.createElement(THIS.tagName.toLowerCase());
                    var ELM = tedApi.insert(elm);
                    ELM.after(pointDom);
                    tedApi.compile(elm);
                    tedApi.copyAttr(THIS, elm);
                    tedApi.removeAttr(elm, "repeat");
                    if (aml.varExist(key, elm) && aml.varExist(value, elm)) {
                        aml.editVar(key, _Key, elm);
                        aml.editVar(value, this, elm);
                    } else {
                        var y = aml.addVar({
                            name: key,
                            value: _Key
                        }, elm);
                        var t = aml.addVar({
                            name: value,
                            value: this
                        }, elm);
                    }
                    elm.innerHTML = THIS.innerHTML;
                    pointDom = elm;
                }
                i++;
            });
        } else {
            return 0;
        }
    }, []);
    ted.beforeCompile(function(t) {
        if (!tedApi.isElement(this) && !tedApi.isTextNode(this)) return 0;
        if (tedApi.isUndefined(this.AML_AccessKey)) this.AML_AccessKey = "AML_" + tedApi.random(24, "hash");
        if (tedApi.isTextNode(this)) return 0;
        if (t) return 0;
        ted.amlStorage.runModules(this, 1);
    });
    ted.beforeElementRun(function(t) {
        if (t) return 0;
        var THAT = this;
        for (var x in ted._Elements) {
            if (typeof ted._Elements[x]["function"] !== typeof undefined) {
                if (ted._Elements[x]["tagName"].toLowerCase() == THAT.tagName.toString()
                    .toLowerCase()) {
                    for (var h = 0; h < ted._Elements[x]
                        ["attributes"].length; h++) {
                        var ATTRSTART = '';
                        var ELPOINT = ted._Elements[x]
                            ["attributes"]
                            [
                                h
                            ];
                        var NAME__ = THAT.tagName.toLowerCase() + "_" + ELPOINT;
                        if (THAT.hasAttribute(ELPOINT)) {
                            if (!aml.varExist(NAME__, THAT)) {
                                aml.addVar({
                                    name: NAME__,
                                    value: THAT.getAttribute(ELPOINT)
                                }, THAT);
                            } else {
                                aml.editVar(NAME__, THAT.getAttribute(ELPOINT), THAT)
                            }
                        }
                    }
                }
            }
        }
    });
    ted.beforeCompile(function(t) {
        if (t) return 0;
        var THAT = this;
        if (!tedApi.isElement(this)) return 0;
        for (var i = 0; i < THAT.attributes.length; i++) {
            var atp = THAT.attributes[i];
            var ATP_Regexp =
                /\{\{(\s*(js\s*\:|aml\s*\:|)\s*([\u0622-\u06CC\w\d\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\/\|\\\'\"\?\>\.\<\,\;\:\]\[\s]+|[\u0622-\u06CC\s\w\d\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\/\|\\\'\"\?\>\.\<\,\;\:\]\[]+))\s*\}\}/igm;
            var WTrue = true;
            while (atp.value.match(ATP_Regexp) !== null && WTrue) {
                var Vatp = atp.value.match(ATP_Regexp);
                if (Vatp !== null) {
                    for (var j = 0; j < Vatp.length; j++) {
                        var f = Vatp[j];
                        var FU = 0;
                        f = f.slice(2, -2)
                            .trim();
                        if (/js\s*\:/.test(f)) {
                            f = f.slice(3);
                            try {
                                FU = tedApi.run.call(THAT, f);
                            } catch (e) {
                                FU = undefined
                            }
                        } else if (/aml\s*\:/.test(f)) {
                            f = f.slice(4);
                            var AVK = aml.amlVar(THAT, f);
                            if (typeof AVK !== typeof undefined && f.toLowerCase() != "undefined" && f.toLowerCase() != "'undefined'") {
                                FU = tedApi.objectToString(AVK);;
                            } else {
                                tedApi.warn("Warning: The AML Variable Doesn't Exist: " + f + "\n  Element:" + THAT.tagName);
                                WTrue = false;
                                continue;
                            }
                        } else {
                            var AVK = aml.amlVar(THAT, f);
                            if (typeof AVK !== typeof undefined && f.toLowerCase() != "undefined" && f.toLowerCase() != "'undefined'") {
                                FU = tedApi.objectToString(AVK);
                            } else {
                                try {
                                    FU = tedApi.run.call(THAT, f);
                                } catch (e) {
                                    FU = "";
                                }
                            }
                        }
                        THAT.attributes[i].nodeValue = THAT.attributes[i].value.replace(Vatp[j], FU);
                    }
                }
            }
        }
    });
    ted.afterCompile(function(t) {
        if (t) return 0;
        if (tedApi.isElement(this)) {
            ted.amlStorage.runModules(this, -1);
        }
    });
})();
ted.creatTextNode(/\{\{(\s*(js\s*\:|aml\s*\:|)\s*([\u0622-\u06CC\s\w\d\~\!\@\#\$\%\^\&\*\(\)\_\-\+\=\/\|\\\'\"\?\>\.\<\,\;\:\]\[]+))\s*\}\}/g, function(b) {
    aml.varCompile(this);
});
this.aml = aml;
