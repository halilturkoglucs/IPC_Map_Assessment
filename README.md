# IPC_Map_Assessment
Source code for the IPC Assessment. This assignment contains source code that accomplishes the below:

Using the data from the IPC API, adding a visual representation of the trends in food insecurity (AFI – Acute Food Insecurity) 
in a specific country (Afghanistan in this case) over the years.
The trend graph displays minimum:
• the number of population in each phase (1 through 5) and/or the percentage of population in each phase for each analysis available via the API.
• the year of the analysis.

There's a sub-README.md file in the population-trend-app folder containing react-starter-app instructions to run the app locally or to build it for production.

# Response
- I have chosen Afghanistan as the source country as the assignment text recommended using that.
- Line chart is used to easily display the trend over the years for each phase
- The chart is titled to show the country info as well as the whole page
- You can include/exclude same phase data from the graph by clicking on the label (see screenshots please)
- The assignment makes use of the given api key. 
You can set a different one by specifying the below environment variable while running locally using nodejs if needed:
`REACT_APP_API_TOKEN=your-api-token-here`
- The chart is responsive and can work in different browsers and viewports (mobile, tablet, desktop etc.)
- I have added a start and end year slicer, it defaults to 2020-2020. You can change the range accordingly but there's a debouncer 
that prevents calling the API immediately to prevent calling it consequently while the range is still being changed by the user for performance reasons.

# How to Run
I have already made a production build and added to the root path. You can open the build/index.html directly. 
Please see the screenshots folder to see the app and how it works.

# What Could Have Been Done More
I think I could have done more in the future:
- Add unit tests for the component
- Add sub area info to the line chart (maybe add a dropdown to select the area that the user wants to display data for)

# Libraries Used
I have utilized the below javascript libraries for the assignment:

React.js: JavaScript library for building user interfaces.
create-react-app: Scaffolding for generating the basic react starter app.
Axios: Promise-based HTTP client for making API requests.
Chart.js: JavaScript charting library for creating interactive charts.
react-chartjs-2: React wrapper for Chart.js to easily integrate charts into React applications.
loadash: Debounce function is used to defer calling the api when the slider changes
Make sure you have Node.js and npm installed on your machine to run the application.