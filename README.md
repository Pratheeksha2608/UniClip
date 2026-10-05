\# UniClip



\### Temporary, account-free clipboard synchronization across devices



UniClip is a lightweight clipboard synchronization system that allows multiple devices to share text through a temporary session.



Instead of requiring user accounts or permanently storing clipboard data, UniClip creates a temporary session with a unique session code. Other devices can join using the code and communicate in real time through WebSockets.



\### Why UniClip?



Moving text between devices can be inconvenient when the devices are not directly connected or when using a temporary setup.



UniClip provides a simple workflow:



\*\*Create a session → Share the session code → Join from another device → Sync clipboard text\*\*



No account is required, and sessions are temporary.



\## Features



\* 🔗 \*\*Temporary sessions\*\* with unique 6-digit session codes

\* 📡 \*\*Real-time communication\*\* using WebSockets

\* 💻 \*\*Multiple device support\*\*

\* 👥 \*\*Connected device tracking\*\*

\* 📋 \*\*Clipboard synchronization\*\* using the Clipboard API

\* 🕘 \*\*Local clipboard history\*\* for sent and received items

\* 📎 \*\*Copy previous clipboard items\*\* from history

\* 🗑️ \*\*Delete individual history items\*\*

\* 🧹 \*\*Clear clipboard history\*\*

\* 🔄 \*\*Reconnection handling\*\*

\* ⏳ \*\*Automatic session expiration\*\* after inactivity

\* 📏 \*\*Clipboard size limit\*\* of 10,000 characters

\* 🚪 \*\*Leave session\*\* functionality

\* 📋 \*\*Copy session code\*\* directly from the interface









\## How It Works



UniClip uses a Node.js WebSocket server to manage temporary sessions and route clipboard data between connected devices.



\### 1. Create a session



A device creates a new session by clicking \*\*Create Session\*\*.



The server generates a unique 6-digit session code and associates the device with that session.



\### 2. Join the session



Another device enters the session code and clicks \*\*Join Session\*\*.



If the session exists, the device is added to the same session and can communicate with the other connected devices.



\### 3. Sync clipboard



When a user clicks \*\*Sync Clipboard\*\*, UniClip reads the current text from the device's clipboard using the browser Clipboard API.



The text is sent to the Node.js WebSocket server.



\### 4. Broadcast to other devices



The server identifies the sender's session and broadcasts the clipboard content to the other devices connected to that session.



The sender does not receive its own message back from the server.



\### 5. Clipboard history



Received clipboard items are added to the local clipboard history.



Users can:



\* Copy a previous item back to their clipboard

\* Delete an individual item

\* Clear the entire history



\### 6. Session lifecycle



Sessions are temporary and expire after a period of inactivity.



Users can also leave a session manually. When devices join or leave, the connected device count and device list are updated in real time.





\## Architecture



UniClip follows a simple client-server architecture.



```text

┌─────────────────────┐

│     Device A        │

│  Browser Client     │

└──────────┬──────────┘

&#x20;          │

&#x20;          │ WebSocket

&#x20;          ▼

┌─────────────────────────────┐

│       Node.js Server        │

│                             │

│  • Session management       │

│  • Device tracking          │

│  • Message routing          │

│  • Session expiration       │

└─────────────┬───────────────┘

&#x20;             │

&#x20;             │ WebSocket

&#x20;             ▼

┌─────────────────────┐

│     Device B        │

│  Browser Client     │

└─────────────────────┘

```



\### Components



\*\*Browser Client\*\*



The frontend is built with HTML, CSS, and JavaScript. It provides the interface for creating and joining sessions, synchronizing clipboard content, viewing clipboard history, and managing the current session.



\*\*Node.js WebSocket Server\*\*



The backend uses Node.js and the `ws` library to maintain WebSocket connections, manage sessions, track connected devices, route messages, and handle session expiration.



\*\*Session Management\*\*



Each session is identified by a unique 6-digit code. The server maintains the devices connected to each session and ensures that clipboard messages are only sent to devices within the same session.



\*\*Clipboard API\*\*



The browser's Clipboard API is used to read text when the user explicitly clicks \*\*Sync Clipboard\*\* and to copy previously received items back to the clipboard.



\*\*In-memory Storage\*\*



Session information and connected clients are maintained in server memory. Clipboard history is maintained locally in the browser and is not permanently stored by the server.











\## Tech Stack



| Technology           | Purpose                                            |

| -------------------- | -------------------------------------------------- |

| \*\*HTML\*\*             | Frontend structure                                 |

| \*\*CSS\*\*              | Frontend styling                                   |

| \*\*JavaScript\*\*       | Frontend logic and user interactions               |

| \*\*Node.js\*\*          | Backend runtime and HTTP server                    |

| \*\*WebSocket (`ws`)\*\* | Real-time communication between clients and server |

| \*\*WebSocket API\*\*    | Browser-side real-time connection                  |

