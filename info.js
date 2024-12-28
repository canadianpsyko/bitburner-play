/** @param {NS} ns */

function dpList(ns, current = "home", set = new Set()) {
  let connections = ns.scan(current)
  let next = connections.filter(c => !set.has(c))
  next.forEach(n => {
    set.add(n);
    return dpList(ns, n, set)
  })
  return Array.from(set.keys())
}

function threadCount(ns, hostname, scriptRam) {
	let threads = 0;
	let free_ram = ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)

	threads = free_ram / scriptRam
	return Math.floor(threads)
}

export async function main(ns) {
  /**
  for (let i = 1; i < 21; i++) {
    var ram = 2 ** i;
    var cost = ns.getPurchasedServerCost(ram);
    var fill = cost * 25;
    ns.print(`A purchased server with ${ns.formatRam(ram)} costs $${ns.formatNumber(cost)}, or $${ns.formatNumber(fill)} to fill`);

  }
  
  for (let i = 5; i < 21; i++) {
    const server = "pserv-0";
    var initialRam = ns.getServerMaxRam(server);
    var finalRam = 2 ** i
    var cost = ns.getPurchasedServerUpgradeCost(server, finalRam)
    ns.print(`An upgrade from ${ns.formatRam(initialRam)} to ${ns.formatRam(finalRam)} costs $${ns.formatNumber(cost)}`);

  }
  */


  
  if (ns.args[0] !== false) {
    let neighbor = ns.scan();
    const target = ns.args[0];
    neighbor = ns.scan(target);
    ns.tprintf("Neighbors of %s.", target);
    for (let i = 0; i < neighbor.length; i++) {
      ns.tprint(neighbor[i]);
    }
  }
  /** 
  //ns.print(`max nodes: ${ns.hacknet.maxNumNodes()}`)
  let servers = dpList(ns)
  for (let server of servers) {
    let s = ns.getServer(server)
    /**    
    if ((s.backdoorInstalled === false) && (s.purchasedByPlayer === false)) {
      ns.print(`${server} needs backdoor`)
    }
    if ((s.backdoorInstalled === true) && (s.purchasedByPlayer === false)) {
      ns.print(`${server} has backdoor`)
    }
    
    let f = ns.ls(server, "cct")
    if ((s.purchasedByPlayer === false) && (f.length !== 0)) {
      ns.print(`${server} - ${f}`)
    }
  }
  ns.print(ns.formatNumber(ns.heart.break()))
  */

  let player = ns.getPlayer()  
  //ns.print(`ns: ${player.exp.hacking}`)

  let server = ns.getServer("foodnstuff")

  ns.print(`id: ${server.hostname}`)

  //let hackTime = ns.formulas.hacking.growTime(server, player)

  //ns.print(`HAcktime ${ns.tFormat(hackTime)}`)

  ns.print(`maxram: ${threadCount(ns, server.hostname, 1.75)}`)

}
