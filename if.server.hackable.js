import BaseServer from "./if.server"

export default class HackableBaseServer extends BaseServer {
  constructor(ns, hostname) {
    super();
    this.ns = ns;
    this._id = hostname;
  }


  get isAttacker() { return ( this.purchased || this.isHome || (this.ram.max > 0 && this.admin))}

  
  sudo() {
    //this.ns.toast("sudoing!")
    try {
      this.ns.brutessh(this.id)
      this.ns.ftpcrack(this.id)
      this.ns.relaysmtp(this.id)
      this.ns.httpworm(this.id)
      this.ns.sqlinject(this.id)
    } catch { }

    try {
      this.ns.nuke(this.id)
    } catch { }
  }


  async updateCache(repeat = true, kv = new Map()) {
    do {

      let getters = this.listGetters(this)
      this.ns.print(`Getters (ha): ${getters.size}`)

      for (let o of Object.keys(getters)) {
        if (!kv.has(getters[o])) {
          kv.set(getters[o], this[getters[o]])
        }
      }
      
      await super.updateCache(false, kv)
      
      if (repeat) {
        await this.ns.asleep((Math.random() * 10000) + 55000); // base server update rate is 60s. we'll call faster updates when we need them.
      }

    } while (repeat)
  }
}
