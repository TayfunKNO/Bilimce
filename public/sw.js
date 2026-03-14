self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  const title = data.title || 'BİLİMCE'
  const body = data.body || 'Yeni araştırma var!'
  
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow('https://bilimce.vercel.app')
  )
})
