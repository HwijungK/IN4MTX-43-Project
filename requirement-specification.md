# Title: CommonGround

Members:

- June Kim \- [hwijungk@uci.edu](mailto:hwijungk@uci.edu)  
- Addie Ruan \- [addier@uci.edu](mailto:addier@uci.edu)  
- Jose Ramos \- jgramos3@uci.edu  
- Celina Chen \- [celinac7@uci.edu](mailto:celinac7@uci.edu) 

# 

# Executive Summary

This application is a location-based social platform designed to help people connect in real life through shared interests and proximity. Unlike traditional social or dating apps, the core purpose is to foster meaningful, in-person interactions by matching users with others nearby who share similar hobbies, lifestyles, or goals. The app operates primarily on portable devices and integrates with location services (e.g., map functionality) to create a dynamic, real-time view of nearby users and communities.

Users begin by creating an account, where they define their age range and identity group (e.g., students, adults), allowing the platform to tailor experiences appropriately. In school-based environments, access can be restricted to verified institutional accounts, improving safety and enabling more relevant connections. Profiles include customizable bios, interests, and media, forming the basis for a matching system that uses swipe-style interaction to introduce users with similar preferences.

A key differentiator is the emphasis on proximity-based interaction. Users can participate in local group chats within a defined radius, making it easy to organize meetups and engage with others nearby. Longer-term communication is supported through private chats with users they have met and added. Additionally, community features allow users to join interest-based groups, receive announcements, and participate in organized events.

The platform also encourages exploration through trending hobby leaderboards and personalized recommendations based on user activity and social connections. An “Around Your Area” feature highlights local opportunities and active communities, reinforcing the app’s mission of bridging online discovery with offline engagement.

While offering high customization and engagement potential, the app must address challenges such as user safety, moderation of content (e.g., hashtags), and balancing accessibility with controlled environments like school networks. Overall, the application aims to redefine social networking by prioritizing real-world connection, shared interests, and localized interaction.

- 

# Application Context / Environmental Constraint

- At home anywhere, outside, whatever  
- Double up as a map  
- On portable devices (phones, etc)  
- App calls to location services like google or apple maps  
- Needs internet access  
- Has to be used around other people that also use the app in a certain radius  
- Ideally should be an App, can be implemented as a website for demo purposes

# 

# Functional Requirements

- **1\. Login Functionality & Account Setup**  
  - On creating an account, prompt the user for who they are (children, uni students, adults) and an age range  
  - For schools:  
    - Built around school campuses with people having to login with a school account to have access to other people within their school  
  - *Pros: Safety by limiting certain features from children, more customized matching so that similar people can interact*  
  - *Cons: Less accessible for users, no guest account (?) means less users probably*  
  - **Use Cases**  
    - Basic:   
      - 1\. User opens app/website and clicks login \-\>  
      - 2\. user is directed to fill in a username and password \-\>  
      - 3\. user correctly fills in fields \-\>  
      - 4\. application checks backend to see if user/password pair is valid (it is) \-\>  
      - 5\.  the user is signed on  
    - Alternative: 4A. User does not have an account set up  
      - 1\. App prompts user to set up an account by providing username, password, age, possibly school \-\>   
      - 2\. A new account is created and the login credentials are saved to a database \-\>   
      - return to step 5 of basic flow.  
    - Exception: 4B User enters wrong password  
      - App informs user that they have entered the wrong password and the user is not signed on  
