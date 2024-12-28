/** @param {NS} ns */
export async function main(ns) {
  // Position and clear the log
  ns.disableLog("ALL");
  ns.clearLog();
  ns.tail();
  ns.moveTail(900, 89);
  ns.resizeTail(780, 500);
  let pwr = 1;
  let ram = 2 ** pwr;

  // Iterator we'll use for our loop
  let i = ns.getPurchasedServers();
  i = i.length;

  // Continuously try to purchase ownServers until we've reached the maximum
  // amount of ownServers
  while (i < ns.getPurchasedServerLimit()) {
    // Check if we have enough money to purchase a server
    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
      // If we have enough money, then:
      //  1. Purchase the server
      //  2. Increment our iterator to indicate that we've bought a new server
      let hostname = ns.purchaseServer("pserv-" + i, ram);
      ns.setTitle(`Buy, ${i} of ${ns.getPurchasedServerLimit()}`)
      ++i;
    }
    // Make the script wait for a 0.1 seconds before looping again.
    // Removing this line may cause an infinite loop and crash the game.
    await ns.sleep(100);
  }

  let ownServers = ns.getPurchasedServers();
  ram = 0;
  let j = 2
  //2^x where to stop buying, 7 = 128GB, 10 = 1TB, 13 = 8TB, 20 = 1PB
  let maxRam = 6
  if (ns.args[0]) {
    maxRam = ns.args[0]
  }
  while (j < (maxRam + 1)) {
    ram = 2 ** j
    let cost = Math.max(ns.getPurchasedServerUpgradeCost(ownServers[0], ram), ns.getPurchasedServerUpgradeCost(ownServers[ownServers.length - 1], ram))
    ns.print(`Starting upgrade to ${ns.formatRam(ram)} of ${ns.formatRam(2 ** maxRam)} for ${ns.formatNumber(cost)}`)
    ns.setTitle(`Upgrade: ${ns.formatRam(ram)} of ${ns.formatRam(2 ** maxRam)}, ${ns.formatNumber(cost)}`)
    //increase each ram size
    let k = 0
    while (ownServers[k]) {
      //run through list of owned ownServers
      while (ns.getServerMaxRam(ownServers[k]) < ram) {
        if (ns.getServerMoneyAvailable("home") > (ns.getPurchasedServerUpgradeCost(ownServers[k], ram))) {
          ns.upgradePurchasedServer(ownServers[k], ram);
          ns.print(`Purchased ${ns.formatRam(ram)} on ${ownServers[k]}`)
          ns.setTitle(`Upgrade, ${k + 1} of ${ns.getPurchasedServerLimit()}, ${ns.formatRam(ram)} of ${ns.formatRam(2 ** maxRam)}, ${ns.formatNumber(cost)}`)
        }
        await ns.sleep(100);
      }
      ++k
    }
    ns.toast(`Servers all upgraded to ${ns.formatRam(ram)}`)
    ++j
  }

  ns.setTitle(`Upgrade complete to ${ns.formatRam(ram)}`)
}
