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
	for (let s of sList) {
		let server = new HackableBaseServer(ns, s)
		servers.push(server);
	}

	for (let server of servers) {
		await server.updateCache(false);
	}

	let target = new HackableBaseServer(ns, "foodnstuff")









  /** 
  let sList = dpList(ns)
  let servers = [];
  let player = new BasePlayer(ns, "player")
  await player.updateCache(false)

  ns.print(`${player.id}`)
  ns.print(`${player.data}`)
  ns.print(`${player.updated_at}`)
  ns.print(`${player.hp.current}`)
  ns.print(`${player.hp.max}`)
  ns.print(`level: ${player.level}`)
  ns.print(`money: ${player.money}`)
  ns.print(`int: ${player.intellegence}`)
  ns.print(`city: ${player.city}`)
  ns.print(`classname: ${player.className}`)
  ns.print(`${player.company.companyName}`)
  ns.print(`${player.company.multipliers.rep}`)
  ns.print(`${server.}`)
  
  
  let server = new BaseServer(ns, "foodnstuff")
  await server.updateCache(false)

  
  ns.print(`${server.id}`)
  ns.print(`${server.ram.max}`)
  ns.print(`${server.money.growth}`)

  let getters = server.listGetters(server)
  ns.print(`Getters (test): ${getters.size}`)

  let hServer = new HackableBaseServer(ns, "foodnstuff")
  await server.updateCache(false)

  
  ns.print(`${hServer.id}`)
  ns.print(`${hServer.ram.max}`)
  ns.print(`${hServer.money.growth}`)


  let hGetters = hServer.listGetters(hServer)
  ns.print(`Getters (hack test): ${hGetters.size}`)

  */


}
