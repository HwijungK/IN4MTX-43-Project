# Architecture

## Platforms

- Web Browser (Demonstration Purpose):  
  - Hardware: Any computer or mobile device  
  - Operating system: Any OS  
  - Benefits:  
    - Cross-platform compatibility, working on any system and without installation.  
    - The modification is immediately visible and does not require recompilation in native apps.  
    - Easy to share and demonstrate  
  - Trade-offs:  
    - The browser cannot continuously locate in the background, which limits the proximity feature based on the distance  
    - The browser-based GPS access is less precise and less reliable than native device location APIs  
    - Notification requires extra setup  
- Mobile Application (Project Target):  
  - Hardware: Mobile devices, smartphones  
  - Operating system: iOS, Android  
  - Benefits:  
    - Accessible native GPS and background location tracking  
    - Firebase notification  
    - Share most of codes with the web browser version  
  - Trade-offs:  
    - Requires separate build pipelines for iOS and Android  
    - There’s a review process during development and updates on Apple App Store and Google Play, may require platform-specific native modules  
    - Harder to demonstrate  
- Backend Server:  
  - Hardware: Cloud-hosted virtual machines  
  - Operating system: Linux  
  - Benefits:  
    - The server is always online and accessible by both the web demo and mobile apps, ensuring consistent behavior for different platforms  
    - Scaled up on demand, easier to handle more users as the app grows.  
  - Trade-offs:  
    - Requires a paid subscription, adding cost as the user grows  
    - Increasing the technical complexity, requiring more configuration and setup than running locally

## Programming Languages

- React Native \+ Typescript  
  - Reasoning: it's just the standard.  
- Expo for app  
  - Reasoning: Easier to implement with background in React

## Communicator Protocols

- Components:  
  - User  
  - Mobile/Web Client  
  - Relational Database (Supabase Postgres)  
  - Realtime Database? (NoSql?)  
  - Location (Native Mobile Location API)?  
  - API for messaging (Firebase Cloud Messaging?)?  
- Communication Protocol:  
  - User \<\> Mobile/Web Client  
    - User will control the app through UI pressing relevant buttons/providing input data  
  - Mobile/Web Client\<\>Backend  
    - Use HTTPS requests between the frontend and backend to request data/functions  
  - Backend \<\> Database  
    - backend queries to database using Supabase API  
  - Client \<\> Location  
    - Native mobile location API is used to access gps functionality from the os

## Examples of Component Functions and Connector Communications

- Use Case 1: Log in Functionality  
  - BASIC FLOW  
    - \[Web Client\]  
      - 1\. EnterCredentials  
      - 8\. DisplayHomePage (successful login)  
    - \[Web Client \<-\> Backend\]   
      - 2\. Client gives Credential data (username, password) to backend for verification  
      - 7\. Backend returns bool depending on whether login was successful  
    - \[Backend\]   
      - 3\. VerifyCredentials  
      - 6\. ReturnLoginSuccess  
    - \[Backend \<-\> DB\]   
      - 4\. Backend queries DB for the row (username, password) of the given username so that it can check if the password was correct  
      - 5\. DB returns row (username, password)  
    - \[DB\]  
      - UserTable (username, password)  
  - Alternative Flow  
    - \[Web Client\]  
      - 1\. EnterNewUserInfo  
    - \[Web Client \<-\> Backend\]  
      - 2\. client supplies name, age, username, password, school .etc  
    - \[Backend\]  
      - 3\. VerifyValidAccount  
        - checks that password meets requirement  
        - check that there is not an existing account that uses the username  
      - 5.. CreateNewAccount  
    - \[Backend \<-\> DB\]  
      - 4\. Queries DB for row containing username (should return None)  
      - 6\. Provides username, password, name, age, etc and inserts into UserTable  
  - EXCEPTION FLOW  
    - \[Web Client\]  
      - 1\. EnterCredentials (gets input from user)  
      - ShowTryAgain (display that UI was wrong)  
    - \[Web Client \<-\> Backend\]  
      - 2\. Client gives credential data to backend for verification  
      - 7\. Backend returns False as password was incorrect  
    - \[Backend\]  
      - 3\. VerifyCredentials  
      - 6\. ReturnLoginSuccess  
    - \[Backend \<-\> DB\]  
      - 4\. Backend queries DB for row matching given username  
      - 5\. Db returns row (username, password)  
