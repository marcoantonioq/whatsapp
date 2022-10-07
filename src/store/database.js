const fs = require('fs');

class Files {
  constructor() {
    this.path = './data.json'
    this.data = {
      received: [],
      created: [],
      toSends: [],
      contacts: [],
      logs: []
    };
    this.read().catch(err => {
      this.write(this.data)
    })
  }

  write(newData, clear = false) {
    return new Promise((resolve, reject) => {
      fs.writeFile(this.path, JSON.stringify(newData), 'utf8', (err) => {
        if (err) {
          reject(err);
        }
        if (clear) {
          resolve(JSON.stringify(newData));
        } else {
          this.data = { ...this.data, ...newData }
          resolve(JSON.stringify(this.data));
        }
      });
    });
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        try {
          this.data = JSON.parse(data)
        } catch (err) {
          reject(err)
        }
        resolve(this.data);
      });
    });
  }

  async msgReceived(msg) {
    try {
      const data = await this.read()
      data.received.push(msg)
      await this.write(data)
      return true
    } catch (e) {
      return false
    }
  }

  async msgCreated(msg) {
    try {
      const data = await this.read()
      data.created.push(msg._data)
      await this.write(data)
      return true
    } catch (e) {
      return false
    }
  }

  async msgToSends(msg) {
    try {
      const data = await this.read()
      data.toSends.push(msg)
      await this.write(data)
      return true
    } catch (e) {
      return false
    }
  }

}

const files = new Files()

module.exports = files