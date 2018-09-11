import '../stylesheets/style.scss'

const lang = require('./lang.json'),
VueColor = require('vue-color'),
Photoshop = VueColor.Photoshop,
Chrome = VueColor.Chrome,
RangeSlider = require('./rangeSlider.js');

let app = new Vue({
  el: '#app',
  data: {
  	showSelectLang: false,
  	lang: lang,
    horizontal_length: 15,
    vertical_length: 15,
    blur: 15,
    radius: 1,
    shadow_color: {
    	hex:"#8A8A8A",
    	out:"#8A8A8A"
    },
    box_color: {
    	hex:"#F0F0F0",
    	out:"#F0F0F0"
    },
    opacity: 1,
    shadow: "",
    shadowText:"",
    inset: false
  },
  components:{
  	"range-slider": RangeSlider,
  	'photoshop-picker': Photoshop,
  	'chrome-picker': Chrome
  },
  methods:{
  	compilecss() {
  		var inset = (this.inset) ? "inset " : "";
  		this.shadow = `${inset}${this.horizontal_length}px ${this.vertical_length}px ${this.blur}px ${this.radius}px ${this.shadow_color.out}`;
		this.compileCode();	  		
  	},
  	compileCode() { 
		this.shadowText = `-webkit-box-shadow: ${this.shadow};\n`;
		this.shadowText += `-moz-box-shadow: ${this.shadow};\n`;
  		this.shadowText += `box-shadow: ${this.shadow};`;
  		if(this.opacity < 1 ) this.shadowText += `\nopacity: ${this.opacity};`;
  		this.shadowText += `\nbackground-color: ${this.box_color.out};`;
  	},
  	reverse(varible) {
  		return (varible) ? false : true;
  	},
  	checkRgba(data) {
  		var out = data.hex;
    	if(data.a < 1){
    		var v = data.rgba;
    		out = `rgba(${v.r},${v.g},${v.b},${v.a})`
    	}
    	return out;
  	}
  },
  mounted () {
  	this.compilecss();
  	var language = localStorage.getItem("lang");

  	if(lang && typeof(this.lang[language]) == "object"){
  		this.lang.current = language;
  	}
  },
  watch: {
   	 	horizontal_length() {	 this.compilecss(); 	},
	    vertical_length() {  	this.compilecss(); },
	    blur() {  this.compilecss(); },
	    inset() {  this.compilecss(); },
	    radius() {  this.compilecss(); },
	    shadow_color: {
	    	deep: true,
	    	handler() {   	
		    	this.shadow_color.out = this.checkRgba(this.shadow_color);
		    	this.compilecss();
	    	}
	    },
	    box_color: {
	    	deep: true,
	    	handler() {   	
		    	this.box_color.out = this.checkRgba(this.box_color);
		    	this.compilecss();
	    	}
	    },
	    opacity() {  	this.compilecss(); },
	    lang: {
	    	deep: true,
	    	handler() {
		    	localStorage.setItem("lang", this.lang.current);
		    }
	    }
   }
});

jQuery(document).ready(function($) {
  let clipboard = new ClipboardJS('.copy');
  clipboard.on('success', function(e) {
      new Noty({
        text: lang[app.lang.current].copied,
        timeout: 1000
      }).show();
  });
  $("body").on('click', '.copy', function(event) {
    event.preventDefault();
  });

  $("body").on('click', '.shadow-row-data > p', function(event) {
    event.preventDefault();
    $(this).next().toggleClass('active');
    $(this).toggleClass('active');
  });
});