- Use Case 2: Interest and Tag Subscription  
  - BASIC FLOW  
    - \[Web/Mobile Client\]  
      - 1.SearchTag(string tag)  
      - 10.DisplayResults  
    - \[Client \<-\> Backend\]  
      - 2.Sends user input tag to backend  
      - 9.Backend sends verified tag with subscriber count  
    - \[Backend\]  
      - 3.QueryTag  
      - 4\. SubscribeToTag  
    - \[Backend \<-\> DB\]  
      - 5\. Increment subscriber count on on relevant tag in Tag table by 1  
      - 6\. add new row to User\_To\_Tag  
      - 7.Backend queries DB Tag table to see if user input is a valid tag  
      - 8.DB returns row (name, subscribe\_count, created\_at)  
    - \[DB\]  
      - Table: Tag (name, subscriber\_count, created\_at)  
      - Table: User\_To\_Tag (username, tag)  
  - ALTERNATIVE FLOW  
    - \[Web/Mobile Client\]  
      - 1.AddTag (string tag)  
      - OnNewTagAdded  
        - display UI saying that you created a new tag  
    - \[Client \<-\> Backend\]  
      - 2.Sends user input tag to backend  
      - 8\. Backend Sends verified new tag  
    - \[Backend\]  
      - 3\. CheckTagIsSafe (string tag)  
      - 5\. AddTag (string tag)  
      - 7\. TagWasAdded  
    - \[Backend \<-\> DB\]  
      - 4\. Backend queries Profanities table to see if proposed tag matches a profanity, (it shouldn’t)  
      - 6\. Backend sends new tag data (tag name, subscriber\_count \= 1, created\_at \= NOW)  
    - \[DB\]  
      - Table: Tag (name, subscriber\_count, created\_at)  
      - Table: Profanities (profanities)  
  - EXCEPTION FLOW (Assume everything up to ALTERNATIVE FLOW step  4 is still in place)  
    - \[Web/Mobile Client\]  
      - 8\. AddTagFailed  
        - Display UI saying that the proposed tag goes against terms and conditions  
    - \[Client \<-\> Backend\]  
      - 7\. backend tells client that tag addition failed and gives reason why (matched profanity)  
    - \[Backend\]  
      - 6\. TagWasAdded  
    - \[Backend \<-\> DB\]  
      - 5\. DB query statement returns a match  
    - \[DB\]  
      - Table: Profanities (profanities)  
- Use Case 3: Profile Editing and Management  
  - BASIC FLOW  
    - \[Web Client\]  
      - 1\. EnterNewProfileData  
      - 8\. DisplayUpdateSuccess  
    - \[Web Client \<-\>  Backend\]  
      - 2\. Client sends updated profile data (string: bio, string: name, array: hashtags) along with the user's session token to the backend.  
      - 7\. Backend returns a boolean or success object confirming the profile has been successfully published  
    - \[Backend\]  
      - 3\. ValidateProfileInput: Checks new data meets length and filter requirements  
      - 6\. ConfirmChangeSuccess: Prepares the success signal back  
    - \[Backend \<-\> DB\]  
      - 4\. Backend sends an update request to the database targeting the specific User ID with the new attributes  
      - 5\. DB returns a status message confirming that the row in the UserTable was updated successfully  
    - \[DB\]  
      - UserTable   
  - ALTERNATIVE FLOW  
    - \[Web Client\]  
      - 1\. RouteToSettings   
      - 2\. InitiateProfileFetch (Loads current profile details)  
      - 9\. PopulateEditFields (Takes returned object and fills textboxes)  
    - \[Web Client \<-\>  Backend\]  
      - 3\. Client sends a GET request to /api/user/profile with the User ID.  
      - 8\. Backend returns a data object  
    - \[Backend\]  
      - 4\. VerifyAccessRights: Backend ensures the requesting user is authorized to view this specific profile.  
      - 7\. FormatProfileResponse: Cleans the raw DB data into a format suitable for the frontend.  
    - \[Backend \<-\> DB\]  
      - 5\. Backend sends a SELECT query to the UserTable for the specific User ID  
      - 6\. DB returns the row containing the user's current profile information.  
    - \[DB\]  
      - UserTable  
  - EXCEPTION FLOW: Empty Textbox  
    - \[Web Client\]  
      - 1\. InterceptSubmission (Reacts to save input, recognizes empty string)  
        - 2\. TriggerValidationError (Highlight text box, displays error message)  
        - *If client-side validation can be bypassed → Continue, else finish*  
        - 7\. HandleErrorResponse (Receives error message, displays error)  
      - \[Web Client \<-\>  Backend\]  
        - 3 .Client sends the update request with empty strings (connector attempt).  
        - 6\. Backend returns an error message and code  
      - \[Backend\]  
        - 4\. ValidateProfileInput  
        - 5\. AbortDatabaseOperation (Halts process before communicating to DB)  
