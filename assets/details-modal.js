class DetailsModal extends HTMLElement {
    constructor() {
        super();
        this.detailsContainer = this.querySelector('details');
        this.summaryToggle = this.querySelector('summary');

        if (this.detailsContainer) {
            this.detailsContainer.addEventListener(
                'keyup',
                (event) => event.code.toUpperCase() === 'ESCAPE' && this.close()
            );
        }

        if (this.summaryToggle) {
            this.summaryToggle.addEventListener(
                'click',
                this.onSummaryClick.bind(this)
            );
            this.summaryToggle.setAttribute('role', 'button');
            this.summaryToggle.setAttribute('aria-expanded', 'false');
        }

        const closeBtn = this.querySelector('button[type="button"]');
        if (closeBtn) {
            closeBtn.addEventListener(
                'click',
                this.close.bind(this)
            );
        }
    }

    isOpen() {
        return this.detailsContainer.hasAttribute('open');
    }

    onSummaryClick(event) {
        event.preventDefault();

        event.target.closest('details').hasAttribute('open') ? this.close() : this.open(event);
    }

    onBodyClick(event) {
        if (!this.contains(event.target)) this.close(false);
    }

    open(event) {
        this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
        event.target.closest('details').setAttribute('open', true);
        document.body.addEventListener('click', this.onBodyClickEvent);

        trapFocus(
            this.detailsContainer.querySelector('[tabindex="-1"]'),
            this.detailsContainer.querySelector('input:not([type="hidden"])')
        );

        var target = $(this.detailsContainer.querySelector('input:not([type="hidden"])').closest('.quickSearch')),
            quickSearch = target.closest('.quickSearch');
    }

    close(focusToggle = true) {
        removeTrapFocus(focusToggle ? this.summaryToggle : null);
        this.detailsContainer.removeAttribute('open');
        document.body.removeEventListener('click', this.onBodyClickEvent);
    }
}

customElements.define('details-modal', DetailsModal);
