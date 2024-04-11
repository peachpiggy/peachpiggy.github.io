Vue.component('parameter-setting', {
    props: ['pet', 'stopTime', 'timeCtrl','saveIng'],
    template: `
<div class="column">
    <fieldset class="ts-fieldset">
        <legend>參數設定</legend>
        <div class="ts-wrap">
            <div class="ts-text is-label" style="word-break: keep-all;">成長速度
                <span class="ts-text is-description">越小越快</span>
            </div>
            <div class="ts-select is-underlined is-fluid" :class="[!stopTime?'is-disabled':'' , saveIng?'is-disabled':'']">
                <select v-model="timeCtrl.age">
                <option value="60000">1 分</option>
                <option value="300000">5 分</option>
                <option value="600000">10 分</option>
                </select>
            </div>
            <div class="ts-text is-label" style="word-break: keep-all;">頻率
                <span class="ts-text is-description">越小越快</span>
            </div>
            <div class="ts-select is-underlined is-fluid" :class="[!stopTime?'is-disabled':'' , saveIng?'is-disabled':'']">
                <select v-model="timeCtrl.base">
                <option value="1000">1 秒</option>
                <option value="240000">4 分</option>
                <option value="480000">8 分</option>
                <option value="600000">10 分</option>
                </select>
            </div>
        </div>
    </fieldset>
</div>
`
});