class YouTubeService {
  constructor() {
    this.clientId = process.env.YOUTUBE_CLIENT_ID
    this.clientSecret = process.env.YOUTUBE_CLIENT_SECRET
    this.redirectUri = "http://localhost:3000";
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
    this.tokenExpiryTime = localStorage.getItem("tokenExpiryTime");
    this.logTokens(this.accessToken, this.refreshToken, this.tokenExpiryTime);
  }

  // Exchange authorization code for access and refresh tokens
  async exchangeCodeForTokens(code) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error_description);
    }

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;
    const tokenExpiryTime = Date.now() + data.expires_in * 1000;

    this.logTokens(accessToken, refreshToken, tokenExpiryTime);
    this.saveTokens(accessToken, refreshToken, tokenExpiryTime);

    return { accessToken, refreshToken, tokenExpiryTime };
  }

  // Refresh the access token using the refresh token
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available to refresh access token.");
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "refresh_token",
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error_description);
    }

    const accessToken = data.access_token;
    const tokenExpiryTime = Date.now() + data.expires_in * 1000;

    this.saveTokens(accessToken, this.refreshToken, tokenExpiryTime);
  }

  logTokens(accessToken, refreshToken, tokenExpiryTime) {
    console.log("accessToken: " + this.accessToken)
    console.log("refreshToken: " + this.refreshToken)
    const tokenExpiryTimeNumber = parseInt(this.tokenExpiryTime, 10);
    const date = new Date(tokenExpiryTimeNumber);
    const formattedDate = date.toLocaleString();
    console.log("tokenExpiryTime: " + formattedDate + " is expired? " + this.isTokenExpired())
  }

  // Save tokens and expiry time in localStorage
  saveTokens(accessToken, refreshToken, tokenExpiryTime) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiryTime = tokenExpiryTime;

    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    localStorage.setItem("tokenExpiryTime", tokenExpiryTime);
  }

  // Check if the access token is expired
  isTokenExpired() {
    return this.tokenExpiryTime && Date.now() > this.tokenExpiryTime;
  }

  // Get access token
  getAccessToken() {
    return this.accessToken;
  }

  // Get refresh token
  getRefreshToken() {
    return this.refreshToken;
  }

  isAuthenticated() {
    if (this.accessToken == null) {
      return false;
    }
    if (this.isTokenExpired()) {
      return false;
    }
    return true;
  }

  requestAuthorizationURL() {
    const scope = "https://www.googleapis.com/auth/youtube.upload";
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=${scope}`;
    return authUrl;
  }

  async uploadToYouTube(title, description, selectedFile) {

    const metadata = {
      snippet: {
        title: title,
        description: description,
        tags: ["New Zealand", "Travel", "Trip"],
        categoryId: "19",
      },
      status: {
        privacyStatus: "public",
        madeForKids: false,
      },
    };

    try {
      // Step 1: Initiate the upload and get the upload URL
      const response = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to initiate YouTube upload. Status: ${response.status}`);
      }

      const uploadUrl = response.headers.get("Location");
      if (!uploadUrl) {
        throw new Error("Failed to get YouTube upload URL.");
      }

      // Step 2: Upload the video file to the returned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload video to YouTube. Status: ${uploadResponse.status}`);
      }

      return "Video uploaded successfully to YouTube!";
    } catch (error) {
      throw new Error(`YouTube Upload Error: ${error.message}`);
    }
  }

  logout() {
    // Remove the tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiryTime");

    // Reset instance variables
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiryTime = null;

    console.log("Logged out and tokens cleared");
  }
}

export default YouTubeService;