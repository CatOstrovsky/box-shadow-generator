var RangeSlider = {
  
  template: `<div class="range-wrapper">
  				<div class="range-track">
	  				<div 
	  					class="range-slider"
	  					v-bind:style="{left:rangeX}"
	  					v-on:mousedown="isactive=1"
	  					v-bind:class={active:isactive}>
	  					</div>
  				</div>
  				<input type="number" v-model="value" class="range-value-input" v-on:input="setValueInput($event.target.value)"/>
  			</div>`,
  props: ['min','max','model'],
  data() {
  	return {
  		rangeX: "0%",
  		isactive: 0,
  		inputValue: 0,
  		value:0
  	};
  },
  created () {
  		var baseValue = this.model;
  		if(this.min<0)	baseValue = Math.abs(this.min) + baseValue;

  		if(this.model){
  			var rangeX = baseValue / ( ( Math.abs(this.max) + Math.abs(this.min) ) / 100 );
  			this.calcRange(rangeX);
	  		}

	  		/** BIND EVENTS TO SCROLL RANGE **/
	  		$(document).on({
	  			'mousemove': (event) => {
		  			event.preventDefault();
		  			this.updateRange(event);
		  		},
          'touchmove': (event) => {
            this.isactive = 1;
            for(let touch of event.originalEvent.changedTouches)
              this.updateRange(touch);
          },
          'touchcancel': (event) => {
            this.isactive = 0;
          },
		  		'mouseup': (event) => {
		  			this.isactive = 0;
		  		}
	  		});
  },
  methods: {
  	updateRange(event) {
  		if(this.isactive){
  			var rangeX = (event.pageX - $(this.$el).offset().left) / ($(this.$el).outerWidth(true) / 100);
  			this.calcRange(rangeX);
  		}
  	},
  	setValueInput (value) {

  		if(this.min < 0) value = Math.abs(this.min) + parseInt(value);

  		var rangeX = value / (( Math.abs(this.max) + Math.abs(this.min) )/100);
  		this.calcRange(rangeX, false);
  	},
  	/**
  	 * @param  {int} range ratio
  	 * @return {void} set values to current object
  	 */
  	calcRange (rangeX, setValue = true) {
  		
		if(rangeX > 100) rangeX = 100;
			if (rangeX <= 0 ) rangeX = 0;
			this.rangeX = parseInt(rangeX)+"%";

			var val = rangeX*( ( Math.abs(this.max) + Math.abs(this.min) )*.01);
			val = parseInt(this.min) + val;

			if(val<this.min) val = this.min;
			if(val>this.max) val = this.max;

			var fixed = 0;
			if(this.max < 5) fixed = 1;
			if(setValue)
				this.value = val.toFixed(fixed);

			this.$emit("input", val.toFixed(1));
  	}
  }

};

module.exports = RangeSlider;