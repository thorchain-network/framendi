function createStreamConnection(store, channel, processDispatch) {
  const connection = new WebSocket(process.env.stream.url)

  connection.onopen = () => {
    const identifier = JSON.stringify({
      channel,
      network: store.state.network
    })
    connection.send(JSON.stringify({ command: 'subscribe', identifier }))
  }

  connection.onmessage = (event) => {
    store.dispatch('stream/increase')

    const { type, message } = JSON.parse(event.data)

    if (type === 'ping' || !message) return

    const data = JSON.parse(message)

    if (store.getters.network.current.lastblock >= data.lastblock) return
    store.dispatch('deltaUpdate', data)
    store.dispatch('ticker/setRune', data.rune)
    store.dispatch(processDispatch, data)
  }

  return connection
}

export const nodeStreamConnection = (store) => {
  return createStreamConnection(store, 'NodeChannel', 'processNodes')
}

export const poolStreamConnection = (store) => {
  return createStreamConnection(store, 'PoolChannel', 'processPools')
}
