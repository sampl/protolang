// Redirects
// URLs that should go to other routes, but have no page of their own

export default [

  // various legal URLs
  {
    path: `/legal`,
    target: `/terms`,
  },
  {
    path: `/terms-of-service`,
    target: `/terms`,
  },
  {
    path: `/terms_of_service`,
    target: `/terms`,
  },
  {
    path: `/tos`,
    target: `/terms`,
  },
  {
    path: `/privacy-policy`,
    target: `/privacy`,
  },
  {
    path: `/privacy_policy`,
    target: `/privacy`,
  },
  {
    path: `/DMCA`,
    target: `/dmca`,
  },
  {
    path: `/gdpr`,
    target: `/legal`,
  },
  {
    path: `/license`,
    target: `/open-source`,
  },
  {
    path: `/licenses`,
    target: `/open-source`,
  },
  
  // contributing
  {
    path: `/contributing`,
    target: `/contribute`,
  },
  {
    path: `/code-of-conduct`,
    target: `/conduct`,
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
  
  // developers
  {
    path: `/style-guide`,
    target: `/styleguide`,
  },
  {
    path: `/style`,
    target: `/styleguide`,
  },
  {
    path: `/styles`,
    target: `/styleguide`,
  },
  {
    path: `/design-system`,
    target: `/styleguide`,
  },
  {
    path: `/components`,
    target: `/styleguide`,
  },
]
