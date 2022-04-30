# Gitlab discord bot

A Discord bot able to track several updates (like merge requests, notes, approvals) on a Gitlab project, and send those updates to a discord channel.

It can also notify you in a private channel for updates regarding a specific user on Gitlab.

## Features

### Register to the bot and track a specific Gitlab user

You can ask the bot to send you notifications when stuff concerning a specific gitlab user happen. For instance, you can ask the bot to notify you in a private message when someone creates a merge request, or when someone answers to a merge requests openend by a specific user.

<!-- markdownlint-disable -->
*Register your gitlab Username and watch it (by default)*

<img src="./docs/assets/register-example.png" alt="Example of /register command" width="600"/>

*Watch a custom Gitlab username*

<img src="./docs/assets/watch-example.png" alt="Example of /watch command" width="600"/>

*Stop watching a custom Gitlab username*

<img src="./docs/assets/drop-example.png" alt="Example of /drop command" width="600"/>
<!-- markdownlint-enable -->

### Track merge requests in a common channel and in private channel

<!-- markdownlint-disable -->
*Notification for an opened merge request in a shared channel*

<img src="./docs/assets/merge-request-opened-example.png" alt="Example of notification sent when a merge request is opened" width="600"/>

*Notification for a closed merge request in a shared channel*

<img src="./docs/assets/merge-request-closed-example.png" alt="Example of notification sent when a merge request is closed" width="600"/>

*Notification for an assignment on a merge request*

<img src="./docs/assets/assigned-on-merge-request-example.png" alt="Example of notification sent when I am assigned on a merge request" width="600"/>
<!-- markdownlint-enable -->

### Track notes and discussions opened on your merge requests

<!-- markdownlint-disable -->
*Notification for when a discussion is opened on your merge requests, or when a discussion you are a part of receives an answer*

<img src="./docs/assets/note-received-example.png" alt="Example of notification regarding discussions and notes" width="600"/>
<!-- markdownlint-enable -->

## Installation

This free-of-charge, open source software is provided as it is, and you are responsible for hosting it.
It requires some infrastructure to work properly, but we tried to document these requirements in the following documentation.

[See the requirements and necessary setup](./docs/requirements.md)

If you lack information on this part, please feel free to open an issue and we will be happy to provide you with the missing details :) Happy botting !
