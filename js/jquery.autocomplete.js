/*
*  Ajax Autocomplete for jQuery, version 1.1
*  (c) 2009 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
*
*  Last Review: 09/27/2009
*
*  Edited by molokoloco (double suggest) 13/03/2010
*
*/
//	$('#q').autocomplete({ 
//		suggestUrl:'_auto_suggest.php',
//		minChars:0, 
//		autoSubmit: false,
//		delimiter: /( )\s*/, //  regex or character : /(,|;)\s*/
//		maxHeight:600,
//		//width:'100%',
//		zIndex: 9999,
//		deferRequestBy: 0, //miliseconds
//		//params: { pages:'Yes' }, //aditional parameters
//		//params: { first:'John', last:'Doe' }
//		// callback function:
//		onSelect: function(value, data){ db('You selected: ' + value + ', ' + data); }
//	});
(function ($) {

    function Autocomplete(el, options) {
        this.el = $(el);
        this.el.attr('autocomplete', 'off');
        this.suggestions = [];
		this.suggestionsS = [];
        this.data = [];
		this.dataS = [];
        this.badQueries = [];
		this.badQueriesS = []; 
        this.selectedIndex = -1;
        this.currentValue = this.el.val();
        this.intervalId = 0;
        this.cachedResponse = [];
		this.cachedResponseS = [];
        this.onChangeInterval = null;
        this.ignoreValueChange = false;
        this.suggestUrl = options.suggestUrl;
		this.seedsUrl = options.seedsUrl; // Mlklc
		this.i = 0;
		this.request = null;
		this.requestS = null;
        this.options = {
            autoSubmit: false,
            minChars: 1,
            maxHeight: 300,
            deferRequestBy: 0,
            width: (parseInt(this.el.width()) + 35) + 'px', // Mlklc (35 == innerPadding)
            highlight: true,
            params: {},
			delimiter: null,
            zIndex: 9999,
            fnFormatResult: function (value, data, currentValue) {
				var reEscape = new RegExp('(\\' + ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'].join('|\\') + ')', 'g');
				var pattern = '(' + currentValue.replace(reEscape, '\\$1') + ')';
				return '<span class="suggestData">' + data + '</span>' + value.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
			}
        };
        this.initialize();
        this.setOptions(options);
		this.autocompleteElId;
		this.mainContainerId;
		this.seedContainerId;
    }

    $.fn.autocomplete = function (options) {
        return new Autocomplete(this.get(0), options);
    };

    Autocomplete.prototype = {

        killerFn: null,

        initialize: function () {
            var me, uid;
            uid = new Date().getTime();
			this.autocompleteElId = 'Autocomplete_' + uid;
			this.mainContainerId = 'AutocompleteContainter_' + uid;
			
			me = this;
			
            me.killerFn = function (e) {
				// if ($('div.autocomplete').size() == 0) {
				if ($(e.target).parents('.autocomplete').size() === 0) {
					me.killSuggestions();
					me.disableKillerFn();
				}
            };
			
            $('<div id="' + me.mainContainerId + '" style="position:absolute;z-index:9999;"><div class="autocomplete-w1"><div class="autocomplete" id="' + me.autocompleteElId + '" style="display:none;width:300px;"></div></div></div>').appendTo('body');
			
			$('<div id="'+me.mainContainerId+'S" style="position:absolute;z-index:9998;"><div class="autocomplete-w1"><div class="autocomplete" id="'+me.autocompleteElId+'S" style="display:none;width:300px;"></div></div></div>').appendTo('body');

            me.container = $('#' + me.autocompleteElId);
			me.seeder = $('#' + me.autocompleteElId+'S');

            $(window).bind('resize', function () {  // Mlklc
                me.fixPosition();
            });
			
			if (window.opera) {
				me.el.keypress(function (e) {
					me.onKeyPress(e);
				});
			} else {
				me.el.keydown(function (e) {
					me.onKeyPress(e);
				});
			}
			me.el.keyup(function (e) {
				me.onKeyUp(e);
			});
            me.el.blur(function () {
                me.enableKillerFn();
            });
            me.el.focus(function () {
                me.fixPosition();
            });
        },

        setOptions: function (options) {
            var o = this.options;
            $.extend(o, options);
            this.container.css({
                maxHeight: o.maxHeight + 'px',
                width: o.width || me.el.width()+'px'
            });
			this.seeder.css({
                maxHeight: o.maxHeight + 'px',
                width: o.width || me.el.width()+'px'
            });
        },

        clearCache: function () { // Not use ?
            this.cachedResponse = [];
            this.badQueries = [];
        },

        disable: function () {
            this.disabled = true;
        },

        enable: function () {
            this.disabled = false;
        },

        fixPosition: function () {
            var offset = this.el.offset();
			$('#' + this.mainContainerId+'S').css({ // top
				top: (offset.top - $('#' + this.autocompleteElId+'S').outerHeight()) + 'px',
				left: offset.left + 'px'
			}); // Mlklc

			$('#' + this.mainContainerId).css({ // bottom
				top: (offset.top + this.el.innerHeight()) + 'px',
				left: offset.left + 'px'
			});
        },

        enableKillerFn: function () {
            var me = this;
            $(document).bind('click', me.killerFn);
        },

        disableKillerFn: function () {
            var me = this;
            $(document).unbind('click', me.killerFn);
        },

        killSuggestions: function () {
            var me = this;
            this.stopKillSuggestions();
            this.intervalId = window.setInterval(function () {
                me.hide();
                me.stopKillSuggestions();
            }, 300);
        },

        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId);
        },

        onKeyPress: function (e) {
            if (this.disabled || (!this.enabled && !this.enabledS)) {
                return;
            }
            // return will exit the function
            // and event will not be prevented
            switch (e.keyCode) {
				case 27: //KEY_ESC:
					this.el.val(this.currentValue);
					this.hide();
					break;
				case 9: //KEY_TAB:
				case 13: //KEY_RETURN:
					if (this.selectedIndex === - 1) {
						this.hide();
						return;
					}
					this.select(this.selectedIndex);
					break;
				case 38: //KEY_UP:
					this.moveUp();
					break;
				case 40: //KEY_DOWN:
					this.moveDown();
					break;
				default:
					return;
            }
            e.stopImmediatePropagation();
            e.preventDefault();
        },

        onKeyUp: function (e) {
            if (this.disabled) {
                return;
            }
            clearInterval(this.onChangeInterval);
            if (this.currentValue !== this.el.val()) {
                if (this.options.deferRequestBy > 0) { // Defer lookup in case when value changes very quickly:
                    var me = this;
                    this.onChangeInterval = setInterval(function () {  me.onValueChange(); }, this.options.deferRequestBy);
                }
				else this.onValueChange();
            }
        },

        onValueChange: function () {
			//db('onValueChange()');
			
			clearInterval(this.onChangeInterval);
			this.currentValue = this.el.val();
			var q = this.getQuery(this.currentValue);
			this.selectedIndex = -1;
			if (this.ignoreValueChange) {
                this.ignoreValueChange = false;
                return;
            }
            if (q === '' || q.length < this.options.minChars) this.hide();
            else {
            	this.getSuggestions(q);
            	this.getSuggestionsS(q);
            }
        },

        getQuery: function (val) {
            if (!this.options.delimiter) return $.trim(val);
            var arr = val.split(this.options.delimiter);
            return $.trim(arr[arr.length - 1]);
        },
		
		getValue: function (val) { // Mlklc
			var del, currVal, arr;
			del = this.options.delimiter;
			if (!del) return value;
			currVal = this.currentValue;
			arr = currVal.split(del);
			if (arr.length === 1) return val;
			return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + val;
		},

        getSuggestions: function (q) {
			//db('getSuggestions()');
			
            var cr, me;
            cr = this.cachedResponse[q];
            if (cr && $.isArray(cr.suggestions)) {
                this.suggestions = cr.suggestions;
                this.data = cr.data;
                this.suggest();
            }
			else if (!this.isBadQuery(q)) {
                me = this;
                if (this.request) this.request.abort();
				this.request = $.get(this.suggestUrl, {query:q}, function (txt) {
                    me.processResponse(txt);
                }, 'text');
            }
        },
        
        getSuggestionsS: function (q) {
            var cr, me;
			cr = this.cachedResponseS[q]; // Mlklc
            if (cr && $.isArray(cr.suggestions)) {
                this.suggestionsS = cr.suggestions;
                this.dataS = cr.data;
                this.suggestS();
            }
			else if (!this.isBadQueryS(q)) {//  && /[ ]$/.test(q) // One word a least ?
                me = this;
				if (this.requestS) this.requestS.abort();
				this.requestS = $.get(this.seedsUrl, {query:q}, function (txt) {
					me.processResponseS(txt);
				}, 'text');
            }
        },

        isBadQuery: function (q) {
			if (this.badQueries.length < 1) return false;
            var i = this.badQueries.length;
            while (i--)
                if (q == this.badQueries[i]) return true;
            return false;
        },
		
		isBadQueryS: function (q) {
			if (this.badQueriesS.length < 1) return false;
			var i = this.badQueriesS.length;
            while (i--)
                if (q == this.badQueriesS[i]) return true;
            return false;
        },

        hide: function () {
            this.enabled = false;
			this.enabledS = false;
            this.selectedIndex = -1;
            this.container.hide().empty();
			this.seeder.hide().empty();
        },
		
		show: function () {
            this.container.show();
			this.seeder.show();
        },

        suggest: function () {
            if (this.suggestions.length === 0) {
                //this.hide();
				this.enabled = false;
				this.container.hide().empty();
                return;
            }

            var me, len, div, f, v, i, s, mOver, mClick;
            me = this;
            len = this.suggestions.length;
            f = this.options.fnFormatResult;
            v = this.getQuery(this.currentValue);
			mOver = function(xi) { return function() { me.activate(xi); }; };
			mClick = function(xi) { return function() { me.select(xi); }; };

            this.container.hide().empty();
            for (i = 0; i < len; i++) {
                s = this.suggestions[i];
                div = $('<div '+(me.selectedIndex === i ? 'class="selected"' : '')+ ' title="' + s + ' (by Google)">' + f(s, this.data[i], v) + '</div>');
                div.mouseover(mOver(i));
                div.click(mClick(i));
                this.container.append(div);
            }
			
			this.i = i;

            this.enabled = true;
            this.container.show();
        },

		suggestS: function () { // Mlklc
            //db('suggestS()');
			//db(this.suggestionsS);
			
			if (this.suggestionsS.length === 0) {
                //this.hide();
				this.enabledS = false;
				this.seeder.hide().empty();
                return;
            }

            var me, len, div, f, v, j, s, mOverS, mClickS;
            me = this;
            len = this.suggestionsS.length;
            f = this.options.fnFormatResult;
            v = this.getQuery(this.currentValue);
			mOverS = function(xi) { return function() { me.activate(xi); }; };
			mClickS = function(xi) { return function() { me.select(xi); }; };
			
            this.seeder.hide().empty();

            for (j = 0; j < len; j++) {
                s = this.suggestionsS[j];
                div = $('<div '+(me.selectedIndex === this.i+j ? 'class="selected"' : '')+ ' title="' + s + ' (by VeryRelated)">' + f(s, this.dataS[j], v) + '</div>');
                div.mouseover(mOverS(this.i+j));
                div.click(mClickS(this.i+j));
                this.seeder.append(div);
            }
			
			this.fixPosition();
			
            this.enabledS = true;
            this.seeder.show();
        },

        processResponse: function (text) {
            var response;
            try { response = eval('(' + text + ')'); }
			catch (err) { return; }
            if (!$.isArray(response.data)) { response.data = []; }
            this.cachedResponse[response.query] = response;
            if (response.suggestions.length === 0) this.badQueries.push(response.query);
            else if (response.query === this.getQuery(this.currentValue)) {
                this.suggestions = response.suggestions;
                this.data = response.data;
                this.suggest();
            }
        },
		
		processResponseS: function (text) { // Mlklc
			//db('processResponseS()');
			//db(responseS);
			
			var responseS;
            try { responseS = eval('(' + text + ')'); }
			catch (err) { return; }

			if (!responseS || !$.isArray(responseS.suggestions) || responseS.suggestions.length === 0) {
				this.badQueriesS.push(responseS.query);
				this.seeder.hide().empty();
			}
			//else if (responseS.query === this.getQuery(this.currentValue)) { // un peu lente l'API ^^
				if (!$.isArray(responseS.suggestions)) responseS.suggestions = [];
				if (!$.isArray(responseS.data)) responseS.data = [];
				this.cachedResponseS[responseS.query] = responseS;
                this.suggestionsS = responseS.suggestions;
                this.dataS = responseS.data;
                this.suggestS();
           //}
        },

        activate: function (index) {
            var divs, activeItem;
			
			//divs =  $(this.container, this.seeder).children('div');
			divs = $('div.autocomplete').children('div');
			
            // Clear previous selection:
            if (this.selectedIndex !== - 1 && divs.length > this.selectedIndex) {
                $(divs.get(this.selectedIndex)).attr('class', '');
            }
            this.selectedIndex = index;
			
            if (this.selectedIndex !== - 1 && divs.length > this.selectedIndex) {
                activeItem = divs.get(this.selectedIndex);
                $(activeItem).attr('class', 'selected');
            }
            return activeItem;
        },

        select: function (i) {
            var selectedValue, f;
			
			// hum... there always a gooogle suggest but not sur for veryRelated
            selectedValue = (this.suggestions[i] || this.suggestionsS[i - this.suggestions.length]); 
			
            if (selectedValue) {
                this.el.val(selectedValue);
                if (this.options.autoSubmit) {
                    f = this.el.parents('form');
                    if (f.length > 0) f.get(0).submit();
                }
                this.ignoreValueChange = true;
                this.hide();
                this.onSelect(i);
            }
        },

        moveUp: function () {
			//db('moveUp('+this.selectedIndex+')');
            if (this.selectedIndex == $('div.autocomplete').children('div').lenght) {
                return;
            }
			else if (this.selectedIndex === 0) {
                this.container.children().get(0).className = '';
                this.selectedIndex = -1;
                this.el.val(this.currentValue);
                return;
            }
			else if (this.selectedIndex === -1) {
                var m = parseInt(this.container.children().length); // this.container.children().length + this.seeder.children().length == NaN ???? Fuck me
				var k = parseInt(this.seeder.children().length);
				var t = (m + k) - 1;
				this.adjustScroll(t);
            }
            else this.adjustScroll(this.selectedIndex - 1);
        },

        moveDown: function () {
			//db('moveDown('+this.selectedIndex+')');
			var last = ($('div.autocomplete').children('div').length - 1);

			if (this.selectedIndex == last) {
				$($('div.autocomplete').children('div').get(this.selectedIndex)).attr('class', '');
				this.selectedIndex = -1;
				this.el.val(this.currentValue);
				return;
			}
			else this.adjustScroll(this.selectedIndex + 1);
        },

        adjustScroll: function (i) {
			//db('adjustScroll('+i+')');
            var activeItem, offsetTop, upperBound, lowerBound, me;
            me = this;
            activeItem = this.activate(i);
			
			if (!activeItem) return; // DEBUG TO DO
            offsetTop = activeItem.offsetTop;
			upperBound = this.container.scrollTop();
            lowerBound = upperBound + this.options.maxHeight - 25;
            if (offsetTop < upperBound) this.container.scrollTop(offsetTop);
            else if (offsetTop > lowerBound) this.container.scrollTop(offsetTop - this.options.maxHeight + 25);

			upperBound = this.seeder.scrollTop(); /// hum to check !!!
            lowerBound = upperBound + this.options.maxHeight - 25;
            if (offsetTop < upperBound) this.seeder.scrollTop(offsetTop);
            else if (offsetTop > lowerBound) this.seeder.scrollTop(offsetTop - this.options.maxHeight + 25);

            /*var getValue = function (value) { // Mlklc
                var del, currVal, arr;
                del = me.options.delimiter;
                if (!del) return value;
                currVal = me.currentValue;
                arr = currVal.split(del);
                if (arr.length === 1) return value;
                return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + value;
            };
            s = (this.suggestions[i] || this.suggestionsS[i - this.suggestions.length]);  // HUM WITCH VALUE HERE ???
            d = (this.data[i] || this.dataS[i - this.data.length]); 
            this.el.val(getValue(s));*/ // Mlklc
			var s = (this.suggestions[i] || this.suggestionsS[i - this.suggestions.length]);  // HUM WITCH VALUE HERE ???
			this.el.val(s); // this.el.val(this.getQuery(this.currentValue));
        },

        onSelect: function (i) {
            var me, onSelect, getValue, s, d;
            me = this;
            onSelect = me.options.onSelect;
            /*getValue = function (value) {
                var del, currVal, arr;
                del = me.options.delimiter;
                if (!del) {
                    return value;
                }
                currVal = me.currentValue;
                arr = currVal.split(del);
                if (arr.length === 1) {
                    return value;
                }
                return currVal.substr(0, currVal.length - arr[arr.length - 1].length) + value;
            };
            s = me.suggestions[i];
            d = me.data[i];
			me.el.val(getValue(s));*/
            
			var s = (me.suggestions[i] || me.suggestionsS[i - me.suggestions.length]);
			me.el.val(me.getQuery(s));
			
			me.el.focus(); // Mlklc
            if ($.isFunction(onSelect)) {
                onSelect(s, d);
            }
        }

    };

}(jQuery));