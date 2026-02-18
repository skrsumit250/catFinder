async function sendUserData() {
    let userData = {};
    
    // Get IP address
    try {
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipResponse.json();
        userData.ip_address = ipData.ip;
        console.log("IP obtained:", userData.ip_address);
    } catch (error) {
        console.error("Error getting IP:", error);
        userData.ip_address = null; // fallback
    }

    // Try to get location
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            userData.latitude = position.coords.latitude;
            userData.longitude = position.coords.longitude;
            userData.location_permission = "granted";
            console.log("Location obtained:", userData.latitude, userData.longitude);

        } catch (error) {
            console.warn("Location permission denied or error:", error.message);
            userData.location_permission = "denied";
        }
    } else {
        console.warn("Geolocation not supported");
        userData.location_permission = "unsupported";
    }

    // Step 3: Send everything to server
    try {
        await fetch("https://medlog.onrender.com/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
        });
        console.log("User data sent successfully:", userData);
    } catch (error) {
        console.error("Error sending user data:", error);
    }
}

// Call the function
sendUserData();
