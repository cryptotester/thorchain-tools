# THORChain Tools

For now this repo contains a simple, yet essential **LP Scenario Simulator** to calculate your liquidity providing 
earnings or losses and impermanent loss protection on ThorSwap.

See it in action here: https://thorchain.cryptotester.info/lp_scenario_sim.html

## How to use LP Scenario Simulator

If you simulate a standard simmetrical scenario (Rune + Asset), you insert the amount of Rune and the amount of the 
other asset, their initial prices etc.

If you simulate an asimmetrical scenario (Asset), you still need (for now) to calculate the amount or Rune you'd had 
inserted at the beginning (which is 50% of the initial amount), then add the remaining parameters.

This is work in progress... I talked with LP university, it will be probably improved and integrated in the official 
website.

You can share the URL of your scenario, see e.g.:

https://thorchain.cryptotester.info/lp_scenario_sim.html#/lp?assetName=BUSD&assetPriceAtEnter=1&assetPriceNow=1&desiredAPY=30&initRuneAmount=50&runePriceAtEnter=20&runePriceNow=40&timeInPool=12

## License

This is open source, MIT license, so do whatever you want with the code (which can contain bugs) and you take 
responsibility for it.
