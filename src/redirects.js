// Redirects
// URLs that should go to other routes, but have no page of their own

export default [

  // various legal URLs
  {
    path: `/terms-of-service`,
    target: `/legal`,
  },
  {
    path: `/terms_of_service`,
    target: `/legal`,
  },
  {
    path: `/terms`,
    target: `/legal`,
  },
  {
    path: `/tos`,
    target: `/legal`,
  },
  {
    path: `/privacy`,
    target: `/legal`,
  },
  {
    path: `/privacy-policy`,
    target: `/legal`,
  },
  {
    path: `/privacy_policy`,
    target: `/legal`,
  },
  {
    path: `/dmca`,
    target: `/legal`,
  },
  {
    path: `/gdpr`,
    target: `/legal`,
  },
  {
    path: `/license`,
    target: `/legal`,
  },
  {
    path: `/licenses`,
    target: `/legal`,
  },
  
  // contributing
  {
    path: `/contributing`,
    target: `/contribute`,
  },

  // urls w/o language param
  {
    path: `/lessons`,
    target: `/`,
  },
  {
    path: `/practice`,
    target: `/`,
  },
  {
    path: `/resources`,
    target: `/`,
  },
  {
    path: `/words`,
    target: `/`,
  },
]
