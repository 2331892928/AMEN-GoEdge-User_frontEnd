(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-21479e40"],{3996:function(e,t,a){},"72a6":function(e,t,a){"use strict";a("3996")},"80e7":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[e._l(e.myRouter,(function(t,i){return[!0!==t.meta.isHidden?[t.meta.itemLabel?a("q-item-label",{key:t.meta.itemLabel,staticClass:"text-weight-bold text-uppercase",attrs:{header:""}},[e._v(" "+e._s(t.meta.itemLabel)+" ")]):e._e(),t.children?a("q-expansion-item",{key:i,class:e.baseItemClassWithNoChildren(t.path),style:e.isWeChart?" line-height: normal":"",attrs:{duration:e.duration,"default-opened":t.meta.isOpen,"header-inset-level":e.initLevel,icon:t.meta.icon,label:t.meta.title}},[a("base-menu-item",{attrs:{"my-router":t.children,"init-level":e.initLevel+.2,"bg-color-level":e.bgColorLevel+1,"bg-color":e.bgColor,"base-path":void 0===e.basePath?t.path:e.basePath+"/"+t.path}})],1):a("q-item",{directives:[{name:"ripple",rawName:"v-ripple"}],key:i,class:e.baseItemClass,style:e.isWeChart?" line-height: normal":"",attrs:{clickable:"",exact:"/console"===t.path,"inset-level":e.initLevel,"active-class":"baseItemActive",to:e.handleLink(e.basePath,t.path)},on:{click:function(a){return e.externalLink(e.basePath,t.path)}}},[a("q-item-section",{attrs:{avatar:""}},[a("q-icon",{attrs:{name:t.meta.icon}})],1),a("q-item-section",[e._v(" "+e._s(t.meta.title)+" ")])],1)]:e._e()]}))],2)},n=[],s=(a("c975"),a("fb6a"),a("2ca0"),{name:"base-menu-item",data:function(){return{baseItemClass:this.bgColor+"-"+this.bgColorLevel+" base-menu-item"}},computed:{baseItemClassWithNoChildren:function(){var e=this;return function(t){return e.$route.fullPath.startsWith(t)?"baseRootItemActive base-menu-item"+e.baseItemClass:e.baseItemClass}},isWeChart:function(){return-1!==navigator.userAgent.toLowerCase().indexOf("micromessenger")}},props:["myRouter","initLevel","bgColor","bgColorLevel","duration","basePath"],methods:{handleLink:function(e,t){var a=void 0===e?t:e+"/"+t;return-1!==a.indexOf("http")?"#":a},externalLink:function(e,t){var a=void 0===e?t:e+"/"+t,i=a.indexOf("http");if(-1!==i){var n=document.createElement("a");return n.setAttribute("href",a.slice(i)),n.setAttribute("target","_blank"),n.click(),!1}}}}),o=s,r=(a("72a6"),a("2877")),l=a("fe09"),c=Object(r["a"])(o,i,n,!1,null,null,null);t["default"]=c.exports;c.options.components=Object.assign(Object.create(c.options.components||null),c.options.components||{},{QItemLabel:l["s"],QItem:l["r"],QItemSection:l["t"],QIcon:l["o"],QExpansionItem:l["l"]}),c.options.directives=Object.assign(Object.create(c.options.directives||null),c.options.directives||{},{Ripple:l["T"]})}}]);