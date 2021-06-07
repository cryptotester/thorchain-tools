let router = new VueRouter()

const app = new Vue({
    router: router,
    el: '#app',
    data: {
        assetName: '',
        initRuneAmount: 0,
        runePriceAtEnter: 0,
        assetPriceAtEnter: 0,
        runePriceNow: 0,
        assetPriceNow: 0,
        timeInPool: 0,
        desiredAPY: 0,
    },
    methods: {
        getRounded(number, rounding, suffix) {
            let suffixText = suffix !== undefined ? ` ${suffix}` : ''
            return !isNaN(number) ? `${number.toFixed(rounding)}${suffixText}` : ''
        },
        updateUrl() {
            router.push({
                path: 'lp',
                query: {
                    assetName: this.assetName,
                    initRuneAmount: this.initRuneAmount,
                    runePriceAtEnter: this.runePriceAtEnter,
                    assetPriceAtEnter: this.assetPriceAtEnter,
                    runePriceNow: this.runePriceNow,
                    assetPriceNow: this.assetPriceNow,
                    timeInPool: this.timeInPool,
                    desiredAPY: this.desiredAPY
                }
            })
        },
    },
    created(){
        let query = this.$route.query
        if (this.debug) console.log(query)
        this.assetName = query.assetName
        this.initRuneAmount = parseFloat(query.initRuneAmount)
        this.runePriceAtEnter = parseFloat(query.runePriceAtEnter)
        this.assetPriceAtEnter = parseFloat(query.assetPriceAtEnter)
        this.runePriceNow = parseFloat(query.runePriceNow)
        this.assetPriceNow = parseFloat(query.assetPriceNow)
        this.timeInPool = parseFloat(query.timeInPool)
        this.desiredAPY = parseFloat(query.desiredAPY)
    },
    computed: {
        initRuneValue() {
            return this.initRuneAmount * this.runePriceAtEnter
        },
        initAssetAmount() {
            return this.initRuneValue / this.assetPriceAtEnter
        },
        initInvestmentValue() {
            return this.initRuneAmount * this.runePriceAtEnter + this.initAssetAmount * this.assetPriceAtEnter
        },
        runeMovement() {
            return this.runePriceNow / this.runePriceAtEnter
        },
        assetMovement() {
            return this.assetPriceNow / this.assetPriceAtEnter
        },
        currentAssetPriceInRune() {
            return this.assetPriceNow / this.runePriceNow
        },
        assetAmountNow() {
            // TODO: add feeEarnAsset
            return Math.sqrt(this.initRuneAmount * this.initAssetAmount / this.currentAssetPriceInRune)
              //+ this.feeEarnAsset
        },
        runeAmountNow() {
            // TODO: add feeEarnRune
            return this.currentAssetPriceInRune * this.assetAmountNow
              //+ this.feeEarnRune
        },
        APY() {
            return this.desiredAPY / 200
        },
        totalPoolBalance() {
            return (this.initRuneAmount + this.runeAmountNow) / 2 * this.runePriceNow + (this.initAssetAmount + this.assetAmountNow) / 2 * this.assetPriceNow  // in USD
        },
        totalFeeEarn() {
            return this.totalPoolBalance * (Math.pow(Math.pow((1 + this.APY), 1/12), this.timeInPool) - 1)
        },
        feeEarnRune() {
            return this.totalFeeEarn / (2 * this.runePriceNow)
        },
        feeEarnAsset() {
            return this.totalFeeEarn / (2 * this.assetPriceNow)
        },
        LPValue() {
            return this.runeAmountNow * this.runePriceNow + this.assetAmountNow * this.assetPriceNow
        },
        symHold() {
            return this.initRuneAmount * this.runePriceNow + this.initAssetAmount * this.assetPriceNow
        },
        symLPvsHOLD() {
            return this.LPValue - this.symHold
        },
        asymRuneLPvsHOLD() {
            let asymRuneHold = this.initRuneAmount * 2 * this.runePriceNow
            return this.LPValue - asymRuneHold
        },
        asymAssetLPvsHOLD() {
            let asymAssetHold = this.initAssetAmount * 2 * this.assetPriceNow
            return this.LPValue - asymAssetHold
        },
        ILP() {
            if (this.timeInPool >= 3.3)
                return 1
            else
                return this.timeInPool * 30 / 100
        },
        overallGain() {
            return this.LPValue - this.initInvestmentValue
        },
        overallGainPercent() {
            return this.LPValue / this.initInvestmentValue * 100 - 100
        }
    },
    watch: {
        initRuneAmount() {
            this.updateUrl()
        },
        runePriceAtEnter() {
            this.updateUrl()
        },
        assetPriceAtEnter() {
            this.updateUrl()
        },
        runePriceNow() {
            this.updateUrl()
        },
        assetPriceNow() {
            this.updateUrl()
        },
        timeInPool() {
            this.updateUrl()
        },
        desiredAPY() {
            this.updateUrl()
        }
    },
})
