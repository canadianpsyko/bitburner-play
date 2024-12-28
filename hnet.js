/** @param {NS} ns **/

function range(size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}

export async function main(ns) {
  // purchases hacknet servers to meet a minimum requirement
  // to get access to Netburners faction

  // 9 servers
  // 500 levels
  let servers = 9
  let levels = 50
  let ramUps = 3

  let totalLevels = 0;
  while (totalLevels < (servers * levels)) {
    let nodes = range(ns.hacknet.numNodes())
    totalLevels = nodes.reduce((a, b) => a + ns.hacknet.getNodeStats(b).level, 0)
    try { nodes.filter(n => ns.hacknet.getNodeStats(n).level < levels).forEach(n => ns.hacknet.upgradeLevel(n, 1)) } catch { }
    if (nodes.length < servers) {
      ns.hacknet.purchaseNode();
    }

    await ns.sleep(10)
  }
  let totalRam = 0
  while (totalRam < (servers * ramUps)) {
    let nodes = range(ns.hacknet.numNodes())
    totalRam = nodes.reduce((a, b) => a + ns.hacknet.getNodeStats(b).ram, 0)
    try { nodes.filter(n => ns.hacknet.getNodeStats(n).ram < 2 ** ramUps).forEach(n => ns.hacknet.upgradeRam(n, 1)) } catch { }
    

    await ns.sleep(10)
  }

}