| \*\*Clipboard API\*\*    | Reading and writing clipboard text                 |



\## Project Structure



```text

UniClip/

├── client/

│   ├── index.html      # User interface

│   └── app.js          # Client-side logic

│

├── server/

│   └── server.js       # Node.js WebSocket server

│

├── .gitignore

├── package.json

├── package-lock.json

└── README.md

```









\## Installation \& Setup



\### Prerequisites



Make sure the following are installed:



\* \[Node.js](https://nodejs.org/) (which includes npm)

\* A modern web browser with Clipboard API support

\* Git (optional, if cloning the repository)



\### 1. Clone the repository



```bash

git clone https://github.com/Pratheeksha2608/UniClip.git

cd UniClip

```



\### 2. Install dependencies



```bash

npm install

```



This installs the WebSocket dependency used by the server.



\### 3. Start the server



```bash

node server/server.js

```



The server will start on:



```text

http://localhost:8080

```



\### 4. Open UniClip



Open the following URL in your browser:



```text

http://localhost:8080

```



For testing multiple devices, open UniClip in multiple browser tabs or windows on the same machine.



> \*\*Note:\*\* The current version is configured for local development. The WebSocket connection uses `ws://localhost:8080`.













\## Usage



\### Create a session



1\. Open UniClip in your browser.

2\. Click \*\*Create Session\*\*.

3\. A unique 6-digit session code will be displayed.

4\. Use \*\*Copy Code\*\* to copy the session code if needed.



\### Join a session



1\. Open UniClip in another browser tab or window.

2\. Enter the session code.

3\. Click \*\*Join Session\*\*.

4\. The connected device count and device list will update automatically.



\### Synchronize clipboard text



1\. Copy some text to the clipboard on one device.

2\. Click \*\*Sync Clipboard\*\*.

3\. The clipboard text is sent through the WebSocket server.

4\. Other devices in the same session receive the text.

5\. The item appears in their local clipboard history.



\### Manage clipboard history



Each history item provides:



\* \*\*Copy\*\* — copies the item back to the local clipboard.

\* \*\*Delete\*\* — removes the individual item from local history.

\* \*\*Clear History\*\* — removes all locally stored history items.



\### Leave a session



Click \*\*Leave Session\*\* to disconnect from the current session.



The remaining devices are updated automatically, and the session's connected device count is refreshed.



\### Session expiration



Sessions automatically expire after \*\*10 minutes of inactivity\*\*.



When a session expires, all connected clients are notified and the session is removed from the server.















\## Limitations \& Security Considerations



UniClip is currently designed as a lightweight local prototype rather than a production-ready synchronization service.



\### Current limitations



\* \*\*Local development:\*\* The current version connects to `localhost` and has not been deployed to a public server.

\* \*\*In-memory sessions:\*\* Session information exists only while the server is running. Restarting the server removes all active sessions.

\* \*\*No user accounts:\*\* Sessions are identified only by their temporary session codes.

\* \*\*Text clipboard only:\*\* The current implementation synchronizes clipboard text rather than files or other clipboard formats.

\* \*\*Manual synchronization:\*\* Clipboard content is sent only when the user explicitly clicks \*\*Sync Clipboard\*\*. UniClip does not continuously monitor the clipboard.

\* \*\*Browser clipboard permissions:\*\* Clipboard operations depend on browser security and permission policies.

\* \*\*No end-to-end encryption:\*\* Clipboard messages are not additionally encrypted by the application.



\### Security considerations



UniClip uses session codes to determine which connected devices belong to the same session. The server routes clipboard messages only to clients belonging to that session.



However, the current local prototype does not provide authentication or end-to-end encryption. Therefore, it should \*\*not be used to transmit sensitive or confidential information in an untrusted network environment\*\*.



For a production deployment, additional security measures would be required, such as:



\* Secure WebSocket connections (`wss://`)

\* Authentication or stronger session authorization

\* End-to-end encryption

\* Rate limiting and abuse protection

\* Secure session-code generation and management

\* Persistent and scalable session management









\## Demo



A short demonstration video showing UniClip's main functionality will be added here.



\*\*Demo Video:\*\* \*Link will be added before submission.\*



The demonstration covers:



\* Creating a temporary session

\* Joining from another device

\* Connected device tracking

\* Synchronizing clipboard text

\* Viewing clipboard history

\* Copying and deleting history items

\* Leaving a session



\## Future Improvements



Possible improvements for future versions include:



\* 🌐 Public deployment for communication across different networks

\* 🔐 End-to-end encryption for clipboard messages

\* 🔑 Stronger authentication and session authorization

\* 📱 Improved support for mobile devices

\* 📁 Support for additional clipboard formats and files

\* ⚡ More robust session management for large numbers of concurrent users

\* 📊 Monitoring and rate limiting for production deployments













\## Author



\*\*Pratheeksha J M\*\*



Built as part of the \*\*GDG × Iris Recruitment 2026\*\* task at NITK.