- Use Case 4: Swiping Functionality  
  - BASIC FLOW  
    - \[Web/Mobile Client\]  
      - 1\. OpenDiscoveryModule  
      - 7\. DisplayMatches  
      - 4\. SendMatch  
      - 5\. RespondToMatch  
      - 7\. LoadNewMatches  
      - 9\. EnableChat  
    - \[Client \<-\> Backend\]  
      - 2\. Client requests a list of potential matches to the backend  
      - 3\. Backend returns the list of potential matches to the client  
      - 4\. Client sends to backend which user they swiped  
      - 5\. Backend sends a swipe notification to the other user  
      - 7\. If all matching profiles have been exhausted, go back to step 3  
      - 8\. Other user sends a request to the backend that they have swiped the sender  
      - 9\. Backend enables the chat feature for the user  
    - \[Backend\]  
      - 4\. AddMatchRequest  
      - 8\. AcceptMatchRequest  
      - 2\. SearchMatchProfiles  
      - 9\. EnableChat  
    - \[Backend \<-\> DB\]  
      - 2\. DB accepts backend request for matches   
      - 3\. DB returns list of matching users with user info  
      - 4\. Backend stores the profiles the user swiped in a DB  
      - 9\. Backend requests DB to add user to chat list  
    - \[DB\]  
      - 2\. MatchesTable(match\_id, user\_a\_id, user\_b\_id)  
      - 4\. SwipesTable(sender\_id, receiver\_id, is\_responded)  
      - 9\. ChatTable(user\_id)  
  - ALTERNATIVE FLOW:  
    - \[Web/Mobile Client\]  
      - 1\. SetFilters  
      - 3\. ShowFilters  
      - 4\. DisplayFilteredMatch  
    - \[Client \<-\> Backend\]  
      - 1\. User sends inputted filters to the backend  
      - 4\. Backend adds the selected filters and updates the user’s matches  
    - \[Backend\]  
      - 1\. AddFilters  
      - 2\. SearchFilteredMatches  
      - 4\. DisplayFilteredMatches  
      - 5\. DisplayFilters  
    - \[Backend \<-\> DB\]  
      - 1\. Backend sends the list of filters applied to DB  
      - 2\. DB removes matches that don’t meet the criteria  
      - 4\. DB returns list of filtered matches  
      - 5\. DB returns the list of filters that were sent from the backend  
    - \[DB\]  
      - 2\. FilteredMatchesTable(match\_id, user\_a\_id, user\_b\_id, filter\_id)  
      - 5\. FilterTable(user\_id, filter\_type, filter\_tag, is\_active) filter\_type is the category to be filtered (location, interest, etc.) filter\_tag is the name of filters  
  - EXCEPTION  
    - \[Web/Mobile Client\]  
      - 2\. DisplayMatchError  
      - 3\. NotifyUser  
    - \[Client \<-\> Backend\]  
      - 1\. Client sends list of filters that eliminate all matches  
      - 2\. Backend sends a blank list of matches to the client  
      - 3\. Backend displays an error message to the client  
    - \[Backend\]  
      - 2\. ReturnBlankMatches  
    - \[Backend \<-\> DB\]  
      - 2\. DB returns an empty table of matches  
    - \[DB\]  
      - 2\. NullMatchTable(error\_id)  
