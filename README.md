**REQUIREMENTS:**

  Intellij IDEA for running the back end
  Vscode (or still Intellij IDEA) for running the front end
  Node js installed on local machine
  Java 17

**SETUP:**

  In intellij, open the backend folder. Open the Main application file (), click run. The server will be set up on localhost 8080.
  I am using HSQL so you dont need to install a DBMS 

  In vscode, open the frontend folder and run "npm i" to install all the dependencies I used. Then run "npm run dev" to start the client. You can now view the UI on localhost 3000

**ADDITIONAL FEATURES:**
  
  - Scheme to help agents divide work amongst themselves, and to prevent
multiple agents working on the same message at once. The agents self assign and can't message a customer if another agent already self assigned

 - Surface messages that are more urgent and in need of immediate
attention. Messages are prioritized by keywords and a conversatin has its priority set to high if any message in it has high priority. Messages on UI are sorted by priority first then timestamp

- Additional information about customers. A customer id is passed to the profile page and information e.g customer name (as implemented here) is fetched

- Canned message feature that allows agents to quickly respond to enquiries
using a set of pre-configured stock messages.

- Realtime communication via websockets
