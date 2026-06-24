class FreeShippingMeter extends HTMLElement {
    constructor() {
        super();
    }

    static freeShippingText = window.free_shipping_text.free_shipping_message;
    static freeShippingText1 = window.free_shipping_text.free_shipping_message_1;
    static freeShippingText2 = window.free_shipping_text.free_shipping_message_2;
    static freeShippingText3 = window.free_shipping_text.free_shipping_message_3;
    static freeShippingText4 = window.free_shipping_text.free_shipping_message_4;
    static classLabel1 = 'progress-30';
    static classLabel2 = 'progress-60';
    static classLabel3 = 'progress-100';
    static freeshipPrice = parseInt(window.free_shipping_price);

    connectedCallback() {
        this.freeShippingEligible = 0;
        this.progressBar = this.querySelector('[data-shipping-progress]');
        this.messageElement = this.querySelector('[data-shipping-message]');
        this.textEnabled = this.progressBar?.dataset.textEnabled === 'true';
        this.shipVal = window.free_shipping_text.free_shipping_1;
        this.progressMeter = this.querySelector('[ data-free-shipping-progress-meter]');

        this.addEventListener('change', this.onCartChange.bind(this));

        this.initialize();
    }

    initialize() {
        Shopify.getCart((cart) => {
            this.cart = cart;
            this.calculateProgress(cart);
        })
    }

    onCartChange(e) {
        this.initialize();
    }

    calculateProgress(cart) {
        const cartTotalPrice = parseInt(cart.total_price) / 100;
        const cartTotalPriceFormatted = cartTotalPrice.toFixed(2);
        const cartTotalPriceRounded = parseFloat(cartTotalPriceFormatted);

        let freeShipBar = Math.abs((cartTotalPriceRounded * 100) / FreeShippingMeter.freeshipPrice);
        if (freeShipBar >= 100) {
            freeShipBar = 100;
        }
        
        const text = this.getText(cartTotalPriceFormatted, freeShipBar);
        const classLabel = this.getClassLabel(freeShipBar);

        this.setProgressWidthAndText(freeShipBar, text, classLabel);
    }

    getText(cartTotalPrice, freeShipBar) {
        let text;

        if (cartTotalPrice == 0) {
            this.progressBar.classList.add('progress-hidden');
            text = '<span>' + FreeShippingMeter.freeShippingText + ' ' + Shopify.formatMoney(FreeShippingMeter.freeshipPrice * 100, window.money_format) +'!</span>';
        } else if (cartTotalPrice >= FreeShippingMeter.freeshipPrice) {
            this.progressBar.classList.remove('progress-hidden');
            this.freeShippingEligible = 1;
            text = FreeShippingMeter.freeShippingText1.replace(/<img[^>]*>/gi, '<svg style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; fill: currentColor;" class="icon-shipping-truck" viewBox="0 0 40.55 24"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="truck-body" d="M40.43,11a3.86,3.86,0,0,0-3.68-2.65H28a1.25,1.25,0,0,1-1.43-1.43c0-2.18,0-4.35,0-6.53,0-.31-.08-.36-.37-.36H5.11a1.18,1.18,0,0,0-1.3,1.32c0,.74,0,1.48,0,2.22,0,.21-.06.27-.26.26-.36,0-.71,0-1.07,0a1.19,1.19,0,1,0,0,2.37H7.19c.43,0,.85,0,1.27,0a1,1,0,0,1,1.07,1A1.19,1.19,0,0,1,8.24,8.48H1.35a1.83,1.83,0,0,0-.47,0A1.19,1.19,0,0,0,0,9.85a1.18,1.18,0,0,0,1.19,1h9.66c.34,0,.68,0,1,0A1.19,1.19,0,0,1,13,12.47a1.26,1.26,0,0,1-1.26.76H1.24a1.19,1.19,0,1,0,0,2.38c.76,0,1.51,0,2.26,0,.26,0,.33.07.32.32,0,1,0,2.09,0,3.13A1.18,1.18,0,0,0,5.1,20.36c.63,0,1.26,0,1.9,0,.27,0,.39.06.47.36a4.55,4.55,0,0,0,8.78-.11.29.29,0,0,1,.32-.25H28.09a.3.3,0,0,1,.34.27,4.55,4.55,0,0,0,8.8,0,.31.31,0,0,1,.35-.26c.49,0,1,0,1.47,0a1.37,1.37,0,0,0,1.5-.87V11.41C40.41,11.29,40.47,11.12,40.43,11ZM32.84,21.62A2.18,2.18,0,1,1,35,19.45,2.21,2.21,0,0,1,32.84,21.62Zm-21,0A2.18,2.18,0,1,1,14,19.45,2.2,2.2,0,0,1,11.86,21.62Z"/><path class="truck-body" d="M29.27,6h5.85c.1,0,.2,0,.29,0C33.64,2.72,32,.91,28.91.26V.57c0,1.68,0,3.35,0,5C28.9,5.9,29,6,29.27,6Z"/><path class="wheel" d="M11.87,17.27A2.18,2.18,0,1,0,14,19.45,2.2,2.2,0,0,0,11.87,17.27Z"/><path class="wheel" d="M32.85,17.27A2.18,2.18,0,1,0,35,19.45,2.22,2.22,0,0,0,32.85,17.27Z"/></g></g></svg>');
        } else {
            this.progressBar.classList.remove('progress-hidden');
            const remainingPrice = Math.abs(FreeShippingMeter.freeshipPrice - cartTotalPrice);
            text = '<span>' + FreeShippingMeter.freeShippingText2 + ' </span>' + Shopify.formatMoney(remainingPrice * 100, window.money_format) + '<span> ' +  FreeShippingMeter.freeShippingText3 + ' </span><span class="text">' + FreeShippingMeter.freeShippingText4 + '</span>';
            this.shipVal = window.free_shipping_text.free_shipping_2;
        }

        return text;
    }

    getClassLabel(freeShipBar) {
        let classLabel;

        if (freeShipBar === 0) {
            classLabel = 'none';
        } else if (freeShipBar <= 30) {
            classLabel = FreeShippingMeter.classLabel1;
        } else  if (freeShipBar <= 60) {
            classLabel = FreeShippingMeter.classLabel2;
        } else if (freeShipBar < 100) {
            classLabel = FreeShippingMeter.classLabel3;
        } else {
            classLabel = 'progress-free'
        }

        return classLabel;
    }
    
    resetProgressClass(classLabel) {
        this.progressBar.classList.remove('progress-30');
        this.progressBar.classList.remove('progress-60');
        this.progressBar.classList.remove('progress-100');
        this.progressBar.classList.remove('progress-free');

        this.progressBar.classList.add(classLabel);
    }
    
    setProgressWidthAndText(freeShipBar, text, classLabel) {
        setTimeout(() => {
            this.resetProgressClass(classLabel);

            this.progressMeter.style.width = `${freeShipBar}%`;
            if (this.textEnabled) {
                const textWrapper = this.progressMeter.querySelector('.text').innerHTML = `${freeShipBar.toFixed(2)}%`;
            }

            this.messageElement.innerHTML = text;

            if ((window.show_multiple_currencies && typeof Currency != 'undefined' && Currency.currentCurrency != shopCurrency) || window.show_auto_currency) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            }
        }, 400)
    }
}

window.addEventListener('load', () => {
    customElements.define('free-shipping-component', FreeShippingMeter);
})