- Use Case 5: Chatting   
  - BASIC FLOW   
    - \[Web/Mobile Client\]  
      - 1\. OpenMapModule  
      - 2\. TapNearbyUser  
      - 3\. SendGreetingMessage  
      - 4\. ReceiveAndReplyMessage  
      - 6\. AddFriend  
    - \[Client \<-\> Backend\]  
      - 2\. Client sends location to backend to retrieve nearby users with shared interests  
      - 7\. Backend returns updated chat status and marks the chat as permanent  
    - \[Backend\]  
      - 3\. CreateProximityRoom  
      - 3\. BroadcastMessage  
      - 6\. AddFriend  
      - 6\. SaveChatAsPermanent  
      - 7\. DissolveProximityRoom  
    - \[Backend \<-\> DB\]  
      - 3\. Backend stores chat message in DB  
      - 6\. Backend updates friend relationship in relational DB  
      - 7\. Backend deletes proximity room from DB when users leave the area  
      - DB returns updated chat and friend status  
    - \[DB\]  
      - ChatTable(message\_id, sender\_id, room\_id, content, time\_sent)  
      - FriendTable(user\_a, user\_b, created\_time)  
      - ProximityRoomTable(room\_id, users\_ids, is\_permanent)  
  - ALTERNATIVE FLOW 3A:  
    - \[Web/Mobile Client\]  
      - 1\. OpenChatModule  
      - 1\. NavigateToFriendsTab  
      - 2\. SelectFriendOrGroup  
      - 2\. SendMessage  
    - \[Client \<-\> Backend\]  
      - 1\. Client requests existing friend chat thread from backend  
      - 2\. Client sends new message to backend  
      - 3\. Backend delivers message to another user and returns to step 4 of the basic flow  
    - \[Backend\]  
      - 1\. GetFriendChat  
      - 2\. DeliverMessage  
    - \[Backend \<-\> DB\]  
      - 1\. Backend queries DB for chat history between the two users  
      - 2\. Backend writes new message to DB  
    - \[DB\]  
      - FriendChatTable (history\_id, user\_a, user\_b, messages)  
  - ALTERNATIVE FLOW 3B:  
    - \[Web/Mobile Client\]  
      - 1\. SelectMultipleNearbyUsers  
      - 1\. TapExistingGroupOnMap  
      - 2\. SendOrAcceptGroupInvite  
    - \[Client \<-\> Backend\]  
      - 1\. Client sends group creation request with selected user ids  
      - 2\. Backend returns group room id and notifies the invited users  
      - 3\. Return to step 3 of the basic flow  
    - \[Backend\]  
      - 1\. CreateGroupRoom  
      - 2\. SendGroupInvite  
      - 3\. NotifyGroup  
    - \[Backend \<-\> DB\]  
      - 1\. Backend stores group room members in DB  
      - DB returns group member list  
    - \[DB\]  
      - GroupRoomTable(room\_id, member\_ids, is\_proximity)  
  - EXCEPTION FLOW 3:  
    - \[Web/Mobile Client\]  
      - 1\. TapNearbyUser  
      - 1\. OpenChatModule  
    - \[Client \<-\> Backend\]  
      - 2\. Client sends chat request to backend  
      - 3\. Backend detects block status and denies the chat request  
      - 3\. Backend updates the map, removing blocked user  
    - \[Backend\]  
      - 2\. CheckStatus  
      - 3\. DenyChatAccess  
      - 3\. RemoveBlockUser  
    - \[Backend \<-\> DB\]  
      - 2\. Backend queries DB to check block status  
      - DB returns block record  
    - \[DB\]  
      - BlockTable(blocker\_id, blocked\_id, created\_at)  
  - EXCEPTION FLOW 4A:  
    - \[Web/Mobile Client\]  
      - ReportAndBlock  
    - \[Client \<-\> Backend\]  
      - Client requests a report along with message id and reason  
      - Backend removes reported user from the chat and notifies the user who reported  
    - \[Backend\]  
      - FlagMessage  
      - ReviewReport  
      - RemoveUser  
    - \[Backend \<-\> DB\]  
      - Backend marks message as flagged in DB  
      - Backend records block status in DB  
    - \[DB\]  
      - MessageTable(message\_id, content, flagged, reviewed)  
      - BlockTable(blocker\_id, blocked\_id, created\_at)  
