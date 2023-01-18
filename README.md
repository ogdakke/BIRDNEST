## This is BIRDNEST
- Gets data from the api/api/, parses it and sets a timestamp to each data element.
- If timestamp exceedes 600 seconds, the data is deleted. 
- Uses localStorage to store the data for each individual browser, so it is not in any way a perfect solution. I think rather it would have been smarter to create a database for the data using a realtime capable db like firebase for ex. I played with storing the data in a cookie, but didn't really see the benfefit + added complexity.
### Problems
- Bugs most definetly exist. I went over them in the code, but most notably:
  - Sometimes, after a bad response from api I suppose, a JSON.parse error occurs, with unexpected character line 1 column 1. This _does not_ fix itself. localstorage needs to be cleared after this. Possible fix is to check for valid json data every time new data is going to be processed.
  - After removal of data, old data, or data with age > 600 seconds pops up again at the bottom of the list before being removed again. Possible fix: No idea, maybe the api response stalling is making the timing act weird. This is quite bad...

## Next.js
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
