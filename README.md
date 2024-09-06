# Short Video Uploader

The **Short Video Uploader** is a Svelte-based web application designed to simplify the process of uploading short videos to multiple social media platforms. Currently, the app supports uploading videos to **YouTube**, and in future updates, it will also support popular platforms like **抖音 (Douyin)**, **TikTok**, **Instagram**, etc

## Features

- **YouTube Upload**: Easily upload short videos to YouTube, complete with customizable titles, descriptions, and privacy settings.
- **Cross-Platform Support (Upcoming)**: Future updates will allow users to upload the same video to platforms like:
  - **抖音 (Douyin)**
  - **TikTok**
  - **Instagram**
  - And more...

## Platform Integration Checklist

### **YouTube Integration**
   - [x] API Access: Research and obtain access to Douyin's developer API.
   - [x] OAuth Authentication: Implement OAuth 2.0 to authenticate users.
   - [x] Video Upload API: Implement video upload functionality using the Google API.
   - [x] Metadata: Ensure that users can add video title, description, and tags.
   - [ ] Video Specifications: Ensure video formats, sizes, and aspect ratios comply with Douyin requirements.
   - [ ] Error Handling: Implement error handling for failed uploads or API rate limits.

### **Douyin (抖音) Integration**
   - [ ] API Access: Research and obtain access to Douyin's developer API.
   - [ ] OAuth Authentication: Implement OAuth 2.0 to authenticate users.
   - [ ] Video Upload API: Implement video upload functionality using the Douyin API.
   - [ ] Metadata: Ensure that users can add video title, description, and tags.
   - [ ] Video Specifications: Ensure video formats, sizes, and aspect ratios comply with Douyin requirements.
   - [ ] Error Handling: Implement error handling for failed uploads or API rate limits.

### **TikTok Integration**
   - [ ] API Access: Register for TikTok for Developers and get API access.
   - [ ] OAuth Authentication: Use TikTok’s OAuth 2.0 for secure login and access.
   - [ ] Video Upload API: Use the TikTok API to upload videos.
   - [ ] Metadata: Allow users to input video title, description, and tags.
   - [ ] Video Specifications: Validate and ensure video formats, sizes, and aspect ratios conform to TikTok's guidelines.
   - [ ] Error Handling: Implement retry mechanisms for failed uploads or API rate limit errors.

### **Instagram Integration**
   - [ ] API Access: Register for access to the Instagram Graph API.
   - [ ] OAuth Authentication: Implement OAuth 2.0 for Instagram account authorization.
   - [ ] Video Upload API: Use the Instagram API for uploading videos to user profiles or reels.
   - [ ] Metadata: Allow users to add captions, hashtags, and geolocation data.
   - [ ] Privacy Settings: Ensure that videos can be posted to public/private accounts or Stories.
   - [ ] Thumbnail Management: Either allow custom thumbnail uploads or use Instagram’s default first-frame thumbnail.
   - [ ] Video Specifications: Ensure video compliance with Instagram's format, aspect ratio, and size limits.
   - [ ] Error Handling: Implement error recovery strategies for failed uploads and rate limits.

## How to Use

1. **Authorization**: The app redirect users to authorize their YouTube account using OAuth 2.0 to ensure secure access to their YouTube channel.
2. **Upload Video**:
   - Enter the video title and description.
   - Select a video file to upload.
   - Click "Upload" to start the video upload process.
3. **Future Expansion**: Future updates will allow you to select multiple platforms for uploading simultaneously.

## Installation and Setup

### Prerequisites

- **Node.js** (version 14.x or later)
- **npm** or **yarn**

### Installation

1. Clone the repository and navigate into the project folder:
```bash
git clone https://github.com/your-username/short-video-uploader.git
cd short-video-uploader
```

2. Create a `.env` file

Before you start the application, you need to set up your environment variables. In the root directory of the project, create a `.env` file and add your YouTube (and other platform in the future) credentials:
```plaintext
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret
```

3. Install the dependencies:
```bash
npm install
```

```plaintext
YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret

4. Start the development server:
```bash
npm run dev
```
5. Open your browser and navigate to http://localhost:3000 to use the app.

