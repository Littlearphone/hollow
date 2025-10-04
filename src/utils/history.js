const LOCAL_STORAGE_NAME = 'bloodorca@hollow'

export default class HistoryData {
  constructor() {
    this.syncFromLocalStorage()
  }

  count() {
    return this.list.length
  }

  syncFromLocalStorage() {
    const res = localStorage.getItem(LOCAL_STORAGE_NAME)
    this.list = (res ? JSON.parse(res).list : []) || []
    this.list.forEach(item => {
      item.date = new Date(item.date)
    })
    if (this.onChange) {
      this.onChange()
    }
  }

  syncToLocalStorage() {
    try {
      localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify({ list: this.list }))
    } catch (err) {
      const departed = this.list[this.list.length - 1]
      console.error(`localStorage quota reached! Removing "${departed.hash}", the least recent file.`)
      this.removeLeastRecent()
      this.syncToLocalStorage()
    }
  }

  addToHistory(jsonString, fileName, hash) {
    this.list.unshift({
      date: new Date(),
      fileName,
      jsonString,
      hash: hash
    })
    if (this.onChange) {
      this.onChange()
    }
  }

  removeFromHistory(hash) {
    this.list = this.list.filter(item => item.hash !== hash)
    if (this.onChange) {
      this.onChange()
    }
  }

  removeLeastRecent() {
    if (this.list.length) {
      this.list.pop()
    }
    if (this.onChange) {
      this.onChange()
    }
  }
}