- Use Case 6: Joining new Communities  
  - BASIC FLOW    
    - \[Web/Mobile Client\]    
      1\. OpenCommunitiesModule    
      2\. BrowseCommunityList    
      3\. SelectCommunity    
      4\. JoinCommunity    
      5\. DisplayCommunityPage    
      6\. ReceiveAnnouncementNotification    
      7\. MarkEventAttendance    
- \[Client \<-\> Backend\]  

  2\. Client requests nearby or recommended communities from backend  

  4\. Client sends join request for selected community  

  6\. Backend sends announcement or event notification to community members  

- \[Backend\]  

  2\. GetCommunities  

  4\. AddCommunityMember  

  6\. CreateAnnouncementNotification  

  7\. UpdateAttendanceStatus  

- \[Backend \<-\> DB\]  

  2\. Backend queries DB for communities matching user interests, location, or search criteria  

  4\. Backend inserts user into CommunityMemberTable  

  6\. Backend stores announcement and notification records  

  7\. Backend updates event attendance record  

- \[DB\]    
- CommunityTable(community\_id, name, hobby\_tag, description, is\_private, lead\_id)    
- CommunityMemberTable(community\_id, user\_id, role, joined\_at)    
- AnnouncementTable(announcement\_id, community\_id, lead\_id, content, created\_at)    
- CommunityEventTable(event\_id, community\_id, title, date, time, location)    
- EventAttendanceTable(event\_id, user\_id, status)


- ALTERNATIVE FLOW: Community Lead creates an official event    
  - \[Web/Mobile Client\]  

    1\. OpenManageCommunityDashboard  

    2\. SelectCreateMeeting  

    3\. EnterMeetingDetails  

    4\. PublishMeeting  

- \[Client \<-\> Backend\]  

  3\. Client sends event date, time, location, and description to backend  

  4\. Backend returns confirmation and notifies community members  

- \[Backend\]  

  3\. ValidateEventDetails  

  4\. CreateCommunityEvent  

  4\. NotifyCommunityMembers  

- \[Backend \<-\> DB\]  

  4\. Backend inserts new event into CommunityEventTable  

  4\. Backend creates notification records for all community members  

- \[DB\]  

  \- CommunityEventTable(event\_id, community\_id, title, date, time, location)  

  \- NotificationTable(notification\_id, user\_id, type, content, created\_at)

- EXCEPTION FLOW: User attempts to join a private or restricted community    
  - \[Web/Mobile Client\]  

    1\. RequestToJoinCommunity  

    4\. DisplayRequestStatus  

- \[Client \<-\> Backend\]  

  1\. Client sends request to join restricted community  

  3\. Backend returns pending, approved, or denied status  

- \[Backend\]  

  2\. CheckCommunityPrivacy  

  2\. CreateJoinRequest  

  3\. ReviewJoinRequest  

- \[Backend \<-\> DB\]  

  2\. Backend checks CommunityTable privacy setting  

  2\. Backend inserts request into JoinRequestTable  

  3\. Backend updates request status after Community Lead review  

- \[DB\]  

  \- JoinRequestTable(request\_id, community\_id, user\_id, status, created\_at)


- EXCEPTION FLOW: Community Lead posts prohibited content    
  - \[Web/Mobile Client\]  

    1\. SubmitAnnouncement  

    5\. ShowPostRejectedMessage  

- \[Client \<-\> Backend\]  

  1\. Client sends announcement content to backend  

  4\. Backend rejects announcement and returns reason  

- \[Backend\]  

  2\. CheckAnnouncementIsSafe  

  3\. RejectAnnouncement  

- \[Backend \<-\> DB\]  

  2\. Backend queries Profanities table or moderation service  

  3\. Announcement is not inserted into AnnouncementTable  

- \[DB\]  

  \- Profanities(profanity\_id, word)


- Use Case 7: Searching Nearby  
  - BASIC FLOW    
    - \[Web/Mobile Client\]    
      1\. OpenAroundYourAreaTab    
      2\. DisplayNearbyInterestLeaderboard    
      3\. SelectInterestTag    
      4\. AddInterestToProfile    
      5\. SearchNearbyUsersWithInterest    
- \[Client \<-\> Backend\]  

  1\. Client sends user location, selected radius, and area request to backend  

  2\. Backend returns top 100 nearby interest tags ranked by popularity  

  4\. Client sends request to add selected interest to user profile  

  5\. Client requests nearby users matching the selected interest  

