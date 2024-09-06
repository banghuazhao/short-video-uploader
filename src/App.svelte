<script>
	import YouTubeService from "./YouTubeService.js";
	let youTubeService = new YouTubeService();

	let title = "";
	let description = "";
	let selectedFile = null;

	let errorMessage_youTube = null;
	let isUploaded_youTube = false; // Track upload status

	$: isYouTubeAuthenticated = youTubeService.isAuthenticated();

	$: {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get("code");

		if (code && !youTubeService.isAuthenticated()) {
			youTubeService
				.exchangeCodeForTokens(code)
				.then(() => {
					isYouTubeAuthenticated = true;
					resetURl();
				})
				.catch((error) => {
					errorMessage_youTube = `Error during authorization: ${error.message}`;
					resetURl();
				});
		}
	}

	function resetURl() {
		const newUrl = window.location.origin + window.location.pathname;
		window.history.replaceState({}, document.title, newUrl);
	}

	function handleFileChange(event) {
		selectedFile = event.target.files[0];
	}

	// Function to request Google OAuth authorization
	function requestAuthorization() {
		const authUrl = youTubeService.requestAuthorizationURL();
		window.location.href = authUrl;
	}

	async function uploadVideo() {
		if (!title) {
			errorMessage_youTube = "Title should not be empty";
			return;
		}
		try {
			if (youTubeService.isTokenExpired()) {
				await youTubeService.refreshAccessToken();
			}

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

			const successMessage = await youTubeService.uploadToYouTube(
				selectedFile,
				metadata,
			);
			isUploaded_youTube = true; // Mark the upload as successful
			console.log(successMessage); // You can still log the success message for debugging
		} catch (error) {
			errorMessage_youTube = `Error during video upload: ${error.message}`;
		}
	}
</script>

<main>
	<h1>Short Video Uploader</h1>

	<input
		type="text"
		bind:value={title}
		placeholder="Enter video title"
		style="width: 500px;"
	/>
	<br />

	<textarea bind:value={description} placeholder="Enter video description"
	></textarea>

	<br />

	<input type="file" on:change={handleFileChange} style="width: 500px;" />

	<h2>YouTube</h2>

	{#if !isYouTubeAuthenticated}
		<button on:click={requestAuthorization}>Authorize with Google</button>
	{:else}
		<div style="display:flex; gap: 20px">
			<p>Youtube is ready to upload</p>
			<button on:click={uploadVideo} disabled={!selectedFile}
				>Upload Video</button
			>
			{#if isUploaded_youTube}
				<p>Uploaded ✅</p>
			{/if}
		</div>
	{/if}
	{#if errorMessage_youTube}
		<p style="color: red;">{errorMessage_youTube}</p>
	{/if}
</main>

<style>
	main {
		text-align: left;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	textarea {
		height: 200px; /* Makes the description box larger */
		width: 500px;
	}
</style>
