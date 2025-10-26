export function getMethodsAPI() {
  return new Promise((resolve, reject) => {
    window.javaQuery({
      request: 'butterfly',
      persistent: false,
      onSuccess: function(response) {
        resolve((JSON).parse(response))
      },
      onFailure: function(error_code, error_message) {
        console.error('Error:', error_code, error_message)
        reject(new Error(`Failed to fetch methods: ${error_message}`))
      }
    })
  })
}