// import LogRocket from 'logrocket'
import * as Sentry from "@sentry/react"

export const logError = (action, error, suppressDialog) => {

  console.error(`Error during ${action}: ${error.message}`, error)

  // https://github.com/getsentry/sentry-javascript/issues/1607#issuecomment-551756226
  Sentry.withScope(scope => {
    // scope.setTags(context.tags)
    scope.setExtras({ action })
    Sentry.captureException(error)
  })

  // // https://docs.logrocket.com/reference/capture-exception
  // LogRocket.captureException(error, {
  //   extra: {
  //     action,
  //   },
  // })

  if (!suppressDialog) {
    alert(`Sorry, something went wrong. Try again in a minute? \n\n Could not ${action} - ${error.message}`)
  }
}
