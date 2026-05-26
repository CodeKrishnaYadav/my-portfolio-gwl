(async function () {

    // Main object
    const userInfo = {};

    // Basic information
    userInfo.timestamp = new Date().toISOString();
    userInfo.currentURL = window.location.href;
    userInfo.referrer = document.referrer;

    // Browser details
    userInfo.userAgent = navigator.userAgent;
    userInfo.language = navigator.language;
    userInfo.languages = navigator.languages;
    userInfo.platform = navigator.platform;
    userInfo.cookieEnabled = navigator.cookieEnabled;
    userInfo.onlineStatus = navigator.onLine;
    userInfo.javaEnabled = navigator.javaEnabled();

    // Device details
    userInfo.screenWidth = screen.width;
    userInfo.screenHeight = screen.height;
    userInfo.availWidth = screen.availWidth;
    userInfo.availHeight = screen.availHeight;
    userInfo.colorDepth = screen.colorDepth;
    userInfo.pixelDepth = screen.pixelDepth;

    // Hardware details
    userInfo.cpuCores = navigator.hardwareConcurrency || 'N/A';
    userInfo.deviceMemory = navigator.deviceMemory || 'N/A';
    userInfo.touchSupport = navigator.maxTouchPoints;

    // Timezone
    userInfo.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Network details
    if (navigator.connection) {
        userInfo.networkType = navigator.connection.effectiveType;
        userInfo.downlink = navigator.connection.downlink;
        userInfo.rtt = navigator.connection.rtt;
    }

    // Approximate location using IP API
    try {
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();

        userInfo.ip = locationData.ip;
        userInfo.city = locationData.city;
        userInfo.region = locationData.region;
        userInfo.country = locationData.country_name;
        userInfo.postal = locationData.postal;
        userInfo.latitude = locationData.latitude;
        userInfo.longitude = locationData.longitude;
        userInfo.org = locationData.org;
        userInfo.network = locationData.network;
        userInfo.timezoneByIP = locationData.timezone;
})();
