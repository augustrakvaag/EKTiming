## EK Timing
EK Timing is a timing system developed for Aquathlon where the swimming is done inside in a pool. The system is a web-applications that can be directly placed anywhere under the web-root/public on a web-server. 

## IMPORTANT
There are two lines needed to be changed in one file before you can start using it, those are in the credentials.php file. One is a filepath the other is the super user passwords. It is also recommended to change the name of the database (in order to "hide" it). The database has no protection and anyone with access can change the data. Hide the position of this database by giving it an obscure name.

## Disclaimer
Do not get fooled by the fancy style-sheets and the differentiating between admin and super-admin user, etc. Tho this may look professional (who am I fooling), there are little to no effort really put into security. Mainly because the application is meant to run locally manipulating relatively non-sensitive data. That said, some precautions have been so that spectators viewing the applications and assistants recording times on the application should not be able to screw it up. 

## Usage & UI
1. Create Event (Tutorial coming next commit, eta June 2024)
2. Get users to navigate to yoururl.com/EKTiming/admin, they will then be sent to the checkin page.
3. Enter the event credentials made in step 1. (Green Background: credentials correct), (Gray Background: did not find event), (Orange Background: Found Event, Wrong password)
4. Just before the assistant start his/hers job at his/hers station press the buttons "clear session data" and "synchronize" (Look at technical for more information)
5. When an assistant registers a timing using the UI designed for their post. The database is updated and everyone can see the live results at yoururl.com/EKTiming/ by providing the event name made in step 1.

## Technical
"Clear Session Data"; deletes all locally stored times saved on the assistant’s unit. This is smart to press before going to a post, since previous recorded times (be they from a test or a previous event) may be annoying to have cluttering the UI.

"Synchronize": All the peripheral and central units run on their own clocks (these needs to be synchronized, as they can be as much as 2 seconds off each other, altering the outcome of some athletes). This is solved by every unit synchronizing to the central one’s clock. However, after a location swap, the peripheral units may also swap how they calculate theirs real time clock. It is therefore sufficient and required that the assistants synchronize their units when arriving at theirs posts.   

"Restarting Swim & Run": After the start has been called and the contestants are out there, then the start time should have been written in stone. This is the philosophy. Resetting swim and run is possibles but it will affect all the contestants. If a swim heat does not go as planned and has to be aborted, then their times should be recorded manually afterwards.
