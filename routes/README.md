# Description

Routes. Simple functions used by express to hand off requests to.

# Strategic

 - These functions should all be very concise and contain as little logic as possible

# Tactical

  - Place a comment above the functions that lists the url pattern(s) that are likely to use this function (e.g. `POST /user/:id/`)
  - URLs should end with a trailing slash