- \[Backend\]  

  1\. GetUserArea  

  2\. QueryPopularNearbyTags  

  4\. AddTagToUserProfile  

  5\. SearchNearbyUsersByTag  

- \[Backend \<-\> DB\]  

  2\. Backend queries DB for tags used by users within the selected area  

  2\. DB returns tag names, subscriber counts, and active nearby user counts  

  4\. Backend inserts selected tag into User\_To\_Tag  

  5\. Backend queries nearby users who share the selected tag  

- \[DB\]  

  \- TagTable(tag\_id, name, subscriber\_count, created\_at)  

  \- User\_To\_Tag(user\_id, tag\_id)  

  \- UserLocationTable(user\_id, latitude, longitude, last\_active)  

  \- UserProfileTable(user\_id, display\_name, age, bio)


- ALTERNATIVE FLOW 1: User searches for a specific nearby interest    
  - \[Web/Mobile Client\]  

    1\. SelectSearchBar  

    2\. EnterInterestKeyword  

    3\. DisplayMatchingInterestTags  

    4\. SelectInterestTag  

- \[Client \<-\> Backend\]  

  2\. Client sends search keyword and location radius to backend  

  3\. Backend returns first 100 similar interest tags in the user’s area  

  4\. Return to step 4 of the basic flow  

- \[Backend\]  

  2\. ValidateSearchInput  

  3\. SearchNearbyTagsByKeyword  

- \[Backend \<-\> DB\]  

  3\. Backend queries TagTable and UserLocationTable for matching local tags  

  3\. DB returns matching tags sorted by similarity and popularity  

- \[DB\]  

  \- TagTable(tag\_id, name, subscriber\_count, created\_at)  

  \- UserLocationTable(user\_id, latitude, longitude, last\_active)


- ALTERNATIVE FLOW 2: User filters nearby interests by group    
  - \[Web/Mobile Client\]  

    1\. OpenFilterMenu  

    2\. SelectFilterCriteria  

    3\. CloseFilterMenu  

    4\. EnterInterestKeyword  

    5\. DisplayFilteredNearbyInterests  

- \[Client \<-\> Backend\]  

  2\. Client sends selected filters such as age range or identity group  

  4\. Client sends search keyword, filters, and location radius to backend  

  5\. Backend returns top 100 filtered nearby interests  

- \[Backend\]  

  2\. StoreTemporarySearchFilters  

  4\. SearchNearbyTagsWithFilters  

- \[Backend \<-\> DB\]  

  4\. Backend queries user profiles, locations, and tag subscriptions using selected filters  

  5\. DB returns matching interest tags from the filtered group  

- \[DB\]  

  \- UserProfileTable(user\_id, age, identity\_group, bio)  

  \- UserLocationTable(user\_id, latitude, longitude, last\_active)  

  \- User\_To\_Tag(user\_id, tag\_id)  

  \- TagTable(tag\_id, name, subscriber\_count)


- EXCEPTION FLOW 1: No nearby interest results found    
  - \[Web/Mobile Client\]  

    1\. EnterInterestKeyword  

    4\. DisplayNoResultsMessage  

- \[Client \<-\> Backend\]  

  1\. Client sends search keyword to backend  

  3\. Backend returns empty result set  

- \[Backend\]  

  2\. SearchNearbyTagsByKeyword  

  3\. ReturnNoResults  

- \[Backend \<-\> DB\]  

  2\. Backend queries DB for matching tags  

  3\. DB returns no matching rows  

- \[DB\]  

  \- TagTable(tag\_id, name, subscriber\_count)


- EXCEPTION FLOW 2: User searches prohibited content    
  - \[Web/Mobile Client\]  

    1\. EnterInterestKeyword  

    5\. DisplayOffensiveSearchError  

- \[Client \<-\> Backend\]  

  1\. Client sends search keyword to backend  

  4\. Backend rejects search request and returns reason  

- \[Backend\]  

  2\. CheckSearchIsSafe  

  3\. RejectSearchInput  

- \[Backend \<-\> DB\]  

  2\. Backend queries Profanities table or moderation service  

  3\. Search is not performed  

- \[DB\]  

  \- Profanities(profanity\_id, word)