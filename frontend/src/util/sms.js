import config from "../config";

export default function sendMessage(to, message) {
  fetch(config.messageUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
      to,
      message
    })
  }).then((response) => response.text()).then((data) => {
    console.log('Message:', message, data)
  })
}