- **2\. Users can subscribe to multiple interests or hashtags**  
  - When a user types a tag, the system auto-suggests related user created tags (similar to how Instagram or TikTok suggests hashtags). Each tag displays total subscribers and active members’ counts  
  - *Pros: More customization for users; app can automatically adapt as new hobbies become popular without hard coded updates*  
  - *Cons: Makes implementation harder, may lead to lots of duplicate hashtags, will need user tag moderation to limit trolling and profanity*  
  - **Use Case**  
    - Basic:   
      - 1\. User clicks search bar for tags \-\>  
      - 2\. User types in a certain hashtag \-\>  
      - 3\. System matches user input to a collection of hashtags in a database  
      - 4\. UI displays tags matching the user’s input,, along with the number of users subscribed to the tag  
      - 5\. The User clicks on one of the displayed outputs  
      - 6\. System subscribes the user to the hashtag  
    - Alternative: 4A No entries in the database matches user’s input  
      - 1\. The UI displays an option with the label Add \#\<USER INPUT\>  
      - 2\. The user selects said option  
      - 3\. A new entry is added to the hashtag database with subscriber count 1  
      - 4\. The user is subscribed to the hashtag  
    - Exception: 4A1A: Profanity Checking  
      - 1\. the user input is matched as offensive content  
      - 2\.  The user is informed that they cannot create a hashtag of that name.  
- **3\. User profiles**  
  - Users can customize their profiles to display their age, bio, hobbies  
  - Upload pictures or videos similar to instagram  
  - *Pros: Probably a necessity for this app, allows matching of users*  
  - *Cons: security concerns, user information can be hacked*  
  - **Use Case**  
    - Basic:  
      - 1\. User clicks edit profile →  
      - 2\. User changes display name, bio, or hashtags →  
      - 3\. User clicks update profile →  
      - 4\. New information is updated on the profile.  
    - Alternative:  
      - 1\. User clicks into settings →  
      - 2\. User navigates to personal details →  
      - 3\. User clicks update profile details →  
      - 4\. User changes display name, bio, or hashtags →  
      - 5\. User clicks save details →  
      - 6\.  New information is updated on the profile.  
    - Exception: Textbox is blank  
      - 1\. The user input is pure whitespace  
      - 2\. The user is informed that their bio/name/hashtags can’t be blank  
- **4\. Swiping Functionality**  
  - Match user with similar profiles and listed interests  
  - Can customize, range, age, hobbies etc.  
  - *Pros: Gives a short-form-content-esque way for users to connect, probably will increase engagement, functionality people are used to from dating apps*  
  - *Cons: Gets lumped in with dating apps which muddles the core principles of this application*  
  - **Use Case**  
    - Basic:  
      - 1\.  User opens discover tab →  
      - 2\. System presents a card for user with a match rate →  
      - 3\. User swipes right →  
      - 4\. If the user also swiped right, matched popup appears →  
      - 5\. The system allows users to display matches and chat.  
    - Alternative:  
      - 1\. User opens discover tab →  
      - 2\. User opens filters →  
      - 3\. User filters by range and interest →  
      - 4\. User is presented with a card that matches their filtration criteria →  
      - 5\. If the user also swiped right, matched popup appears →  
      - 6\. The system allows users to display matches and chat.  
    - Exception: User filters out all applicable and available profiles  
      - 1\. System cannot find any matching profiles  
      - 2\. The system doesn’t display any cards and notifies user to expand criteria or check again later.  
