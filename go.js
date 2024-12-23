/** @param {NS} ns **/

/**
 * returns an array of servers dynamically
 */
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
  //don't spam log with all actions, and clear previous run
  ns.disableLog("ALL");
  ns.clearLog();
  //list al servers, define target
  let servers = dpList(ns)
  let target = "foodnstuff"
  //upload hack files to all servers, list details
  ns.print("Server             - Cash Time - Max Cash  - Min Diff - Max time")
  for (let server of servers) {
    await ns.scp(["bin.wk.js", "bin.hk.js", "bin.gr.js"], server, "home")
    let s = ns.getServer(server)
    let hackTime = ns.getHackTime(server)
    let growTime = ns.getGrowTime(server)
    let weakTime = ns.getWeakenTime(server)
    let ports = s.openPortCount >= s.numOpenPortsRequired
    let hackable = (s.requiredHackingSkill <= ns.getHackingLevel()) && ports
    let maxTime = Math.max(hackTime, growTime, weakTime)
    let cashTime = s.moneyMax / maxTime
    let sName = s.hostname.padEnd(18)
    if (ns.getServerMaxMoney(server) > 0 && hackable) {
      ns.print(`${sName} - ${ns.formatNumber(cashTime).padStart(9)} - ${ns.formatNumber(s.moneyMax).padStart(9)} - ${ns.formatNumber(s.minDifficulty).padStart(8)} - ${ns.tFormat(maxTime)}`)
    }


  }
  ns.print("Server             - Cash Time - Max Cash  - Min Diff - Max time")
  //print status, show targets details
  ns.print("Files uploaded")
  ns.print(`Targeting ${target}`)
  ns.print(`${ns.formatNumber(ns.getServerSecurityLevel(target))} / ${ns.formatNumber(ns.getServerMinSecurityLevel(target))} - ${ns.formatNumber(ns.getServerMoneyAvailable(target))} / ${ns.formatNumber(ns.getServerMaxMoney(target))}`)
  while (true) {
    for (let server of servers) {
      if (ns.hasRootAccess(server) && ns.hasRootAccess(target)) {
        // divert all of this server's available threads to the most valuable command
        if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
          let available_threads = threadCount(ns, server, 1.75)
          // weaken the target while security > minsecurity
          if (available_threads >= 1) {
            ns.exec("bin.wk.js", server, available_threads, target)
            //pretty title
            ns.setTitle(`${target} - ${ns.formatNumber(ns.getServerSecurityLevel(target))} / ${ns.formatNumber(ns.getServerMinSecurityLevel(target))} - ${ns.formatNumber(ns.getServerMoneyAvailable(target))} / ${ns.formatNumber(ns.getServerMaxMoney(target))}`)

          }
        } else if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
          let available_threads = threadCount(ns, server, 1.75)
          // grow the target while money < maxmoney
          if (available_threads >= 1) {
            ns.exec("bin.gr.js", server, available_threads, target)
            ns.setTitle(`${target} - ${ns.formatNumber(ns.getServerSecurityLevel(target))} / ${ns.formatNumber(ns.getServerMinSecurityLevel(target))} - ${ns.formatNumber(ns.getServerMoneyAvailable(target))} / ${ns.formatNumber(ns.getServerMaxMoney(target))}`)

          }
        } else {
          let available_threads = threadCount(ns, server, 1.7)
          // hack the target
          if (available_threads >= 1) {
            ns.exec("bin.hk.js", server, available_threads, target)
            ns.setTitle(`${target} - ${ns.formatNumber(ns.getServerSecurityLevel(target))} / ${ns.formatNumber(ns.getServerMinSecurityLevel(target))} - ${ns.formatNumber(ns.getServerMoneyAvailable(target))} / ${ns.formatNumber(ns.getServerMaxMoney(target))}`)

          }
        }

      } else {
        // open all possible ports on every server; then attempt to nuke the server
        try {
          ns.brutessh(server)
          ns.ftpcrack(server)
          ns.relaysmtp(server)
          ns.httpworm(server)
          ns.sqlinject(server)
        } catch { }

        try {
          ns.nuke(server)
        } catch { }

      }

      await ns.sleep(10)
    }
  }
}
