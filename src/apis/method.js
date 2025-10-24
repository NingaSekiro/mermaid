export const getMethods = () => {
  window.javaQuery({
    request: 'butterfly',
    persistent: false,
    onSuccess: function(response) {
      return response
    },
    onFailure: function(error_code, error_message) {
    }
  })
}