- **5\. Chatting Services**  
  - A proximity group chat for you and people in your area so that you can reach out to people and plan meetups  
  - A lasting non-proxity chat only for people you’ve met in person and friended  
  - Users can report or block others directly within the chat interface. Blocked users are immediately removed from the reporting user’s proximity chat and map view.  
  - Users can join/create nearby group chatting.  
  - Proximity chat dissolves unless friends.  
  - *Pros: Easy way for people to connect, proximity chat is in-line with the app's goal of bringing people together in real-world interactions as you can’t change with random strangers that are far away.*  
  - *Cons: Proximity chat might raise stalking problems. Persistent chat also creates privacy concerns.*  
  - **Use Case**  
    - Basic:  
      - 1\. User clicks the map module and sees nearby users with a shared interest  
      - 2\. User taps nearby user and open the chat module  
      - 3\. User sends a greeting message  
      - 4\. User receives and replies  
      - 5\. Users agree on a meetup location and time  
      - 6\. Users add each other as friends and the chat becomes persistent  
      - 7\. Users leave the area and the proximity chat dissolves for non-friends  
    - Alternative:   
      - 3A User chats with a friend/group already exist  
        - 1\. User clicks the chat module and navigates to ‘Friends’ tab  
        - 2\. User choose a friend/group and send a message  
        - 3\. Return to step 4 of basic flow  
      - 3B User joins or creates a group chat with nearby users  
        - 1\. User can select multiple nearby users to create group chat or taps an existing group on the map module  
        - 2\. User sends/accepts a group invite  
        - 3\. Return to the step 3 of basic flow  
    - Exception:  
      - 3 User is blocked by another user  
        - 1\. User attempts to chat with another user/group  
        - 2\. System detects the block status  
        - 3\. Chat module is inaccessible and the blocked user is removed from the map  
        - 4\. User will not be notified for the blocking reason  
      - 4A User receives an inappropriate massage  
        - 1\. User selects ‘Report and Block’ for the message  
        - 2\. Message will be reviewed by the system  
        - 3a. Blocked user is removed from the chat  
        - 3b. If in a group chat, user is removed from that chat  
        - 4\. User continues using app without interacting with blocked user  
- **6\. Communities**  
  - Communities are groups people with the same hobbies can join  
  - Community leads can make official announcements and post group meetings  
  - *Pros: Easy way for people to meet lots of people with the same interests, naturally groups people by interests which is one of the main points of the app, people will expect this kind of functionality when coming from other apps like facebook*  
- **7\. Exploring new hobbies**  
  - A leaderboard for the most popular interests on the site  
  - Recommended interests to look into, that matches interests that many of your friends have  
  - Users new to the interest can distinguish themselves with a tag  
  - “Around your area” tab  
  - *Pros: Lets people discover new interests and hobbies, encourages people to try new things*  
  - *Cons: too many selected interests and hobbies could result in a more cluttered interface, including too many user recommendations and UI challenges.*   
  - **Use case**  
    - Basic: User is looking for a list of the most popular interests in their area  
      - User clicks the “Around your area” tab on the interface  
      - List of interests (listed as tags), ranked by popularity, is displayed, alongside the number of subscribers of that interest in the user’s chosen area.  
      - List of interests will only show the top 100 interests in the user’s area  
      - User can quickly add the selected interest to their user profile.  
      - User can also choose to select the interest to find users nearby with that specified interest.  
    - Alternative 1: User wants to look for a specific interest that’s not shown on the list of interests upon checking the “Around your area” tab  
      - User selects the search bar located at the top of the site  
      - User inputs a string of text that will represent the interest they are looking up  
      - The site will search for the specified interest tag  
      - If successful, the site will display all interest tags similar to the user’s input.  
      - The site will only display the first 100 most similar results.  
      - The user can also quickly add the selected interest to their user profile and search for users nearby with the selected interest.  
    - Alternative 2: User wants to filter for interests and hobbies of a specified group of people (i.e. age)  
      - User selects the search bar located at the top of the site  
      - User selects the “filter” button on the side of the bar.  
      - User selects the specific filter they are interested in.  
      - User closes the filter menu.  
      - User inputs the hobby tags they are interested in and searches.  
      - The site will display the top 100 interests of the specified filtered group in the user’s selected area  
      - The user can also quickly add the selected interest to their user profile and search for users nearby with the selected interest.  
    - Exception 1: User searched up an interest that has not been added to the site yet  
      - User searches for an interest that has been tagged zero times on the site.  
      - The site will display an error message, “No results were found; try using other keywords.”  
      - No interest tags will be displayed.  
    - Exception 2: User uses prohibited characters/words  
      - User searches for an interest/hobby name that has profanity  
      - The site will return an error message: “Search cannot contain offensive words”  
      - No interest tags will be displayed

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
