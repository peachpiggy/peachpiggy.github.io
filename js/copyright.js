Vue.component('copyright', {
    data() {
        return {
            time: moment(),
        }
    },
    template: `
    <div class="copyright">
        <div class="ts-text is-description">
            <a target="_blank" href="https://twitter.com/LunAh_Eric" style="vertical-align:middle;">
                © LunAh Eric {{ time.format('YYYY') }} 
            </a>
        </div>
        <div class="ts-image">
            <img src="./lib/img/Cc_by-nd_icon.svg" alt="cc">
        </div>
    </div>
`
});