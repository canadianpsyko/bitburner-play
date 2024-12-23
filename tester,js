/** @param {NS} ns */
import HackableBaseServer from "./if.server.hackable"
import BasePlayer from "./if.player";
import BaseServer from "./if.server";

function dpList(ns, current = "home", set = new Set()) {
  let connections = ns.scan(current)
  let next = connections.filter(c => !set.has(c))
  next.forEach(n => {
    set.add(n);
    return dpList(ns, n, set)
  })
  return Array.from(set.keys())
}

export async function main(ns) {
  let sList = dpList(ns)
  let servers = [];
  let player = new BasePlayer(ns, "player")
  await player.updateCache(false)

  
  let server = new BaseServer(ns, "foodnstuff")
  //Works
  //await server.updateCache(false)

  
  ns.print(`${server.id}`)
  ns.print(`${server.ram.max}`)
  ns.print(`${server.money.growth}`)

  let getters = server.listGetters(server)
  ns.print(`Getters (test): ${getters.size}`)

  let hServer = new HackableBaseServer(ns, "foodnstuff")
  //BReaks
  //await server.updateCache(false)

  
  ns.print(`${hServer.id}`)
  ns.print(`${hServer.ram.max}`)
  ns.print(`${hServer.money.growth}`)


  let hGetters = hServer.listGetters(hServer)
  ns.print(`Getters (hack test): ${hGetters.size}`)
  // Results in 0
  


}
