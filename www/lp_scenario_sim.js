let router = new VueRouter()

const app = new Vue({
    router: router,
    el: '#app',
    data: {
        report: [],
        assetName: '',
        initRuneAmount: '',
        runePriceAtEnter: '',
        assetPriceAtEnter: '',
        initRuneValue: '',
        initAssetAmount: '', // calculated from initRuneValue
        runePriceNow: '',
        assetPriceNow: '',
        timeInPool: '',
        desiredAPY: '',
        initInvestmentValue: '',
        LPValue: '',
        overallGain: '',
        overallGainPercent: '',
        runeMovement: '',
        assetMovement: '',
        runeAmountNow: '',
        assetAmountNow: '',
        feeEarnRune: '',
        feeEarnAsset: '',
        hodlValue: '',
        symLPvsHOLD: '',
        asymRuneLPvsHOLD: '',
        asymAssetLPvsHOLD: '',
        ILP: '',
        debug: false
    },
    methods: {
        getReport() {
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
            if (this.debug) console.log('getReport Fired')
            this.initRuneValue = this.initRuneAmount * this.runePriceAtEnter
            if (this.debug) console.log(`initRuneValue: ${this.initRuneValue}`)
            this.initAssetAmount = this.initRuneValue / this.assetPriceAtEnter
            if (this.debug) console.log(`Initial ${this.assetName} amount is calculated automatically: ${this.initAssetAmount} ${this.assetName}`)
            let APY = this.desiredAPY / 200;

            let initAssetPriceInRune = this.initRuneAmount / this.initAssetAmount
            this.initInvestmentValue = this.initRuneAmount * this.runePriceAtEnter + this.initAssetAmount * this.assetPriceAtEnter
            if (this.debug) console.log(`initInvestmentValue: ${this.initInvestmentValue}`)

            this.runeMovement = this.runePriceNow / this.runePriceAtEnter
            this.assetMovement = this.assetPriceNow / this.assetPriceAtEnter

            let currentAssetPriceInRune = this.assetPriceNow / this.runePriceNow

            this.assetAmountNow = Math.sqrt(this.initRuneAmount * this.initAssetAmount / currentAssetPriceInRune)
            if (this.debug) console.log(`assetAmountNow: ${this.assetAmountNow}`)
            this.runeAmountNow = currentAssetPriceInRune * this.assetAmountNow
            if (this.debug) console.log(`runeAmountNow: ${this.runeAmountNow}`)

            let totalPoolBalance = (this.initRuneAmount + this.runeAmountNow) / 2 * this.runePriceNow + (this.initAssetAmount + this.assetAmountNow) / 2 * this.assetPriceNow  // in USD
            if (this.debug) console.log(`totalPoolBalance: ${totalPoolBalance}`)
            let totalFeeEarn = totalPoolBalance * (Math.pow(Math.pow((1 + APY), 1/12), this.timeInPool) - 1)
            this.feeEarnRune = totalFeeEarn / (2 * this.runePriceNow)
            this.feeEarnAsset = totalFeeEarn / (2 * this.assetPriceNow)
            if (this.debug) console.log(`feeEarnRune: ${this.feeEarnRune}, feeEarnAsset: ${this.feeEarnAsset}, totalFeeEarn: ${totalFeeEarn}`)

            this.assetAmountNow += this.feeEarnAsset
            this.runeAmountNow += this.feeEarnRune

            this.LPValue = this.runeAmountNow * this.runePriceNow + this.assetAmountNow * this.assetPriceNow
            if (this.debug) console.log(`LPValue: ${this.LPValue}`)

            // HOLD Scenarios
            let symHold = this.initRuneAmount * this.runePriceNow + this.initAssetAmount * this.assetPriceNow
            let asymRuneHold = this.initRuneAmount * 2 * this.runePriceNow
            let asymAssetHold = this.initAssetAmount * 2 * this.assetPriceNow

            // LP vs HOLD
            this.hodlValue = this.initRuneAmount * this.runePriceNow + this.initAssetAmount * this.assetPriceNow
            this.symLPvsHOLD = this.LPValue - symHold
            this.asymRuneLPvsHOLD = this.LPValue - asymRuneHold
            this.asymAssetLPvsHOLD = this.LPValue - asymAssetHold

            // ILP
            this.ILP = 0
            if (this.timeInPool >= 3.3)
                this.ILP = 1
            else
                this.ILP = (this.timeInPool * 30) / 100

            this.overallGain = this.LPValue - this.initInvestmentValue
            this.overallGainPercent = this.LPValue / this.initInvestmentValue * 100 - 100
            if (this.debug) {
                console.log("################################")
                console.log(`Initial investment value: ${this.initInvestmentValue} USD, Current pool value: ${this.LPValue} USD`)
                console.log(`---------------------------OVERALL GAIN: ${this.overallGainPercent} %-----------------------`)
                console.log(`--------------Rune movement: ${this.runeMovement} - ${this.assetName} movement: ${this.assetMovement}`)
                console.log(`---------Rune amount in pool: ${this.runeAmountNow} - ${this.assetName} amount in pool: ${this.assetAmountNow}`)
                console.log(`-----------Total Gain/Loss: ${this.runeAmountNow - this.initRuneAmount} Rune & ${this.assetAmountNow - this.initAssetAmount} ${this.assetName}`)
                console.log(`-------------------Fee earn: ${this.feeEarnRune} Rune & ${this.feeEarnAsset} ${this.assetName}`)
                console.log(`------------------------------ LP SCENARIOS ----------------------------`)
                console.log(`---------1) If you entered the pool symmetrically`)
                console.log(`-------------- LP vs HOLD value : ${this.symLPvsHOLD} USD`)
                console.log(`--------- 2) If you entered the pool asymmetrically with Rune`)
                console.log(`-------------- LP vs HOLD value : ${this.asymRuneLPvsHOLD} USD`)
                console.log(`--------- 3) If you entered the pool asymmetrically with ${this.assetName}`)
                console.log(`-------------- LP vs HOLD value : ${this.asymAssetLPvsHOLD} USD`)
                if (this.symLPvsHOLD >= 0)
                    console.log(`---- No ILP needed ! :), you made ${this.symLPvsHOLD} USD!`)
                else
                    console.log(`---- ILP would cover ${(this.ILP * 100).toFixed(2)} % of your losses : ${(-this.symLPvsHOLD * this.ILP).toFixed(2)} USD or ${((-this.symLPvsHOLD / this.runePriceNow) * this.ILP).toFixed(2)} Rune`)
            }
        }
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
        //this.debug = (query.debug === 'true')
    },
    watch: {
        initRuneAmount() {
            this.getReport()
        },
        runePriceAtEnter() {
            this.getReport()
        },
        assetPriceAtEnter() {
            this.getReport()
        },
        runePriceNow() {
            this.getReport()
        },
        assetPriceNow() {
            this.getReport()
        },
        timeInPool() {
            this.getReport()
        },
        desiredAPY() {
            this.getReport()
        }
    },
})
