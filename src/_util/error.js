export const logError = (action, error, suppressDialog) => {

  console.error(`Error during ${action}: ${error.message}`, error)

  // TODO: Send error to sentry etc

  if (!suppressDialog) {
    alert(`Sorry, something went wrong. Try again in a minute? \n\n Could not ${action} - ${error.message}`)
  }
}
