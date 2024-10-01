Things to do after cloning the repository

Setup Database:
1. Launch Xampp and start the Apache and MySql services
2. Open a web browser and go to localhost/phpmyadmin/ (link may be unsafe to some browsers. just proceed)
3. Create a new database and name it 'unicoredb'
4. Select the new database and go to Import tab
5. Choose the unicoredb.sql file from the unicore-backend folder and click Import

Next, go to the root folder of your repo and launch the Terminal/Command Prompt

Commands for Backend API from root folder:
1. cd unicore-backend
2. node api.js

This will run the API. Press Ctrl + C in the Terminal to stop the API from running

Commands for Frontend from root folder:
1. cd unicore-frontend
2. npx auth secret (one-time only, unless repo is updated)
3. npm run dev

This will run the port 3000 for the frontend (Ctrl + C to stop)

Then open a web browser and got to localhost:3000
