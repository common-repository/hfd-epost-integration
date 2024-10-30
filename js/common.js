var IsraelPostCommon = {
    shippingMethod: 'israelpost_standard',
    additonalBlock: null,
    shippingInput: null,
    loader: null,
    config: {
    },

    init: function (config) {
        config = config || {};
        this.config = $j.extend({}, config);

        // var _loader = $j('#'+ this.overlay);
        // if (!_loader.length) {
        //     _loader = $j('<div id="'+ this.overlay +'"></div>').appendTo($j('body'));
        // }
        // this.loader = $j('<div id="firecheckout-spinner">'+ Translator.translate('Please wait') +'...</div>');
        this.overlay = $j('<div id="israelpost-overlay"></div>');

        this.overlay.appendTo($j('body'));
        this.initAjaxEvent();
        this.initAdditional();

        IsraelPost.init();

        setTimeout(function(){
			if( typeof WoocommerCheckout != 'undefined' ){
				WoocommerCheckout.init();
			}
		}, 2000);
    },

    initAdditional: function () {
		this.additonalBlock = $j('#israelpost-additional');
		this.shippingInput = this.additonalBlock.siblings('input.shipping_method');
				
        setTimeout(function(){
			var blockShip = $j( ".wc-block-components-radio-control__option input[id*='betanet_epost']" );
			if( blockShip.length && blockShip.is( ":checked" ) ){
				$j.ajax({
					type : "POST",
					url : hfd_ajax_obj.ajaxurl,
					data : { action: "hfd_get_additional_data" },
					success: function( response ){
						var obj = JSON.parse( response );
						
						blockShip.parent().after( obj.html );
					}
				});
			}else{
				this.additonalBlock = $j('#israelpost-additional');
				this.shippingInput = this.additonalBlock.siblings('input.shipping_method');
				
				if( !this.shippingInput.length ){
					return;
				}

				// this.additonalBlock.appendTo(this.shippingInput.closest('li'));

				// $j('input[name="shipping_method"]').on('change', function () {
				//     _this.switchShippingMethod($j(this).val());
				// });

				if (!this.shippingInput.is(':checked')) {
					this.additonalBlock.hide();
				}
			}
		}, 2000);
		
		$j( "body" ).on( "change", ".wc-block-components-shipping-rates-control input[type='radio']", function(){
			var blockShip = $j( ".wc-block-components-radio-control__option input[id*='betanet_epost']" );
			if( blockShip.length && blockShip.is( ":checked" ) ){
				$j('#israelpost-additional').show();
			}else{
				$j('#israelpost-additional').hide();
			}
		});
    },

    initAjaxEvent: function () {
        var _this = this;
        $j(document).ajaxComplete(function (event, xhr, settings) {
            var action = _this.getUrlParameter(settings.url, 'wc-ajax');

            if (action &&
                (action == 'update_shipping_method'
                    || action == 'update_order_review'
                    || action == 'get_refreshed_fragments'
                )
            ) {
                _this.initAdditional();
                IsraelPost.initPickerButton();
            }
        });
    },

    getUrlParameter: function(url, name) {
        var  results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);

        return results ? results[1] : null;
    },

    switchShippingMethod: function (method) {
        method = method || '';
        if (method == this.shippingMethod) {
            this.additonalBlock.show();
        } else {
            this.additonalBlock.hide();
        }
    },

    getConfig: function (key) {
        if (typeof this.config[key] != 'undefined') {
            return this.config[key];
        }

        return null;
    },

    showLoader: function () {
        var block = this.additonalBlock.closest('.cart_totals');

        if (!block.length) {
            block = this.additonalBlock.closest('.shop_table');
        }

        if (!block.length) {
            return;
        }

        block.addClass('processing').block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });
    },

    hideLoader: function () {
        var block = this.additonalBlock.closest('.cart_totals');

        if (!block.length) {
            block = this.additonalBlock.closest('.shop_table');
        }

        if (!block.length) {
            return;
        }

        block.removeClass('processing').unblock();
    },
	
	destroy: function(){
		this.additonalBlock = null;
		this.shippingInput = null;
		this.loader = null;
		this.config = {};
		
		IsraelPost.destroy();
	}
};