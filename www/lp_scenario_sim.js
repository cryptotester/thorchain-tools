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
            if (suffix !== undefined && suffix.toUpperCase() === 'BTC') rounding = 4
            return !isNaN(number) ? `${number.toFixed(rounding)}${suffixText}` : ''
        },
        updateUrl() {
            router.push({
                path: 'lp',
                query: {
                    assetName: this.assetName || undefined,
                    initRuneAmount: this.initRuneAmount || undefined,
                    runePriceAtEnter: this.runePriceAtEnter || undefined,
                    assetPriceAtEnter: this.assetPriceAtEnter || undefined,
                    runePriceNow: this.runePriceNow || undefined,
                    assetPriceNow: this.assetPriceNow || undefined,
                    timeInPool: this.timeInPool || undefined,
                    desiredAPY: this.desiredAPY || undefined
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
        initAssetAmountAsym() {
            return this.initAssetAmount * 2
        },
        initRuneAmountAsym() {
            return this.initRuneAmount * 2
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
        assetAmountNowWithoutFees() {
            return Math.sqrt(this.initRuneAmount * this.initAssetAmount / this.currentAssetPriceInRune)
        },
        runeAmountNowWithoutFees() {
            return this.currentAssetPriceInRune * this.assetAmountNowWithoutFees
        },
        assetAmountNow() {
            return this.assetAmountNowWithoutFees + this.feeEarnAsset
        },
        runeAmountNow() {
            return this.runeAmountNowWithoutFees + this.feeEarnRune
        },
        APY() {
            return this.desiredAPY / 200
        },
        totalPoolBalance() {
            return (this.initRuneAmount + this.runeAmountNowWithoutFees) / 2 * this.runePriceNow + (this.initAssetAmount + this.assetAmountNowWithoutFees) / 2 * this.assetPriceNow  // in USD
        },
        totalFeeEarn() {
            return this.totalPoolBalance * (Math.pow(Math.pow((1 + this.APY), 1/12), this.timeInPool) - 1)
        },
        feeEarnRune() {
            return this.totalFeeEarn / this.runePriceNow
        },
        feeEarnAsset() {
            return this.totalFeeEarn / this.assetPriceNow
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
        assetName() {
            this.updateUrl()
        },
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
