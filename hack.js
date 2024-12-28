/** @param {NS} ns **/
import HackableBaseServer from "./if.server.hackable"
import BasePlayer from "./if.player"
/**
 * returns an array of servers dynamically
 */
function dpList(ns, current = "home", set = new Set()) {
  let connections = ns.scan(current)
  let next = connections.filter(c => !set.has(c))
  next.forEach(n => {
    set.add(n)
    return dpList(ns, n, set)
  })
  return Array.from(set.keys())
}


export async function main(ns) {
  // Don't spam log with all actions, and clear previous run
  ns.disableLog("ALL")
  
  // Open tail window, size and position it
  ns.tail()
  ns.moveTail(900, 54)
  ns.resizeTail(780, 1320)

  // Add player to db
  let player = new BasePlayer(ns, "player")
  await player.updateCache(false)

  // List all servers, add to db
  let sList = dpList(ns)
  let servers = []
  for (let s of sList) {
    let server = new HackableBaseServer(ns, s)
    servers.push(server);
  }
  for (let server of servers) {
    await server.updateCache(false);
  }


  // Define target
  let target = new HackableBaseServer(ns, "rho-construction")

  // Clear log window 
  ns.clearLog()
  // Upload hack files to all servers, list details
  ns.print("Server             - Cash Time - Max Cash  - Min Diff - Max time")
  for (let server of servers) {
    await ns.scp(["bin.wk.js", "bin.hk.js", "bin.gr.js"], server.id, "home")
    let hackTime = ns.getHackTime(server.id)
    let growTime = ns.getGrowTime(server.id)
    let weakTime = ns.getWeakenTime(server.id)
    let ports = server.ports.open >= server.ports.required
    let hackable = (server.level <= player.level) && ports
    let maxTime = Math.max(hackTime, growTime, weakTime)
    let cashTime = server.money.max / maxTime
    let sName = server.id.padEnd(18)
    if (ns.getServerMaxMoney(server.id) > 0 && hackable) {
      ns.print(`${sName} - ${ns.formatNumber(cashTime).padStart(9)} - ${ns.formatNumber(server.money.max).padStart(9)} - ${ns.formatNumber(server.security.min).padStart(8)} - ${ns.tFormat(maxTime)}`)
    }


  }
  ns.print("Server             - Cash Time - Max Cash  - Min Diff - Max time")
  // print status, show targets details
  ns.print("Files uploaded")
  ns.print(`Targeting ${target.id}`)
  ns.print(`${ns.formatNumber(target.security.level)} / ${ns.formatNumber(target.security.min)} - ${ns.formatNumber(target.money.available)} / ${ns.formatNumber(target.money.max)}`)
  while (true) {
    for (let server of servers) {
      if (server.admin && target.admin) {
        // divert all of this server's available threads to the most valuable command
        if (target.security.level > target.security.min) {
          let available_threads = server.threadCount(1.75)
          // weaken the target while security > minsecurity
          if (available_threads >= 1) {
            ns.exec("bin.wk.js", server.id, available_threads, target.id)
            // Make a pretty title, update every cycle
            ns.setTitle(`${target.id} - ${ns.formatNumber(target.security.level)} / ${ns.formatNumber(target.security.min)} - ${ns.formatNumber(target.money.available)} / ${ns.formatNumber(target.money.max)}`)

          }
        } else if (target.money.available < target.money.max) {
          let available_threads = server.threadCount(1.75)
          // grow the target while money < maxmoney
          if (available_threads >= 1) {
            ns.exec("bin.gr.js", server.id, available_threads, target.id)
            ns.setTitle(`${target.id} - ${ns.formatNumber(target.security.level)} / ${ns.formatNumber(target.security.min)} - ${ns.formatNumber(target.money.available)} / ${ns.formatNumber(target.money.max)}`)

          }
        } else {
          let available_threads = server.threadCount(1.7)
          // hack the target
          if (available_threads >= 1) {
            ns.exec("bin.hk.js", server.id, available_threads, target.id)
            ns.setTitle(`${target.id} - ${ns.formatNumber(target.security.level)} / ${ns.formatNumber(target.security.min)} - ${ns.formatNumber(target.money.available)} / ${ns.formatNumber(target.money.max)}`)

          }
        }

      } else {
        server.sudo()
      }

      await ns.sleep(10)
    }
  }
}
