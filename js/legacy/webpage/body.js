/** Page Body

	+ body
		+ body
			+ left_sidebar
			+ center
			+ right_sidebar
	+ dead session

**/

function Body() { 
	this.left_sidebar = null;
	this.right_sidebar = null;
	this.status_area = null;
	var me = this;
	page_body = this;
	
	this.ready = function() {
		$dh('startup_div');
		$ds('body_div');	
	}
	
	this.setup_page_areas = function() {
		this.center = this.body;
		this.center.header = $a(this.center, 'div');
		this.center.body = $a(this.center, 'div');
		this.center.loading = $a(this.center, 'div', '', {margin:'200px 0px', fontSize:'14px', color:'#999', textAlign:'center'});
		this.center.loading.innerHTML = 'Loading...'
				
	}
	
	this.run_startup_code = function() {
		$(document).trigger('startup');
		// startup code
		try{
			if(this.cp.custom_startup_code)
				eval(this.cp.custom_startup_code);
		} catch(e) {
			errprint(e);
		}
	}
	
	this.setup = function() {
		this.cp = wn.control_panel;
		
		this.wrapper = $a($i('body_div'),'div');
		this.body = $a(this.wrapper, 'div');

		this.setup_page_areas();

		// core areas;
		if(user=='Guest') user_defaults.hide_webnotes_toolbar = 1;
		if(!cint(user_defaults.hide_webnotes_toolbar) || user=='Administrator') {
			this.wntoolbar = new wn.ui.toolbar.Toolbar();
		}
		
		// page width
		if(this.cp.page_width) 
			$y(this.wrapper,{width:cint(this.cp.page_width) + 'px'});
		
	}
	
	// Standard containers
	// - Forms
	// - Report Builder
	// - Item List
	// - [Pages by their names]

	this.pages = {};
	this.cur_page = null;
	this.add_page = function(label, onshow, onhide) {
		var c = $a(this.center.body, 'div');
		if(onshow)
			c.onshow = onshow;
		if(onhide)
			c.onhide = onhide;
		this.pages[label] = c;
		$dh(c);
		return c;
	}
	
	this.change_to = function(label) {
		// hide existing
		$dh(this.center.loading);
		if(me.cur_page &&  me.pages[label]!=me.cur_page) {
			if(me.cur_page.onhide)
				me.cur_page.onhide();
			$dh(me.cur_page);
		}
		// show
		me.cur_page = me.pages[label];
		me.cur_page_label = label;
		$(me.cur_page).fadeIn();
	
		// on show
		if(me.cur_page.onshow)
			me.cur_page.onshow(me.cur_page);
	}

	this.set_status = function(txt) {
		if(this.status_area)
			this.status_area.innerHTML = txt;
	}
	
	this.set_session_changed = function() {
		if(this.session_message_set) return;
		var div = $a($i('body_div').parentNode,'div','',{textAlign: 'center', fontSize:'14px', margin:'150px auto'});
		$dh('body_div');
		div.innerHTML = 'This session has been changed. Please <span class="link_type" onclick="window.location.reload()">refresh</span> to continue';
		this.session_message_set = 1;
	}
	
	this.setup();
}